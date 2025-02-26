import { useContext } from "react";
import { Moon, Sun } from "react-feather";
import { ThemeContext } from "../context/ThemeContext";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Menu from "../components/Menu";
import '../index.css'

const Layout = ({ children, title }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <>
    <Helmet>
        <title>{title ? `${title} | Terra'Novare` : "Terra'Novare"}</title>
      </Helmet>
      {/* Sidebar at the Top Layer */}
      <aside className="fixed-left">
  <div
    className="offcanvas offcanvas-start"
    id="offcanvasDarkNavbar"
    aria-labelledby="offcanvasDarkNavbarLabel"
    data-bs-backdrop="true"  // ✅ Disables the black overlay
  >
    <div className="offcanvas-header pt-1 ps-3">
      
      <h1 className="offcanvas-title" id="offcanvasDarkNavbarLabel" to="/">
        Terra'Novare
      </h1>
        
      <button
        type="button"
        id="closeBtn"
        className="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div className="offcanvas-body">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="/shop">Shop</a>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="/"
            role="button"
            data-bs-toggle="dropdown"
          >
            Connect
          </a>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li><a className="dropdown-item" href="/">Apps</a></li>
            <li><a className="dropdown-item" href="/">Web3.0</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</aside>


      {/* Navigation Bar */}
      <Nav />

      {/* Main Content */}
      <main className="m-0">
        <Outlet />
        {children}
      </main>

      {/* Footer / Additional Components */}
      <Menu />
      <div className="">

      <button 
      onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      </div>
      </>
  );
};

export default Layout;
