"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../../globals.css";

const MainContent: React.FC = () => {
  const items = [
    { id: 1, title: "Material", image: "/material.png", path: "/material" },
    { id: 2, title: "Konfigurasi", image: "/config.png", path: "/configuration", roleId: 1 },
  ];

  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    const storedRoleId = parseInt(localStorage.getItem("roleId") || "0", 10);
    setRoleId(storedRoleId);
  }, []);

  return (
    <main className="mx-auto" style={{ maxWidth: "450px" }}>
      <div className="container-fluid justify-content-center align-items-center">
        <div className="row row-cols-2 row-cols-md-4 g-4">
          {items.map((item) => (
            <div key={item.id} className="col text-center">
              {item.roleId && roleId !== null && item.roleId !== roleId ? (
                <div
                  className="shadow p-3 bg-body rounded text-muted"
                  style={{
                    cursor: "not-allowed",
                    opacity: 0.5,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "3rem",
                    }}
                  />
                </div>
              ) : (
                <Link href={item.path} className="text-decoration-none text-black poppins-medium">
                  <div className="shadow p-3 bg-body rounded animasi">
                    <img src={item.image} alt={item.title} style={{ width: "3rem" }} />
                  </div>
                </Link>
              )}
              <h2
                className="poppins-reguler mt-2"
                style={{
                  fontSize: "14px",
                  color: item.roleId && roleId !== null && item.roleId !== roleId ? "gray" : "black",
                }}
              >
                {item.title}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
