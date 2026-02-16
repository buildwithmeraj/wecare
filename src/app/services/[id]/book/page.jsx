"use client";
import ServiceBooking from "@/components/user/ServiceBooking";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ServiceDetails } from "@/actions/server/ServiceDetails";
import { GetServiceAreas } from "@/actions/server/GetServiceAreas";

const ServiceBookingPage = () => {
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
    <ServiceBooking
      service={service}
      serviceId={id}
      userEmail={session.user.email}
      areas={normalizedAreas}
    >
      {id}
    </ServiceBooking>
  );
};

export default ServiceBookingPage;
