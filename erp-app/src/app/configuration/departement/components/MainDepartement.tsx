"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../../globals.css";

const DepartementPage: React.FC = () => {
  const [departements, setDepartement] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newDepartementName, setNewDepartement] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const departementPerPage = 6;

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDepartements = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/departement", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDepartement(response.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartements();
  }, [token]);

  const filteredDepartement = departements.filter((departement) =>
    departement.departement_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDepartement.length / departementPerPage);
  const paginatedDepartement = filteredDepartement.slice(
    (currentPage - 1) * departementPerPage,
    currentPage * departementPerPage
  );

  const handleDelete = async (departementId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/departement/${departementId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDepartement((prev) =>
            prev.filter((departement) => departement.departementId !== departementId)
          );
          Swal.fire("Deleted!", "The department has been deleted.", "success");
        } catch {
          Swal.fire("Error!", "Failed to delete the department.", "error");
        }
      }
    });
  };

  const handleCreateDepartement = async () => {
    if (!newDepartementName.trim()) {
      Swal.fire("Error", "Department name is required.", "error");
      return;
    }

    try {
      const response = await axios.post(
        "/api/departement",
        { departement_name: newDepartementName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartement((prev) => [...prev, response.data]);
      setNewDepartement("");
      setShowModal(false);
      Swal.fire("Success", "Department created successfully.", "success");
    } catch {
      Swal.fire("Error", "Failed to create the department.", "error");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Department Management</h3>
          <button
            className="btn btn-light btn-sm"
            onClick={() => setShowModal(true)}
          >
            + Create Department
          </button>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by department name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p>Loading departments...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <>
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDepartement.map((departement, index) => (
                    <tr key={departement.departementId}>
                      <td>{(currentPage - 1) * departementPerPage + index + 1}</td>
                      <td>{departement.departement_name}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(departement.departementId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <nav className="mt-3">
                <ul className="pagination justify-content-end">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content shadow-lg p-4 rounded">
            <h5 className="mb-3">Create Department</h5>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Department Name"
              value={newDepartementName}
              onChange={(e) => setNewDepartement(e.target.value)}
            />
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateDepartement}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartementPage;
