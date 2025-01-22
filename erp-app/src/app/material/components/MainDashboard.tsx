import React from "react";
import "../../globals.css";

const MainDashboard: React.FC = () => {
  const data = [
    {
      title: "Total Requests",
      image: "/material-request.jpg",
    },
    {
      title: "Total Items",
      image: "/total-item.jpg",
    },
    {
      title: "Total Approved",
      image: "/approved-material.jpg",
    },
    {
      title: "Total Rejected",
      image: "/rejected-material.png",
    },
  ];

  return (
    <main className="container py-4">
      <div className="row justify-content-center align-items-center g-3">
        {data.map((item, index) => (
          <div
            className="col-12 col-md-6 col-lg-3 d-flex justify-content-center"
            key={index}
          >
            <div className="card border-0 text-center p-3 mb-5 bg-body rounded" style={{ width: "24rem",boxShadow:"rgba(0, 0, 0, 0.1) 0px 4px 12px" }}>
              <img
                src={item.image}
                className="card-img-top img-fluid"
                alt={item.title}
                style={{ width: "100%", height: "12rem", objectFit: "cover" }} 
              />
              <div className="card-body">
                <h5 className="fs-6 poppins-reguler">{item.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainDashboard;
