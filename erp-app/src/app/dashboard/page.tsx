import React from "react";
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-9">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
