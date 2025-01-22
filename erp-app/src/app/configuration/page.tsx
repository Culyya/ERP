import React from "react";
import Navbar from "../configuration/components/Navbar";
import MainContent from "../configuration/components/MainContent";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
