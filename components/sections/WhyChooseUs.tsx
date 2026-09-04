"use client";

import { motion } from "framer-motion";
import {
  Award,
  Shield,
  Star,
  Clock,
  Heart,
  Camera,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_CHOOSE_US } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  award: Award,
  shield: Shield,
  star: Star,
  clock: Clock,
  heart: Heart,
  camera: Camera,
};

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-navy-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />

      <div className="container-custom relative">
        <SectionHeading
          label="Why Choose Us"
          title="The Sallam Skis Difference"
          description="We're not just another rental — we're your partners in creating unforgettable memories on the water."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = iconMap[item.icon] || Star;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 sm:p-8 text-center hover:border-orange-500/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="text-orange-400 w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
