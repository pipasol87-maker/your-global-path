(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Nav: scroll shadow + mobile toggle ----------
  const nav = $('#nav');
  const toggle = $('.nav__toggle');
  const menu = $('.nav__menu');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu when a link is clicked
  $$('.nav__menu a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- LINE template copy ----------
  $$('.flow__copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = '✓ コピーしました';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('is-copied');
        }, 1800);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
        btn.textContent = '✓ コピー済';
        btn.classList.add('is-copied');
      }
    });
  });

  // ---------- Apply / LINE CTA placeholders ----------
  // Replace these URLs when the form / LINE official account is ready.
  const CONFIG = {
    applyUrl: '',  // e.g. 'https://forms.gle/xxxx'
    lineUrl: '',   // e.g. 'https://lin.ee/xxxxxxx'
  };
  $$('[data-action="apply"]').forEach(a => {
    a.addEventListener('click', e => {
      if (!CONFIG.applyUrl) {
        e.preventDefault();
        alert('申込フォームは公開時にここへリンクします。\n（例: Google Form のURL）');
      } else {
        a.href = CONFIG.applyUrl;
      }
    });
  });
  $$('[data-action="line"]').forEach(a => {
    a.addEventListener('click', e => {
      if (!CONFIG.lineUrl) {
        e.preventDefault();
        alert('公式LINEは公開時にここへリンクします。\n（例: https://lin.ee/xxxxx）');
      } else {
        a.href = CONFIG.lineUrl;
      }
    });
  });

  // ---------- Scarcity counter (placeholder) ----------
  // Easy to tweak: set window.SLOTS_LEFT in HTML to override.
  const slots = (typeof window.SLOTS_LEFT === 'number') ? window.SLOTS_LEFT : 10;
  $$('#slotsLeft, #slotsLeft2').forEach(el => { el.textContent = String(slots); });

  // ---------- Reveal on scroll ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    $$('.section__head, .problem, .reason, .mentor, .price, .flow li, .faq details, .story, .gap-callout, .guarantee')
      .forEach(el => io.observe(el));
  } else {
    $$('.section__head, .problem, .reason, .mentor, .price, .flow li, .faq details, .story, .gap-callout, .guarantee')
      .forEach(el => el.classList.add('is-visible'));
  }
})();
