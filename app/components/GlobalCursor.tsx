"use client";

import { useEffect, useRef } from "react";

export default function GlobalCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || window.innerWidth <= 900) return;

    const body = document.body;
    const dot = dotRef.current;
    const trails = trailsRef.current.filter(Boolean);
    if (!dot || trails.length === 0) return;

    body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const positions = trails.map(() => ({ x: mouseX, y: mouseY }));

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    let raf = 0;
    const tick = () => {
      trails.forEach((trail, i) => {
        const prev = i === 0 ? { x: mouseX, y: mouseY } : positions[i - 1];
        positions[i].x += (prev.x - positions[i].x) * 0.25;
        positions[i].y += (prev.y - positions[i].y) * 0.25;

        trail.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px) translate(-50%, -50%) scale(${1 - i * 0.15})`;
        trail.style.opacity = `${0.6 - i * 0.12}`;
      });

      raf = requestAnimationFrame(tick);
    };

    const onEnterInteractive = () => body.classList.add("cursor-hover");
    const onLeaveInteractive = () => body.classList.remove("cursor-hover");

    const bindInteractiveEvents = () => {
      const interactive = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .product-card'
      );

      interactive.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });

      return () => {
        interactive.forEach((el) => {
          el.removeEventListener("mouseenter", onEnterInteractive);
          el.removeEventListener("mouseleave", onLeaveInteractive);
        });
      };
    };

    const unbind = bindInteractiveEvents();

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", onEnterInteractive);
    window.addEventListener("mouseup", onLeaveInteractive);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onEnterInteractive);
      window.removeEventListener("mouseup", onLeaveInteractive);
      unbind();
      body.classList.remove("has-custom-cursor", "cursor-hover");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="cursor-trail"
          ref={(el) => {
            if (el) trailsRef.current[i] = el;
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}