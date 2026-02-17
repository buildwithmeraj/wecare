import { ServiceDetails } from "@/actions/server/ServiceDetails";
import { GetServiceAreas } from "@/actions/server/GetServiceAreas";
import ServiceBooking from "@/components/user/ServiceBooking";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function BookingPage({ params }) {
  const { service_id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/booking/${service_id}`)}`);
  }

  const [service, areas] = await Promise.all([
    ServiceDetails(service_id),
    GetServiceAreas(),
  ]);

  if (!service || service.success === false) {
    return <p className="text-center">Service not found</p>;
  }

  return (
    <ServiceBooking
      service={service}
      serviceId={service_id}
      userEmail={session.user.email}
      areas={areas}
    />
  );
}
