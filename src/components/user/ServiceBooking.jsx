"use client";

import { BookService } from "@/actions/server/BookService";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

const ServiceBooking = ({ service, serviceId, userEmail, areas }) => {
  const router = useRouter();
  const [serviceType, setServiceType] = useState("perHour");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceDuration: 1,
      address: "",
    },
  });

  const duration = watch("serviceDuration") || 0;
  const pricePerUnit =
    serviceType === "perHour" ? service.pricePerHour : service.pricePerDay;
  const totalCost = useMemo(
    () => duration * pricePerUnit,
    [duration, pricePerUnit],
  );

  const locationData = useMemo(() => {
    if (!areas || !Array.isArray(areas)) return [];
    return areas.map((item) => ({
      region: item.region,
      district: item.district,
      city: item.city,
      covered_area: Array.isArray(item.covered_area) ? item.covered_area : [],
      latitude: item.latitude,
      longitude: item.longitude,
      flowchart: item.flowchart,
    }));
  }, [areas]);

  const divisions = useMemo(() => {
    if (!areas || !Array.isArray(areas)) return [];
    return [...new Set(areas.map((a) => a.region))];
  }, [areas]);

  const districts = useMemo(() => {
    if (!region || !locationData.length) return [];
    const filtered = locationData.filter((item) => item.region === region);
    return [...new Set(filtered.map((item) => item.district).filter(Boolean))];
  }, [locationData, region]);

  const cities = useMemo(() => {
    if (!region || !district || !locationData.length) return [];

    const filtered = locationData.filter(
      (item) => item.region === region && item.district === district,
    );
    return [...new Set(filtered.map((item) => item.city).filter(Boolean))];
  }, [locationData, region, district]);

  const coveredAreas = useMemo(() => {
    if (!region || !district || !city || !locationData.length) return [];

    const filtered = locationData.filter(
      (item) =>
        item.region === region &&
        item.district === district &&
        item.city === city,
    );
    return [
      ...new Set(
        filtered.flatMap((item) => item.covered_area || []).filter(Boolean),
      ),
    ];
  }, [locationData, region, district, city]);

  const selectedLocation = useMemo(() => {
    if (!region || !district || !city || !locationData.length) return null;
    return locationData.find(
      (a) => a.region === region && a.district === district && a.city === city,
    );
  }, [locationData, region, district, city]);

  const onSubmit = async (data) => {
    if (!region || !district || !city || !area) {
      toast.error(
        "Please select full location (division, district, city, area)",
      );
      return;
    }

    setLoading(true);

    const bookingData = {
      userEmail,
      serviceId,
      serviceName: service.name,
      serviceType,
      serviceDuration: Number(data.serviceDuration),
      pricePerUnit,
      totalCost,
      status: "Pending",
      location: {
        region,
        district,
        city,
        area,
        address: data.address,
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
        flowchart: selectedLocation?.flowchart,
      },
    };

    const result = await BookService(bookingData);

    if (result.success) {
      toast.success(
        result.emailSuccess
          ? "Service booked successfully. Invoice sent to your email."
          : "Service booked successfully",
      );
      reset();
      setRegion("");
      setDistrict("");
      setCity("");
      setArea("");
      router.push("/my-bookings");
    } else {
      toast.error(result.message || "Booking failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto card bg-base-100 shadow-sm">
      <h2 className="pt-2 text-center font-semibold text-lg">Book Service</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-3 card-body"
      >
        <div className="col-span-2">
          <label className="label">User Email</label>
          <input className="input w-full" value={userEmail} readOnly />
        </div>

        <div className="col-span-2">
          <label className="label">Service</label>
          <input className="input w-full" value={service.name} readOnly />
        </div>

        <div>
          <label className="label">Service Type</label>
          <select
            className="select"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="perHour">Per Hour</option>
            <option value="perDay">Per Day</option>
          </select>
        </div>

        <div>
          <label className="label">
            Duration ({serviceType === "perHour" ? "Hours" : "Days"})
          </label>
          <input
            type="number"
            min={1}
            className="input"
            {...register("serviceDuration", { required: true, min: 1 })}
          />
          {errors.serviceDuration && (
            <p className="text-red-500">Minimum 1 required</p>
          )}
        </div>

        <div>
          <label className="label">Price per unit</label>
          <input className="input" value={`৳${pricePerUnit}`} readOnly />
        </div>

        <div>
          <label className="label">Total Cost</label>
          <input
            className="input font-semibold"
            value={`৳${totalCost}`}
            readOnly
          />
        </div>

        <div>
          <label className="label">Division</label>
          <select
            className="select"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setDistrict("");
              setCity("");
              setArea("");
            }}
          >
            <option value="">Select Division</option>
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">District</label>
          <select
            className="select"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setCity("");
              setArea("");
            }}
            disabled={!region}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">City</label>
          <select
            className="select"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setArea("");
            }}
            disabled={!district}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Area</label>
          <select
            className="select"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            disabled={!city}
          >
            <option value="">Select Area</option>
            {coveredAreas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="label">Full Address</label>
          <textarea
            className="textarea w-full"
            {...register("address", { required: true, minLength: 5 })}
            placeholder="House, Road, Landmark"
          />
          {errors.address && (
            <p className="text-red-500">Address is required</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 col-span-full">
          <Link href={`/service/${serviceId}`} className="btn btn-neutral">
            <IoMdArrowRoundBack className="mt-0.5" />
            Go Back
          </Link>
          <button
            className="btn btn-primary col-span-2"
            type="submit"
            disabled={loading}
          >
            <FaCheck />
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceBooking;
