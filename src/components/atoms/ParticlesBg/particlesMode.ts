"use client";

import { useSyncExternalStore } from "react";

// How the decorative particles background behaves:
// "moving" animates, "still" freezes a single frame, "off" removes it.
export type ParticlesMode = "moving" | "still" | "off";

export const PARTICLES_MODES: ParticlesMode[] = ["moving", "still", "off"];

const STORAGE_KEY = "particles-mode";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const listeners = new Set<() => void>();

// Used only when storage is unavailable, so a choice still sticks in-session.
let fallbackMode: ParticlesMode | null = null;

const isMode = (value: unknown): value is ParticlesMode =>
    PARTICLES_MODES.includes(value as ParticlesMode);

// Storage can throw (private windows, blocked site data), so every access is
// guarded and the page keeps working with the OS-derived default.
const readStored = (): ParticlesMode | null => {
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return isMode(value) ? value : null;
    } catch {
        return null;
    }
};

const prefersReducedMotion = () =>
    typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches;

// An explicit choice wins; otherwise follow the OS "reduce motion" setting.
const getSnapshot = (): ParticlesMode =>
    readStored() ?? (prefersReducedMotion() ? "still" : "moving");

const getServerSnapshot = (): ParticlesMode => "moving";

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    // Keep in sync with other tabs and with OS setting changes.
    const media = typeof window.matchMedia === "function" ? window.matchMedia(REDUCED_MOTION) : null;
    window.addEventListener("storage", listener);
    media?.addEventListener?.("change", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
        media?.removeEventListener?.("change", listener);
    };
};

export const setParticlesMode = (mode: ParticlesMode) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
        // Not persisted; the choice still applies until the page reloads.
        fallbackMode = mode;
    }
    notify();
};

export const useParticlesMode = () =>
    useSyncExternalStore(
        subscribe,
        () => fallbackMode ?? getSnapshot(),
        getServerSnapshot
    );
