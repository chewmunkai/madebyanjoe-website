import { create } from 'zustand'

/* Tiny shared flag so the hero (and later sections) can choreograph their
   entrance to the exact moment the preloader curtain lifts. */
export const useIntro = create((set) => ({
  done: false,
  finish: () => set({ done: true }),
}))
