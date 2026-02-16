"use client";

import { ServiceDetails } from "@/actions/server/ServiceDetails";
import { GetServiceAreas } from "@/actions/server/GetServiceAreas";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const [service, setService] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const data = await ServiceDetails(id);
        setService(data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  useEffect(() => {
    const fetchAreas = async () => {
      const res = await GetServiceAreas();
      setAreas(res);
    };
    fetchAreas();
  }, []);

  const normalizedAreas = useMemo(() => {
    const map = {};

    areas.forEach((item) => {
      if (!map[item.region]) {
        map[item.region] = {
          region: item.region,
          covered_area: new Set(),
        };
      }

      item.covered_area.forEach((area) =>
        map[item.region].covered_area.add(area)
      );
    });

    return Object.values(map).map((item) => ({
      region: item.region,
      covered_area: Array.from(item.covered_area),
    }));
  }, [areas]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!service) return <p className="text-center">Service not found</p>;

  return (
    <div className="max-w-7xl mx-auto my-6">
      <h2 className="text-xl font-bold text-center mb-4">Service Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Image
          src={service.image}
          alt={service.name}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
        />
        <div>
          <h3 className="text-lg font-semibold">{service.name}</h3>
          <p>{service.category}</p>
          <p>{service.description}</p>
          <p className="font-semibold">
            Price (per hour): ${service.pricePerHour}
          </p>
          <p className="font-semibold">
            Price (per day): ${service.pricePerDay}
          </p>
          <p>Features: {service.features}</p>

          {session?.user ? (
            <Link className="btn btn-primary" href={`/services/${id}/book`}>
              Book
            </Link>
          ) : (
            <p className="text-red-500">Please log in to book this service.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
