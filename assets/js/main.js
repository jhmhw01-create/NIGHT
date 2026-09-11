const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// NIGHT identity motion: moonlight, afterimage and water reflections.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  const veil = document.createElement('div');
  veil.className = 'night-page-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('is-ready')));

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    const moonlight = document.createElement('div');
    moonlight.className = 'night-cursor-light';
    moonlight.setAttribute('aria-hidden', 'true');
    document.body.appendChild(moonlight);

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let cursorFrame = 0;
    window.addEventListener('pointermove', (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      moonlight.classList.add('is-active');
      if (cursorFrame) return;
      cursorFrame = requestAnimationFrame(() => {
        moonlight.style.transform = `translate3d(${cursorX - 215}px,${cursorY - 215}px,0)`;
        cursorFrame = 0;
      });
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => moonlight.classList.remove('is-active'));
  }

  const titleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('night-title-awake');
      entry.target.addEventListener('animationend', () => entry.target.classList.remove('night-title-awake'), { once: true });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('.hero-title, .section-title, .member-title, .contents-hero h1, .era-hero h1, .travel-hero h1, .behind-hero h1, .medley-hero h1').forEach((title) => titleObserver.observe(title));

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('a, button, summary, .gallery-item')) return;
    const ring = document.createElement('span');
    ring.className = 'night-water-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.style.left = `${event.clientX}px`;
    ring.style.top = `${event.clientY}px`;
    document.body.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
  }, { passive: true });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || /^(?:mailto:|tel:|javascript:)/i.test(href)) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.hash) return;

    event.preventDefault();
    veil.classList.remove('is-ready');
    veil.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = destination.href; }, 240);
  });
}

// Keep Taehoon's legacy site key (`taehun`) compatible with newer assets.
document.querySelectorAll('.gallery-item').forEach((item) => {
  const categories = (item.dataset.category || '').split(/\s+/);
  if (categories.includes('taehoon')) {
    item.dataset.category = categories.map((category) => category === 'taehoon' ? 'taehun' : category).join(' ');
  }

  const image = item.querySelector('img');
  if (!image) return;

  image.addEventListener('error', () => {
    const currentPath = image.getAttribute('src') || '';
    const fallbackPath = currentPath.includes('taehoon')
      ? currentPath.replace('taehoon', 'taehun')
      : currentPath.includes('taehun')
        ? currentPath.replace('taehun', 'taehoon')
        : '';

    if (fallbackPath && fallbackPath !== currentPath) image.src = fallbackPath;
  }, { once: true });
});


// Gallery v03
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const galleryFilters = [...document.querySelectorAll('.gallery-filter')];
const galleryCount = document.querySelector('.gallery-count');
const lightbox = document.querySelector('#galleryLightbox');

if (galleryItems.length && galleryFilters.length) {
  let currentFilter = 'all';
  let visibleItems = [...galleryItems];
  let currentIndex = 0;

  const updateFilter = (filter) => {
    currentFilter = filter;
    galleryFilters.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === filter));
    galleryItems.forEach(item => {
      const categories = (item.dataset.category || '').split(/\s+/);
      const show = filter === 'all' || categories.includes(filter);
      item.hidden = !show;
    });
    visibleItems = galleryItems.filter(item => !item.hidden);
    if (galleryCount) galleryCount.textContent = `${visibleItems.length} PHOTOS`;
  };

  galleryFilters.forEach(btn => btn.addEventListener('click', () => updateFilter(btn.dataset.filter)));

  if (lightbox) {
    const image = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-title');
    const index = lightbox.querySelector('.lightbox-index');
    const close = lightbox.querySelector('.lightbox-close');
    const prev = lightbox.querySelector('.lightbox-prev');
    const next = lightbox.querySelector('.lightbox-next');
    let lastFocused = null;

    const renderLightbox = () => {
      const item = visibleItems[currentIndex];
      if (!item) return;

      // Use the already-resolved thumbnail URL as the base for the full image.
      // This works both on local/GitHub Pages and in file-preview environments
      // that do not rewrite relative URLs stored only in data-* attributes.
      const thumb = item.querySelector('img');
      const resolvedThumb = thumb ? (thumb.currentSrc || thumb.src) : '';
      const resolvedFull = resolvedThumb.includes('/thumbs/')
        ? resolvedThumb.replace('/thumbs/', '/full/')
        : new URL(item.dataset.full, document.baseURI).href;

      image.onerror = () => {
        image.onerror = null;
        if (resolvedThumb) image.src = resolvedThumb;
      };
      image.src = resolvedFull;
      image.alt = item.getAttribute('aria-label') || 'NIGHT 갤러리 확대 이미지';
      title.textContent = item.dataset.title || '';
      index.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    };

    const openLightbox = (item) => {
      visibleItems = galleryItems.filter(el => !el.hidden);
      currentIndex = Math.max(0, visibleItems.indexOf(item));
      lastFocused = document.activeElement;
      renderLightbox();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      close.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      image.removeAttribute('src');
      if (lastFocused) lastFocused.focus();
    };

    const move = (step) => {
      currentIndex = (currentIndex + step + visibleItems.length) % visibleItems.length;
      renderLightbox();
    };

    galleryItems.filter(item => item.dataset.full).forEach(item => item.addEventListener('click', () => openLightbox(item)));
    close.addEventListener('click', closeLightbox);
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    });
  }
}
