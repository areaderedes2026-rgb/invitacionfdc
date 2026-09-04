"use client";

import { useEffect, useRef } from "react";
import { Volume2, VolumeX, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExperienceStore } from "@/store/experience-store";

function createAmbientNoise(ctx: AudioContext) {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.35;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.value = 0.035;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  return { source, gain, ctx };
}

export function AmbientAudio({ musicUrl }: { musicUrl?: string }) {
  const {
    ambientEnabled,
    audioEnabled,
    setAmbientEnabled,
    setAudioEnabled,
  } = useExperienceStore();

  const ambientRef = useRef<ReturnType<typeof createAmbientNoise> | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      ambientRef.current?.source.stop();
      ambientRef.current?.ctx.close();
      ambientRef.current = null;
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const toggleAmbient = async () => {
      if (ambientEnabled) {
        if (!ambientRef.current) {
          const ctx = new AudioContext();
          ambientRef.current = createAmbientNoise(ctx);
        } else if (ambientRef.current.ctx.state === "suspended") {
          await ambientRef.current.ctx.resume();
        }
      } else if (ambientRef.current) {
        ambientRef.current.source.stop();
        await ambientRef.current.ctx.close();
        ambientRef.current = null;
      }
    };

    void toggleAmbient();
  }, [ambientEnabled]);

  useEffect(() => {
    if (!musicUrl) return;

    if (audioEnabled) {
      if (!musicRef.current) {
        musicRef.current = new Audio(musicUrl);
        musicRef.current.loop = true;
        musicRef.current.volume = 0.35;
      }
      void musicRef.current.play().catch(() => setAudioEnabled(false));
    } else if (musicRef.current) {
      musicRef.current.pause();
    }
  }, [audioEnabled, musicUrl, setAudioEnabled]);

  return (
    <div className="fixed bottom-[5.8rem] right-3 z-[56] flex gap-2 md:bottom-5 md:right-5 md:z-[70]">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-pressed={ambientEnabled}
        aria-label={ambientEnabled ? "Desactivar ambiente de campo" : "Activar ambiente de campo"}
        className="border-ocre/40 bg-marfil/80 backdrop-blur"
        onClick={() => setAmbientEnabled(!ambientEnabled)}
      >
        <Wind className="h-4 w-4 text-noche" />
      </Button>
      {musicUrl ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-pressed={audioEnabled}
          aria-label={audioEnabled ? "Silenciar música" : "Activar música"}
          className="border-ocre/40 bg-marfil/80 backdrop-blur"
          onClick={() => setAudioEnabled(!audioEnabled)}
        >
          {audioEnabled ? (
            <Volume2 className="h-4 w-4 text-noche" />
          ) : (
            <VolumeX className="h-4 w-4 text-noche" />
          )}
        </Button>
      ) : null}
    </div>
  );
}
