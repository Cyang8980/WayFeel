import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface BetaSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BetaSignupModal({ isOpen, onClose }: BetaSignupModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/beta-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setEmail("");
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Join the Beta</h2>
        <p className="text-gray-600 mb-6">
          Enter your email to join the WayFeel beta and be notified when we launch!
        </p>

        {submitStatus === "success" ? (
          <div className="text-center py-4">
            <div className="text-green-600 text-lg font-semibold mb-2">✓ Success!</div>
            <p className="text-gray-600">We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />

            {submitStatus === "error" && (
              <p className="text-red-600 text-sm mb-4">
                Something went wrong. Please try again.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="bg-blue-400 hover:bg-blue-500 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

