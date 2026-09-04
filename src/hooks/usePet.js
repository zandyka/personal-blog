import { useState, useEffect, useCallback } from 'react';

export const PETS = [
  {
    id: 'maxwell',
    name: 'Maxwell',
    tag: 'Loaf Cat',
    src: '/pet/maxwell.png',
    defaultQuote: 'Meow~ 🍞',
    runQuote: 'NYOOOM!! 💨',
    catchQuote: 'Phew.. kenyang 🐾',
  },
  {
    id: 'akmal',
    name: 'Akmal',
    tag: 'Munchkin',
    src: '/pet/akmal.png',
    defaultQuote: 'O_O mantau dev',
    runQuote: 'KABUURRR!! ⚡',
    catchQuote: 'Aman dari bug 😼',
  },
  {
    id: 'usu',
    name: 'Kucing USU',
    tag: 'Anak USU',
    src: '/pet/kucing-usu.png',
    defaultQuote: 'Kuliah lagi.. 🎓',
    runQuote: 'TELAT KELAS!! 🏃💨',
    catchQuote: 'Dosen belum datang 😹',
  },
];

let currentPetIndex = 0;
let currentPetVisible = true;
const petListeners = new Set();

if (typeof window !== 'undefined') {
  try {
    const savedIdx = localStorage.getItem('activePetIndex');
    if (savedIdx !== null) currentPetIndex = parseInt(savedIdx, 10) % PETS.length;
    const savedVis = localStorage.getItem('petVisible');
    if (savedVis !== null) currentPetVisible = savedVis === 'true';
  } catch {}
}

export function usePet() {
  const [petIndex, setPetIndexState] = useState(currentPetIndex);
  const [isPetVisible, setIsPetVisibleState] = useState(currentPetVisible);

  useEffect(() => {
    const handler = (idx, vis) => {
      setPetIndexState(idx);
      setIsPetVisibleState(vis);
    };
    petListeners.add(handler);
    return () => {
      petListeners.delete(handler);
    };
  }, []);

  const cyclePet = useCallback(() => {
    currentPetIndex = (currentPetIndex + 1) % PETS.length;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('activePetIndex', currentPetIndex.toString());
      } catch {}
    }
    petListeners.forEach((listener) => listener(currentPetIndex, currentPetVisible));
    return currentPetIndex;
  }, []);

  const togglePetVisibility = useCallback(() => {
    currentPetVisible = !currentPetVisible;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('petVisible', currentPetVisible.toString());
      } catch {}
    }
    petListeners.forEach((listener) => listener(currentPetIndex, currentPetVisible));
    return currentPetVisible;
  }, []);

  const setPetIndex = useCallback((idx) => {
    currentPetIndex = idx % PETS.length;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('activePetIndex', currentPetIndex.toString());
      } catch {}
    }
    petListeners.forEach((listener) => listener(currentPetIndex, currentPetVisible));
  }, []);

  return {
    petIndex,
    currentPet: PETS[petIndex],
    pets: PETS,
    isPetVisible,
    cyclePet,
    togglePetVisibility,
    setPetIndex,
  };
}
