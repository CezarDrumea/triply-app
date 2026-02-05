import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import { all, dbPath, getDb, run } from './db.js'
import { destinations, posts, products } from './seed-data.js'

const app = express()
const PORT = 4000
const allowedOrigins = new Set(['http://localhost:5173', 'http://127.0.0.1:5173'])

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  })
)
app.use(express.json())

const ROLE_COOKIE = 'triply_role'

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [key, ...rest] = part.split('=')
      acc[key] = decodeURIComponent(rest.join('='))
      return acc
    }, {})
}

function getRole(req) {
  const cookies = parseCookies(req.headers.cookie ?? '')
  const role = cookies[ROLE_COOKIE]
  return role === 'admin' || role === 'user' ? role : null
}

function requireAdmin(req, res, next) {
  const role = getRole(req)
  if (!role) {
    res.status(401).json({ error: 'authentication required' })
    return
  }
  if (role !== 'admin') {
    res.status(403).json({ error: 'admin access required' })
    return
  }
  next()
}

async function ensureDatabase() {
  const dbExists = fs.existsSync(dbPath)
  const db = getDb()

  if (!dbExists) {
    await run(
      db,
      `CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL,
        category TEXT,
        rating REAL,
        image TEXT,
        badge TEXT,
        description TEXT
      )`
    )
    await run(
      db,
      `CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        title TEXT,
        excerpt TEXT,
        city TEXT,
        days INTEGER,
        cover TEXT,
        date TEXT
      )`
    )
    await run(
      db,
      `CREATE TABLE destinations (
        id INTEGER PRIMARY KEY,
        name TEXT,
        country TEXT,
        temperature TEXT,
        season TEXT,
        image TEXT,
        highlight TEXT
      )`
    )

    for (const product of products) {
      await run(
        db,
        `INSERT INTO products (id, name, price, category, rating, image, badge, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ,
        [
          product.id,
          product.name,
          product.price,
          product.category,
          product.rating,
          product.image,
          product.badge,
          product.description
        ]
      )
    }

    for (const post of posts) {
      await run(
        db,
        `INSERT INTO posts (id, title, excerpt, city, days, cover, date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
        ,
        [post.id, post.title, post.excerpt, post.city, post.days, post.cover, post.date]
      )
    }

    for (const destination of destinations) {
      await run(
        db,
        `INSERT INTO destinations (id, name, country, temperature, season, image, highlight)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
        ,
        [
          destination.id,
          destination.name,
          destination.country,
          destination.temperature,
          destination.season,
          destination.image,
          destination.highlight
        ]
      )
    }
  }

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS cart_items (
      product_id INTEGER PRIMARY KEY,
      quantity INTEGER NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`
  )

  db.close()
}

async function fetchCart(db) {
  const rows = await all(
    db,
    `SELECT
      products.id,
      products.name,
      products.price,
      products.category,
      products.rating,
      products.image,
      products.badge,
      products.description,
      cart_items.quantity
     FROM cart_items
     JOIN products ON products.id = cart_items.product_id
     ORDER BY cart_items.product_id`
  )

  const items = rows.map(row => {
    const { quantity, ...product } = row
    return { product, quantity }
  })

  return { items }
}

app.get('/api/products', async (_req, res) => {
  const db = getDb()
  const rows = await all(db, 'SELECT * FROM products')
  db.close()
  res.json({ data: rows })
})

app.get('/api/auth/me', (req, res) => {
  const role = getRole(req)
  res.json({ data: { role } })
})

app.post('/api/auth/login', (req, res) => {
  const { role } = req.body ?? {}
  if (role !== 'user' && role !== 'admin') {
    res.status(400).json({ error: 'role must be user or admin' })
    return
  }

  res.cookie(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  })

  res.json({ data: { role } })
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(ROLE_COOKIE, { httpOnly: true, sameSite: 'lax' })
  res.json({ data: { role: null } })
})

app.get('/api/posts', async (_req, res) => {
  const db = getDb()
  const rows = await all(db, 'SELECT * FROM posts ORDER BY date DESC')
  db.close()
  res.json({ data: rows })
})

app.get('/api/destinations', async (_req, res) => {
  const db = getDb()
  const rows = await all(db, 'SELECT * FROM destinations')
  db.close()
  res.json({ data: rows })
})

app.get('/api/cart', async (_req, res) => {
  const db = getDb()
  const cart = await fetchCart(db)
  db.close()
  res.json({ data: cart })
})

app.post('/api/cart/items', async (req, res) => {
  const { productId, quantity } = req.body ?? {}
  const resolvedQuantity = Number.isFinite(quantity) ? Number(quantity) : 1

  if (!Number.isFinite(productId)) {
    res.status(400).json({ error: 'productId is required' })
    return
  }

  if (resolvedQuantity <= 0) {
    res.status(400).json({ error: 'quantity must be greater than 0' })
    return
  }

  const db = getDb()
  await run(
    db,
    `INSERT INTO cart_items (product_id, quantity)
     VALUES (?, ?)
     ON CONFLICT(product_id)
     DO UPDATE SET quantity = quantity + excluded.quantity`,
    [productId, resolvedQuantity]
  )
  const cart = await fetchCart(db)
  db.close()
  res.json({ data: cart })
})

app.patch('/api/cart/items/:productId', async (req, res) => {
  const productId = Number(req.params.productId)
  const { quantity } = req.body ?? {}

  if (!Number.isFinite(productId)) {
    res.status(400).json({ error: 'productId is required' })
    return
  }

  if (!Number.isFinite(quantity)) {
    res.status(400).json({ error: 'quantity is required' })
    return
  }

  const resolvedQuantity = Number(quantity)
  const db = getDb()

  if (resolvedQuantity <= 0) {
    await run(db, 'DELETE FROM cart_items WHERE product_id = ?', [productId])
  } else {
    await run(
      db,
      `INSERT INTO cart_items (product_id, quantity)
       VALUES (?, ?)
       ON CONFLICT(product_id)
       DO UPDATE SET quantity = excluded.quantity`,
      [productId, resolvedQuantity]
    )
  }

  const cart = await fetchCart(db)
  db.close()
  res.json({ data: cart })
})

app.delete('/api/cart/items/:productId', async (req, res) => {
  const productId = Number(req.params.productId)

  if (!Number.isFinite(productId)) {
    res.status(400).json({ error: 'productId is required' })
    return
  }

  const db = getDb()
  await run(db, 'DELETE FROM cart_items WHERE product_id = ?', [productId])
  const cart = await fetchCart(db)
  db.close()
  res.json({ data: cart })
})

app.post('/api/cart/clear', async (_req, res) => {
  const db = getDb()
  await run(db, 'DELETE FROM cart_items')
  const cart = await fetchCart(db)
  db.close()
  res.json({ data: cart })
})

app.get('/api/summary', async (_req, res) => {
  const db = getDb()
  const [productsCount] = await all(db, 'SELECT COUNT(*) as count FROM products')
  const [postsCount] = await all(db, 'SELECT COUNT(*) as count FROM posts')
  const [destinationsCount] = await all(db, 'SELECT COUNT(*) as count FROM destinations')
  db.close()
  res.json({
    data: {
      products: productsCount.count,
      posts: postsCount.count,
      destinations: destinationsCount.count
    }
  })
})

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  const { name, price, category, rating, image, badge, description } = req.body ?? {}
  const resolvedPrice = Number(price)
  const resolvedRating = Number(rating)

  if (!name || !image || !description) {
    res.status(400).json({ error: 'name, image, and description are required' })
    return
  }
  if (!Number.isFinite(resolvedPrice) || resolvedPrice <= 0) {
    res.status(400).json({ error: 'price must be a positive number' })
    return
  }
  if (!Number.isFinite(resolvedRating) || resolvedRating < 0 || resolvedRating > 5) {
    res.status(400).json({ error: 'rating must be between 0 and 5' })
    return
  }
  if (!['gear', 'prints', 'guides'].includes(category)) {
    res.status(400).json({ error: 'category must be gear, prints, or guides' })
    return
  }

  const db = getDb()
  const result = await run(
    db,
    `INSERT INTO products (name, price, category, rating, image, badge, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, resolvedPrice, category, resolvedRating, image, badge ?? null, description]
  )
  const [row] = await all(db, 'SELECT * FROM products WHERE id = ?', [result.lastID])
  db.close()
  res.json({ data: row })
})

app.post('/api/admin/posts', requireAdmin, async (req, res) => {
  const { title, excerpt, city, days, cover, date } = req.body ?? {}
  const resolvedDays = Number(days)
  const resolvedDate =
    typeof date === 'string' && date.trim().length > 0
      ? date
      : new Date().toISOString().slice(0, 10)

  if (!title || !excerpt || !city || !cover) {
    res.status(400).json({ error: 'title, excerpt, city, and cover are required' })
    return
  }
  if (!Number.isFinite(resolvedDays) || resolvedDays <= 0) {
    res.status(400).json({ error: 'days must be a positive number' })
    return
  }

  const db = getDb()
  const result = await run(
    db,
    `INSERT INTO posts (title, excerpt, city, days, cover, date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, excerpt, city, resolvedDays, cover, resolvedDate]
  )
  const [row] = await all(db, 'SELECT * FROM posts WHERE id = ?', [result.lastID])
  db.close()
  res.json({ data: row })
})

app.post('/api/admin/destinations', requireAdmin, async (req, res) => {
  const { name, country, temperature, season, image, highlight } = req.body ?? {}

  if (!name || !country || !temperature || !season || !image || !highlight) {
    res.status(400).json({
      error: 'name, country, temperature, season, image, and highlight are required'
    })
    return
  }

  const db = getDb()
  const result = await run(
    db,
    `INSERT INTO destinations (name, country, temperature, season, image, highlight)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, country, temperature, season, image, highlight]
  )
  const [row] = await all(db, 'SELECT * FROM destinations WHERE id = ?', [
    result.lastID
  ])
  db.close()
  res.json({ data: row })
})

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Triply server running on http://localhost:${PORT}`)
    })
  })
  .catch(error => {
    console.error('Failed to start server', error)
    process.exitCode = 1
  })
