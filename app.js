(() => {
  const menu = document.getElementById('mobileMenu');
  const nav = document.getElementById('nav');
  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false');
    if (menu) menu.textContent = '☰';
  }));

  // Staggered reveal animation, with a reduced-motion fallback in CSS.
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      observer.observe(el);
    });
  } else reveals.forEach(el => el.classList.add('is-visible'));

  // Category filter: keep the library as curated cards, not an embedded browser.
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.asset-card');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
    const filter = tab.dataset.filter;
    cards.forEach(card => card.classList.toggle('filtered-out', filter !== 'all' && card.dataset.category !== filter));
  }));

  // No false purchase claim: only redirect if an operator has configured a real checkout URL.
  const config = window.AURELIA_SITE_CONFIG || {};
  const buy = document.getElementById('buyPro');
  const message = document.getElementById('purchaseMessage');
  buy?.addEventListener('click', () => {
    if (config.proCheckoutUrl && /^https:\/\//i.test(config.proCheckoutUrl)) {
      window.location.assign(config.proCheckoutUrl);
    } else {
      if (message) message.textContent = 'Pro checkout is not configured yet. No payment was taken.';
      buy.classList.add('button-attention');
      setTimeout(() => buy.classList.remove('button-attention'), 900);
    }
  });

  // Friendly missing-download state; the website does not pretend an installer exists.
  const freeLink = document.getElementById('freeDownload');
  const downloadNote = document.getElementById('downloadNote');
  freeLink?.addEventListener('click', async (e) => {
    try {
      const r = await fetch('/downloads/AURELIA-Free-Setup.exe', { method: 'HEAD' });
      if (!r.ok) {
        e.preventDefault();
        if (downloadNote) downloadNote.textContent = 'The Free installer has not been uploaded to this website yet. Build it with AURELIA and place it in public/downloads.';
      }
    } catch (_) {
      // Normal anchor fallback; static hosts may not support HEAD.
    }
  });
})();