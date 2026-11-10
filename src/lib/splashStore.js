import { useSyncExternalStore } from 'react';

// Status splash screen yang bisa dibaca komponen mana pun (mis. hero menunggu
// splash selesai sebelum memulai animasi masuknya).
let active = true;
const listeners = new Set();

export function setSplashActive(next) {
  if (active === next) return;
  active = next;
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => active;

export function useSplashActive() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
