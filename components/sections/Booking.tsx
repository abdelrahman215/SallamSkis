"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Waves,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { DEFAULT_SERVICES } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/utils";
import type { Service, BookingFormData } from "@/lib/types";

const STEPS = ["Service", "Date & Time", "Your Details", "Confirm"];

export function Booking() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<BookingFormData>({
    service_id: "",
    appointment_date: "",
    appointment_time: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    notes: "",
  });

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

  useEffect(() => {
    if (!form.appointment_date) return;
    setLoadingSlots(true);
    fetch(`/api/availability?date=${form.appointment_date}`)
      .then((r) => r.json())
      .then((data) => setAvailableSlots(data.availableSlots || []))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.appointment_date]);

  const selectedService = services.find((s) => s.id === form.service_id);

  const canProceed = () => {
    switch (step) {
      case 0: return !!form.service_id;
      case 1: return !!form.appointment_date && !!form.appointment_time;
      case 2: return !!form.customer_name && !!form.customer_phone && !!form.customer_email;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  if (confirmed) {
    return (
      <section id="booking" className="section-padding bg-navy-900/50">
        <div className="container-custom max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 sm:p-12 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-white/60 mb-6">
              Thank you, {form.customer_name}! Your appointment has been submitted.
              We&apos;ll confirm shortly via email or phone.
            </p>
            <div className="glass rounded-xl p-4 text-left space-y-2 mb-6 text-sm">
              <p className="text-white/40">Service</p>
              <p className="text-white font-medium">{selectedService?.name}</p>
              <p className="text-white/40 mt-3">Date & Time</p>
              <p className="text-white font-medium">
                {formatDate(form.appointment_date)} at {formatTime(form.appointment_time)}
              </p>
            </div>
            <Button onClick={() => { setConfirmed(false); setStep(0); setForm({ service_id: "", appointment_date: "", appointment_time: "", customer_name: "", customer_phone: "", customer_email: "", notes: "" }); }}>
              Book Another
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="section-padding bg-navy-900/50">
      <div className="container-custom">
        <SectionHeading
          label="Book Now"
          title="Reserve Your Adventure"
          description="Book in under 2 minutes. Select your service, pick a time, and we'll handle the rest."
        />

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 max-w-xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 ${i <= step ? "text-orange-400" : "text-white/30"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  i <= step ? "border-orange-500 bg-orange-500/10" : "border-white/20"
                }`}>
                  {i + 1}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 ${i < step ? "bg-orange-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              {/* Step 0: Service */}
              {step === 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Waves className="text-orange-400 w-5 h-5" />
                    Select a Service
                  </h3>
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setForm({ ...form, service_id: service.id })}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        form.service_id === service.id
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{service.name}</span>
                        {service.price && (
                          <span className="text-orange-400 text-sm">{service.price}</span>
                        )}
                      </div>
                      <p className="text-white/40 text-sm mt-1">{service.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-white font-medium mb-3">
                      <Calendar className="text-orange-400 w-5 h-5" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={form.appointment_date}
                      onChange={(e) => setForm({ ...form, appointment_date: e.target.value, appointment_time: "" })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 [color-scheme:dark]"
                    />
                  </div>
                  {form.appointment_date && (
                    <div>
                      <label className="flex items-center gap-2 text-white font-medium mb-3">
                        <Clock className="text-orange-400 w-5 h-5" />
                        Select Time
                      </label>
                      {loadingSlots ? (
                        <p className="text-white/40 text-sm">Loading available times...</p>
                      ) : availableSlots.length === 0 ? (
                        <p className="text-white/40 text-sm">No available times for this date. Please choose another date.</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setForm({ ...form, appointment_time: time })}
                              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                                form.appointment_time === time
                                  ? "bg-orange-500 text-white"
                                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                              }`}
                            >
                              {formatTime(time)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                      <User size={16} /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                      <Phone size={16} /> Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.customer_phone}
                      onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                      <Mail size={16} /> Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.customer_email}
                      onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                      <MessageSquare size={16} /> Notes (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none"
                      placeholder="Group size, special requests, etc."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Review Your Booking</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Service", value: selectedService?.name },
                      { label: "Date", value: formatDate(form.appointment_date) },
                      { label: "Time", value: formatTime(form.appointment_time) },
                      { label: "Name", value: form.customer_name },
                      { label: "Phone", value: form.customer_phone },
                      { label: "Email", value: form.customer_email },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/40 text-sm">{item.label}</span>
                        <span className="text-white text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                    {form.notes && (
                      <div className="py-2">
                        <span className="text-white/40 text-sm">Notes</span>
                        <p className="text-white text-sm mt-1">{form.notes}</p>
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1">
                    <ChevronLeft size={18} /> Back
                  </Button>
                ) : (
                  <div />
                )}
                {step < 3 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="gap-1"
                  >
                    Next <ChevronRight size={18} />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting} className="gap-1">
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
