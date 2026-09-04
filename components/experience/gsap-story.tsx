"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Preset = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
};

function presets(isMobile: boolean): Record<string, Preset> {
  const y = isMobile ? 20 : 36;
  const x = isMobile ? 14 : 28;
  const duration = isMobile ? 0.68 : 0.92;

  return {
    "fade-up": {
      from: { opacity: 0, y },
      to: { opacity: 1, y: 0, duration, ease: "power3.out" },
    },
    "fade-down": {
      from: { opacity: 0, y: -y * 0.55 },
      to: { opacity: 1, y: 0, duration: duration * 0.9, ease: "power3.out" },
    },
    "fade-in": {
      from: { opacity: 0 },
      to: { opacity: 1, duration: isMobile ? 0.7 : 1, ease: "power2.out" },
    },
    "fade-left": {
      from: { opacity: 0, x: -x },
      to: { opacity: 1, x: 0, duration, ease: "power3.out" },
    },
    "fade-right": {
      from: { opacity: 0, x },
      to: { opacity: 1, x: 0, duration, ease: "power3.out" },
    },
    "scale-in": {
      from: { opacity: 0, scale: 0.92 },
      to: {
        opacity: 1,
        scale: 1,
        duration: isMobile ? 0.62 : 0.82,
        ease: "power3.out",
      },
    },
    "clip-up": {
      from: { clipPath: "inset(18% 0 18% 0)", opacity: 0.5 },
      to: {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: isMobile ? 0.85 : 1.15,
        ease: "power3.out",
      },
    },
    "clip-left": {
      from: { clipPath: "inset(0 38% 0 0)", opacity: 0.55 },
      to: {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: isMobile ? 0.85 : 1.15,
        ease: "power3.out",
      },
    },
    line: {
      from: { scaleX: 0 },
      to: {
        scaleX: 1,
        duration: isMobile ? 0.55 : 0.75,
        ease: "power2.out",
      },
    },
  };
}

function bindReveals(root: HTMLElement, isMobile: boolean) {
  const start = isMobile ? "top 92%" : "top 84%";
  const catalog = presets(isMobile);

  const play = (
    targets: gsap.TweenTarget,
    preset: Preset,
    trigger: Element,
    extra?: { delay?: number; stagger?: number }
  ) => {
    gsap.fromTo(
      targets,
      { ...preset.from, force3D: true },
      {
        ...preset.to,
        delay: extra?.delay || 0,
        stagger: extra?.stagger,
        immediateRender: true,
        overwrite: "auto",
        scrollTrigger: {
          trigger,
          start,
          once: true,
          toggleActions: "play none none none",
        },
        onComplete: () => {
          gsap.set(targets, {
            clearProps: "transform,clipPath,willChange",
          });
        },
      }
    );
  };

  gsap.utils.toArray<HTMLElement>("[data-gsap]", root).forEach((el) => {
    if (el.closest("[data-gsap-stagger]")) return;
    const preset = catalog[el.dataset.gsap || "fade-up"] || catalog["fade-up"];
    const delay = Number(el.dataset.gsapDelay || 0);
    play(el, preset, el, { delay });
  });

  gsap.utils.toArray<HTMLElement>("[data-gsap-stagger]", root).forEach((group) => {
    const preset =
      catalog[group.dataset.gsapStagger || "fade-up"] || catalog["fade-up"];
    const items = gsap.utils.toArray<HTMLElement>("[data-gsap-item]", group);
    if (!items.length) return;
    play(items, preset, group, {
      stagger: isMobile ? 0.08 : 0.12,
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-kenburns]", root).forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 1.12 },
      {
        scale: 1,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: isMobile ? 0.65 : 1.05,
        },
      }
    );
  });
}

export function GsapStory({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const root = ref.current;
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          mobile: "(max-width: 767px)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          if (context.conditions?.reduce) return;

          const isMobile = Boolean(context.conditions?.mobile);
          const intro = gsap.delayedCall(0.4, () => {
            bindReveals(root, isMobile);
            ScrollTrigger.refresh();
          });

          return () => {
            intro.kill();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 900);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("load", refresh);

    const images = ref.current?.querySelectorAll("img") ?? [];
    images.forEach((img) => img.addEventListener("load", refresh));

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("load", refresh);
      images.forEach((img) => img.removeEventListener("load", refresh));
    };
  }, []);

  return <div ref={ref} className="scroll-reveal overflow-x-clip">{children}</div>;
}
