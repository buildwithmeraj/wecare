"use client";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

export default function ServiceCard({ service }) {
  const featuresText = Array.isArray(service.features)
    ? service.features.join(", ")
    : service.features;

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-base-200">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="badge badge-primary">{service.category}</span>
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-2">
          {service.name}
        </h3>
        <p className="text-sm text-base-content/70 mb-3 md:mb-4 line-clamp-3">
          {service.description}
        </p>
        <p className="text-xs text-base-content/60 mb-3 md:mb-4 italic line-clamp-2">
          {featuresText}
        </p>

        <div className="grid justify-between grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <FaClock className="inline mb-0.5 " />
            <p className="font-bold text-sm text-primary">
              ${service.pricePerHour}
              /Hour
            </p>
          </div>
          <div className="flex justify-end items-center gap-2">
            <FaCalendarAlt className="inline mb-0.5" />
            <p className="font-bold text-sm text-primary">
              ${service.pricePerDay}
              /Day
            </p>
          </div>
        </div>

        <Link
          href={`/service/${service._id}`}
          className="btn btn-primary btn-sm md:btn-md mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
