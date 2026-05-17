"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: { node: { url: string; altText: string } }[] };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
      };
    }[];
  };
}

export default function HomeClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trails = cursorTrailRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    const trailPositions = trails.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    let frame: number;
    const animateTrails = () => {
      trails.forEach((trail, i) => {
        const prev = i === 0 ? { x: mouseX, y: mouseY } : trailPositions[i - 1];
        trailPositions[i].x += (prev.x - trailPositions[i].x) * 0.35;
        trailPositions[i].y += (prev.y - trailPositions[i].y) * 0.35;

        if (trail) {
          trail.style.left = `${trailPositions[i].x}px`;
          trail.style.top = `${trailPositions[i].y}px`;
          trail.style.opacity = `${0.4 - i * 0.1}`;
          trail.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.15})`;
        }
      });

      frame = requestAnimationFrame(animateTrails);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(animateTrails);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById("hero-split");
    if (!el) return;

    const lines = [
      { text: "Two", italic: false },
      { text: "Forces.", italic: true },
      { text: "One Label.", italic: false },
    ];

    el.innerHTML = lines
      .map(
        (line, li) =>
          `<span class="split-line${line.italic ? " split-italic" : ""}">${line.text
            .split("")
            .map(
              (ch, ci) =>
                `<span class="split-char" style="animation-delay:${0.4 + li * 0.18 + ci * 0.045}s">${ch === " " ? "&nbsp;" : ch}</span>`
            )
            .join("")}</span>`
      )
      .join("<br/>");
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveals.forEach((el) => el.classList.add("visible"));
    }

    return () => observer.disconnect();
  }, []);

  async function handleAddToCart(variantId: string) {
    const { createCheckout } = await import("@/lib/shopify");
    const url = await createCheckout(variantId);
    if (url) window.open(url, "_blank");
  }

  function openMobile() {
    document.getElementById("mobileMenu")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMobile() {
    document.getElementById("mobileMenu")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  return (
    <>
      <div ref={cursorRef} className="cursor-dot" aria-hidden="true" />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="cursor-trail"
          ref={(el) => {
            if (el) cursorTrailRef.current[i] = el;
          }}
          aria-hidden="true"
        />
      ))}

      <div
        className="mobile-menu"
        id="mobileMenu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <button className="mobile-close" aria-label="Close menu" onClick={closeMobile}>
          ✕
        </button>
        <a href="#collection" onClick={closeMobile}>Collection</a>
        <a href="#philosophy" onClick={closeMobile}>Philosophy</a>
        <a href="#">Lookbook</a>
        <a href="#">Contact</a>
      </div>

      <nav ref={navRef}>
        <a href="#" className="nav-logo" aria-label="DVND home">
          DVND<span>.</span>
        </a>
        <ul className="nav-links" role="list">
          <li><a href="#collection">Collection</a></li>
          <li><a href="#philosophy">Philosophy</a></li>
          <li><a href="#">Lookbook</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div className="nav-actions">
          <a href="#collection" className="nav-cta">Shop Now</a>
          <button className="hamburger" aria-label="Open menu" onClick={openMobile}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <main>
        <section className="hero" aria-label="DVND hero">
          <div className="hero-parallax-wrap" aria-hidden="true">
            <div ref={heroImgRef} className="hero-parallax-img">
              <Image
                src="/hero.jpg"
                alt="DVND — Street Born, Luxury Worn"
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <div className="hero-overlay" />
            </div>
          </div>

          <div className="hero-content">
            <p className="hero-eyebrow">SS 2026 — Drop One</p>
            <h1 className="hero-title" id="hero-split" aria-label="Two Forces. One Label.">
              Two<br /><em>Forces.</em><br />One Label.
            </h1>
            <div className="hero-sub">
              <p className="hero-tagline">Premium dark luxury streetwear — born from duality</p>
              <div className="hero-divider" aria-hidden="true"></div>
              <a href="#collection" className="hero-cta">
                Explore Collection
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-scroll" aria-hidden="true">
            <div className="scroll-line"></div>
            <span className="scroll-label">Scroll</span>
          </div>
        </section>

        <div className="marquee-section" aria-hidden="true">
          <div className="marquee-track">
            {[
              "DVND Luxe",
              "Two Forces",
              "One Label",
              "SS 2026",
              "Premium Streetwear",
              "Dark Luxury",
              "Born From Duality",
              "DVND Luxe",
              "Two Forces",
              "One Label",
              "SS 2026",
              "Premium Streetwear",
              "Dark Luxury",
              "Born From Duality",
            ].map((t, i) => (
              <span className="marquee-item" key={i}>{t}</span>
            ))}
          </div>
        </div>

        <section className="section" id="philosophy" aria-labelledby="philosophy-heading">
          <div className="philosophy">
            <div className="philosophy-text">
              <p className="section-label reveal">The Philosophy</p>
              <h2 className="section-heading reveal reveal-delay-1" id="philosophy-heading">
                Not for<br /><em>everyone.</em>
              </h2>
              <p className="philosophy-body reveal reveal-delay-2">
                DVND was born from a single truth — that duality is not contradiction. Darkness and refinement coexist. Street and luxury are not opposites. We build for those who carry both forces without apology.
              </p>
              <blockquote className="philosophy-quote reveal reveal-delay-3">
                &ldquo;Silence is a fabric. We wear it well.&rdquo;
              </blockquote>
            </div>

            <div className="philosophy-visual reveal reveal-delay-1" aria-label="DVND brand visual">
              <Image
                src="/couple.jpg"
                alt="DVND — Worn by few. Remembered by all."
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
              <div className="philosophy-img-overlay" />
              <span className="visual-tag">DVND — EST. 2026</span>
            </div>
          </div>
        </section>

        <section className="section" id="collection" aria-labelledby="collection-heading">
          <div className="products-header">
            <div>
              <p className="section-label reveal">Drop One — SS 2026</p>
              <h2 className="section-heading reveal reveal-delay-1" id="collection-heading">
                The <em>Collection</em>
              </h2>
            </div>
            <a href="#" className="view-all reveal">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product, i) => {
                const img = product.images.edges[0]?.node;
                const price = parseFloat(product.priceRange.minVariantPrice.amount);
                const variant = product.variants.edges[0]?.node;

                return (
                  <article
                    key={product.id}
                    className={`product-card reveal${i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : ""}`}
                  >
                    <div className="product-image">
                      {img && (
                        <Image
                          src={img.url}
                          alt={img.altText || product.title}
                          fill
                          sizes="(max-width: 580px) 50vw, (max-width: 900px) 50vw, 33vw"
                          style={{ objectFit: "cover", objectPosition: "center top" }}
                        />
                      )}
                      {i === 0 && <span className="product-tag">New</span>}
                    </div>

                    <div className="product-meta">
                      <h3 className="product-name">{product.title}</h3>
                      <p className="product-sub">
                        {product.description?.slice(0, 40) || "Premium Drop"}
                      </p>
                      <p className="product-price">
                        ₹{Math.round(price).toLocaleString("en-IN")}
                      </p>

                      <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                        <button
                          className="add-to-cart"
                          type="button"
                          onClick={() => router.push(`/products/${product.handle}`)}
                        >
                          View Product
                        </button>

                        {variant && (
                          <button
                            className="add-to-cart"
                            type="button"
                            onClick={() => handleAddToCart(variant.id)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <>
                <article className="product-card reveal">
                  <div className="product-image">
                    <Image
                      src="/tee-front.jpg"
                      alt="Void Oversized Tee"
                      fill
                      sizes="(max-width: 580px) 50vw, 33vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                    <span className="product-tag">New</span>
                  </div>
                  <div className="product-meta">
                    <h3 className="product-name">Void Oversized Tee</h3>
                    <p className="product-sub">Matte Black — 400 GSM</p>
                    <p className="product-price">₹3,499</p>
                  </div>
                </article>

                <article className="product-card reveal reveal-delay-1">
                  <div className="product-image">
                    <Image
                      src="/tee-back.jpg"
                      alt="Duality Tee"
                      fill
                      sizes="(max-width: 580px) 50vw, 33vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                  </div>
                  <div className="product-meta">
                    <h3 className="product-name">Duality Tee</h3>
                    <p className="product-sub">The Duality Back Print</p>
                    <p className="product-price">₹3,799</p>
                  </div>
                </article>

                <article className="product-card reveal reveal-delay-2">
                  <div className="product-image">
                    <Image
                      src="/model-side.jpg"
                      alt="Force Profile Tee"
                      fill
                      sizes="(max-width: 580px) 50vw, 33vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                    <span className="product-tag">Limited</span>
                  </div>
                  <div className="product-meta">
                    <h3 className="product-name">Force Profile Tee</h3>
                    <p className="product-sub">Onyx — 400 GSM</p>
                    <p className="product-price">₹3,999</p>
                  </div>
                </article>
              </>
            )}
          </div>
        </section>

        <div className="manifesto-section">
          <div className="manifesto-inner">
            <p className="section-label reveal" style={{ textAlign: "center" }}>
              DVND Manifesto
            </p>
            <blockquote className="manifesto-text reveal reveal-delay-1">
              We don&apos;t follow trends.<br />
              We don&apos;t chase <em>attention.</em><br />
              We build for the unbothered —<br />
              <strong>for those who wear the void.</strong>
            </blockquote>
            <p className="manifesto-sub reveal reveal-delay-2">DVND — Two Forces. One Label.</p>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-inner">
          <div>
            <p className="footer-brand-name">DVND</p>
            <p className="footer-tagline">Two forces. One label.</p>
            <div className="footer-social">
              <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                Pinterest
              </a>
            </div>
          </div>

          <div>
            <p className="footer-col-title">Shop</p>
            <ul className="footer-links">
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">T-Shirts</a></li>
              <li><a href="#">Hoodies</a></li>
              <li><a href="#">Accessories</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Brand</p>
            <ul className="footer-links">
              <li><a href="#philosophy">Philosophy</a></li>
              <li><a href="#">Lookbook</a></li>
              <li><a href="#">Collaborations</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Help</p>
            <ul className="footer-links">
              <li><a href="#">Sizing Guide</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 DVND. All rights reserved.</p>
          <p className="footer-copy">dvndluxe.com</p>
        </div>
      </footer>
    </>
  );
}