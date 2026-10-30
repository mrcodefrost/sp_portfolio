"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { slideInFromLeft, slideInFromRight } from "@/utils/motion";
import toast from "react-hot-toast";
import VerticalCutReveal from "../sub/VerticalCutReveal";
import CommsBeacon from "../sub/CommsBeacon";
import { IsoStyle } from "../sub/IsoControls";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mpzvajzo";

interface FormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const validate = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (!/^[a-zA-Z\s'\-]+$/.test(data.name.trim())) {
    errors.name = "Name cannot contain numbers or special characters.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (data.phone.trim()) {
    if (!/^[\d\s\-().]{4,15}$/.test(data.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
  }

  if (!data.subject.trim()) {
    errors.subject = "Subject is required.";
  } else if (data.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required.";
  } else if (data.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters.";
  }

  return errors;
};

const fieldClass = (error?: string) =>
  `w-full bg-white/[0.03] border ${
    error ? "border-red-500/70" : "border-white/10"
  } rounded-lg px-3.5 py-2.5 text-sm text-cyan-50 placeholder-cyan-100/25
  focus:outline-none focus:border-cyan-300/70 focus:shadow-[0_0_14px_-2px_rgba(34,211,238,0.45)]
  transition-all duration-200`;

const FieldLabel = ({
  id,
  children,
  optional,
}: {
  id: string;
  children: React.ReactNode;
  optional?: boolean;
}) => (
  <label
    htmlFor={id}
    className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/70"
  >
    {children}
    {optional && (
      <span className="ml-1.5 normal-case tracking-normal text-cyan-100/30">
        (optional)
      </span>
    )}
  </label>
);

const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <FieldLabel id={id}>{label}</FieldLabel>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={fieldClass(error)}
    />
    {error && <p className="font-mono text-[11px] text-red-400">! {error}</p>}
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // surface a field's error once the user leaves it (an untouched empty optional phone stays quiet)
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name as keyof FormErrors;
    const found = validate(formData)[name];
    if (found) setErrors((prev) => ({ ...prev, [name]: found }));
  };

  // live validity lights the pads on the transmitter and arms the transmit button
  const live = validate(formData);
  const filled = [
    !!formData.name.trim() && !live.name,
    !!formData.email.trim() && !live.email,
    !!formData.subject.trim() && !live.subject,
    !!formData.message.trim() && !live.message,
  ];
  const armed = filled.every(Boolean) && !live.phone;

  // payload progress: a valid field counts fully, a started one counts partially
  const partial = (len: number, need: number) => Math.min(len / need, 0.9);
  const progress = armed
    ? 1
    : ([
        [formData.name, 2],
        [formData.email, 6],
        [formData.subject, 3],
        [formData.message, 20],
      ] as const).reduce(
        (sum, [v, need], i) => sum + (filled[i] ? 1 : partial(v.trim().length, need)),
        0
      ) / 4;
  const CELLS = 24;
  const lit = Math.round(progress * CELLS);

  const submit = async () => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.", {
        style: {
          background: "#1a0538",
          color: "#f0e6ff",
          border: "1px solid #7042f861",
        },
        iconTheme: { primary: "#f87171", secondary: "#1a0538" },
      });
      return;
    }

    // Combine country code + phone for submission
    const fullPhone = formData.phone.trim()
      ? `${formData.countryCode} ${formData.phone.trim()}`
      : "";

    setIsSubmitting(true);
    setSent(false);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (res.ok) {
        toast.success("Message sent! I'll get back to you soon.", {
          style: {
            background: "#0d0225",
            color: "#e9d5ff",
            border: "1px solid rgba(112, 66, 248, 0.5)",
          },
          iconTheme: { primary: "#a855f7", secondary: "#0d0225" },
          duration: 5000,
        });
        setFormData({ name: "", email: "", countryCode: "+1", phone: "", subject: "", message: "" });
        setErrors({});
        setSent(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.", {
        style: {
          background: "#1a0538",
          color: "#f0e6ff",
          border: "1px solid #7042f861",
        },
        iconTheme: { primary: "#f87171", secondary: "#1a0538" },
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (armed && !isSubmitting) void submit();
  };

  const status = isSubmitting
    ? "Transmitting"
    : sent
      ? "Delivered"
      : armed
        ? "Armed"
        : "Standby";

  return (
    <div
      ref={ref}
      id="contact"
      className="flex flex-col items-center justify-center py-20 z-[20] w-full"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-10">
        <VerticalCutReveal
          autoStart={inView}
          splitBy="characters"
          staggerDuration={0.025}
          staggerFrom="first"
          containerClassName="justify-center"
          transition={{ type: "spring", stiffness: 200, damping: 21 }}
        >
          CONTACT ME
        </VerticalCutReveal>
      </h1>

      <div className="w-full max-w-4xl px-6 md:px-10">
        {/* Header card */}
        <motion.div
          variants={slideInFromLeft(0.15)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-8 text-center"
        >
          <p className="text-gray-400 text-base leading-relaxed">
            Open to full-time, contract, and select freelance remote work.
            <br />
            I typically reply within 3 business days, or connect on{" "}
            <a
              href="https://www.linkedin.com/in/daksh-nauni-69a470208/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-2"
            >
              LinkedIn
            </a>
            .
          </p>
        </motion.div>

        <IsoStyle />
        <motion.form
          variants={slideInFromRight(0.3)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-2xl bg-gradient-to-b from-cyan-400/50 via-purple-500/25 to-cyan-400/10 p-px shadow-[0_0_60px_-12px_rgba(34,211,238,0.35)]"
        >
          <div className="relative overflow-hidden rounded-[15px] bg-[#050118]/90 backdrop-blur-xl">
          {/* soft ambient light */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-1/2 rounded-full bg-purple-600/15 blur-3xl" />

          {/* corner brackets */}
          {[
            "left-3 top-3 border-l border-t rounded-tl-md",
            "right-3 top-3 border-r border-t rounded-tr-md",
            "left-3 bottom-3 border-l border-b rounded-bl-md",
            "right-3 bottom-3 border-r border-b rounded-br-md",
          ].map((c) => (
            <span key={c} aria-hidden="true" className={`pointer-events-none absolute z-10 h-3 w-3 border-cyan-300/60 ${c}`} />
          ))}

          {/* console header strip */}
          <div className="relative flex items-center justify-between gap-3 border-b border-white/5 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-200/80">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-px bg-cyan-300/60" />
              Secure uplink
            </span>
            <span className="inline-flex items-center gap-2" role="status">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isSubmitting
                    ? "animate-pulse bg-amber-300"
                    : armed
                      ? "bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
                      : "bg-green-400"
                }`}
              />
              {status}
            </span>
          </div>

          <div className="relative grid gap-8 p-5 md:grid-cols-[1fr_17rem] md:p-7">
            {/* terminal fields */}
            <div className="flex min-w-0 flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField
                  label="Callsign"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  placeholder="John Doe"
                />
                <InputField
                  label="Frequency (email)"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel id="phone" optional>
                    Comm-link
                  </FieldLabel>
                  <div className="flex min-w-0 gap-2">
                    <input
                      id="countryCode"
                      name="countryCode"
                      type="text"
                      aria-label="Country code"
                      value={formData.countryCode}
                      onChange={handleChange}
                      placeholder="+1"
                      className={`${fieldClass()} !w-16 shrink-0 !px-2`}
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="234 567 8900"
                      className={`${fieldClass(errors.phone)} min-w-0 flex-1`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="font-mono text-[11px] text-red-400">! {errors.phone}</p>
                  )}
                </div>

                <InputField
                  label="Subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.subject}
                  placeholder="Freelance project, Job opportunity..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel id="message">Transmission</FieldLabel>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell me about your project or inquiry..."
                  className={`${fieldClass(errors.message)} resize-none`}
                />
                {errors.message && (
                  <p className="font-mono text-[11px] text-red-400">! {errors.message}</p>
                )}
              </div>
            </div>

            {/* isometric transmitter + launch control */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <CommsBeacon filled={filled} sending={isSubmitting} />
            </div>
          </div>

          {/* launch bar: always visible, glows when armed */}
          <div className="relative flex flex-col gap-3 border-t border-white/5 bg-white/[0.02] px-6 py-3 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-xs">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-cyan-200/60">
                <span>
                  {sent ? "Message received" : armed ? "All systems green" : "Awaiting payload"}
                </span>
                <span className="tabular-nums">{Math.round(progress * 100)}%</span>
              </div>
              <div
                role="progressbar"
                aria-label="Payload ready"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                className="flex h-2 gap-[3px]"
              >
                {Array.from({ length: CELLS }, (_, i) => (
                  <span
                    key={i}
                    className={`h-full flex-1 rounded-[1px] transition-all duration-300 ${
                      i < lit
                        ? "bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.7)]"
                        : "bg-white/10"
                    } ${!armed && i === lit ? "animate-pulse bg-cyan-300/50" : ""}`}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={!armed || isSubmitting}
              aria-label="Transmit message"
              className={`group inline-flex w-full items-center justify-center gap-2 rounded-lg border px-7 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 sm:w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px ${
                armed
                  ? "border-cyan-200 bg-cyan-400 text-[#03001a] shadow-[0_0_16px_rgba(34,211,238,0.5)] hover:bg-cyan-300"
                  : "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
              }`}
            >
              {isSubmitting ? "Transmitting..." : "Transmit"}
            </button>
          </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
