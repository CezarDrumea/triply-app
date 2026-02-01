import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import { all, dbPath, getDb, run } from './db.js'
import { destinations, posts, products } from './seed-data.js'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

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
