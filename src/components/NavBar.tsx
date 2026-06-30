import { Link } from "react-router-dom";
import "../App.css";

function NavBar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Janson Blog
      </Link>
      <nav>
        <Link to="/">首页</Link>
        <a href="#about">关于</a>
      </nav>
    </header>
  );
}
export default NavBar;
