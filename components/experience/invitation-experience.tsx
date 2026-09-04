"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientAudio } from "@/components/experience/ambient-audio";
import { GsapStory } from "@/components/experience/gsap-story";
import { InvitationReveal } from "@/components/experience/invitation-reveal";
import { ScrollProgress } from "@/components/experience/scroll-progress";
import { SmoothScroll } from "@/components/experience/smooth-scroll";
import { IvoryBackdrop } from "@/components/experience/ivory-backdrop";
import { WelcomeScreen } from "@/components/experience/welcome-screen";
import { Countdown } from "@/components/invitation/countdown";
import { EventInfo } from "@/components/invitation/event-info";
import { Footer } from "@/components/invitation/footer";
import { InstitutionalLetter } from "@/components/invitation/institutional-letter";
import { MapSection } from "@/components/invitation/map-section";
import { MobileDock } from "@/components/invitation/mobile-dock";
import { RsvpForm } from "@/components/invitation/rsvp-form";
import { Timeline } from "@/components/invitation/timeline";
import { VideoSection } from "@/components/invitation/video-section";
import { useExperienceStore } from "@/store/experience-store";
import type { SiteConfig } from "@/types";

interface InvitationExperienceProps {
  config: SiteConfig;
  enlaceSlug?: string | null;
}

export function InvitationExperience({
  config,
  enlaceSlug = null,
}: InvitationExperienceProps) {
  const invitationOpened = useExperienceStore((s) => s.invitationOpened);
  const curtainAnimating = useExperienceStore((s) => s.curtainAnimating);
  const setEnlaceOrigen = useExperienceStore((s) => s.setEnlaceOrigen);

  const showInvitation = invitationOpened || curtainAnimating;

  useEffect(() => {
    setEnlaceOrigen(enlaceSlug);
  }, [enlaceSlug, setEnlaceOrigen]);

  useEffect(() => {
    if (!enlaceSlug) return;
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: enlaceSlug }),
    });
  }, [enlaceSlug]);

  return (
    <SmoothScroll>
      <div className="relative min-h-dvh overflow-x-hidden bg-marfil">
        <IvoryBackdrop />
        <WelcomeScreen config={config} />
        <InvitationReveal />
        <AmbientAudio musicUrl={config.musica_url || undefined} />

        <AnimatePresence>
          {showInvitation ? (
            <motion.main
              key="invitation"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.1,
                delay: curtainAnimating ? 0.35 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10"
            >
              {invitationOpened ? (
                <>
                  <ScrollProgress />
                  <MobileDock />
                </>
              ) : null}

              <GsapStory>
                {/* La invitación abre directamente en la carta */}
                <InstitutionalLetter config={config} isOpening />
                <EventInfo config={config} />
                <Countdown config={config} />
                <MapSection config={config} />
                <Timeline config={config} />
                <VideoSection config={config} />
                <RsvpForm />
                <Footer config={config} />
              </GsapStory>
            </motion.main>
          ) : null}
        </AnimatePresence>
      </div>
    </SmoothScroll>
  );
}
