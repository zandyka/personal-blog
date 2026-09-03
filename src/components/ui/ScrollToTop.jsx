import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures that whenever the user navigates between routes/pages,
 * the window scroll position resets immediately to the very top.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      setTimeout(() => {
        const elem = document.getElementById(targetId) || document.getElementById('contact-form') || document.getElementById('contact');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            const nameInput = document.querySelector('input[name="name"]');
            if (nameInput) {
              nameInput.focus();
              nameInput.style.transition = 'all 0.3s ease';
              nameInput.style.borderColor = 'var(--accent)';
              nameInput.style.boxShadow = '0 0 0 4px rgba(255, 59, 29, 0.3)';
              setTimeout(() => {
                nameInput.style.borderColor = '';
                nameInput.style.boxShadow = '';
              }, 2500);
            }
          }, 400);
        }
      }, 350);
      return;
    }

    // Reset window scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, hash]);

  return null;
}