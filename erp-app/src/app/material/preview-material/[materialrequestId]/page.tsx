import React from "react";
import Navbar from "../../components/Navbar";
import MainEdit from "../[materialrequestId]/components/MainPreview";

const DashboardMaterial: React.FC<{ params: { materialrequestId: string } }> = ({ params }) => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="">
            <MainEdit/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMaterial;
