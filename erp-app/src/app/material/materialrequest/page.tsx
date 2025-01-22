import React from "react";
import Navbar from "../components/Navbar";
import MainContent from "../components/MainMaterialRequest";

const DashboardMaterial: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMaterial;
