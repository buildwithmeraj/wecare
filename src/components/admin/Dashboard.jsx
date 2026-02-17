"use client";

import { getAdminDashboardData, updateBookingStatusByAdmin } from "@/actions/server/AdminDashboard";
import { DeleteService } from "@/actions/server/DeleteService";
import { UpdateService } from "@/actions/server/UpdateService";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const bookingStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoadingId, setStatusLoadingId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadData = async () => {
    const data = await getAdminDashboardData();
    setServices(data.services || []);
    setBookings(data.bookings || []);
    setStats(data.stats);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const data = await getAdminDashboardData();
      if (!mounted) return;
      setServices(data.services || []);
      setBookings(data.bookings || []);
      setStats(data.stats);
      setLoading(false);
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedService) {
      reset({
        ...selectedService,
        features: Array.isArray(selectedService.features)
          ? selectedService.features.join(", ")
          : selectedService.features,
      });
    }
  }, [selectedService, reset]);

  const onSubmit = async (data) => {
    if (!selectedService?._id) return;

    const result = await UpdateService({
      ...data,
      id: selectedService._id,
    });

    if (!result.success) {
      toast.error(result.message || "Failed to update service");
      return;
    }

    toast.success("Service updated");
    document.getElementById("edit_modal")?.close();
    await loadData();
  };

  const handleDeleteService = async () => {
    if (!selectedService?._id) return;

    const result = await DeleteService(selectedService._id);
    if (!result.success) {
      toast.error(result.message || "Failed to delete service");
      return;
    }

    toast.success("Service deleted");
    document.getElementById("delete_modal")?.close();
    await loadData();
  };

  const handleBookingStatusChange = async (bookingId, nextStatus) => {
    setStatusLoadingId(bookingId);
    const result = await updateBookingStatusByAdmin(bookingId, nextStatus);

    if (!result.success) {
      toast.error(result.message || "Failed to update status");
      setStatusLoadingId("");
      return;
    }

    toast.success("Booking status updated");
    await loadData();
    setStatusLoadingId("");
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    document.getElementById("edit_modal")?.showModal();
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    document.getElementById("delete_modal")?.showModal();
  };

  if (loading) {
    return <p className="text-center">Loading admin dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/add-service" className="btn btn-primary btn-sm">
          Add New Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-sm opacity-70">Total Services</p>
            <h3 className="text-2xl font-semibold">{stats.totalServices}</h3>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-sm opacity-70">Total Bookings</p>
            <h3 className="text-2xl font-semibold">{stats.totalBookings}</h3>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-sm opacity-70">Pending Bookings</p>
            <h3 className="text-2xl font-semibold">{stats.pendingBookings}</h3>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-sm opacity-70">Completed Revenue</p>
            <h3 className="text-2xl font-semibold">৳{stats.totalRevenue}</h3>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Manage Services</h2>
        <div className="overflow-x-auto bg-base-100 rounded-xl">
          <table className="table">
            <thead className="bg-primary/10">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Per Hour</th>
                <th>Per Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, idx) => (
                <tr key={service._id}>
                  <th>{idx + 1}</th>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{service.pricePerHour}</td>
                  <td>{service.pricePerDay}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => openEditModal(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-xs"
                      onClick={() => openDeleteModal(service)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Manage Bookings</h2>
        <div className="overflow-x-auto bg-base-100 rounded-xl">
          <table className="table">
            <thead className="bg-primary/10">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Service</th>
                <th>Duration</th>
                <th>Total</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={booking._id}>
                  <th>{idx + 1}</th>
                  <td>{booking.userEmail}</td>
                  <td>{booking.serviceName}</td>
                  <td>
                    {booking.serviceDuration}{" "}
                    {booking.serviceType === "perHour" ? "hour(s)" : "day(s)"}
                  </td>
                  <td>৳{booking.totalCost}</td>
                  <td>{booking.status}</td>
                  <td>
                    <select
                      className="select select-bordered select-sm"
                      defaultValue={booking.status}
                      disabled={statusLoadingId === booking._id}
                      onChange={(e) =>
                        handleBookingStatusChange(booking._id, e.target.value)
                      }
                    >
                      {bookingStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center">Update Service</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input w-full"
                  {...register("name", { required: true })}
                />
                {errors.name && <p className="text-red-500">Name is required</p>}
              </div>
              <div>
                <label className="label">Image URL</label>
                <input
                  type="url"
                  className="input w-full"
                  {...register("image", { required: true })}
                />
                {errors.image && (
                  <p className="text-red-500">Image URL is required</p>
                )}
              </div>
              <div>
                <label className="label">Category</label>
                <input
                  type="text"
                  className="input w-full"
                  {...register("category", { required: true })}
                />
                {errors.category && (
                  <p className="text-red-500">Category is required</p>
                )}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="textarea w-full"
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <p className="text-red-500">Description is required</p>
                )}
              </div>
              <div>
                <label className="label">Price Per Hour</label>
                <input
                  type="number"
                  className="input w-full"
                  {...register("pricePerHour", { required: true, min: 1 })}
                />
              </div>
              <div>
                <label className="label">Price Per Day</label>
                <input
                  type="number"
                  className="input w-full"
                  {...register("pricePerDay", { required: true, min: 1 })}
                />
              </div>
              <div>
                <label className="label">Features (comma separated)</label>
                <input
                  type="text"
                  className="input w-full"
                  {...register("features", { required: true })}
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => document.getElementById("edit_modal")?.close()}
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
          <p className="text-error mt-4 text-center">
            Are you sure you want to delete{" "}
            <strong>{selectedService?.name}</strong>?
          </p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={handleDeleteService}>
              Delete
            </button>
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => document.getElementById("delete_modal")?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Dashboard;
