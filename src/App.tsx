import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 JANSON Blog. Powered by React.</p>
      </footer>
    </div>
  );
}

export default App;
