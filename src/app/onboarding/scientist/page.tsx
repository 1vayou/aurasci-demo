"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Award, Loader2, CheckCircle2, User, Mail, Building2, FileText } from "lucide-react";
import { useAppStore } from "@/store";
import type { ScientistProfile } from "@/types";

type AuthProvider = "github" | "orcid" | null;

export default function ScientistOnboarding() {
  const router = useRouter();
  const setScientistProfile = useAppStore((s) => s.setScientistProfile);

  const [authProvider, setAuthProvider] = useState<AuthProvider>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [mockHandle, setMockHandle] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    affiliation: "",
    bio: "",
  });

  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock OAuth connection
  const handleConnect = async (provider: "github" | "orcid") => {
    setAuthProvider(provider);
    setIsConnecting(true);

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockHandles = {
      github: "@dr_alice_smith",
      orcid: "0000-0002-1825-0097",
    };

    setMockHandle(mockHandles[provider]);
    setIsConnecting(false);
    setIsConnected(true);

    // Auto-hide success message after 2s
    setTimeout(() => {
      setIsConnected(false);
    }, 2000);
  };

  // Handle bio word count
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setFormData({ ...formData, bio: text });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mockHandle) {
      alert("Please connect GitHub or ORCID first");
      return;
    }

    if (wordCount > 200) {
      alert("Bio must be 200 words or less");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const profile: ScientistProfile = {
      id: `sci_${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      handle: mockHandle,
      affiliation: formData.affiliation,
      bio: formData.bio,
      status: "pending_review",
    };

    setScientistProfile(profile);
    setIsSubmitting(false);

    // Navigate to dashboard
    router.push("/dashboard/scientist");
  };

  return (
    <div className="min-h-screen hero-gradient grid-pattern py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Scientist Onboarding
          </h1>
          <p className="text-gray-600 text-sm">
            Connect your research identity and create your Lab Profile
          </p>
        </div>

        {/* OAuth Connection Section */}
        <div className="mb-8 p-6 rounded-2xl border border-gray-200 bg-white aura-shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            Step 1: Connect Research Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GitHub Button */}
            <button
              onClick={() => handleConnect("github")}
              disabled={isConnecting || (isConnected && authProvider === "github")}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  {isConnecting && authProvider === "github" ? (
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                  ) : isConnected && authProvider === "github" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Github className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">GitHub</div>
                  <div className="text-xs text-gray-500">
                    {isConnected && authProvider === "github"
                      ? "Connected ✓"
                      : "Connect account"}
                  </div>
                </div>
              </div>
            </button>

            {/* ORCID Button */}
            <button
              onClick={() => handleConnect("orcid")}
              disabled={isConnecting || (isConnected && authProvider === "orcid")}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  {isConnecting && authProvider === "orcid" ? (
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                  ) : isConnected && authProvider === "orcid" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Award className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">ORCID</div>
                  <div className="text-xs text-gray-500">
                    {isConnected && authProvider === "orcid"
                      ? "Connected ✓"
                      : "Connect account"}
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Connected Handle Display */}
          {mockHandle && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-xs text-emerald-700 font-medium">
                Connected: {mockHandle}
              </div>
            </div>
          )}
        </div>

        {/* Lab Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 bg-white aura-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Step 2: Complete Lab Profile
            </h2>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
                  placeholder="Dr. Alice Smith"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
                  placeholder="alice@university.edu"
                />
              </div>

              {/* Affiliation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Affiliation
                </label>
                <input
                  type="text"
                  required
                  value={formData.affiliation}
                  onChange={(e) =>
                    setFormData({ ...formData, affiliation: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
                  placeholder="MIT, Stanford, etc."
                />
              </div>

              {/* Research Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Bio
                  <span className="ml-2 text-xs text-gray-400">
                    ({wordCount}/200 words)
                  </span>
                </label>
                <textarea
                  required
                  value={formData.bio}
                  onChange={handleBioChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                  placeholder="Describe your research focus, expertise, and current projects..."
                />
                {wordCount > 200 && (
                  <p className="mt-2 text-xs text-red-500">
                    Bio exceeds 200 word limit
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!mockHandle || isSubmitting || wordCount > 200}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit for Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
