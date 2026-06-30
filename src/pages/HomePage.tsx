import { useState, useMemo, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import CategoryFilter from "../components/CategoryFilter";
import useDebouncedValue from "../hooks/useDebouncedValue";
import useFavoriteArticles from "../hooks/useFavoriteArticles";
import type { Article } from "../types";

function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const debouncedSearchText = useDebouncedValue(searchText.trim(), 300);
  const { favoriteIds, favoriteIdSet, toggleFavorite } = useFavoriteArticles();

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

  const categories = useMemo(() => {
    return ["全部", ...new Set(articles.map((a) => a.category))];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const normalizedSearchText = debouncedSearchText.toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "全部" || article.category === activeCategory;
      const matchesSearch =
        normalizedSearchText.length === 0 ||
        [article.title, article.summary, article.category, article.date]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearchText);
      const matchesFavorite =
        !showFavoritesOnly || favoriteIdSet.has(article.id);

      return matchesCategory && matchesSearch && matchesFavorite;
    });
  }, [
    articles,
    activeCategory,
    debouncedSearchText,
    favoriteIdSet,
    showFavoritesOnly,
  ]);

  const emptyMessage = showFavoritesOnly
    ? "还没有匹配的收藏文章"
    : "没有找到匹配的文章";

  return (
    <div>
      <h2 className="section-title">最新文章</h2>

      {/* 加载中 */}
      {isLoading && <p className="status-msg">加载中，请稍候...</p>}

      {/* 加载出错 */}
      {error && (
        <div className="status-msg error">
          <p>加载失败：{error}</p>
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      )}

      {/* 数据加载完成 */}
      {!isLoading && !error && (
        <>
          <div className="blog-toolbar">
            <label className="search-box">
              <span>搜索</span>
              <input
                type="search"
                placeholder="搜索标题、摘要、分类或日期"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </label>
            <label className="favorite-filter">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(event) =>
                  setShowFavoritesOnly(event.target.checked)
                }
              />
              <span>只看收藏</span>
            </label>
          </div>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <p className="result-info">
            共 {filteredArticles.length} 篇
            {favoriteIds.length > 0 && ` · 已收藏 ${favoriteIds.length} 篇`}
          </p>
          {filteredArticles.length === 0 ? (
            <p className="empty-tip">{emptyMessage}</p>
          ) : (
            <div className="article-grid">
              {filteredArticles.map((article) => (
                <BlogCard
                  key={article.id}
                  {...article}
                  isFavorite={favoriteIdSet.has(article.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
