"use client";

import CallToAction from "@/components/HomePageUi/CallToAction";
import Features from "@/components/HomePageUi/Features";
import Footer from "@/components/HomePageUi/Footer";
import Header from "@/components/HomePageUi/Header";
import Hero from "@/components/HomePageUi/Hero";
import ProductPreview from "@/components/HomePageUi/ProductPreview";
import Testimonials from "@/components/HomePageUi/Testimonials";
import { useAuth } from "@/context/AuthContext";

const themeColors = {
  primary: "#1e40af",
  secondary: "#dde4fc",
  accent: "#f3f4f6",
  text: "#111827",
  background: "from-blue-50 to-indigo-100",
};

export default function HomePage() {
  const { user } = useAuth();

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
