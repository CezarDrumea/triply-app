import type { Post } from "../types";

const PostCard = ({ post }: { post: Post }) => {
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article>
      <div className="media">
        <img src={post.cover} alt={post.title} loading="lazy" />
      </div>

      <div className="card-body">
        <div>
          <p className="eyebrow">
            {post.city} ▸ {post.days}
          </p>
          <h3>{post.title}</h3>
          <p className="muted">{post.excerpt}</p>
        </div>

        <div className="meta-row">
          <span className="pill">{date}</span>
          <button className="ghost">Read guide</button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
