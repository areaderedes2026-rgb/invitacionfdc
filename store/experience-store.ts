"use client";

import { create } from "zustand";

interface ExperienceState {
  invitationOpened: boolean;
  curtainAnimating: boolean;
  audioEnabled: boolean;
  enlaceOrigen: string | null;
  openInvitation: () => void;
  completeCurtain: () => void;
  setAudioEnabled: (value: boolean) => void;
  setEnlaceOrigen: (slug: string | null) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  invitationOpened: false,
  curtainAnimating: false,
  audioEnabled: false,
  enlaceOrigen: null,
  openInvitation: () => set({ curtainAnimating: true }),
  completeCurtain: () =>
    set({ curtainAnimating: false, invitationOpened: true }),
  setAudioEnabled: (value) => set({ audioEnabled: value }),
  setEnlaceOrigen: (slug) => set({ enlaceOrigen: slug }),
}));
