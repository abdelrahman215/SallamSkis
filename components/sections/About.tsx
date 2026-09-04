"use client";

import { motion } from "framer-motion";
import { Target, Heart, Zap, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT_STATS } from "@/lib/constants";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To deliver the most thrilling, safe, and memorable jet ski experiences on Florida's waterways.",
  },
  {
    icon: Heart,
    title: "Our Passion",
    description:
      "Born from a love of the ocean and jet skiing — we live and breathe water sports every day.",
  },
  {
    icon: Zap,
    title: "Our Promise",
    description:
      "Premium equipment, expert guidance, and an experience that exceeds expectations every time.",
  },
  {
    icon: Users,
    title: "Our Community",
    description:
      "Building a family of riders who share the stoke — follow our adventures on Instagram.",
  },
];

export function About() {
  return (
    <section id="about" className="section-padding bg-navy-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <SectionHeading
          label="About Us"
          title="Florida's Premier Jet Ski Experience"
          description="Sallam Skis is more than a rental — it's a lifestyle. We combine premium Yamaha WaveRunners with expert local knowledge to create unforgettable adventures on the water."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ABOUT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center glass rounded-2xl p-6"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 sm:p-8 hover:border-orange-500/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <item.icon className="text-orange-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/50 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
