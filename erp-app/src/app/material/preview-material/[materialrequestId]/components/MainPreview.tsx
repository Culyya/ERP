"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface MaterialData {
  materialId: string;
  username: string;
  status: string;
  createdAt: string;
  materialNumber: string;
  totalItem: string;
  departmentId: number;
  description_rejected: string;
}

interface MaterialRequestItem {
  materialrequestitemId: string;
  materialrequestId: string;
  itemName: string;
  itemId: string;
  quantity: string;
  description: string;
}

const PreviewMaterial = ({ params }: { params: { materialrequestId: string } }) => {
  const router = useRouter();
  const { materialrequestId } = useParams();
  const [data, setData] = useState<MaterialData | null>(null);
  const [items, setItems] = useState<MaterialRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const materialResponse = await axios.get(`/api/materialrequest/${materialrequestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(materialResponse.data);

        const itemsResponse = await axios.get(`/api/materialrequestitem/${materialrequestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(itemsResponse.data)) {
          setItems(itemsResponse.data);
        } else {
          setError("Invalid items response format");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [materialrequestId]);

  const handleApproval = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      Swal.fire("Error", "User is not authenticated.", "error");
      return;
    }

    try {
      await axios.put(
        `/api/materialrequest/${materialrequestId}`,
        { approved_by: parseInt(userId, 10), status: "Approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Success", "Material request approved successfully!", "success").then(() => {
        router.push("/material/materialrequest");
      });
    } catch (err) {
      Swal.fire("Error", "Failed to approve material request.", "error");
    }
  };

  const handleRejection = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      Swal.fire("Error", "User is not authenticated.", "error");
      return;
    }

    const { value: description, isConfirmed } = await Swal.fire({
      title: "Reject Material Request",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter your reason here...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Rejection reason is required!";
        }
      },
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.put(
        `/api/materialrequest/${materialrequestId}`,
        { approved_by: parseInt(userId, 10), description_rejected: description, status: "Rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Success", "Material request rejected successfully!", "success").then(() => {
        router.push("/material/materialrequest");
      });
    } catch (err) {
      Swal.fire("Error", "Failed to reject material request.", "error");
    }
  };

  return (
    <div className="container py-2">
      <h1 className="text-primary mb-4">Preview Material</h1>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : data ? (
        <div>
          <div className="rounded p-3 mb-4 bg-light shadow-sm">
            <p>
              <strong>Material ID:</strong> {String(data.materialNumber).padStart(5, "0")}
            </p>
            <p>
              <strong>Material Name:</strong> {data.username}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(data.createdAt).toISOString().split("T")[0]}
            </p>
            <p>
              <strong>Total Items:</strong> {data.totalItem}
            </p>
          </div>

          {parseInt(localStorage.getItem("departementId") || "0", 10) === 1 && data.status === "Rejected" && (
            <div className="alert alert-warning">
              <h5>Rejection Reason</h5>
              <p>{data.description_rejected || "No reason provided."}</p>
            </div>
          )}

          <h2 className="text-secondary mb-3">Material Request Items</h2>
          {items.length > 0 ? (
            <table className="table table-bordered rounded">
              <thead className="table-primary text-center">
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.materialrequestitemId}>
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items available.</p>
          )}
          <div className="d-flex justify-content-end">
            {parseInt(localStorage.getItem("departementId") || "0", 10) === 2 && (
              <div className="">
                <button className="btn btn-success me-2" onClick={handleApproval}>
                  Approve
                </button>
                <button className="btn btn-danger me-2" onClick={handleRejection}>
                  Reject
                </button>
              </div>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => router.push("/material/materialrequest")}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default PreviewMaterial;
