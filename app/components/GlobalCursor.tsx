"use client";

import { useEffect, useRef } from "react";

export default function GlobalCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const body = document.body;
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = mouseX;
    let trailY = mouseY;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const tick = () => {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
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
      <div ref={trailRef} className="cursor-trail" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}