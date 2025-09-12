"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

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

.sticky-cards {
  position: relative;
  width: 100vw;
  background-color: #0f0f0f;
}

.card {
  position: sticky;
  width: 100%;
  height: 125svh;
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

.card-info {
  width: 25%;
  padding: 4em;
  text-align: left;
}

.card-info p {
  font-size: 0.9rem;
}

.card-title h1 {
  font-size: 10rem;
  padding: 2rem 0;
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
  height: 100%;
  margin-top: 4em;
  overflow: hidden;
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
    font-size: 3rem;
  }

  .card-description p {
    font-size: 1.25rem;
  }
}

      
      `}</style>

      <section className="hero">
        <h1>Art That Lives Online</h1>
      </section>

      <section className="sticky-cards">
        <div className="card" id="card-1">
          <div className="card-inner">
            <div className="card-info">
              <p>A surreal dive into neon hues and playful decay</p>
            </div>
            <div className="card-title">
              <h1>Reverie</h1>
            </div>
            <div className="card-description">
              <p>
                A psychedelic skull study exploring the tension between
                playfulness and decay. Bold candy tones, liquid forms, and crisp
                vectors bring a surreal, pop-art mood meant for covers and prints.
              </p>
            </div>
            <div className="card-img">
              <img src="/img1.jpg" alt="" />
            </div>
          </div>
        </div>

        <div className="card" id="card-2">
          <div className="card-inner">
            <div className="card-info">
              <p>A retro-futurist scene where nostalgia meets glitch</p>
            </div>
            <div className="card-title">
              <h1>Vaporwave</h1>
            </div>
            <div className="card-description">
              <p>
                An 80s-UI dreamscape: stacked windows, checkerboard floors, and a
                sunset gradient. Built to feel like a loading screen to another
                world—nostalgic, glossy, and a bit uncanny.
              </p>
            </div>
            <div className="card-img">
              <img src="/img2.jpg" alt="" />
            </div>
          </div>
        </div>

        <div className="card" id="card-3">
          <div className="card-inner">
            <div className="card-info">
              <p>A kaleidoscope of folk motifs reimagined in digital form</p>
            </div>
            <div className="card-title">
              <h1>Kaleido</h1>
            </div>
            <div className="card-description">
              <p>
                Ornamental symmetry inspired by folk motifs and stained-glass
                glow. Designed as a seamless, tileable pattern for textiles,
                wallpapers, and rich UI backgrounds.
              </p>
            </div>
            <div className="card-img">
              <img src="/img3.jpg" alt="" />
            </div>
          </div>
        </div>

        <div className="card" id="card-4">
          <div className="card-inner">
            <div className="card-info">
              <p>A portrait framed by oddball creatures and doodles</p>
            </div>
            <div className="card-title">
              <h1>Menagerie</h1>
            </div>
            <div className="card-description">
              <p>
                A playful portrait surrounded by oddball companions—mascots,
                monsters, and midnight snacks. Loose linework meets pastel whimsy,
                perfect for merch, stickers, and editorial spots.
              </p>
            </div>
            <div className="card-img">
              <img src="/img4.jpg" alt="" />
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