"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>("");

  useEffect(() => {
    // Access localStorage only on the client-side
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "User");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <nav className="navbar navbar-expand-lg shadow p-3 mb-3 bg-body">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo and Home Link */}
        <Link href="/dashboard" className="navbar-brand d-flex align-items-center">
          <img
            src="../../seatrum-logo.png"
            style={{ width: "8rem" }}
            alt="Logo"
          />
        </Link>

        {/* Navbar toggler for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div
          className="collapse navbar-collapse justify-content-end poppins-medium"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav">
            {/* User dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {username}
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
