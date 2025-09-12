"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import AnimatedCopy from "./AnimatedCopy";

export default function Home() {
  const lenisRef = useRef();

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

      <section className="hero">
        <div>
          <h1>Some Of My works</h1>
          <AnimatedCopy>
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

      <section className="outro">
        <h1>Next Canvas Awaits</h1>
      </section>
    </>
  );
}