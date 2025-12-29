"use client";
import { AddService } from "@/actions/addService";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
const AddServiceForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const result = await AddService(data);
    if (result.success) {
      toast.success("Service added successfully");
      reset();
    } else {
      toast.error(result.message || "Failed to add service");
    }
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-auto mt-10">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center">Add Service</h2>
        <fieldset className="fieldset">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              className="input"
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
              className="input"
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
              className="input"
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
              className="textarea input"
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
              className="input"
              placeholder="Price Per Hour"
              {...register("pricePerHour", { required: true, min: 1 })}
            />
            {errors.pricePerHour?.type === "required" && (
              <p className="text-red-500">Price Per Hour is required</p>
            )}
            {errors.pricePerHour?.type === "min" && (
              <p className="text-red-500">Price Per Hour must be at least 1</p>
            )}
          </div>
          <div>
            <label className="label">Price Per Day</label>
            <input
              type="number"
              className="input"
              placeholder="Price Per Day"
              {...register("pricePerDay", { required: true, min: 10 })}
            />
            {errors.pricePerDay?.type === "required" && (
              <p className="text-red-500">Price Per Day is required</p>
            )}
            {errors.pricePerDay?.type === "min" && (
              <p className="text-red-500">Price Per Day must be at least 10</p>
            )}
          </div>
          <div>
            <label className="label">Features</label>
            <input
              type="text"
              className="input"
              placeholder="Features (comma separated)"
              {...register("features", { required: true })}
            />
            {errors.features?.type === "required" && (
              <p className="text-red-500">Features is required</p>
            )}
          </div>

          <button className="btn btn-neutral mt-4">Add</button>
        </fieldset>
      </form>
    </div>
  );
};

export default AddServiceForm;
