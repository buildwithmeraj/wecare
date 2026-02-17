"use client";
import { ServicesList } from "@/actions/server/servicesList";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ServiceCard from "../ServiceCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
};

export default Services;
