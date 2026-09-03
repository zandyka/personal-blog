/**
 * Utility to smoothly scroll to the Direct Message ('Kirim Pesan Langsung')
 * form in the Contact section and give the first input a glowing focus highlight.
 */
export const scrollToDirectMessage = (navigate, currentPathname) => {
  const highlightForm = () => {
    const formElem = document.getElementById('contact-form') || document.getElementById('contact');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      }, 450);
    }
  };

  if (currentPathname === '/' || window.location.pathname === '/') {
    highlightForm();
  } else {
    if (navigate) {
      navigate('/#contact-form');
    } else {
      window.location.href = '/#contact-form';
    }
  }
};
