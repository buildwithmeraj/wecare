"use client";

import { useState } from "react";
import Link from "next/link";

const slides = [
  {
    id: "slide1",
    title: "Care That Feels Like Family",
    description:
      "Book trusted babysitters and elderly caregivers with confidence, right when your family needs support.",
    bgImage:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "slide2",
    title: "Safe, Reliable, Always Nearby",
    description:
      "Choose care professionals by location, duration, and service type with a smooth booking process.",
    bgImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "slide3",
    title: "Your Loved Ones Deserve Better Care",
    description:
      "From child care to special home support, Care.xyz makes caregiving simple, secure, and accessible.",
    bgImage:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function BannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="mb-8">
      <div className="relative rounded-2xl overflow-hidden bg-base-200">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative min-h-[360px] w-full shrink-0"
              style={{
                backgroundImage: `url(${slide.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/45" />

              <div className="relative z-10 w-full flex items-center justify-center p-8 md:p-14 text-white">
                <div className="max-w-2xl text-center">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-lg mb-6">{slide.description}</p>
                  <Link href="/services" className="btn btn-primary">
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute flex justify-between transform -translate-y-1/2 left-3 right-3 top-1/2">
          <button type="button" onClick={goPrev} className="btn btn-circle btn-sm md:btn-md">
            ❮
          </button>
          <button type="button" onClick={goNext} className="btn btn-circle btn-sm md:btn-md">
            ❯
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                activeIndex === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
