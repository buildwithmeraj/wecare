"use client";
import { ServicesList } from "@/actions/server/servicesList";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchServices = async () => {
      const data = await ServicesList();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);
  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {services.map((service) => (
        <div className="card bg-base-100 max-w-2xl shadow-sm" key={service._id}>
          <figure>
            <img src={service.image} alt={service.name} />
          </figure>
          <div className="card-body">
            <h1 className="card-title">{service.name}</h1>
            <p>{service.description}</p>
            <div className="card-actions justify-end">
              <Link
                className="btn btn-primary"
                href={`/services/${service._id}`}
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services;
