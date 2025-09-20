import { Header } from "./Header";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackground(true);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image Layer */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          showBackground ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: "url('/wp9212222.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen bg-black/20 backdrop-blur-sm">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}