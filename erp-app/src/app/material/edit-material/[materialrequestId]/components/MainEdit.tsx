"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

const MainEdit: React.FC = () => {
  const { materialrequestId } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [createdBy, setCreatedBy] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!materialrequestId) return;

    const token = localStorage.getItem("token");

    const fetchMaterialRequest = async () => {
      try {
        const response = await axios.get(`/api/materialrequest/${materialrequestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedDate = new Date(response.data.createdAt).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        setCreatedBy(response.data.username);
        setCurrentDate(formattedDate);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch material request details.", "error");
      }
    };

    const fetchMaterialRequestItems = async () => {
      try {
        const response = await axios.get(`/api/materialrequestitem/${materialrequestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch material request items.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterialRequest();
    fetchMaterialRequestItems();
  }, [materialrequestId]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleDeleteItem = async (itemId: number, index: number) => {
    const token = localStorage.getItem("token");

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
          await axios.delete(`/api/materialrequestitem/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const updatedItems = items.filter((_, i) => i !== index);
          setItems(updatedItems);

          Swal.fire("Deleted!", "Your item has been removed.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete the item. Please try again.", "error");
        }
      }
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `/api/materialrequestitem/bulk-update`,
        items.map(({ materialrequestitemId, quantity, description }) => ({
          materialrequestitemId,
          quantity,
          description,
        })),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Material request items updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update material request items.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Edit Material Request</h2>

      <div className="row mb-3">
        <div className="col-md-6 mb-3">
          <label htmlFor="createdBy" className="form-label fw-bold">
            Created By
          </label>
          <input type="text" id="createdBy" className="form-control" value={createdBy} disabled />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="date" className="form-label fw-bold">
            Date
          </label>
          <input type="text" id="date" className="form-control" value={currentDate} disabled />
        </div>
      </div>

      <h4 className="mb-3 text-secondary">Items</h4>
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                      min="1"
                    />
                  </td>
                  <td>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={item.description || ""}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteItem(item.materialrequestitemId, index)}
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  <em>No items available</em>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-2">
        <Link href="/material/materialrequest" passHref>
          <button className="btn btn-secondary">
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </Link>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={items.length === 0}
        >
          <i className="bi bi-save"></i> Save Changes
        </button>
      </div>
    </div>
  );
};

export default MainEdit;
