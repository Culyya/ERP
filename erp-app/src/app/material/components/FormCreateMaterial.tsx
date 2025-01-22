"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2"; 


interface Item {
  itemId: string;
  item_name: string;
}

interface AddedItem {
  itemId: string;
  itemName: string;
  quantity: number;
  description: string;
}

const MaterialRequestForm: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]); // Explicit type definition
  const [createdBy, setCreatedBy] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCreatedBy(localStorage.getItem("username") || "User");
    const token = localStorage.getItem("token");
    setCurrentDate(new Date().toISOString().split("T")[0]);

    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/item", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch items. Please try again.", "error");
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = () => {
    if (!selectedItem || quantity <= 0) {
      Swal.fire(
        "Invalid Input",
        "Please select an item and enter a valid quantity.",
        "warning"
      );
      return;
    }

    const newItem: AddedItem = {
      itemId: selectedItem.itemId,
      itemName: selectedItem.item_name,
      quantity: parseInt(quantity.toString(), 10),
      description: description || "",
    };

    setAddedItems([...addedItems, newItem]);
    setSelectedItem(null);
    setQuantity(1);
    setDescription("");
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const materialRequestResponse = await axios.post(
        "/api/materialrequest",
        { created_by: parseInt(localStorage.getItem("userId") || "0", 10) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const material_request_id = materialRequestResponse.data.materialrequestId;

      const materialRequestItems = addedItems.map((item) => ({
        material_request_id,
        item_id: item.itemId,
        quantity: item.quantity,
        description: item.description,
      }));

      await axios.post("/api/materialrequestitem", materialRequestItems, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Success", "Material request items submitted successfully!", "success");
      setAddedItems([]);
      router.push("/material/materialrequest");
    } catch (error) {
      Swal.fire("Error", "Failed to submit data. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto" style={{maxWidth:"50rem"}}>
      <h2 className="text-primary mb-4">Material Request Form</h2>
      <form className="bg-light p-4 rounded shadow-sm">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="createdBy" className="form-label fw-bold">
              Created By
            </label>
            <input
              type="text"
              id="createdBy"
              className="form-control"
              value={createdBy}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="date" className="form-label fw-bold">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={currentDate}
              disabled
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="item" className="form-label fw-bold">
            Item
          </label>
          <select
            id="item"
            className="form-select"
            value={selectedItem ? JSON.stringify(selectedItem) : ""}
            onChange={(e) =>
              setSelectedItem(JSON.parse(e.target.value) as Item)
            }
          >
            <option value="" disabled>
              Select an item
            </option>
            {items.map((item) => (
              <option key={item.itemId} value={JSON.stringify(item)}>
                {item.item_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label fw-bold">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold">
            Description
          </label>
          <textarea
            id="description"
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          type="button"
          className="btn btn-success w-100"
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </form>

      <h4 className="text-secondary mt-4">Added Items</h4>
      <ul className="list-group mb-3">
        {addedItems.map((item, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{item.itemName}</strong> (Quantity: {item.quantity}) - {item.description}
            </span>
          </li>
        ))}
        {addedItems.length === 0 && (
          <li className="list-group-item text-center">
            <em>No items added yet.</em>
          </li>
        )}
      </ul>

      <button
        type="button"
        className="btn btn-primary w-100 mb-4"
        onClick={handleSubmit}
        disabled={addedItems.length === 0}
      >
        Submit Request
      </button>
    </div>
  );
};

export default MaterialRequestForm;
