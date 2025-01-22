"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "../../globals.css";

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("User");

  useEffect(() => {
   
    const storedUsername = localStorage.getItem("username") || "User";
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const isActive = (path: string) => (pathname === path ? "active-link" : "");

  return (
    <nav className="navbar navbar-expand-lg shadow p-3 mb-3 bg-body">
      <div className="container-fluid">

        <Link href="/dashboard" className="navbar-brand d-flex align-items-center">
          <img src="../../seatrum-logo.png" style={{ width: "8rem" }} alt="Logo" />
        </Link>

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

    
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
        
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                href="/material"
                className={`nav-link ${isActive("/material")}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/material/materialrequest"
                className={`nav-link ${isActive("/material/materialrequest")}`}
              >
                Material
              </Link>
            </li>
          </ul>

        
          <ul className="navbar-nav ms-auto">
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
