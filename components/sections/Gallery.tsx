"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GALLERY_IMAGES, SITE_CONFIG } from "@/lib/constants";
import type { GalleryImage } from "@/lib/types";

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(setImages)
      .catch(() => {
        setImages(
          GALLERY_IMAGES.map((img, i) => ({
            id: `default-${i}`,
            image_url: img.src,
            caption: img.alt,
            sort_order: i + 1,
            is_active: true,
            created_at: new Date().toISOString(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <section id="gallery" className="section-padding bg-navy-950">
      <div className="container-custom">
        <SectionHeading
          label="Portfolio"
          title="Our Adventures"
          description="Real moments from real riders. Follow our journey on Instagram for the latest."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {images.map((image, i) => (
            <motion.button
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightbox(i)}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[400px]" : "aspect-square"
              }`}
            >
              <Image
                src={image.image_url}
                alt={image.caption || "Sallam Skis gallery"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-colors duration-300" />
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <Instagram size={18} />
              Follow Us on Instagram
            </Button>
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white z-10 p-2"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] w-full aspect-[3/4] sm:aspect-auto sm:h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].image_url}
                alt={images[lightbox].caption || ""}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
