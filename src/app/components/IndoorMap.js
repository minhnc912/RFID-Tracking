"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const ZONE_PIXELS = {
  Entrance: { x: 750, y: 95 },
  Classroom_1: { x: 1000, y: 318 },
  Classroom_2: { x: 594, y: 509 },
  Cafeteria: { x: 269, y: 235 },
  Restroom: { x: 456, y: 522 },
  Lab: { x: 250, y: 509 },
  Classroom_3: { x: 812, y: 509 },
  Classroom_4: { x: 594, y: 318 },
  Leaving: { x: 750, y: 95 },
};

export default function IndoorMap({ currentZone, durationText }) {
  const [pos, setPos] = useState({ x: 750, y: 95 });
  const requestRef = useRef();
  const targetRef = useRef({ x: 750, y: 95 });

  useEffect(() => {
    if (currentZone && ZONE_PIXELS[currentZone]) {
      targetRef.current = ZONE_PIXELS[currentZone];
    }
  }, [currentZone]);

  useEffect(() => {
    const animate = () => {
      setPos((prev) => {
        const dx = targetRef.current.x - prev.x;
        const dy = targetRef.current.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 5;

        if (dist <= speed) {
          return targetRef.current;
        } else {
          const angle = Math.atan2(dy, dx);
          return {
            x: prev.x + Math.cos(angle) * speed,
            y: prev.y + Math.sin(angle) * speed,
          };
        }
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="relative border border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-950">
      <Image
        src="/school.png"
        alt="School Map"
        width={1200}
        height={600}
        priority
      />

      <div
        className="absolute bg-white px-2 py-1 text-[11px] font-bold text-slate-900 border border-slate-300 rounded shadow-md z-10 transition-all duration-75 select-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: "translate(-50%, -150%)",
        }}
      >
        {durationText || "Entering"}
      </div>

      <div
        className="absolute w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse z-10 transition-all duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
