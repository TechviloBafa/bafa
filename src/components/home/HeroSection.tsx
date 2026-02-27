import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Palette, Music, Theater } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroBg1 from "@/assets/hero-bg.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";

const slides = [
  {
    title: "আন্তর্জাতিক স্বীকৃতিপ্রাপ্ত সাংস্কৃতিক শিক্ষা প্রতিষ্ঠান",
    subtitle: "বাংলাদেশ বুলবুল ললিতকলা একাডেমী (বাফা) তে স্বাগতম",
    description: "সংগীত, নৃত্য, চিত্রাংকন, আবৃত্তি, গীটার, কারাতে ও তবলা দক্ষতা অর্জন করুন আমাদের অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে।",
    icon: Palette,
    image: heroBg1,
  },
  {
    title: "সংগীত শিক্ষা",
    subtitle: "ধ্রুপদী ও আধুনিক সংগীতে প্রশিক্ষণ",
    description: "রবীন্দ্রসংগীত, নজরুলগীতি, ভক্তিগীতি এবং আধুনিক গানের প্রশিক্ষণ নিন।",
    icon: Music,
    image: heroBg2,
  },
  {
    title: "মঞ্চ নাটক ও অভিনয়",
    subtitle: "থিয়েটার ও অভিনয় কলায় পারদর্শী হোন",
    description: "মঞ্চাভিনয়, টেলিভিশন ও চলচ্চিত্র অভিনয়ের উপর বিশেষ প্রশিক্ষণ।",
    icon: Theater,
    image: heroBg3,
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-500"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/40 pointer-events-none" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-float">
          <CurrentIcon className="h-20 w-20 text-white/70" />
        </div>
        <div className="absolute top-1/3 right-1/6 w-16 h-16 rounded-full bg-accent/40 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-white/20 animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative z-30 h-full flex items-center py-20 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="max-w-2xl text-primary-foreground space-y-6 relative z-40 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/20"
            >
              <CurrentIcon className="h-4 w-4" />
              <span>{slides[currentSlide].subtitle}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-lg md:text-xl text-white/90 max-w-lg"
            >
              {slides[currentSlide].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-wrap gap-4 pt-4 relative z-50 pointer-events-auto"
            >
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold border-2 border-white cursor-pointer">
                <Link to="/admission">
                  ভর্তি আবেদন করুন
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/90 border-2 border-white text-black hover:bg-white font-semibold cursor-pointer">
                <Link to="/about/administration">
                  আরও জানুন
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 left-4 right-4 flex justify-between z-20 translate-y-1/2 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm pointer-events-auto"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm pointer-events-auto"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-3 bg-white/50"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
