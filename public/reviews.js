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
  let full = dialog.querySelector('.reviews-full-image');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, active = 0, paused = reduce.matches, hovering = false, visible = false;
  let timer, hideTimer, scrollTimer, opener, startX, startY;
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
  // Keep the image and its caption in one stable, animated frame.
  const stage = dialog.querySelector('.reviews-dialog-stage');
  const caption = dialog.querySelector('.reviews-dialog-caption');
  const counter = dialog.querySelector('.reviews-dialog-count');
  const frame = document.createElement('div');
  frame.className = 'reviews-media-frame';
  const canvas = document.createElement('div');
  canvas.className = 'reviews-image-canvas';
  full.before(frame);
  frame.append(canvas, caption);
  canvas.append(full);
  full.draggable = false;
  const cache = new Map();
  let requested = 0, revision = 0, animations = [], lockedScroll = 0, bodyStyle;
  let wheelAmount = 0, wheelTime = 0, wheelLast = 0;
  const wrap = i => (i + links.length) % links.length;
  const prepare = i => {
    i = wrap(i);
    if (!cache.has(i)) {
      const image = new Image();
      image.decoding = 'async';
      image.src = links[i].href;
      const promise = image.decode().then(() => image).catch(error => {cache.delete(i); throw error;});
      cache.set(i, promise);
    }
    return cache.get(i);
  };
  const warm = i => [i - 1, i + 1].forEach(n => {prepare(n).catch(() => {});});
  const cancelAnimation = () => {animations.forEach(animation => animation.cancel()); animations = [];};
  const animate = async (frames, duration) => {
    if (reduce.matches) return;
    const animation = frame.animate(frames, {duration, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards'});
    animations.push(animation);
    await animation.finished.catch(() => {});
  };
  const show = async (i, direction = 0) => {
    requested = wrap(i);
    const target = requested, ticket = ++revision;
    cancelAnimation();
    dialog.setAttribute('aria-busy', 'true');
    let image;
    try { image = await prepare(target); }
    catch {
      // A failed full-size request must not strand the viewer or mismatch the caption.
      image = new Image();
      image.src = links[target].querySelector('img').src;
      try { await image.decode(); } catch { /* Retain the last successfully displayed image. */ }
      if (!image.naturalWidth) {
        if (ticket === revision) {requested = active; dialog.removeAttribute('aria-busy');}
        return;
      }
    }
    if (ticket !== revision || !dialog.open) return;
    if (direction) await animate([{opacity:1, transform:'translateX(0)'}, {opacity:0, transform:`translateX(${direction * 28}px)`}], 110);
    if (ticket !== revision || !dialog.open) return;
    // Commit all visible metadata only when the decoded image is ready.
    image.className = 'reviews-full-image';
    image.draggable = false;
    image.alt = links[target].querySelector('img').alt;
    canvas.replaceChildren(image);
    full = image;
    caption.textContent = full.alt;
    counter.textContent = `${target + 1} / ${links.length}`;
    active = target;
    dialog.removeAttribute('aria-busy');
    cancelAnimation();
    if (direction) await animate([{opacity:0, transform:`translateX(${-direction * 28}px)`}, {opacity:1, transform:'translateX(0)'}], 230);
    if (ticket !== revision) return;
    cancelAnimation();
    warm(active);
  };
  const navigate = direction => {show(requested + direction, direction);};
  links.forEach((link, i) => link.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || typeof dialog.showModal !== 'function') return;
    e.preventDefault(); opener = link; stop();
    canvas.replaceChildren(); caption.textContent = ''; counter.textContent = '';
    lockedScroll = window.scrollY;
    bodyStyle = {position:document.body.style.position, top:document.body.style.top, width:document.body.style.width, overflow:document.body.style.overflow};
    Object.assign(document.body.style, {position:'fixed', top:`-${lockedScroll}px`, width:'100%', overflow:'hidden'});
    dialog.showModal(); show(i);
    dialog.querySelector('.reviews-close').focus();
    wheelAmount = 0; wheelTime = 0; startX = null;
  }));
  dialog.querySelector('.reviews-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.reviews-dialog-prev').addEventListener('click', () => navigate(-1));
  dialog.querySelector('.reviews-dialog-next').addEventListener('click', () => navigate(1));
  dialog.addEventListener('click', e => {if (e.target === dialog || e.target === stage) dialog.close();});
  dialog.addEventListener('close', () => {
    ++revision; cancelAnimation(); dialog.removeAttribute('aria-busy'); startX = null;
    Object.assign(document.body.style, bodyStyle);
    window.scrollTo({top:lockedScroll, behavior:'instant'});
    opener?.focus({preventScroll:true}); schedule();
  });
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {e.preventDefault(); navigate(e.key === 'ArrowLeft' ? 1 : -1);}
    if (e.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button')];
      if (e.shiftKey && document.activeElement === buttons[0]) {e.preventDefault(); buttons.at(-1).focus();}
      else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {e.preventDefault(); buttons[0].focus();}
    }
  });
  stage.addEventListener('touchstart', e => {
    if(e.touches.length === 1 && !e.target.closest('button') && (window.visualViewport?.scale || 1) <= 1) {
      startX=e.touches[0].clientX; startY=e.touches[0].clientY;
    } else startX=null;
  }, {passive:true});
  stage.addEventListener('touchend', e => {
    if(startX == null) return;
    const dx=e.changedTouches[0].clientX-startX, dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.5) navigate(dx>0?1:-1);
    startX=null;
  }, {passive:true});
  stage.addEventListener('touchcancel', () => {startX=null;}, {passive:true});
  stage.addEventListener('wheel', e => {
    if(e.ctrlKey || (window.visualViewport?.scale || 1)>1) return;
    e.preventDefault();
    const now=performance.now(), gap=now-wheelLast; wheelLast=now;
    if(now-wheelTime<450) return;
    if(gap>160) wheelAmount=0;
    const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?-e.deltaX:e.deltaY;
    wheelAmount+=delta*(e.deltaMode===1?16:e.deltaMode===2?stage.clientHeight:1);
    if(Math.abs(wheelAmount)>55) {navigate(wheelAmount>0?1:-1); wheelTime=now; wheelAmount=0;}
  }, {passive:false});
  labelPause(); update();
})();
