"use client";

import { DeleteService } from "@/actions/DeleteService";
import { ServicesList } from "@/actions/servicesList";
import { UpdateService } from "@/actions/UpdateService";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    data.id = selectedService._id;
    const result = await UpdateService(data);
    if (result.success) {
      toast.success("Service updated successfully");
      fetchServices();
      document.getElementById("edit_modal").close();
    } else {
      toast.error(result.message || "Failed to update service");
    }
  };
  const fetchServices = async () => {
    const data = await ServicesList();
    setServices(JSON.parse(JSON.stringify(data)));
    setLoading(false);
  };
  const handleDeleteService = async (id) => {
    try {
      const result = await DeleteService(id);
      if (result.success) {
        toast.success("Service deleted successfully");
        fetchServices();
        document.getElementById("delete_modal").close();
      } else {
        toast.error(result.message || "Failed to delete service");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the service");
    }
  };
  const showEditModal = (service) => {
    setSelectedService(service);
    const modal = document.getElementById("edit_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const showDeleteModal = (service) => {
    setSelectedService(service);
    const modal = document.getElementById("delete_modal");
    if (modal) {
      modal.showModal();
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      reset(selectedService);
    }
  }, [selectedService, reset]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  let itemNo = 1;

  return (
    <div>
      <h2 className="text-center">Admin Dashboard {services.length}</h2>

      <div className="overflow-x-auto">
        <table className="table rounded-xl">
          <thead className="bg-primary/10">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price per hour</th>
              <th>Price per day</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <th>{itemNo++}</th>
                <td>{service.name}</td>
                <td>{service.category}</td>
                <td>{service.pricePerHour}</td>
                <td>{service.pricePerDay}</td>
                <td>
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => showEditModal(service)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => showDeleteModal(service)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center">Update Service</h3>
          <form method="dialog" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500">Name is required</p>
                )}
              </div>
              <div>
                <label className="label">Image</label>
                <input
                  type="url"
                  className="input w-full"
                  placeholder="Image URL"
                  {...register("image", { required: true })}
                />
                {errors.image?.type === "required" && (
                  <p className="text-red-500">Image URL is required</p>
                )}
              </div>
              <div>
                <label className="label">Category</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Category"
                  {...register("category", { required: true })}
                />
                {errors.category?.type === "required" && (
                  <p className="text-red-500">Category is required</p>
                )}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="textarea input w-full"
                  placeholder="Description"
                  {...register("description", { required: true })}
                ></textarea>
                {errors.description?.type === "required" && (
                  <p className="text-red-500">Description is required</p>
                )}
              </div>
              <div>
                <label className="label">Price Per Hour</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Price Per Hour"
                  {...register("pricePerHour", { required: true, min: 1 })}
                />
                {errors.pricePerHour?.type === "required" && (
                  <p className="text-red-500">Price Per Hour is required</p>
                )}
                {errors.pricePerHour?.type === "min" && (
                  <p className="text-red-500">
                    Price Per Hour must be at least 1
                  </p>
                )}
              </div>
              <div>
                <label className="label">Price Per Day</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Price Per Day"
                  {...register("pricePerDay", { required: true, min: 10 })}
                />
                {errors.pricePerDay?.type === "required" && (
                  <p className="text-red-500">Price Per Day is required</p>
                )}
                {errors.pricePerDay?.type === "min" && (
                  <p className="text-red-500">
                    Price Per Day must be at least 10
                  </p>
                )}
              </div>
              <div>
                <label className="label">Features</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Features (comma separated)"
                  {...register("features", { required: true })}
                />
                {errors.features?.type === "required" && (
                  <p className="text-red-500">Features is required</p>
                )}
              </div>

              <div className="modal-action flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => document.getElementById("edit_modal").close()}
                >
                  Close
                </button>

                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </dialog>

      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center">Delete Service</h3>
          <p className="text-error mt-6 text-center">
            Are you sure you want to delete service{" "}
            <strong>{selectedService?.name}</strong>?
          </p>
          <div className="modal-action flex justify-end gap-3">
            <button
              type="submit"
              className="btn btn-error"
              onClick={() => handleDeleteService(selectedService._id)}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => document.getElementById("delete_modal").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminDashboard;
