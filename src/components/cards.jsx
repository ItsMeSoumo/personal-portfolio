"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import Plasma from "@/components/ui/plasma";

export default function Home() {
  const lenisRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);

    const lenis = lenisRef.current?.lenis;
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);

    const smoothStep = (p) => p * p * (3 - 2 * p);

    if (typeof window !== "undefined" && window.innerWidth > 1000) {
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "75% top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const heroCardsContainerOpacity = gsap.utils.interpolate(1, 0.5, smoothStep(progress));
          gsap.set(".hero-cards", { opacity: heroCardsContainerOpacity });

          ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach((cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1));
            const y = gsap.utils.interpolate("0%", "350%", smoothStep(cardProgress));
            const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));
            let x = "0%";
            let rotation = 0;
            if (index === 0) {
              x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
            } else if (index === 2) {
              x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
            }
            gsap.set(cardId, { y, x, rotation, scale });
          });
        },
      });

      ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        pin: ".services",
        pinSpacing: true,
      });

      ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        onLeave: () => {
          const servicesSection = document.querySelector(".services");
          if (!servicesSection) return;
          const servicesRect = servicesSection.getBoundingClientRect();
          const servicesTop = window.pageYOffset + servicesRect.top;
          gsap.set(".cards", { position: "absolute", top: servicesTop, left: 0, width: "100vw", height: "100vh" });
        },
        onEnterBack: () => {
          gsap.set(".cards", { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" });
        },
      });

      ScrollTrigger.create({
        trigger: ".services",
        start: "top bottom",
        end: `+=${window.innerHeight * 4}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
          const headerY = gsap.utils.interpolate("400%", "0%", smoothStep(headerProgress));
          gsap.set(".services-header", { y: headerY });

          ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
            const delay = index * 0.5;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
            let y;
            if (cardProgress < 0.4) {
              const normalized = cardProgress / 0.4;
              y = gsap.utils.interpolate("-100%", "50%", smoothStep(normalized));
            } else if (cardProgress < 0.6) {
              const normalized = (cardProgress - 0.4) / 0.2;
              y = gsap.utils.interpolate("50%", "0%", smoothStep(normalized));
            } else {
              y = "0%";
            }

            let scale;
            if (cardProgress < 0.4) {
              const normalized = cardProgress / 0.4;
              scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(normalized));
            } else if (cardProgress < 0.6) {
              const normalized = (cardProgress - 0.4) / 0.2;
              scale = gsap.utils.interpolate(0.75, 1, smoothStep(normalized));
            } else {
              scale = 1;
            }

            let opacity;
            if (cardProgress < 0.2) {
              const normalized = cardProgress / 0.2;
              opacity = smoothStep(normalized);
            } else {
              opacity = 1;
            }

            let x, rotate, rotationY;
            if (cardProgress < 0.6) {
              x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
              rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
              rotationY = 0;
            } else if (cardProgress < 1) {
              const normalized = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", smoothStep(normalized));
              rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, smoothStep(normalized));
              rotationY = smoothStep(normalized) * 180;
            } else {
              x = "0%";
              rotate = 0;
              rotationY = 180;
            }

            gsap.set(cardId, { opacity, y, x, rotate, scale });
            const innerCardEl = document.querySelector(`${cardId} .flip-card-inner`);
            if (innerCardEl) gsap.set(innerCardEl, { rotationY });
          });
        },
      });
    }

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", onLenisScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      {/* Empty style block for you to add CSS later */}
      <style jsx global>{`
        :root {
  --dark: #000;
  --light: #f9f4eb;
  --light2: #f0ece5;
  --accent-1: #e5d9f6;
  --accent-2: #ffd2f3;
  --accent-3: #fcdca6;
}
      `}</style>
      <style jsx>{`
      @import url("https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap");



* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "DM Sans";
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
}

p {
  font-size: 1.1rem;
  font-weight: 500;
}

span {
  text-transform: uppercase;
  font-family: "DM Mono";
  font-size: 0.75rem;
  font-weight: 500;
}

nav {
  position: fixed;
  width: 100vw;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}

.logo span,
.menu-btn span {
  font-size: 0.8rem;
  padding: 0.75rem;
  border-radius: 0.25rem;
}

.logo span {
  background-color: var(--dark);
  color: var(--light);
}

.menu-btn span {
  background-color: var(--light2);
  color: var(--dark);
}

section {
  position: relative;
  width: 100vw;
  height: 100svh;
  padding: 2rem;
  overflow: hidden;
}

.hero {
  position: relative;
  background-color: #000; /* dark base so Plasma alpha doesn't show white */
  color: var(--dark);
}

.about,
.outro {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--dark);
  color: var(--light);
}

