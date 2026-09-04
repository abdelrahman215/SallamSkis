"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GALLERY_IMAGES, SITE_CONFIG } from "@/lib/constants";

export function InstagramFeed() {
  const images = GALLERY_IMAGES;

  return (
    <section className="section-padding bg-navy-900/50">
      <div className="container-custom">
        <SectionHeading
          label="Instagram"
          title="Follow the Adventure"
          description="Stay connected with our latest rides, behind-the-scenes, and customer highlights."
        />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 mb-8">
          {images.map((img, i) => (
            <motion.a
              key={img.src}
              href={SITE_CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-square overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/50 transition-colors flex items-center justify-center">
                <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <Instagram size={18} />
              Follow {SITE_CONFIG.instagramHandle}
            </Button>
          </a>
          <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="gap-2">
              View Profile
              <ExternalLink size={16} />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
