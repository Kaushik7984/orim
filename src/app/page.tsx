"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/HomePageUi/Header";
import Hero from "@/components/HomePageUi/Hero";
import Features from "@/components/HomePageUi/Features";
import ProductPreview from "@/components/HomePageUi/ProductPreview";
import Testimonials from "@/components/HomePageUi/Testimonials";
import CallToAction from "@/components/HomePageUi/CallToAction";
import Footer from "@/components/HomePageUi/Footer";

// Create a ThemeProvider wrapper or CSS variables to apply the color palette across components
const themeColors = {
  primary: "#1e40af", // Deep blue as the main color
  secondary: "#dde4fc", // Light blue for hover effects
  accent: "#f3f4f6", // Very light gray
  text: "#111827", // Dark text
  background: "from-blue-50 to-indigo-100", // Gradient background
};

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${themeColors.background} relative overflow-hidden`}
    >
      <Header user={user} />
      <Hero />
      <ProductPreview />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
