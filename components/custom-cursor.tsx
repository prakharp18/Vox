"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false); 
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.2 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setIsVisible(true);

    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") !== null ||
        target.closest("a") !== null ||
        target.closest('[role="button"]') !== null;

      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.body.style.cursor = 'auto'; 
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100000]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isHovered ? 2.5 : 1, 
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="h-3 w-3 rounded-full bg-white border border-black/20 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />
      </motion.div>
    </>
  );
}