/* Ensure the about section appears above fixed backgrounds */
.about {
  position: relative;
  z-index: 5;
}

.hero-cards {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35%;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.hero-cards .card {
  flex: 1;
  position: relative;
  aspect-ratio: 5/7;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.hero-cards .card span {
  font-size: 0.7rem;
}

.hero-cards .card#hero-card-1 {
  background-color: var(--accent-1);
  transform-origin: top right;
  z-index: 2;
}

.hero-cards .card#hero-card-2 {
  background-color: var(--accent-2);
  z-index: 1;
}

.hero-cards .card#hero-card-3 {
  background-color: var(--accent-3);
  transform-origin: top left;
  z-index: 0;
}

.services {
  padding: 8rem 2rem;
}

.services-header {
  position: relative;
  width: 100%;
  text-align: center;
  transform: translateY(400%);
  will-change: transform;
}

.cards {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100svh;
  display: flex;
  justify-content: center;
  /* keep this section visible; inner content controls stacking */
  z-index: 0;
  background-color: #000; /* dark base */
}

.cards-container {
  position: relative;
  width: 75%;
  height: 100%;
  margin-top: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
}

.cards-container .card {
  flex: 1;
  position: relative;
  aspect-ratio: 5/7;
  perspective: 1000px;
}

.cards-container .card .card-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  animation: floating 2s infinite ease-in-out;
}

@keyframes floating {
  0% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-50%, -55%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}

#card-1 .card-wrapper {
  animation-delay: 0;
}

#card-2 .card-wrapper {
  animation-delay: 0.25s;
}

#card-3 .card-wrapper {
  animation-delay: 0.5s;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  backface-visibility: hidden;
  overflow: hidden;
}

.flip-card-front {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

#card-1 .flip-card-front {
  background-color: var(--accent-1);
}

#card-2 .flip-card-front {
  background-color: var(--accent-2);
}

#card-3 .flip-card-front {
  background-color: var(--accent-3);
}

.flip-card-back {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  background-color: #fff;
  transform: rotateY(180deg);
}

.card-copy {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-copy p {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  background-color: var(--light2);
  border-radius: 0.25rem;
}

.cards #card-1 {
  transform: translateX(100%) translateY(-100%) rotate(-5deg) scale(0.25);
  z-index: 2;
}

.cards #card-2 {
  transform: translateX(0%) translateY(-100%) rotate(0deg) scale(0.25);
  z-index: 1;
}

.cards #card-3 {
  transform: translateX(-100%) translateY(-100%) rotate(5deg) scale(0.25);
  z-index: 0;
}

.cards .cards-container .card {
  opacity: 0;
}

.mobile-cards {
  display: none;
}

@media (max-width: 1000px) {
  .hero-cards {
    width: calc(100% - 4rem);
  }

  .services {
    min-height: 100svh;
    height: 100%;
  }

  .services-header {
    transform: translateY(0%);
  }

  .mobile-cards {
    display: block;
    height: 100%;
  }

  .mobile-cards .cards-container {
    width: calc(100% - 4rem);
    display: block;
    height: 100%;
    margin: 4rem auto;
  }

  .mobile-cards .cards-container .card {
    margin-bottom: 2rem;
  }

  .mobile-cards .cards-container .card-wrapper {
    animation: none;
  }

  .mobile-cards .card .flip-card-front {
    transform: rotateY(180deg);
  }

  .mobile-cards .flip-card-back {
    transform: rotateY(0deg);
  }
}

