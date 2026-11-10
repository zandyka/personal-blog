import { useEffect } from 'react';

// framer-motion baru menghitung ulang progres scroll saat ada event scroll/resize jendela.
// Bila tata letak bergeser tanpa scroll — elemen baru dipasang (mis. setelah filter berganti),
// bagian lain dilepas, atau gambar selesai dimuat — progresnya tertahan di nilai lama dan
// elemen bisa tetap tak terlihat sampai pengguna menggulir.
//
// Solusinya satu ResizeObserver bersama pada <body>: setiap kali tinggi halaman berubah,
// kirim event scroll sintetis (paling banyak sekali per frame) agar semua pengukuran diperbarui.

let observer = null;
let users = 0;
let queued = false;

const nudge = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    window.dispatchEvent(new Event('scroll'));
  });
};

export function useMeasureOnMount() {
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    users += 1;
    if (!observer) {
      observer = new ResizeObserver(nudge);
      observer.observe(document.body);
    }
    nudge();
    return () => {
      users -= 1;
      if (users === 0 && observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, []);
}
