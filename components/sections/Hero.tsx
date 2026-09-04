"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Instagram, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || videoError) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    try {
      await video.play();
      setVideoReady(true);
    } catch {
      // Autoplay can still fail until a user gesture; retry on touch.
    }
  }, [videoError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    tryPlay();

    const onCanPlay = () => {
      setVideoReady(true);
      void tryPlay();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") void tryPlay();
    };

    const resumeOnGesture = () => {
      void tryPlay();
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("touchstart", resumeOnGesture, { once: true, passive: true });
    window.addEventListener("click", resumeOnGesture, { once: true });

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("touchstart", resumeOnGesture);
      window.removeEventListener("click", resumeOnGesture);
    };
  }, [tryPlay]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    video.defaultMuted = nextMuted;
    setIsMuted(nextMuted);

    if (video.paused) {
      void video.play();
    }
  };

  return (
    <section className="relative flex min-h-[100svh] min-h-[100dvh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-navy-950">
        {!videoError && (
          <video
            ref={videoRef}
            className={`hero-video absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            src={SITE_CONFIG.heroVideo}
            poster={SITE_CONFIG.heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onPlaying={() => setVideoReady(true)}
            onError={() => setVideoError(true)}
            aria-hidden="true"
          />
        )}

        {(videoError || !videoReady) && (
          <Image
            src={SITE_CONFIG.heroPoster}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}

        <div className="hero-overlay pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/45 via-transparent to-orange-500/10" />
      </div>

      {!videoError && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-orange-400/30 bg-navy-950/70 text-white shadow-lg shadow-black/30 backdrop-blur-md transition-all hover:border-orange-400/70 hover:bg-navy-900 sm:bottom-8 sm:left-8"
          aria-label={isMuted ? "Unmute background video" : "Mute background video"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      <div className="relative z-10 container-custom px-4 pb-28 pt-24 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/logo.png"
            alt={SITE_CONFIG.name}
            width={120}
            height={120}
            className="mx-auto mb-6 h-24 w-24 rounded-full ring-4 ring-orange-500/30 shadow-2xl shadow-orange-500/20 sm:h-28 sm:w-28"
            priority
          />

          <h1
            className="mb-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-white">Ride the </span>
            <span className="text-gradient">Waves</span>
          </h1>

          <p className="mx-auto mb-3 max-w-2xl text-lg font-light text-white/80 sm:text-xl">
            {SITE_CONFIG.tagline}
          </p>

          <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Premium Yamaha WaveRunner rentals, guided tours, and unforgettable
            adventures on Miami&apos;s stunning waterways.
          </p>

          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#booking" className="w-full sm:w-auto">
              <Button size="lg" className="w-full min-w-[200px] sm:w-auto">
                Book an Appointment
              </Button>
            </a>
            <a href="#gallery" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full min-w-[200px] sm:w-auto">
                View Our Work
              </Button>
            </a>
          </div>

          <a
            href={SITE_CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-orange-400"
          >
            <Instagram size={18} />
            Follow {SITE_CONFIG.instagramHandle}
          </a>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="h-6 w-6 text-white/30" />
        </motion.div>
      </div>
    </section>
  );
}