/* Plasma background helper */
.plasma-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* behind content within section */
  pointer-events: none;
}
      `}</style>

      {/* <nav>
        <div className="logo"><span>Site Logo</span></div>
        <div className="menu-btn"><span>Menu</span></div>
      </nav> */}

      <section className="hero" style={{ backgroundColor: "#000" }}>
        {/* <div className="plasma-bg">
          <Plasma
            color="#ff6b35"
            speed={0.8}
            direction="forward"
            scale={1.0}
            opacity={1}
            mouseInteractive={true}
          />
        </div> */}
        <div className="hero-cards" style={{ position: "relative", zIndex: 1 }}>
          <div className="card" id="hero-card-1">
            <div className="card-title">
              <span>Plan</span>
              <span>01</span>
            </div>
            <div className="card-title">
              <span>01</span>
              <span>Plan</span>
            </div>
          </div>

          <div className="card" id="hero-card-2">
            <div className="card-title">
              <span>Design</span>
              <span>02</span>
            </div>
            <div className="card-title">
              <span>02</span>
              <span>Design</span>
            </div>
          </div>

          <div className="card" id="hero-card-3">
            <div className="card-title">
              <span>Develop</span>
              <span>03</span>
            </div>
            <div className="card-title">
              <span>03</span>
              <span>Develop</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about">
        <h1>Keep scrolling — it gets good</h1>
      </section>

      <section className="services">
        <div className="services-header">
          <h1>Stuff I make so you don’t have to</h1>
        </div>

        <div className="mobile-cards">
          <div className="cards-container">
            <div className="card" id="mobile-card-1">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-title">
                      <span>Plan</span>
                      <span>01</span>
                    </div>
                    <div className="card-title">
                      <span>01</span>
                      <span>Plan</span>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <span>Plan</span>
                      <span>01</span>
                    </div>
                    <div className="card-copy">
                      <p>Discovery</p>
                      <p>Audit</p>
                      <p>User Flow</p>
                      <p>Site Map</p>
                      <p>Personas</p>
                      <p>Strategy</p>
                    </div>
                    <div className="card-title">
                      <span>01</span>
                      <span>Plan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" id="mobile-card-2">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-title">
                      <span>Design</span>
                      <span>02</span>
                    </div>
                    <div className="card-title">
                      <span>02</span>
                      <span>Design</span>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <span>Design</span>
                      <span>02</span>
                    </div>
                    <div className="card-copy">
                      <p>Wireframes</p>
                      <p>UI Kits</p>
                      <p>Prototypes</p>
                      <p>Visual Style</p>
                      <p>Interaction</p>
                      <p>Design QA</p>
                    </div>
                    <div className="card-title">
                      <span>02</span>
                      <span>Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" id="mobile-card-3">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-title">
                      <span>Develop</span>
                      <span>03</span>
                    </div>
                    <div className="card-title">
                      <span>03</span>
                      <span>Develop</span>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title">
                      <span>Develop</span>
                      <span>03</span>
                    </div>
                    <div className="card-copy">
                      <p>HTML/CSS/JS</p>
                      <p>CMS Build</p>
                      <p>GSAP Motion</p>
                      <p>Responsive</p>
                      <p>Optimization</p>
                      <p>Launch</p>
                    </div>
                    <div className="card-title">
                      <span>03</span>
                      <span>Develop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cards">
        <div className="plasma-bg">
          <Plasma
            color="#ff6b35"
            speed={0.5}
            direction="forward"
            scale={1.0}
            opacity={1}
            mouseInteractive={true}
          />
        </div>
        <div className="cards-container" style={{ position: "relative", zIndex: 1 }}>
          <div className="card" id="card-1">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Plan</span>
                    <span>01</span>
                  </div>
                  <div className="card-title">
                    <span>01</span>
                    <span>Plan</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Plan</span>
                    <span>01</span>
                  </div>
                  <div className="card-copy">
                    <p>Discovery</p>
                    <p>Audit</p>
                    <p>User Flow</p>
                    <p>Site Map</p>
                    <p>Personas</p>
                    <p>Strategy</p>
                  </div>
                  <div className="card-title">
                    <span>01</span>
                    <span>Plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" id="card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Design</span>
                    <span>02</span>
                  </div>
                  <div className="card-title">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Design</span>
                    <span>02</span>
                  </div>
                  <div className="card-copy">
                    <p>Wireframes</p>
                    <p>UI Kits</p>
                    <p>Prototypes</p>
                    <p>Visual Style</p>
                    <p>Interaction</p>
                    <p>Design QA</p>
                  </div>
                  <div className="card-title">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" id="card-3">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Develop</span>
                    <span>03</span>
                  </div>
                  <div className="card-title">
                    <span>03</span>
                    <span>Develop</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Develop</span>
                    <span>03</span>
                  </div>
                  <div className="card-copy">
                    <p>HTML/CSS/JS</p>
                    <p>CMS Build</p>
                    <p>GSAP Motion</p>
                    <p>Responsive</p>
                    <p>Optimization</p>
                    <p>Launch</p>
                  </div>
                  <div className="card-title">
                    <span>03</span>
                    <span>Develop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <h1>The story’s not over yet</h1>
      </section>
    </>
  );
}