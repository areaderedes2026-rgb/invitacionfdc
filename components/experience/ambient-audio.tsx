"use client";

import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { extractYoutubeId } from "@/lib/youtube";
import { useExperienceStore } from "@/store/experience-store";

type AmbientHandle = {
  source: AudioBufferSourceNode;
  ctx: AudioContext;
};

type YoutubePlayer = {
  playVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
  setVolume: (value: number) => void;
};

type YoutubeWindow = Window & {
  YT?: {
    Player: new (
      element: HTMLElement,
      options: Record<string, unknown>
    ) => YoutubePlayer;
  };
  onYouTubeIframeAPIReady?: () => void;
};

let youtubeApi: Promise<void> | null = null;

function loadYoutubeApi() {
  if (typeof window === "undefined") return Promise.reject();
  const win = window as YoutubeWindow;
  if (win.YT?.Player) return Promise.resolve();
  if (youtubeApi) return youtubeApi;

  youtubeApi = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      youtubeApi = null;
      reject(new Error("YouTube no cargó"));
    }, 12000);

    const prev = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timer);
      prev?.();
      resolve();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    if (win.YT?.Player) {
      window.clearTimeout(timer);
      resolve();
    }
  });

  return youtubeApi;
}

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
  const youtubeRef = useRef<YoutubePlayer | null>(null);
  const youtubeHostRef = useRef<HTMLDivElement | null>(null);

  const stopAll = async () => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.src = "";
      musicRef.current = null;
    }
    if (youtubeRef.current) {
      try {
        youtubeRef.current.stopVideo();
        youtubeRef.current.destroy();
      } catch {
        /* already gone */
      }
      youtubeRef.current = null;
    }
    if (youtubeHostRef.current) {
      youtubeHostRef.current.replaceChildren();
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
  }, []);

  const startYoutube = async (id: string) => {
    await loadYoutubeApi();
    const Player = (window as YoutubeWindow).YT?.Player;
    const host = youtubeHostRef.current;
    if (!Player || !host) {
      throw new Error("YouTube no está disponible");
    }

    host.replaceChildren(document.createElement("div"));
    const mount = host.firstElementChild as HTMLElement;

    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error("timeout")), 10000);
      youtubeRef.current = new Player(mount, {
        width: 1,
        height: 1,
        videoId: id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: id,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: { target: YoutubePlayer }) => {
            window.clearTimeout(timer);
            event.target.setVolume(40);
            event.target.playVideo();
            resolve();
          },
          onError: () => {
            window.clearTimeout(timer);
            reject(new Error("Este video de YouTube no se puede reproducir acá"));
          },
        },
      });
    });
  };

  const toggleSound = async () => {
    if (audioEnabled) {
      await stopAll();
      setAudioEnabled(false);
      return;
    }

    try {
      const youtubeId = musicUrl ? extractYoutubeId(musicUrl) : null;
      if (youtubeId) {
        await startYoutube(youtubeId);
      } else if (musicUrl) {
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
      <div
        ref={youtubeHostRef}
        className="pointer-events-none fixed left-[-9999px] top-0 h-[180px] w-[320px] overflow-hidden"
        aria-hidden
      />
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
