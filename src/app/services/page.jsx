import Services from "@/components/home/Services";

export const metadata = {
  title: "All Services | Care.xyz",
  description: "Browse baby care, elderly care, and sick people care services.",
};

export default function ServicesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Care Services</h1>
      <Services />
    </div>
  );
}
