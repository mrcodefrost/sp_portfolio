"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { slideInFromLeft, slideInFromRight } from "@/utils/motion";
import toast from "react-hot-toast";

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

const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  optional,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  optional?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-300">
      {label}
      {optional && (
        <span className="ml-1.5 text-xs text-gray-500 font-normal">
          (optional)
        </span>
      )}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`bg-[#0d0225]/70 border ${
        error ? "border-red-500/70" : "border-[#7042f861]"
      } rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 text-sm
      focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/40
      transition-all duration-200 backdrop-blur-sm`}
    />
    {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div
      id="contact"
      className="flex flex-col items-center justify-center py-20 z-[20] w-full"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-10">
        CONTACT ME
      </h1>

      <div ref={ref} className="w-full max-w-3xl px-6 md:px-10">
        {/* Header card */}
        <motion.div
          variants={slideInFromLeft(0.2)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-8 text-center"
        >
          <p className="text-gray-400 text-base leading-relaxed">
            Have a project in mind, a job opportunity, or just want to say hi?
            <br />
            Fill out the form below and I&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <motion.form
          variants={slideInFromRight(0.3)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-2xl border border-[#7042f861] bg-[#03001430] backdrop-blur-md p-8 shadow-lg shadow-[#2A0E61]/30"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/5 pointer-events-none" />

          <div className="relative flex flex-col gap-5">
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Full Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
              />
              <InputField
                label="Email Address"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john@example.com"
              />
            </div>

            {/* Row 2: Phone (with country code) + Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone with country code prefix */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Phone Number
                  <span className="ml-1.5 text-xs text-gray-500 font-normal">(optional)</span>
                </label>
                <div className="flex gap-2 min-w-0">
                  <input
                    id="countryCode"
                    name="countryCode"
                    type="text"
                    value={formData.countryCode}
                    onChange={handleChange}
                    placeholder="+1"
                    className="w-16 shrink-0 bg-[#0d0225]/70 border border-[#7042f861] rounded-lg px-2 py-3
                    text-gray-200 placeholder-gray-600 text-sm
                    focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/40
                    transition-all duration-200 backdrop-blur-sm"
                  />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="234 567 8900"
                    className={`min-w-0 flex-1 bg-[#0d0225]/70 border ${
                      errors.phone ? "border-red-500/70" : "border-[#7042f861]"
                    } rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 text-sm
                    focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/40
                    transition-all duration-200 backdrop-blur-sm`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-0.5">{errors.phone}</p>
                )}
              </div>

              <InputField
                label="Subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
                placeholder="Freelance project, Job opportunity..."
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project or inquiry..."
                className={`bg-[#0d0225]/70 border ${
                  errors.message ? "border-red-500/70" : "border-[#7042f861]"
                } rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 text-sm
                focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/40
                transition-all duration-200 backdrop-blur-sm resize-none`}
              />
              {errors.message && (
                <p className="text-xs text-red-400 mt-0.5">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary mt-2 w-full md:w-auto md:self-end px-8 py-3 rounded-lg
              text-white font-semibold text-sm tracking-wide
              border border-[#7042f861]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
