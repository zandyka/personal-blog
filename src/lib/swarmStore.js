import { useSyncExternalStore } from 'react';

// Efek swarm cursor di Playground: nyala/mati, dibagi antara tombol di navbar dan halamannya.
// Pilihan disimpan di localStorage; bila penyimpanan tak tersedia, berlaku untuk sesi ini saja.
const KEY = 'playground-swarm';

const read = () => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
};

let enabled = typeof window === 'undefined' ? true : read();
const listeners = new Set();

export function setSwarmEnabled(next) {
  if (enabled === next) return;
  enabled = next;
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off');
  } catch {
    /* abaikan — tetap berlaku di sesi ini */
  }
  listeners.forEach((fn) => fn());
}

export const toggleSwarm = () => setSwarmEnabled(!enabled);

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => enabled;

export function useSwarmEnabled() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
