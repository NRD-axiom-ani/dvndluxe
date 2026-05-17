"use client";

import { useEffect, useRef } from "react";

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trails = trailRef.current;
    if (!cursor || window.innerWidth <= 900) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const positions = trails.map(() => ({ x: mouseX, y: mouseY }));

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    let frame = 0;
    const animate = () => {
      trails.forEach((trail, i) => {
        const prev = i === 0 ? { x: mouseX, y: mouseY } : positions[i - 1];
        positions[i].x += (prev.x - positions[i].x) * 0.35;
        positions[i].y += (prev.y - positions[i].y) * 0.35;

        if (trail) {
          trail.style.left = `${positions[i].x}px`;
          trail.style.top = `${positions[i].y}px`;
          trail.style.opacity = `${0.42 - i * 0.09}`;
          trail.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.14})`;
        }
      });

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-dot" aria-hidden="true" />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="cursor-trail"
          ref={(el) => {
            if (el) trailRef.current[i] = el;
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}