import { redirect } from "next/navigation";

export default async function LegacyBookPage({ params }) {
  const { id } = await params;
  redirect(`/booking/${id}`);
}
