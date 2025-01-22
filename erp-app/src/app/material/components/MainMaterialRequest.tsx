"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import "../../globals.css";

const TablePage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 5;

    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("/api/materialrequest", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(response.data);
            } catch (err: any) {
                setError(err.message || "Something went wrong!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    
    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        const startDateFormatted = startDate
            ? new Date(startDate).toISOString().split("T")[0]
            : null;

        const isMatchingDate =
            !startDateFormatted || itemDate === startDateFormatted;

        const matchesSearch = item.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        return isMatchingDate && matchesSearch;
    });


    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (materialrequestId: string) => {
        const token = localStorage.getItem("token");
        const userId = parseInt(localStorage.getItem("userId") || "0", 10);

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
                    await axios.put(
                        `/api/materialrequest/remove/${materialrequestId}`,
                        { delete_by: userId },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    setData((prevData) =>
                        prevData.filter(
                            (item) => item.materialrequestId !== materialrequestId
                        )
                    );

                    Swal.fire("Deleted!", "Your material request has been deleted.", "success");
                } catch (error) {
                    Swal.fire("Error!", "Failed to delete material request.", "error");
                }
            }
        });
    };


    const handleApprove = (materialrequestId: string) => {
        if (parseInt(localStorage.getItem("departementId") || "0", 10) === 1) {
            Swal.fire({
                title: "Preview Material?",
                text: "You are about to detail this material request.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, preview it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `/material/preview-material/${materialrequestId}`;
                }
            });
        }else {
        Swal.fire({
            title: "Approve Request?",
            text: "You are about to approve this material request.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/material/preview-material/${materialrequestId}`;
            }
        });
    }
    };

    const handleUpdate = (materialrequestId: string) => {
        Swal.fire({
            title: "Edit Request?",
            text: "You are about to edit this material request.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, edit it!",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/material/edit-material/${materialrequestId}`;
            }
        });
    };

    return (
        <div className="container py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h1 className="text-primary  text-md-start">Material Requests</h1>
                <div className="d-flex flex-column flex-md-row align-items-start gap-3  w-md-auto">
                {parseInt(localStorage.getItem("departementId") || "0", 10) === 1 && (
                        <Link href="/material/create-material">
                            <button className="btn btn-primary w-100 w-md-auto">Create</button>
                        </Link>
                    )}
                    <input
                        type="text"
                        className="form-control "
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    

                </div>
            </div>


            {isLoading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-custom">
                        <thead>
                            <tr>
                                <th>Material Number</th>
                                <th>Created By</th>
                                <th>Total Item</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <tr key={item.materialrequestId}>
                                        <td>{String(item.materialNumber).padStart(5, "0")}</td>
                                        <td>{item.username}</td>
                                        <td>{item.totalItem}</td>
                                        <td>{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
                                        <td>
                                            <span
                                                className={`badge ${item.status === "Pending Approval"
                                                        ? "badge-pending"
                                                        : item.status === "Approved"
                                                            ? "badge-approved"
                                                            : "badge-rejected"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm text-success"
                                                title="Preview"
                                                onClick={() => handleApprove(item.materialrequestId)}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm text-warning"
                                                title="Edit"
                                                onClick={() => handleUpdate(item.materialrequestId)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            {parseInt(localStorage.getItem("departementId") || "0", 10) === 1 && (
                                                <button
                                                    className="btn btn-sm text-danger"
                                                    title="Delete"
                                                    onClick={() => handleDelete(item.materialrequestId)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <nav>
                <ul className="pagination justify-content-end">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index + 1}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""
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
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
        </div>
    );
};

export default TablePage;
