import { ReactNode, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import FloatingNodes from './FloatingNodes';

interface ParallaxHeroProps {
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export default function ParallaxHero({ children, imageSrc, imageAlt }: ParallaxHeroProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.1]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary" />
        </div>
        <div className="relative z-10">{children}</div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary text-primary-foreground">
      <motion.div
        className="absolute inset-0"
        style={{ opacity, scale }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary" />
        <FloatingNodes />
      </motion.div>

      <motion.div
        className="relative z-10 w-full"
        style={{ y, opacity }}
      >
        {children}
      </motion.div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
