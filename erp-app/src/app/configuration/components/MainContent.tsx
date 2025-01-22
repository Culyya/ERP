import React from "react";
import Link from "next/link";
import "../../globals.css";

const projects = [
  {
    id: 1,
    initials: "Us",
    name: "Users Master Data",
    color: "#ff0077", 
    link: "/configuration/user", 
  },
  {
    id: 2,
    initials: "RL",
    name: "Role Master Data",
    color: "#9b51e0",
    link: "/configuration/role", 
  },
  {
    id: 3,
    initials: "DP",
    name: "Departement Master Data",
    color: "#f2c94c",
    link: "/configuration/departement", 
  },
  {
    id: 4,
    initials: "IT",
    name: "Item Master Data",
    color: "#27ae60",
    link: "/configuration/item", 
  },
];

const MainContent: React.FC = () => {
  return (
    <div className="main-content">
      <h2 className="fs-4 mb-4">Master Data</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <Link href={project.link} key={project.id}>
            <div className="project-card">
              <div
                className="project-initials"
                style={{ backgroundColor: project.color }}
              >
                {project.initials}
              </div>
              <div className="project-details">
                <h3>{project.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
