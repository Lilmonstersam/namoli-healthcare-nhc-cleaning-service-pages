document.querySelectorAll('.ndis-page .accordion-header').forEach((header) => {
  header.setAttribute('aria-expanded', 'false');
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    const wasOpen = header.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.ndis-page .accordion-header').forEach((other) => {
      other.setAttribute('aria-expanded', 'false');
      other.nextElementSibling.style.maxHeight = '';
      other.querySelector('svg')?.classList.remove('rotate-180');
    });

    if (!wasOpen) {
      header.setAttribute('aria-expanded', 'true');
      content.style.maxHeight = `${content.scrollHeight}px`;
      header.querySelector('svg')?.classList.add('rotate-180');
    }
  });
});
