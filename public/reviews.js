(() => {
  'use strict';
  const section = document.querySelector('#customer-reviews');
  if (!section) return;
  const carousel = section.querySelector('.reviews-carousel');
  const track = section.querySelector('.reviews-track');
  const cards = [...track.querySelectorAll('.review-card')];
  const links = cards.map(card => card.querySelector('a'));
  const prev = section.querySelector('.reviews-prev');
  const next = section.querySelector('.reviews-next');
  const pause = section.querySelector('.reviews-pause');
  const dialog = document.querySelector('.reviews-dialog');
  const full = dialog.querySelector('.reviews-full-image');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, active = 0, paused = reduce.matches, hovering = false, visible = false;
  let timer, hideTimer, scrollTimer, opener, oldOverflow, startX, startY;
  const nearest = () => {
    const edge = track.getBoundingClientRect().right;
    return cards.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().right - edge) < Math.abs(cards[best].getBoundingClientRect().right - edge) ? i : best, 0);
  };
  const atEnd = () => Math.abs(track.scrollLeft) >= track.scrollWidth - track.clientWidth - 4;
  const update = () => {
    index = nearest();
    section.querySelector('.reviews-count').textContent = `${index + 1} / ${cards.length}`;
    prev.disabled = Math.abs(track.scrollLeft) < 4;
    next.disabled = atEnd();
  };
  const go = i => {
    const target = cards[Math.max(0, Math.min(cards.length - 1, i))];
    const distance = target.getBoundingClientRect().right - track.getBoundingClientRect().right;
    track.scrollBy({left: distance, behavior: reduce.matches ? 'instant' : 'smooth'});
  };
  const stop = () => clearInterval(timer);
  const schedule = () => {
    stop();
    if (paused || hovering || !visible || document.hidden || dialog.open || section.contains(document.activeElement)) return;
    timer = setInterval(() => go(atEnd() ? 0 : nearest() + 1), 5000);
  };
  const revealControls = () => {
    carousel.classList.add('controls-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => carousel.classList.remove('controls-visible'), 2200);
  };
  const labelPause = () => {
    pause.textContent = paused ? 'تشغيل الحركة التلقائية' : 'إيقاف الحركة التلقائية';
    pause.setAttribute('aria-pressed', String(paused));
  };
  [prev, next, section.querySelector('.reviews-controls')].forEach(el => el.hidden = false);
  prev.addEventListener('click', () => {go(nearest() - 1); schedule();});
  next.addEventListener('click', () => {go(nearest() + 1); schedule();});
  pause.addEventListener('click', () => {paused = !paused; labelPause(); schedule();});
  track.addEventListener('scroll', () => {clearTimeout(scrollTimer); scrollTimer = setTimeout(update, 100);}, {passive:true});
  carousel.addEventListener('pointermove', revealControls);
  carousel.addEventListener('pointerdown', () => {stop(); revealControls();});
  window.addEventListener('pointerup', schedule);
  carousel.addEventListener('mouseenter', () => {hovering = true; stop();});
  carousel.addEventListener('mouseleave', () => {hovering = false; schedule();});
  section.addEventListener('focusin', stop);
  section.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reduce.addEventListener('change', () => {paused = reduce.matches; labelPause(); schedule();});
  new IntersectionObserver(entries => {visible = entries[0].isIntersecting; schedule();}, {threshold:.15}).observe(carousel);
  window.addEventListener('resize', update);
  const show = i => {
    active = (i + links.length) % links.length;
    full.src = links[active].href;
    full.alt = links[active].querySelector('img').alt;
    dialog.querySelector('.reviews-dialog-caption').textContent = full.alt;
    dialog.querySelector('.reviews-dialog-count').textContent = `${active + 1} / ${links.length}`;
  };
  links.forEach((link, i) => link.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || typeof dialog.showModal !== 'function') return;
    e.preventDefault(); opener = link; stop(); show(i);
    oldOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    dialog.querySelector('.reviews-close').focus();
  }));
  dialog.querySelector('.reviews-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.reviews-dialog-prev').addEventListener('click', () => show(active - 1));
  dialog.querySelector('.reviews-dialog-next').addEventListener('click', () => show(active + 1));
  dialog.addEventListener('click', e => {if (e.target === dialog || e.target.classList.contains('reviews-dialog-stage')) dialog.close();});
  dialog.addEventListener('close', () => {document.body.style.overflow = oldOverflow; opener?.focus({preventScroll:true}); schedule();});
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); show(active + (e.key === 'ArrowLeft' ? 1 : -1));}
    if (e.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button')];
      if (e.shiftKey && document.activeElement === buttons[0]) {e.preventDefault(); buttons.at(-1).focus();}
      else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {e.preventDefault(); buttons[0].focus();}
    }
  });
  dialog.addEventListener('touchstart', e => {if(e.touches.length === 1) {startX=e.touches[0].clientX;startY=e.touches[0].clientY;} else startX=null;}, {passive:true});
  dialog.addEventListener('touchend', e => {
    if(startX == null) return;
    const dx=e.changedTouches[0].clientX-startX, dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) show(active+(dx>0?1:-1));
    startX=null;
  }, {passive:true});
  labelPause(); update();
})();
