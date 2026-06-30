import { Link } from "react-router-dom";
import type { Article } from "../types";

type BlogCardProps = Pick<
  Article,
  "id" | "title" | "summary" | "date" | "category"
> & {
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

function BlogCard({
  id,
  title,
  summary,
  date,
  category,
  isFavorite,
  onToggleFavorite,
}: BlogCardProps) {
  return (
    <article className="article-card">
      <button
        type="button"
        className={`favorite-button ${isFavorite ? "active" : ""}`}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "取消收藏" : "收藏文章"}
        onClick={() => onToggleFavorite(id)}
      >
        {isFavorite ? "已收藏" : "收藏"}
      </button>
      <Link to={`/post/${id}`} className="card-link">
        <div className="card-content">
          <span className="card-category">{category}</span>
          <h3 className="card-title">{title}</h3>
          <p className="card-summary">{summary}</p>
          <time className="card-date">{date}</time>
        </div>
      </Link>
    </article>
  );
}

export default BlogCard;
