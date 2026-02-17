import { redirect } from "next/navigation";

export default async function LegacyServiceDetailsPage({ params }) {
  const { id } = await params;
  redirect(`/service/${id}`);
}
