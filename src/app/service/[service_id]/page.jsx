import { ServiceDetails } from "@/actions/server/ServiceDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa6";

export async function generateMetadata({ params }) {
  const { service_id } = await params;
  const service = await ServiceDetails(service_id);

  if (!service || service.success === false) {
    return {
      title: "Service Not Found | Care.xyz",
      description: "The requested caregiving service was not found.",
    };
  }

  return {
    title: `${service.name} | Care.xyz`,
    description: service.description,
  };
}

export default async function ServiceDetailsPage({ params }) {
  const { service_id } = await params;
  const session = await getServerSession(authOptions);
  const service = await ServiceDetails(service_id);

  if (!service || service.success === false) {
    return <p className="text-center">Service not found</p>;
  }

  const bookUrl = `/booking/${service_id}`;
  const loginUrl = `/login?callbackUrl=${encodeURIComponent(bookUrl)}`;
  const features = Array.isArray(service.features)
    ? service.features
    : String(service.features || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-3">{service.name}</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm">
            <div className="relative w-full h-fit-content aspect-video bg-base-200">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm xl:sticky xl:top-24">
            <h2 className="text-xl font-semibold pb-4">Pricing & Booking</h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between border border-base-300 rounded-lg px-4 py-3">
                <span className="text-base-content/70">Per Hour</span>
                <span className="font-bold text-lg">
                  ${service.pricePerHour}
                </span>
              </div>
              <div className="flex items-center justify-between border border-base-300 rounded-lg px-4 py-3">
                <span className="text-base-content/70">Per Day</span>
                <span className="font-bold text-lg">
                  ${service.pricePerDay}
                </span>
              </div>
            </div>

            {features.length ? (
              <div className="flex flex-wrap gap-2 pb-3">
                <span className="text-base-content/70 font-semibold">
                  Features:
                </span>
                {features.map((feature, idx) => (
                  <span
                    key={`${feature}-${idx}`}
                    className="badge badge-neutral badge-outline px-3 py-3"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-base-content/70 pb-3">
                No feature details provided.
              </p>
            )}

            {session?.user ? (
              <Link className="btn btn-primary w-full" href={bookUrl}>
                <FaCheck className="mt-0.5" />
                Book Service
              </Link>
            ) : (
              <Link className="btn btn-primary w-full" href={loginUrl}>
                Login to Book Service
              </Link>
            )}
          </div>

          <div className="bg-base-100 border border-base-300 mt-4 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-3">Service Details</h2>
            <p className="text-base-content/80 leading-relaxed pb-2">
              {service.description}
            </p>
            <span className="text-base-content/70 font-semibold">
              Category:
            </span>{" "}
            <span className="badge badge-primary badge-outline px-4 py-3">
              {service.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
