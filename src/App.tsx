import { useState, useMemo } from "react";
import "./App.css";

function App() {
  const [articles] = useState([
    {
      id: 1,
      title: "React 入门完全指南",
      summary: "从零开始学 React",
      category: "React",
      date: "2024-05-10",
    },
    {
      id: 2,
      title: "JS 异步编程详解",
      summary: "搞懂 Promise 和 async/await",
      category: "JavaScript",
      date: "2024-05-08",
    },
    {
      id: 3,
      title: "CSS Grid 布局实战",
      summary: "用 Grid 实现响应式布局",
      category: "CSS",
      date: "2024-05-05",
    },
    {
      id: 4,
      title: "React Hooks 深入",
      summary: "深入理解 useState 和 useEffect",
      category: "React",
      date: "2024-05-03",
    },
    {
      id: 5,
      title: "Flexbox 完全指南",
      summary: "一文学会弹性布局",
      category: "CSS",
      date: "2024-05-01",
    },
  ]);

  const [activeCategory, setActiveCategory] = useState("全部");

  // 提取所有分类（去重）
  const categories = useMemo(() => {
    const cats = articles.map((a) => a.category);
    return ["全部", ...new Set(cats)];
  }, [articles]);

  // 根据分类过滤文章
  const filteredArticles = useMemo(() => {
    if (activeCategory === "全部") return articles;
    return articles.filter((a) => (a.category = activeCategory));
  }, [articles, activeCategory]);

  return (
    <div className="app">
      {/* 顶部导航栏 */}
      <header className="navbar">
        <h1 className="logo">JANSON Blog</h1>
        <nav>
          <a href="/">首页</a>
          <a href="#">关于</a>
        </nav>
      </header>

      {/* 主内容区 */}
      <main className="container">
        <h2 className="section-title">最新文章</h2>

        {/* 条件渲染：有文章就显示，没文章就显示空态
        {articles.length === 0 ? (
          <p className="empty-tip">还没有文章，敬请期待。</p>
        ) : (
          <div className="article-grid">
            {/* 列表渲染：map 遍历数组 

            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="card-cover"
                />
                <div className="card-content">
                  <span className="card-category">{article.category}</span>
                  <h3 className="card-title">{article.title}</h3>
                  <p className="card-summary">{article.summary}</p>
                  <span className="card-date">{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        )} 
      
        */}

        {/* 分类筛选按钮组 */}
        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active" : ""}
              onClick={() => {
                setActiveCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="result-info">共 {filteredArticles.length} 篇</p>

        {filteredArticles.length === 0 ? (
          <p className="empty-tip">该分类下暂无文章</p>
        ) : (
          <div className="article-grid">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="card-conent">
                  <span className="card-category">{article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <span className="card-date">{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="footer">
        <p>© 2026 JANSON Blog. Powered by React.</p>
      </footer>
    </div>
  );
}

export default App;
