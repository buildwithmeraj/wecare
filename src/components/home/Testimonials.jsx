import { Image } from "next/image";
const testimonials = [
  {
    id: 1,
    name: "Nusrat Jahan",
    role: "Mother of 2",
    quote:
      "I found a caring babysitter within a day. The booking process was simple and very reliable.",
  },
  {
    id: 2,
    name: "Mahmud Rahman",
    role: "Working Professional",
    quote:
      "Care.xyz helped me arrange elderly support for my father. The caretaker was punctual and professional.",
  },
  {
    id: 3,
    name: "Shamsun Nahar",
    role: "Family Caregiver",
    quote:
      "I love how easy it is to track bookings and status updates. It made caregiving much less stressful.",
  },
];

export default function Testimonials() {
  return (
    <section className="mt-10">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold">What Families Say</h2>
        <p className="text-base-content/70">Testimonials from our users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 border border-base-300 shadow-sm"
          >
            <div className="card-body">
              <p className="italic text-base-content/80">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={`https://i.pravatar.cc/150?u=${item.id}`}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="mt-3">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-base-content/70">{item.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
