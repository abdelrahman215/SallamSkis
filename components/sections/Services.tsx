"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Waves, Compass, Users, Sunset, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { DEFAULT_SERVICES } from "@/lib/constants";
import type { Service } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  waves: Waves,
  compass: Compass,
  users: Users,
  sunset: Sunset,
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => {
        setServices(
          DEFAULT_SERVICES.map((s, i) => ({
            id: `default-${i}`,
            ...s,
            is_active: true,
            sort_order: i + 1,
            created_at: new Date().toISOString(),
          }))
        );
      });
  }, []);

  return (
    <section id="services" className="section-padding bg-navy-900/50">
      <div className="container-custom">
        <SectionHeading
          label="Our Services"
          title="Adventures for Every Rider"
          description="From solo thrills to group celebrations — choose your perfect ride on the water."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon || "waves"] || Waves;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all duration-500"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  {service.image_url && (
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-orange-500/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="text-orange-400 w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {service.name}
                    </h3>
                    {service.price && (
                      <span className="text-orange-400 font-semibold text-sm whitespace-nowrap ml-4">
                        {service.price}
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.benefits?.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2 text-white/60 text-sm"
                      >
                        <Check className="text-orange-400 w-4 h-4 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <a href="#booking">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Book This Service
                    </Button>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
