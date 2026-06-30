import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import useFavoriteArticles from "../hooks/useFavoriteArticles";
import type { Article } from "../types";

function PostPage() {
  const { id } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favoriteIdSet, toggleFavorite } = useFavoriteArticles();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPost() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/post.json", { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as Article[];
        setArticles(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "未知错误");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchPost();

    return () => {
      controller.abort();
    };
  }, []);

  const article = useMemo(() => {
    return articles.find((item) => item.id === Number(id));
  }, [articles, id]);

  if (isLoading) {
    return <p className="status-msg">加载中，请稍候...</p>;
  }

  if (error) {
    return <p className="status-msg error">加载失败：{error}</p>;
  }

  if (!article) {
    return (
      <div className="not-found">
        <h2>文章不存在</h2>
        <p>找不到 ID 为 {id} 的文章</p>
        <Link to="/" className="back-link">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="post-view">
      <div className="post-meta-row">
        <span className="category-tag">{article.category}</span>
        <button
          type="button"
          className={`favorite-button post-favorite ${
            favoriteIdSet.has(article.id) ? "active" : ""
          }`}
          aria-pressed={favoriteIdSet.has(article.id)}
          onClick={() => toggleFavorite(article.id)}
        >
          {favoriteIdSet.has(article.id) ? "已收藏" : "收藏"}
        </button>
      </div>
      <h1>{article.title}</h1>
      <time>{article.date}</time>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      <Link to="/" className="back-link">
        ← 返回首页
      </Link>
    </article>
  );
}
export default PostPage;
