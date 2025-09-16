"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import AnimatedCopy from "./AnimatedCopy";

export default function Home() {
  const lenisRef = useRef();
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);

    // Sync ScrollTrigger with Lenis scroll events
    const lenis = lenisRef.current?.lenis;
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);

    // Card animations (converted from previous DOM script)
    const cards = gsap.utils.toArray(".card");
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const cardInner = card.querySelector(".card-inner");
        if (!cardInner) return;

        gsap.fromTo(
          cardInner,
          { y: "0%", z: 0, rotationX: 0 },
          {
            y: "-50%",
            z: -250,
            rotationX: 45,
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top 85%",
              end: "top -75%",
              scrub: true,
              pin: card,
              pinSpacing: false,
            },
          }
        );

        gsap.to(cardInner, {
          "--after-opacity": 1,
          scrollTrigger: {
            trigger: cards[index + 1],
            start: "top 75%",
            end: "top -25%",
            scrub: true,
          },
        });
      }
    });

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", onLenisScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Local time updater for the outro section
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const offsetMin = -now.getTimezoneOffset();
      const sign = offsetMin >= 0 ? "+" : "-";
      const abs = Math.abs(offsetMin);
      const hh = String(Math.floor(abs / 60)).padStart(2, "0");
      const mm = String(abs % 60).padStart(2, "0");
      setLocalTime(`${time} GMT${sign}${hh}:${mm}`);
    };
    updateTime();
    const t = setInterval(updateTime, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      {/* Empty styled block for you to fill later */}
      {/* Make :root variables global so they apply everywhere */}
      <style jsx global>{`
        :root {
          --accent-1: #b1c0ef;
          --accent-2: #f2acac;
          --accent-3: #fedd93;
          --accent-4: #81b7bf;
          --accent-5:rgb(183, 87, 18);
        }
      `}</style>
      <style jsx>{`
      @import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Host Grotesk", sans-serif;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  text-transform: uppercase;
  font-family: "Barlow Condensed";
  font-size: 5rem;
  font-weight: 900;
  line-height: 1;
}

p {
  text-transform: uppercase;
  font-weight: 500;
}

.hero,
.outro {
  position: relative;
  width: 100vw;
  height: 100svh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f9f4eb;
  color: #141414;
}

/* Outro redesign */
.outro {
  background-color: #0f0f0f;
  color: #eaeaea;
  text-align: left;
  margin-top: -10vh; /* pull section up as requested */
}

.outro .outro-content {
  position: relative;
  width: min(1200px, 92vw);
  height: 100%;
  margin: 0 auto;
  display: block;
}

.outro-title {
  font-family: "Barlow Condensed";
  font-weight: 800;
  letter-spacing: -0.02em;
  font-size: clamp(2.75rem, 7vw, 6rem);
  line-height: 1.05;
  margin: 0;
}

.outro-divider {
  position: absolute;
  top: 52%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}

.outro-cta {
  position: absolute;
  top: calc(52% - 88px);
  right: clamp(1.25rem, 8vw, 8rem);
  width: 176px;
  height: 176px;
  border-radius: 50%;
  background: #4f5dff;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(79, 93, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.outro-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(79, 93, 255, 0.45);
}

.outro-pills {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: clamp(2.25rem, 6vh, 3.5rem);
  display: flex;
  gap: 1rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 600;
}

.pill:hover { background: rgba(255, 255, 255, 0.08); }

/* Icon size inside pill buttons */
.pill svg {
  width: 16px;
  height: 16px;
  display: inline-block;
}

.outro-local-time,
.outro-social {
  position: absolute;
  bottom: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

.outro-local-time { left: 1.5rem; }
.outro-social { right: 1.5rem; text-align: right; }

.outro-social-title {
  font-weight: 300;
  opacity: 0.65;
}

.outro-time-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.95rem;
  letter-spacing: normal;
  text-transform: none;
  opacity: 0.9;
}

.outro-social .links a {
  margin-left: 0.9rem;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.9;
}

.outro-social .links a:hover { opacity: 1; text-decoration: underline; }

@media (max-width: 800px) {
  .outro-title { font-size: clamp(2rem, 9vw, 3rem); }
  .outro-cta { width: 128px; height: 128px; top: calc(52% - 64px); right: 1rem; }
  .outro { padding-bottom: calc(2.5rem + env(safe-area-inset-bottom)); }
  .outro-pills { flex-direction: column; gap: 0.75rem; bottom: 5.5rem; }
  /* Stack bottom meta on mobile */
  .outro-local-time,
  .outro-social {
    position: static;
    text-align: center;
    margin-top: 0.5rem;
    opacity: 0.9;
  }
  .outro-social .links a { margin: 0 0.6rem; }
}

/* Hero subtitle under the main heading */
.hero-sub {
  margin-top: 1rem;
  max-width: min(820px, 90vw);
  margin-inline: auto;
  line-height: 1.6;
  font-size: clamp(1rem, 0.9vw + 0.9rem, 1.25rem);
  font-weight: 500;
  opacity: 0.9;
  text-transform: none; /* override global uppercase for p */
}

.sticky-cards {
  position: relative;
  width: 100vw;
  background-color: #0f0f0f;
}

.card {
  position: sticky;
  width: 100%;
  height: 155svh; /* increased to accommodate larger media */
  transform-style: preserve-3d;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transform-origin: 50% 100%;
  will-change: transform;
  text-align: center;
}

#card-1 .card-inner {
  background-color: var(--accent-1);
}

#card-2 .card-inner {
  background-color: var(--accent-2);
}

#card-3 .card-inner {
  background-color: var(--accent-3);
}

#card-4 .card-inner {
  background-color: var(--accent-4);
}

#card-5 .card-inner {
  background-color: var(--accent-5);
}

.card-info {
  width: 25%;
  padding: 4em;
  text-align: left;
}

.card-info p {
  font-size: 0.9rem;
}

.card-title h1 {
  font-size: 6rem;
  padding: 1.25rem 0;
}

.card-description {
  width: 60%;
  margin: 0 auto 2em auto;
}

.card-description p {
  font-size: 1.5rem;
}

.card-img {
  width: 100%;
  height: 900vh !important; /* enforce larger height */
  margin-top: 0;
  margin-bottom: 1vh;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f0f0f10; /* subtle backdrop */
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* override global cover */
}

.card-inner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: var(--after-opacity, 0);
  will-change: opacity;
  pointer-events: none;
  z-index: 2;
}

.card-link-btn {
  position: absolute;
  right: 3rem;
  top: 35%;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #111214;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.08);
  z-index: 3;
  will-change: transform, box-shadow;
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
}

.card-link-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 16px 40px rgba(0,0,0,0.35);
  background: #0d0e10;
}

@media (max-width: 1000px) {
  .card-link-btn {
    right: 1.25rem;
    top: auto;
    bottom: 2.5rem;
    width: 88px;
    height: 88px;
    font-size: 0.85rem;
  }
}

@media (max-width: 1000px) {
  h1,
  .card-description {
    width: calc(100% - 4rem);
    font-size: 3rem;
    margin: 0 auto;
  }

  .card-info {
    width: 75%;
    margin: 0 auto;
    padding: 4em 2em;
    text-align: center;
  }

  .card-title h1 {
    font-size: 2.25rem;
  }

  .card-description p {
    font-size: 1.25rem;
  }
}
      
      `}</style>

      <section id="portfolio" className="hero">
        <div>
          <h1>Some Of My works</h1>
          <AnimatedCopy colorInitial="#bdbdbd" colorAccent="#00e676" colorFinal="#141414">
            <p className="hero-sub">
            Designing and building interactive web experiences. Below are selected
            works — dashboards, apps, and brand sites — with live demos and links.
            Explore the projects to see craft, performance, and UX in action.
            </p>
          </AnimatedCopy>
        </div>
      </section>

      <section className="sticky-cards">
        <div className="card" id="card-1">
          <div className="card-inner">
            <div className="card-info">
              <p>Assign work, capture trader inputs, track progress</p>
            </div>
            <div className="card-title">
              <h1>Admin Dashboard</h1>
            </div>
            <div className="card-description">
              <p>
                A role‑based dashboard where traders, developers and social media managers submit updates and managers
                assign tasks with clarity. Real‑time status tracking, progress
                visibility per person, and streamlined handoffs make operations
                effortless and auditable.
              </p>
            </div>
            <a
              href="https://admindashboard-liard.vercel.app/?tab=dashboard"
              className="card-link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </a>
            <div className="card-img">
              <img src="/website-images/admindashboard.jpg" alt="Admin Dashboard preview" />
            </div>
          </div>
        </div>

        <div className="card" id="card-2">
          <div className="card-inner">
            <div className="card-info">
              <p>Book visits, onboard doctors, manage via admin</p>
            </div>
            <div className="card-title">
              <h1>Doctor App</h1>
            </div>
            <div className="card-description">
              <p>
                A 3‑in‑1 appointment platform: patients book and track visits,
                doctors self‑register and manage schedules, and an admin panel
                oversees users, approvals, and reporting—all in one app.
              </p>
            </div>
            <a
              href="https://doctor-app-rho.vercel.app/login"
              className="card-link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </a>
            <div className="card-img">
              <img src="/website-images/doctorapp.jpg" alt="Doctor App preview" />
            </div>
          </div>
        </div>

        <div className="card" id="card-3">
          <div className="card-inner">
            <div className="card-info">
              <p>Real-world client delivery for a law firm</p>
            </div>
            <div className="card-title">
              <h1>Law Firm Website</h1>
            </div>
            <div className="card-description">
              <p>
                A modern firm site delivered end‑to‑end: clear practice areas,
                attorney profiles, and contact flows built for trust and
                conversions. Optimized for speed, accessibility, and SEO.
              </p>
            </div>
            <a
              href="https://www.duckhawk.in/"
              className="card-link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </a>
            <div className="card-img">
              <img src="/website-images/duckhawk.jpg" alt="Duckhawk preview" />
            </div>
          </div>
        </div>

        <div className="card" id="card-4">
          <div className="card-inner">
            <div className="card-info">
              <p>Modern startup platform for a dev + social media agency</p>
            </div>
            <div className="card-title">
              <h1>Agency Platform</h1>
            </div>
            <div className="card-description">
              <p>
                Startup project with a crisp, modern UI for a development and
                social media agency. Full‑stack build with a proper backend and
                database, showcasing services, case studies, and lead capture—with
                performance and SEO baked in.
              </p>
            </div>
            <a
              href="https://www.growmint.net/"
              className="card-link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </a>
            <div className="card-img">
              <img src="/website-images/growmint.png" alt="Growmint preview" />
            </div>
          </div>
        </div>

        <div className="card" id="card-5">
          <div className="card-inner"> 
            <div className="card-info">
              <p>GSAP masking, 3D model spins, layered parallax</p>
            </div>
            <div className="card-title">
              <h1>Interactive Motion Site</h1>
            </div>
            <div className="card-description">
              <p>
                Frontend‑heavy client project for an agency: advanced GSAP
                timelines with masking transitions, real‑time 3D model rotation,
                and multi‑layer parallax for depth. Built for smooth performance
                and a standout first impression.
              </p>
            </div>
            <a
              href="https://www.studiodevstag.com/home"
              className="card-link-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </a>
            <div className="card-img">
              <img src="/website-images/studiodevstag.png" alt="Studio Devstag preview" />
            </div>
          </div>
        </div>
      </section>

      <section id="connect" className="outro">
        <div className="outro-content">
          <h1 className="outro-title">Let's work together</h1>
          <div className="outro-divider" />

          <a className="outro-cta" href="mailto:soumo2020.saha@gmail.com">Get in touch</a>

          <div className="outro-pills">
            <a className="pill" href="mailto:soumo2020.saha@gmail.com">soumo2020.saha@gmail.com</a>
            <a
              className="pill"
              href="/Soumodeep%20Saha-resume%20(2).pdf"
              download="Soumodeep-Saha-Resume.pdf"
              rel="noopener noreferrer"
            >
              Resume
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 19h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </a>
          </div>

          <div className="outro-local-time">
            <div>Local Time</div>
            <span className="outro-time-value">{localTime}</span>
          </div>

          <div className="outro-social">
            <div className="outro-social-title">Socials</div>
            <div className="links">
              <a href="#" target="_blank" rel="noopener noreferrer">Github</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}