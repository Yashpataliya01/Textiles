import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>
          <a href="/" style={styles.logoLink}>
            <h2 style={styles.logoText}>Admin Panel</h2>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div style={styles.navLinks}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/" style={styles.navLink}>
                Products
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/blogs" style={styles.navLink}>
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/gallery" style={styles.navLink}>
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} style={styles.mobileMenuButton}>
          <div style={styles.hamburger}>
            <span
              style={{
                ...styles.hamburgerLine,
                ...(isMobileMenuOpen ? styles.hamburgerLineActive1 : {}),
              }}
            ></span>
            <span
              style={{
                ...styles.hamburgerLine,
                ...(isMobileMenuOpen ? styles.hamburgerLineActive2 : {}),
              }}
            ></span>
            <span
              style={{
                ...styles.hamburgerLine,
                ...(isMobileMenuOpen ? styles.hamburgerLineActive3 : {}),
              }}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <ul style={styles.mobileNavList}>
            <li style={styles.mobileNavItem}>
              <a href="/" style={styles.mobileNavLink}>
                Products
              </a>
            </li>
            <li style={styles.mobileNavItem}>
              <a href="/blogs" style={styles.mobileNavLink}>
                Blogs
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: "64px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoLink: {
    textDecoration: "none",
    color: "inherit",
  },
  logoText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "32px",
  },
  navItem: {
    margin: 0,
  },
  navLink: {
    textDecoration: "none",
    color: "#6b7280",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 0",
    transition: "color 0.15s ease-in-out",
    cursor: "pointer",
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "transparent",
    border: "1px solid #d1d5db",
    color: "#6b7280",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
  },
  authButtons: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  loginLink: {
    textDecoration: "none",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
    padding: "6px 12px",
    transition: "color 0.15s ease-in-out",
  },
  signupButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.15s ease-in-out",
  },
  mobileMenuButton: {
    display: "none",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  hamburger: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  hamburgerLine: {
    width: "20px",
    height: "2px",
    backgroundColor: "#6b7280",
    transition: "all 0.3s ease-in-out",
  },
  hamburgerLineActive1: {
    transform: "rotate(45deg) translate(5px, 5px)",
  },
  hamburgerLineActive2: {
    opacity: 0,
  },
  hamburgerLineActive3: {
    transform: "rotate(-45deg) translate(7px, -6px)",
  },
  mobileMenu: {
    display: "none",
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb",
    padding: "16px",
  },
  mobileNavList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  mobileNavItem: {
    margin: 0,
  },
  mobileNavLink: {
    textDecoration: "none",
    color: "#374151",
    fontSize: "16px",
    fontWeight: "500",
    display: "block",
    padding: "8px 0",
  },
  mobileAuthButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "8px",
    width: "100%",
  },
};

// Add media query styles through a style tag
const MediaQueryStyles = () => (
  <style>{`
    @media (max-width: 768px) {
      .navbar .nav-links {
        display: none !important;
      }
      .navbar .auth-section {
        display: none !important;
      }
      .navbar .mobile-menu-button {
        display: block !important;
      }
      .navbar .mobile-menu {
        display: block !important;
      }
    }
    
    .navbar .nav-link:hover {
      color: #374151 !important;
    }
    
    .navbar .login-link:hover {
      color: #2563eb !important;
    }
    
    .navbar .signup-button:hover {
      background-color: #1d4ed8 !important;
    }
    
    .navbar .logout-button:hover {
      background-color: #f3f4f6 !important;
      border-color: #9ca3af !important;
    }
  `}</style>
);

const NavbarWithStyles = () => (
  <>
    <MediaQueryStyles />
    <div className="navbar">
      <Navbar />
    </div>
  </>
);

export default NavbarWithStyles;
