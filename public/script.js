// Al-Alamy Moving & Logistics — Interactive Script & Scroll Enhancements
document.addEventListener('DOMContentLoaded', () => {
  // 1. TOP SCROLL PROGRESS BAR
  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);
  }

  // 2. STICKY HEADER WITH FROSTED BLUR
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');

  // 3. BACK TO TOP BUTTON
  let backToTop = document.querySelector('.back-to-top-btn');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.className = 'back-to-top-btn';
    backToTop.setAttribute('aria-label', 'العودة لأعلى الصفحة');
    backToTop.setAttribute('title', 'العودة لأعلى الصفحة');
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(backToTop);
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Optimized Scroll Listener using RequestAnimationFrame
  let ticking = false;
  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Update progress bar
    if (docHeight > 0) {
      const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // Sticky header styling
    if (header) {
      if (scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Back to top visibility
    if (backToTop) {
      if (scrollY > 320) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // 4. MOBILE NAVIGATION DRAWER
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('is-open');
      menuButton.textContent = isOpen ? '✕' : '☰';
      menuButton.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        mobileNav.style.animation = 'menuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both';
      }
    });

    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('is-open') && !mobileNav.contains(e.target) && e.target !== menuButton) {
        mobileNav.classList.remove('is-open');
        menuButton.textContent = '☰';
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        menuButton.textContent = '☰';
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 5. TOAST NOTIFICATION ENGINE
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  window.showAlalamiToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    const icon = type === 'success' 
      ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
      : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <div class="toast-text">${message}</div>
      <button type="button" class="toast-close" aria-label="إغلاق">✕</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.animation = 'toastOut 0.25s forwards';
      setTimeout(() => toast.remove(), 250);
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.isConnected) {
        toast.style.animation = 'toastOut 0.25s forwards';
        setTimeout(() => toast.remove(), 250);
      }
    }, 4500);
  };

  // 6. TRADITIONAL CIRCULAR FLOATING CONTACTS WIDGET
  const existingContacts = document.querySelector('.floating-contacts');
  if (existingContacts) existingContacts.remove();

  const contacts = document.createElement('aside');
  contacts.className = 'floating-contacts';
  contacts.setAttribute('aria-label', 'التواصل السريع مع العالمي');
  contacts.innerHTML = `
    <a class="floating-contact floating-whatsapp" href="https://wa.me/201033188096" target="_blank" rel="noopener noreferrer" aria-label="واتساب 01033188096" title="واتساب: 01033188096">
      <svg viewBox="0 0 24 24" width="30" height="30" fill="#ffffff" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.65 7.89 8.02 8.48 8.02 9.7C8.02 10.92 8.91 12.09 9.03 12.26C9.16 12.42 10.74 14.86 13.16 15.91C13.74 16.16 14.18 16.31 14.54 16.42C15.12 16.61 15.65 16.58 16.07 16.52C16.54 16.45 17.51 15.93 17.72 15.35C17.92 14.77 17.92 14.28 17.86 14.17C17.8 14.07 17.65 14.01 17.41 13.89C17.17 13.78 16 13.2 15.78 13.12C15.56 13.04 15.4 13 15.24 13.24C15.08 13.48 14.61 14.07 14.47 14.23C14.33 14.39 14.19 14.41 13.95 14.29C13.71 14.17 12.94 13.92 12.02 13.1C11.31 12.46 10.82 11.68 10.68 11.44C10.54 11.2 10.66 11.08 10.78 10.96C10.89 10.85 11.03 10.67 11.15 10.53C11.27 10.39 11.31 10.28 11.39 10.12C11.47 9.96 11.43 9.82 11.37 9.7C11.31 9.58 10.84 8.42 10.64 7.95C10.45 7.49 10.26 7.55 10.12 7.54C9.98 7.53 9.82 7.53 9.66 7.53L9.53 7.34Z"/></svg>
      <span class="floating-tooltip">واتساب</span>
    </a>
    <a class="floating-contact floating-phone" href="tel:+201033188096" aria-label="اتصال هاتفياً 01033188096" title="اتصال: 01033188096">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="#ffffff" aria-hidden="true"><path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/></svg>
      <span class="floating-tooltip">اتصال</span>
    </a>
  `;
  document.body.appendChild(contacts);

  // 7. SMOOTH SCROLL REVEAL & STAGGER ANIMATIONS
  const animatableSelectors = [
    '.reveal',
    '.service-card',
    '.price-card',
    '.team-card',
    '.blog-card',
    '.area-card',
    '.location-benefits > div',
    '.feature-panel',
    '.contact-copy'
  ];
  const itemsToReveal = document.querySelectorAll(animatableSelectors.join(','));

  // Group elements to calculate stagger delay among siblings
  const parentGroups = new Map();
  itemsToReveal.forEach(el => {
    const parent = el.parentElement;
    if (parent) {
      if (!parentGroups.has(parent)) parentGroups.set(parent, []);
      parentGroups.get(parent).push(el);
    }
  });

  parentGroups.forEach(siblings => {
    if (siblings.length > 1) {
      siblings.forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${Math.min(index * 0.08, 0.4)}s`);
      });
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    itemsToReveal.forEach(el => revealObserver.observe(el));
  } else {
    itemsToReveal.forEach(el => el.classList.add('is-visible'));
  }

  // 8. ANIMATED STATS NUMBERS COUNTER
  const statNumbers = document.querySelectorAll('.stat strong');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          counterObserver.unobserve(el);

          const fullText = el.textContent.trim();
          const match = fullText.match(/^([^\d]*)([\d,]+(?:\.\d+)?)([^\d]*)$/);
          if (!match) return;

          const prefix = match[1] || '';
          const rawNum = match[2].replace(/,/g, '');
          const targetValue = parseFloat(rawNum);
          const suffix = match[3] || '';
          if (isNaN(targetValue)) return;

          const hasDecimal = rawNum.includes('.');
          const duration = 1600; // ms
          const startTime = performance.now();

          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease Out Cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = targetValue * easeOut;

            const formatted = hasDecimal ? current.toFixed(1) : Math.round(current).toLocaleString('en-US');
            el.textContent = `${prefix}${formatted}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = fullText;
            }
          };

          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(s => counterObserver.observe(s));
  }

  // 9. INTERACTIVE ACCORDION WITH SMOOTH EXPANSION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('button');
    if (!button) return;

    button.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');

      // Close other accordions in the same list
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const indicator = other.querySelector('button b');
          if (indicator) indicator.textContent = '+';
        }
      });

      item.classList.toggle('open', willOpen);
      const indicator = button.querySelector('b');
      if (indicator) {
        indicator.textContent = willOpen ? '×' : '+';
      }
    });

    // Keyboard navigation
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  // Helper to safely navigate to WhatsApp with encoded message
  const sendToWhatsApp = (message) => {
    const waUrl = `https://wa.me/201033188096?text=${encodeURIComponent(message)}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.isConnected) link.remove();
    }, 300);
  };

  // 10. ENHANCED BOOKING FORM HANDLER
  document.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-booking-form]');
    if (!form) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const status = form.querySelector('.booking-status');
    const phoneInput = form.querySelector('[name="phone"]');

    if (!phoneInput || !phoneInput.value.trim()) {
      if (status) status.textContent = 'يرجى كتابة رقم الهاتف للتواصل.';
      phoneInput?.focus();
      return;
    }

    const data = new FormData(form);
    const area = form.dataset.area || 'غير محددة';
    const moveFrom = data.get('moveFrom') || 'غير محدد';
    const moveTo = data.get('moveTo') || 'غير محدد';
    const furniture = data.get('furniture') || 'عفش وأثاث منزلي متكامل';
    const phone = data.get('phone');

    const formattedMessage = [
      '🚚 *طلب حجز نقل وتغليف أثاث جديد — العالمي*',
      '--------------------------------',
      `📍 *المنطقة / الفرع:* ${area}`,
      `📦 *النقل من:* ${moveFrom}`,
      `🎯 *النقل إلى:* ${moveTo}`,
      `🛋️ *محتويات الأثاث:* ${furniture}`,
      `📞 *رقم العميل:* ${phone}`,
      '--------------------------------',
      '✨ أرجو تأكيد الموعد وإرسال أفضل عرض سعر.'
    ].join('\n');

    if (status) {
      status.textContent = 'جارٍ تحويلك إلى واتساب لإتمام الحجز…';
    }

    window.showAlalamiToast('تم تجهيز طلبك! جارٍ فتح واتساب للتأكيد الفوري مع خدمة العملاء...', 'success');

    setTimeout(() => {
      sendToWhatsApp(formattedMessage);
      if (status) {
        status.textContent = 'تم إرسال الطلب بنجاح إلى واتساب.';
      }
    }, 400);
  }, true);

  // 11. CONTACT & NEWSLETTER FORMS (SENDING SUMMARY TO WHATSAPP)
  document.querySelectorAll('form:not([data-booking-form])').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isNewsletter = form.classList.contains('newsletter-form') || form.closest('.newsletter');
      const status = form.querySelector('.form-status');

      if (isNewsletter) {
        const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input');
        if (!emailInput || !emailInput.value.trim()) {
          window.showAlalamiToast('يرجى إدخال البريد الإلكتروني للاشتراك.', 'info');
          emailInput?.focus();
          return;
        }

        const email = emailInput.value.trim();
        const pageTitle = document.title.replace('— شركة العالمي لنقل وتغليف الأثاث', '').replace('— العالمي للنقل', '').trim() || 'الموقع الرئيسي';

        const formattedMessage = [
          '📰 *طلب اشتراك في النشرة البريدية والعروض الحصرية — العالمي*',
          '--------------------------------',
          `✉️ *البريد الإلكتروني المشترك:* ${email}`,
          `📍 *الصفحة المصدر:* ${pageTitle}`,
          '--------------------------------',
          '✨ أود الاشتراك وتفعيل كود الخصم واستلام أحدث عروض وتخفيضات نقل وتغليف الأثاث.'
        ].join('\n');

        if (status) {
          status.textContent = 'جارٍ توجيهك إلى واتساب لتأكيد الاشتراك…';
        }

        window.showAlalamiToast('شكرًا لاشتراكك! جارٍ تحويلك إلى واتساب لتأكيد الاشتراك وتفعيل كود الخصم...', 'success');

        setTimeout(() => {
          sendToWhatsApp(formattedMessage);
          if (status) {
            status.textContent = 'تم تحويل طلب الاشتراك إلى واتساب بنجاح.';
          }
          form.reset();
        }, 400);

      } else {
        // Contact Form
        const nameInput = form.querySelector('[name="name"]') || form.querySelectorAll('input')[0];
        const phoneInput = form.querySelector('[name="phone"]') || form.querySelectorAll('input')[1];
        const emailInput = form.querySelector('[name="email"]') || form.querySelector('input[type="email"]');
        const subjectInput = form.querySelector('[name="subject"]') || form.querySelectorAll('input')[3];
        const messageInput = form.querySelector('[name="message"]') || form.querySelector('textarea');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const subject = subjectInput ? subjectInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
          if (status) status.textContent = 'يرجى كتابة الاسم والبريد الإلكتروني وتفاصيل الرسالة.';
          window.showAlalamiToast('يرجى ملء الحقول الإلزامية (الاسم، البريد، الرسالة).', 'info');
          return;
        }

        const formattedMessage = [
          '📋 *استفسار ورسالة تواصل جديدة — شركة العالمي لنقل الأثاث*',
          '--------------------------------',
          `👤 *الاسم:* ${name}`,
          `📞 *رقم الهاتف:* ${phone || 'غير مسجل'}`,
          `✉️ *البريد الإلكتروني:* ${email}`,
          `📌 *الموضوع:* ${subject || 'استفسار عام'}`,
          '💬 *نص الرسالة:*',
          message,
          '--------------------------------',
          '✨ أرجو الرد والمتابعة في أقرب وقت متاح.'
        ].join('\n');

        if (status) {
          status.textContent = 'جارٍ تحويلك إلى واتساب لإرسال ملخص الرسالة…';
        }

        window.showAlalamiToast('تم تجهيز بياناتك! جارٍ فتح واتساب للمتابعة المباشرة مع خدمة العملاء...', 'success');

        setTimeout(() => {
          sendToWhatsApp(formattedMessage);
          if (status) {
            status.textContent = 'تم إرسال ملخص الرسالة إلى واتساب بنجاح.';
          }
          form.reset();
        }, 400);
      }
    });
  });

  // 12. SMOOTH SCROLL FOR IN-PAGE ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, targetId);
      }
    });
  });

  // 13. BLOG TAB FILTERING
  const blogTabButtons = document.querySelectorAll('.blog-tab-btn');
  const blogCards = document.querySelectorAll('.blog-grid .blog-card');
  if (blogTabButtons.length > 0 && blogCards.length > 0) {
    blogTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        blogTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.textContent.trim();

        blogCards.forEach(card => {
          const categoryEl = card.querySelector('.eyebrow');
          const category = categoryEl ? categoryEl.textContent.trim() : '';
          const title = card.querySelector('h3')?.textContent || '';

          if (filter === 'جميع المقالات') {
            card.style.display = '';
          } else if (filter === 'أوناش الرفع' && (category.includes('أوناش') || title.includes('ونش'))) {
            card.style.display = '';
          } else if (filter === 'تقنيات التغليف' && (category.includes('تغليف') || title.includes('تغليف'))) {
            card.style.display = '';
          } else if (filter === 'الشيخ زايد وأكتوبر' && (title.includes('زايد') || title.includes('أكتوبر'))) {
            card.style.display = '';
          } else if (filter === 'التجمع والقاهرة الجديدة' && (title.includes('التجمع') || title.includes('القاهرة الجديدة'))) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 14. READING PROGRESS BAR ON ARTICLES
  const articleContainer = document.querySelector('.article-container');
  if (articleContainer) {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.right = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '4px';
    progressBar.style.background = 'var(--red, #e63946)';
    progressBar.style.zIndex = '99999';
    progressBar.style.width = '0%';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const rect = articleContainer.getBoundingClientRect();
      const totalHeight = articleContainer.offsetHeight - window.innerHeight;
      const scrollPosition = -rect.top;
      let progress = 0;
      if (totalHeight > 0) {
        progress = Math.min(Math.max((scrollPosition / totalHeight) * 100, 0), 100);
      }
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }
});

