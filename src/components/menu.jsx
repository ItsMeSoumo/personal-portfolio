"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { ReactLenis } from "lenis/react";

export default function Home() {
    const lenisRef = useRef();

    useEffect(() => {
        gsap.registerPlugin(CustomEase, SplitText);
        CustomEase.create("hop", ".87,0,.13,1");

        function update(time) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }
        gsap.ticker.add(update);

        // SplitText setup
        const textContainers = document.querySelectorAll(".menu-col");
        const splitTextByContainer = [];
        textContainers.forEach((container) => {
            const textElements = container.querySelectorAll("a, p");
            const containerSplits = [];
            textElements.forEach((element) => {
                const split = SplitText.create(element, {
                    type: "lines",
                    mask: "lines",
                    linesClass: "line",
                });
                containerSplits.push(split);
                gsap.set(split.lines, { y: "-110%" });
            });
            splitTextByContainer.push(containerSplits);
        });

        const container = document.querySelector(".container");
        const menuToggleBtn = document.querySelector(".menu-toggle-btn");
        const menuOverlay = document.querySelector(".menu-overlay");
        const menuOverlayContainer = document.querySelector(".menu-overlay-content");
        const menuMediaWrapper = document.querySelector(".menu-media-wrapper");
        const copyContainers = document.querySelectorAll(".menu-col");
        const menuToggleLabel = document.querySelector(".menu-toggle-label p");
        const hamburgerIcon = document.querySelector(".menu-hamburger-icon");

        let isMenuOpen = false;
        let isAnimating = false;

        // Toggle with optional callback fired after CLOSE animation completes
        const onToggleClick = (maybeCallback) => {
            const afterClose = typeof maybeCallback === 'function' ? maybeCallback : undefined;
            if (isAnimating) return;
            if (!isMenuOpen) {
                isAnimating = true;

                // Stop Lenis while menu is open
                lenisRef.current?.lenis?.stop?.();

                const tl = gsap.timeline();
                tl.to(menuToggleLabel, { y: "-110%", duration: 1, ease: "hop" }, "<")
                    .to(container, { y: "100svh", duration: 1, ease: "hop" }, "<")
                    .to(menuOverlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, ease: "hop" }, "<")
                    .to(menuOverlayContainer, { yPercent: 0, duration: 1, ease: "hop" }, "<")
                    .to(menuMediaWrapper, { opacity: 1, duration: 0.75, ease: "power2.out", delay: 0.5 }, "<");

                splitTextByContainer.forEach((containerSplits) => {
                    const copyLines = containerSplits.flatMap((split) => split.lines);
                    tl.to(copyLines, { y: "0%", duration: 2, ease: "hop", stagger: -0.075 }, -0.15);
                });

                hamburgerIcon?.classList.add("active");
                tl.call(() => { isAnimating = false; });
                isMenuOpen = true;
            } else {
                isAnimating = true;
                hamburgerIcon?.classList.remove("active");
                const tl = gsap.timeline();
                tl.to(container, { y: "0svh", duration: 1, ease: "hop" })
                    .to(menuOverlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 1, ease: "hop" }, "<")
                    .to(menuOverlayContainer, { yPercent: -50, duration: 1, ease: "hop" }, "<")
                    .to(menuToggleLabel, { y: "0%", duration: 1, ease: "hop" }, "<")
                    .to(copyContainers, { opacity: 0.25, duration: 1, ease: "hop" }, "<");

                tl.call(() => {
                    splitTextByContainer.forEach((containerSplits) => {
                        const copyLines = containerSplits.flatMap((split) => split.lines);
                        gsap.set(copyLines, { y: "-110%" });
                    });
                    gsap.set(copyContainers, { opacity: 1 });
                    gsap.set(menuMediaWrapper, { opacity: 0 });
                    isAnimating = false;
                    lenisRef.current?.lenis?.start?.();
                    // Fire callback when fully closed
                    afterClose && afterClose();
                });

                isMenuOpen = false;
            }
        };

        menuToggleBtn?.addEventListener("click", onToggleClick);

        // Smooth-scroll navigation for menu links
        // Attach to ALL menu links and tags so the menu always closes on click
        const navLinks = Array.from(
          document.querySelectorAll('.menu-link a, .menu-tag a')
        );
        const navHandlers = [];

        const scrollWithLenis = (target) => {
          const lenis = lenisRef.current?.lenis;
          const opts = { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) };
          if (target === 'top') {
            lenis?.scrollTo(0, opts);
            return;
          }
          const el = document.querySelector(target);
          lenis?.scrollTo(el || 0, opts);
        };

        navLinks.forEach((link) => {
          const handler = (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');

            // Close menu first if open, then optional scroll (via callback on completion)
            if (isMenuOpen) {
              onToggleClick(() => { if (target) scrollWithLenis(target); });
            } else if (target) {
              scrollWithLenis(target);
            }
          };
          link.addEventListener('click', handler);
          navHandlers.push([link, handler]);
        });

        return () => {
            gsap.ticker.remove(update);
            menuToggleBtn?.removeEventListener("click", onToggleClick);
            navHandlers.forEach(([link, handler]) => link.removeEventListener('click', handler));
            gsap.globalTimeline.clear();
        };
    }, []);

    return (
        <>
            <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
            {/* Empty style block for you to add CSS later */}

            <style jsx global>{`
:root {
  --bg: #171717;
  --fg: #fff;
  --menu-bg: #0f0f0f;
  --menu-fg-secondary: #5f5f5f;
  --hamburger-icon-border: rgba(255, 255, 255, 0.1);
}
      `}</style>
            <style jsx>{`
      @import url("https://fonts.cdnfonts.com/css/pp-neue-montreal");
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");



* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "PP Neue Montreal", "Inter", sans-serif;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  font-size: 7.5rem;
  font-weight: 500;
  letter-spacing: -0.2rem;
  line-height: 1;
}

p {
  font-size: 0.95rem;
  font-weight: 500;
}

a {
  text-decoration: none;
  color: var(--fg);
  font-size: 1.5rem;
  font-weight: 500;
}

.container {
  position: relative;
  transform: translateY(0svh);
  background-color: var(--bg);
  color: var(--fg);
}

section {
  position: relative;
  width: 100vw;
  height: 100svh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: -1;
}

section h1 {
  width: 75%;
}

section img {
  opacity: 0.5;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100svh;
  pointer-events: none;
  overflow: hidden;
  z-index: 2;
}

.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  pointer-events: all;
  color: var(--menu-fg-secondary);
  z-index: 2;
}

.menu-logo {
  width: 2rem;
  height: 2rem;
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.menu-toggle-label {
  overflow: hidden;
}

.menu-toggle-label p {
  position: relative;
  transform: translateY(0%);
  will-change: transform;
}

.menu-hamburger-icon {
  position: relative;
  width: 3rem;
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid var(--hamburger-icon-border);
  border-radius: 100%;
  background-color: #000;
}

.menu-hamburger-icon span {
  position: absolute;
  width: 15px;
  height: 1.25px;
  background-color: var(--fg);
  transition: all 0.75s cubic-bezier(0.87, 0, 0.13, 1);
  transform-origin: center;
  will-change: transform;
}

.menu-hamburger-icon span:nth-child(1) {
  transform: translateY(-3px);
}

.menu-hamburger-icon span:nth-child(2) {
  transform: translateY(3px);
}

.menu-hamburger-icon.active span:nth-child(1) {
  transform: translateY(0) rotate(45deg) scaleX(1.05);
}

.menu-hamburger-icon.active span:nth-child(2) {
  transform: translateY(0) rotate(-45deg) scaleX(1.05);
}

.menu-overlay,
.menu-overlay-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100svh;
  color: var(--fg);
  overflow: hidden;
  z-index: 1;
}

.menu-overlay {
  background-color: var(--menu-bg);
  clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
  will-change: clip-path;
}

.menu-overlay-content {
  display: flex;
  transform: translateY(-50%);
  will-change: transform;
  pointer-events: all;
}

.menu-media-wrapper {
  flex: 2;
  opacity: 0;
  will-change: opacity;
}

.menu-media-wrapper img {
  opacity: 0.25;
}

.menu-content-wrapper {
  flex: 3;
  position: relative;
  display: flex;
}

.menu-content-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.menu-footer {
  margin: 0 auto;
}

.menu-content-main,
.menu-footer {
  width: 75%;
  padding: 2rem;
  display: flex;
  align-items: flex-end;
  gap: 2rem;
}

.menu-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-col:nth-child(1) {
  flex: 3;
}

/* Add extra spacing between Index / Portfolio / Connect */
.menu-content-main .menu-col:nth-child(1) {
  gap: 1.25rem;
}

.menu-col:nth-child(2) {
  flex: 2;
}

.menu-link a {
  font-size: 3.5rem;
  font-weight: 500;
  line-height: 1.2;
}

.menu-tag a,
.menu-footer p {
  color: var(--menu-fg-secondary);
}

.line {
  position: relative;
  will-change: transform;
}

@media (max-width: 1000px) {
  h1 {
    font-size: 3rem;
    letter-spacing: -0.05rem;
  }

  section h1 {
    width: 100%;
  }

  .menu-media-wrapper {
    display: none;
  }

  .menu-content-main,
  .menu-footer {
    width: 100%;
  }

  .menu-content-main {
    top: 50%;
    flex-direction: column;
    align-items: flex-start;
    gap: 5rem;
  }

  .menu-link a {
    font-size: 3rem;
  }

  .menu-tag a {
    font-size: 1.25rem;
  }
}

      
      `}</style>

            <nav>
                <div className="menu-bar">
                    <div className="menu-toggle-btn">
                        <div className="menu-toggle-label"><p>Menu</p></div>
                        <div className="menu-hamburger-icon">
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
                <div className="menu-overlay">
                    <div className="menu-overlay-content">
                        <div className="menu-media-wrapper">
                            <img src="/menu-media.jpg" alt="" />
                        </div>
                        <div className="menu-content-wrapper">
                            <div className="menu-content-main">
                                <div className="menu-col">
                                    <div className="menu-link"><a href="#top" data-target="top">Index</a></div>
                                    <div className="menu-link"><a href="#portfolio" data-target="#portfolio">Portfolio</a></div>
                                    <div className="menu-link"><a href="#connect" data-target="#connect">Connect</a></div>
                                </div>

                                <div className="menu-col">
                                    <div className="menu-tag"><a href="#about" data-target="#about">About me</a></div>
                                </div>
                            </div>
                            <div className="menu-footer">
                                <div className="menu-col">
                                    <p>India</p>
                                </div>
                                <div className="menu-col">
                                    <p>+91 9883060948</p>
                                    <p>soumo2020.saha@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

        </>
    );
}