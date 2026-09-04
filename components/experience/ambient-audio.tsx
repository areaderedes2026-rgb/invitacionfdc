"use client";

import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useExperienceStore } from "@/store/experience-store";

type AmbientHandle = {
  source: AudioBufferSourceNode;
  ctx: AudioContext;
};

function startAmbient(ctx: AudioContext): AmbientHandle {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.4;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.Q.value = 0.65;

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  return { source, ctx };
}

export function AmbientAudio({ musicUrl }: { musicUrl?: string }) {
  const { audioEnabled, setAudioEnabled } = useExperienceStore();
  const ambientRef = useRef<AmbientHandle | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = async () => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current = null;
    }
    if (ambientRef.current) {
      try {
        ambientRef.current.source.stop();
        await ambientRef.current.ctx.close();
      } catch {
        /* already closed */
      }
      ambientRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      void stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = async () => {
    if (audioEnabled) {
      await stopAll();
      setAudioEnabled(false);
      return;
    }

    try {
      if (musicUrl) {
        const audio = new Audio(musicUrl);
        audio.loop = true;
        audio.volume = 0.4;
        musicRef.current = audio;
        await audio.play();
      } else {
        const ctx = new AudioContext();
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        ambientRef.current = startAmbient(ctx);
      }
      setAudioEnabled(true);
    } catch {
      await stopAll();
      setAudioEnabled(false);
    }
  };

  return (
    <div className="fixed bottom-[5.8rem] right-3 z-[56] md:bottom-5 md:right-5 md:z-[70]">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-pressed={audioEnabled}
        aria-label={audioEnabled ? "Silenciar" : "Activar sonido"}
        title={audioEnabled ? "Silenciar" : "Activar sonido"}
        className={cn(
          "h-11 w-11 border-ocre/50 shadow-[0_8px_24px_rgba(26,23,51,0.12)] backdrop-blur transition-colors",
          audioEnabled
            ? "bg-noche text-marfil hover:bg-noche-deep"
            : "bg-marfil/90 text-noche hover:bg-marfil"
        )}
        onClick={() => void toggleSound()}
      >
        {audioEnabled ? (
          <Volume2 className="h-5 w-5" aria-hidden />
        ) : (
          <VolumeX className="h-5 w-5" aria-hidden />
        )}
      </Button>
    </div>
  );
}
