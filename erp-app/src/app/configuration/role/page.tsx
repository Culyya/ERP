import React from "react";
import Navbar from "../components/Navbar";
import MainContent from "./components/MainRole";

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
