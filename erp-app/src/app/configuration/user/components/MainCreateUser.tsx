"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const CreateUser: React.FC = () => {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [departments, setDepartments] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch departments and roles
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [departmentsResponse, rolesResponse] = await Promise.all([
                    axios.get("/api/departement", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("/api/role", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setDepartments(departmentsResponse.data);
                setRoles(rolesResponse.data);
            } catch (err) {
                Swal.fire("Error", "Failed to fetch departments or roles.", "error");
            }
        };

        fetchData();
    }, []);

    const handleCreate = async () => {
        if (!username || !email || !password || !departmentId || !roleId) {
            Swal.fire("Error", "Please fill out all fields.", "error");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/api/users/Create",
                {
                    username,
                    email,
                    password,
                    departement_id: parseInt(departmentId),
                    role_id: parseInt(roleId),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire("Success", "User created successfully.", "success").then(() =>
                router.push("/configuration/user")
            );
        } catch (err) {
            Swal.fire("Error", "Failed to create user.", "error");
        }
    };

    return (
        <div className="container py-2">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white text-center">
                    <h2>Create User</h2>
                </div>
                <div className="card-body">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreate();
                        }}
                    >
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-bold">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                placeholder="Enter full name"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="department" className="form-label fw-bold">
                                Department
                            </label>
                            <select
                                id="department"
                                className="form-select"
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                            >
                                <option value="">Select a department</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.departementId}>
                                        {department.departement_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label fw-bold">
                                Role
                            </label>
                            <select
                                id="role"
                                className="form-select"
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                            >
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.roleId} value={role.roleId}>
                                        {role.role_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Create User
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
