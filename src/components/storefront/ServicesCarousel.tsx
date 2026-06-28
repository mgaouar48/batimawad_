"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, ClipboardCheck, Truck, HardHat, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const SERVICES = [
  {
    id: "conseil",
    icon: ClipboardCheck,
    title: "Conseil technique",
    description: "Recommandations de produits, fiches techniques et solutions sur-mesure adaptées aux spécificités de votre structure.",
    href: "/catalogue",
    bgImage: "/service-conseil-bg.png",
  },
  {
    id: "livraison",
    icon: Truck,
    title: "Livraison et logistique",
    description: "Acheminement rapide et sécurisé de vos matériaux de construction sur vos chantiers à travers les 58 wilayas.",
    href: "/catalogue",
    bgImage: "/service-livraison-bg.png",
  },
  {
    id: "assistance",
    icon: HardHat,
    title: "Assistance sur chantier",
    description: "Accompagnement pratique et conseils d'application par nos techniciens directement sur votre site de travail.",
    href: "/catalogue",
    bgImage: "/service-assistance-bg.png",
  },
  {
    id: "qualite",
    icon: ShieldCheck,
    title: "Contrôle de qualité",
    description: "Vérification rigoureuse des performances mécaniques et de la conformité de nos produits aux normes BTP.",
    href: "/catalogue",
    bgImage: "/service-qualite-bg.png",
  },
];

export function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  // Keep the ref in sync so startTimer can read it without a stale closure
  isHoveredRef.current = isHovered;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isHoveredRef.current) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % SERVICES.length);
      }, 6000);
    }
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    startTimer(); // reset interval so it doesn't fire right after this click
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
    startTimer();
  };

  const selectSlide = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered]);

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl tracking-tight">
            Nos Services
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Des services professionnels et réactifs pour vous accompagner à chaque étape de votre chantier.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 pb-6 overflow-x-auto justify-start md:justify-center scrollbar-none snap-x snap-mandatory max-w-4xl mx-auto">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            const isActive = activeIndex === idx;
            return (
              <button
                key={service.title}
                onClick={() => selectSlide(idx)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-xs transition-all duration-300 whitespace-nowrap snap-start cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {service.title}
              </button>
            );
          })}
        </div>

        {/* Carousel Viewport Container */}
        <div 
          className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border/40 shadow-2xl bg-black"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Slides Wrapper */}
          <div 
            className="flex transition-transform duration-700 ease-out" 
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              const isActive = activeIndex === idx;
              return (
                <div 
                  key={service.title} 
                  className="relative w-full flex-shrink-0 h-[380px] md:h-[460px] flex flex-col justify-end"
                >
                  {/* Background Image with Zoom Effect */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={service.bgImage}
                      alt={service.title}
                      fill
                      priority={idx === 0}
                      className={`object-cover object-center transition-transform duration-7000 ease-out opacity-75 ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                    />
                    {/* Dark gradient overlay for extreme contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/70 md:to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 p-6 md:p-12 md:max-w-2xl text-white flex flex-col items-start">
                    {/* Badge */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-primary uppercase bg-primary-foreground/10 px-2.5 py-1 rounded-md">
                        Service {idx + 1} / {SERVICES.length}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-2xl md:text-4xl font-extrabold tracking-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 text-sm md:text-base text-gray-300 leading-relaxed max-w-xl">
                      {service.description}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={`/contact-service?service=${service.id}`}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]"
                    >
                      <Mail className="h-4 w-4" />
                      Nous contacter
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Chevrons */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-black/15 hover:bg-black/30 border border-white/10 text-white/70 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Service précédent"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-black/15 hover:bg-black/30 border border-white/10 text-white/70 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Service suivant"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {/* Slide Progress Indicators (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {SERVICES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => selectSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Aller au service ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

