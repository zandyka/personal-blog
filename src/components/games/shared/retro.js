// Pembantu untuk game retro beresolusi tetap.

// Membesarkan kanvas beresolusi rendah agar pas di dalam kotaknya. Skala bulat dipakai
// bila cukup ruang supaya pikselnya rata; di layar kecil skalanya boleh pecahan.
export function fitPixelCanvas(canvas, w, h, vw, vh) {
  if (w <= 0 || h <= 0) return 1;
  let s = Math.min(w / vw, h / vh);
  if (s >= 2) s = Math.floor(s);
  s = Math.max(0.5, s);
  canvas.style.width = `${Math.round(vw * s)}px`;
  canvas.style.height = `${Math.round(vh * s)}px`;
  return s;
}

export const loadChoice = (key, ids, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return ids.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
};

export const saveChoice = (key, v) => {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* hanya berlaku di sesi ini */
  }
};

// Kucing awal mengikuti pilihan terakhir pemain, atau peliharaan yang aktif di situs.
export const CATS = [
  { id: 'maxwell', name: 'Maxwell', tag: 'Loaf Cat', photo: '/pet/maxwell.png' },
  { id: 'akmal', name: 'Akmal', tag: 'Munchkin', photo: '/pet/akmal.png' },
  { id: 'usu', name: 'Kucing USU', tag: 'Anak USU', photo: '/pet/kucing-usu.png' },
];

export const loadCat = () => {
  const ids = CATS.map((c) => c.id);
  let pet;
  try {
    pet = parseInt(localStorage.getItem('activePetIndex') || '0', 10) || 0;
  } catch {
    pet = 0;
  }
  return loadChoice('pg-survivor-hero', ids, ids[pet % ids.length]);
};
