import Services from "@/components/home/Services";
import Link from "next/link";

export const metadata = {
  title: "Care.xyz | Baby Sitting & Elderly Care Services",
  description:
    "Reliable care services for children, elderly, and family members. Book trusted caregivers based on your location and schedule.",
};

export default function Home() {
  return (
    <>
      <section className="hero bg-base-200 rounded-xl p-8 mb-8">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-3">Trusted Care, When Your Family Needs It</h1>
            <p className="mb-5">
              Care.xyz helps you find dependable babysitters, elderly caregivers,
              and home support professionals based on your preferred time and
              location.
            </p>
            <Link href="/services" className="btn btn-primary">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">About Care.xyz</h2>
        <p>
          Our mission is to make caregiving easy, secure, and accessible. We
          connect families with trusted caretakers and provide a simple booking
          flow, transparent pricing, and booking status tracking.
        </p>
      </section>

      <Services />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold">1,000+</h3>
            <p>Successful care bookings</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold">98%</h3>
            <p>Customer satisfaction score</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold">24/7</h3>
            <p>Support for urgent care requests</p>
          </div>
        </div>
      </section>
    </>
  );
}
