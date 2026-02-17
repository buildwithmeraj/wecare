import { ServiceDetails } from "@/actions/server/ServiceDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";

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
          className="w-full h-auto rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold">{service.name}</h3>
          <p>{service.category}</p>
          <p>{service.description}</p>
          <p className="font-semibold">Price (per hour): ${service.pricePerHour}</p>
          <p className="font-semibold">Price (per day): ${service.pricePerDay}</p>
          <p>Features: {Array.isArray(service.features) ? service.features.join(", ") : service.features}</p>

          {session?.user ? (
            <Link className="btn btn-primary mt-3" href={bookUrl}>
              Book Service
            </Link>
          ) : (
            <Link className="btn btn-primary mt-3" href={loginUrl}>
              Login to Book Service
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
