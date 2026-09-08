/* Voyage 1 — production frontend behavior */

function toggleCard(button) {
  const card = button.closest('.dest-card');
  if (!card) return;
  const expanded = card.classList.toggle('expanded');
  button.setAttribute('aria-expanded', String(expanded));
  button.textContent = expanded ? 'Read Less ↑' : 'Read More →';
}

/* Branded loader — once per browsing session, not on every internal page. */
(function () {
  const loader = document.querySelector('[data-site-loader]');
  if (!loader) return;
  let seen = false;
  try { seen = sessionStorage.getItem('voyage-loader-seen') === '1'; } catch (e) {}
  if (seen) {
    document.documentElement.classList.add('vo-loader-skip');
    loader.remove();
    window.dispatchEvent(new CustomEvent('voyage:loader-leaving'));
    return;
  }
  const started = performance.now();
  let hiding = false;
  const hide = () => {
    if (hiding) return;
    hiding = true;
    const wait = Math.max(0, 720 - (performance.now() - started));
    window.setTimeout(() => {
      try { sessionStorage.setItem('voyage-loader-seen', '1'); } catch (e) {}
      loader.classList.add('is-leaving');
      window.dispatchEvent(new CustomEvent('voyage:loader-leaving'));
      window.setTimeout(() => loader.remove(), 700);
    }, wait);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hide, { once: true });
  else hide();
  window.setTimeout(hide, 2200);
})();

/* Accessible copy helper used by static enquiry forms. */
async function copyVoyageText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {}
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (e) { return false; }
}

function showFormStatus(form, message, copyText) {
  let box = form.querySelector('.vo-form-status');
  if (!box) {
    box = document.createElement('div');
    box.className = 'vo-form-status';
    box.setAttribute('role', 'status');
    form.appendChild(box);
  }
  box.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = message;
  box.appendChild(span);
  if (copyText) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Copy enquiry';
    button.addEventListener('click', async () => {
      const ok = await copyVoyageText(copyText);
      button.textContent = ok ? 'Copied ✓' : 'Select and copy manually';
    });
    box.appendChild(button);
  }
}

function wireEnquiryForms() {
  document.querySelectorAll('form#contact-enquiry-form, form#uae-enquiry-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      const lines = [];
      data.forEach((value, key) => {
        const clean = String(value).trim();
        if (clean) lines.push(key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()) + ': ' + clean);
      });
      const destination = form.dataset.destination || '';
      const subject = form.dataset.subject || (destination ? destination + ' Journey Enquiry — Voyage 1' : 'New Enquiry — Voyage 1');
      const body = 'Hello Voyage 1 Team,\n\nI would like to enquire about the following:\n\n' + lines.join('\n') + '\n\nThank you.';
      const mailto = 'mailto:info@voyage-one.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      showFormStatus(form, 'Your enquiry is ready. Your email app should open now; if it does not, use “Copy enquiry” and email info@voyage-one.com.', body);
      await copyVoyageText(body);
      window.location.href = mailto;
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  /* Career links can carry a role into the shared enquiry form. */
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  const subject = params.get('subject');
  const requirements = document.getElementById('requirements');
  if (requirements && (role || subject)) {
    requirements.value = (role ? 'Career enquiry — ' + role : 'Career enquiry') + '\n\nI would like to learn more about opportunities at Voyage 1.';
  }

  /* Native AOS-compatible reveal engine: smooth, no external dependency. */
  const revealItems = Array.from(document.querySelectorAll('[data-aos]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  revealItems.forEach((item) => {
    const rawDelay = parseInt(item.getAttribute('data-aos-delay') || '0', 10);
    const rawDuration = parseInt(item.getAttribute('data-aos-duration') || '900', 10);
    item.style.setProperty('--vo-delay', Math.min(Math.max(rawDelay || 0, 0), 520) + 'ms');
    item.style.setProperty('--vo-duration', Math.min(Math.max(rawDuration || 900, 700), 1250) + 'ms');
    if (!item.hasAttribute('data-aos-delay')) {
      const row = item.parentElement;
      if (row && row.children.length > 1 && row.children.length <= 10) {
        const i = Array.prototype.indexOf.call(row.children, item);
        item.style.setProperty('--vo-delay', Math.min(i * 60, 300) + 'ms');
      }
    }
  });
  if (reduceMotion) revealItems.forEach(item => item.classList.add('aos-animate'));
  else {
    document.querySelectorAll('section[data-aos]').forEach((section) => {
      if (section.querySelector('[data-aos]')) section.classList.add('vo-reveal-shell', 'aos-animate');
    });
    revealItems.filter(item => item.closest('.hero') || item.classList.contains('service-strip')).forEach(item => item.classList.add('aos-animate'));
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(() => entry.target.classList.add('aos-animate'));
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    revealItems.forEach(item => { if (!item.classList.contains('aos-animate')) observer.observe(item); });
  }

  /* FAQ accordion. */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((other) => {
        if (other === item) return;
        other.classList.remove('is-open');
        other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', !open);
      trigger.setAttribute('aria-expanded', String(!open));
    });
  });

  /* Sticky header shadow + scroll-direction reveal. */
  const header = document.querySelector('.vo-header');
  if (header) {
    let lastScrollY = Math.max(0, window.scrollY || 0);
    let ticking = false;
    const sync = () => {
      const y = Math.max(0, window.scrollY || 0);
      header.classList.toggle('is-scrolled', y > 8);

      const menuOpen = !!header.querySelector('.navbar-collapse.show');
      if (y <= 12 || y < lastScrollY - 3) {
        header.classList.remove('vo-nav-hidden');
      } else if (y > 120 && y > lastScrollY + 3 && !menuOpen) {
        header.classList.add('vo-nav-hidden');
      }
      lastScrollY = y;
      ticking = false;
    };
    sync();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    }, { passive: true });
  }

  /* Desktop dropdowns are hover/focus only; tablet/phone use Bootstrap click. */
  const dropdownToggles = Array.from(document.querySelectorAll('.vo-header .dropdown-toggle'));
  const syncDropdownMode = () => {
    const desktop = window.innerWidth >= 992;
    dropdownToggles.forEach((toggle) => {
      if (desktop) {
        if (!toggle.dataset.bsToggleSaved) toggle.dataset.bsToggleSaved = toggle.getAttribute('data-bs-toggle') || 'dropdown';
        toggle.removeAttribute('data-bs-toggle');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.nextElementSibling?.classList.remove('show');
      } else {
        toggle.setAttribute('data-bs-toggle', toggle.dataset.bsToggleSaved || 'dropdown');
      }
    });
  };
  syncDropdownMode();
  window.addEventListener('resize', syncDropdownMode, { passive: true });

  /* Parent dropdown labels are real links too. On tablet/phone the first tap
     opens the submenu; tapping the already-open parent again follows its page link. */
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      if (window.innerWidth >= 992) return;
      const menu = toggle.nextElementSibling;
      const href = toggle.getAttribute('href');
      if (!href || href === '#' || !menu?.classList.contains('show')) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.href = href;
    });
  });

  /* Close mobile navbar after a real navigation choice. */
  const navCollapse = document.getElementById('voyageNavbar');
  if (navCollapse && window.bootstrap) {
    navCollapse.querySelectorAll('a:not(.dropdown-toggle)').forEach((link) => link.addEventListener('click', () => {
      if (window.innerWidth < 992 && navCollapse.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    }));
  }

  wireEnquiryForms();
});

/* Home hero slider — opening film + destination images. */
(function () {
  const slider = document.querySelector('[data-hero-slider]');
  if (!slider) return;
  const hero = slider.closest('.hero');
  const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
  const controls = document.querySelector('[data-hero-controls]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const IMAGE_DURATION = 5000;
  let index = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
  let timer = null;
  const stop = () => { if (timer) clearTimeout(timer); timer = null; };
  const typeOf = s => s?.dataset.slideType || 'image';
  const videoOf = s => s?.querySelector('[data-hero-video]') || null;

  const updateControls = () => controls?.querySelectorAll('.hero-slider-line').forEach((button, i) => {
    const active = i === index; button.classList.toggle('is-active', active); button.setAttribute('aria-current', active ? 'true' : 'false');
  });
  const refreshText = () => {
    const content = hero?.querySelector('.hero-content'); if (!content) return;
    content.classList.remove('hero-content-refresh'); void content.offsetWidth; content.classList.add('hero-content-refresh');
  };
  const schedule = () => {
    stop(); if (document.hidden || typeOf(slides[index]) !== 'image') return;
    timer = setTimeout(() => show(index + 1, 'auto'), IMAGE_DURATION);
  };
  const playVideo = (restart) => {
    const video = videoOf(slides[index]); if (!video) return;
    video.controls = false; video.removeAttribute('controls'); video.muted = true; video.defaultMuted = true;
    if (restart) { try { video.currentTime = 0; } catch (e) {} }
    if (document.querySelector('[data-site-loader]:not(.is-leaving)')) { video.pause(); return; }
    if (reduced.matches) { timer = setTimeout(() => show(index + 1, 'reduced'), IMAGE_DURATION); return; }
    const p = video.play(); if (p?.catch) p.catch(() => { timer = setTimeout(() => show(index + 1, 'fallback'), IMAGE_DURATION); });
  };
  function show(next, reason) {
    stop(); const ni = (next + slides.length) % slides.length;
    if (ni === index) { if (typeOf(slides[index]) === 'video' && reason === 'user') playVideo(true); else schedule(); return; }
    videoOf(slides[index])?.pause(); slides[index].classList.remove('is-active'); slides[index].setAttribute('aria-hidden', 'true');
    index = ni; slides[index].classList.add('is-active'); slides[index].setAttribute('aria-hidden', 'false');
    const video = typeOf(slides[index]) === 'video'; hero?.classList.toggle('is-video-active', video); updateControls(); refreshText();
    if (video) playVideo(true); else schedule();
  }
  if (controls) {
    controls.innerHTML = '';
    slides.forEach((slide, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'hero-slider-line';
      b.setAttribute('aria-label', 'Show ' + (typeOf(slide) === 'video' ? 'opening film' : (slide.dataset.label || 'slide ' + (i + 1))));
      b.addEventListener('click', () => show(i, 'user')); controls.appendChild(b);
    });
  }
  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    const v = videoOf(slide); if (v) v.addEventListener('ended', () => { if (slides[index] === slide) show(index + 1, 'video-ended'); });
  });
  hero?.classList.toggle('is-video-active', typeOf(slides[index]) === 'video'); updateControls();
  const start = () => typeOf(slides[index]) === 'video' ? playVideo(true) : schedule();
  if (!document.querySelector('[data-site-loader]:not(.is-leaving)')) start();
  window.addEventListener('voyage:loader-leaving', start, { once: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); videoOf(slides[index])?.pause(); } else { typeOf(slides[index]) === 'video' ? playVideo(false) : schedule(); } });
})();

/* Testimonials — same finite, wrapping carousel behavior as the destination gallery. */
(function(){
  const slider=document.querySelector('[data-testimonial-slider]');
  if(!slider) return;
  const viewport=slider.querySelector('.testimonial-viewport');
  const track=slider.querySelector('.testimonial-track');
  const slides=Array.from(track?.querySelectorAll('.testimonial-slide')||[]);
  const prev=slider.querySelector('[data-testimonial-prev]');
  const next=slider.querySelector('[data-testimonial-next]');
  if(!viewport||!track||!slides.length) return;

  let index=0;

  const visibleCount=()=>{
    if(window.innerWidth<=600) return 1;
    if(window.innerWidth<=900) return 2;
    return 3;
  };

  const maxIndex=()=>Math.max(0,slides.length-visibleCount());

  const update=()=>{
    index=Math.min(index,maxIndex());
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    const step=(slides[0]?.getBoundingClientRect().width||0)+gap;
    track.style.transform=`translate3d(${-index*step}px,0,0)`;

    slides.forEach((slide,i)=>{
      const active=i>=index && i<index+visibleCount();
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',String(!active));
      if(!active) slide.querySelectorAll('video').forEach(video=>video.pause());
    });
  };

  const go=(dir)=>{
    const max=maxIndex();
    if(!max) return;
    index+=dir;
    if(index<0) index=max;
    if(index>max) index=0;
    update();
  };

  prev?.addEventListener('click',()=>go(-1));
  next?.addEventListener('click',()=>go(1));

  viewport.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
    if(e.key==='ArrowRight'){e.preventDefault();go(1);}
  });

  window.addEventListener('resize',()=>requestAnimationFrame(update));
  update();
})();


/* Selected work carousel — all destination countries, 3/2/1 visible responsively. */
(function(){
  const slider=document.querySelector('[data-cases-slider]');
  if(!slider) return;
  const viewport=slider.querySelector('.cases-viewport');
  const track=slider.querySelector('.cases-track');
  const slides=Array.from(track?.querySelectorAll('.case')||[]);
  const prev=slider.querySelector('[data-cases-prev]');
  const next=slider.querySelector('[data-cases-next]');
  if(!viewport||!track||!slides.length) return;
  let index=0;
  const visibleCount=()=>window.innerWidth<=600?1:(window.innerWidth<=900?2:3);
  const maxIndex=()=>Math.max(0,slides.length-visibleCount());
  const update=()=>{
    index=Math.min(index,maxIndex());
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    const step=(slides[0]?.getBoundingClientRect().width||0)+gap;
    track.style.transform=`translate3d(${-index*step}px,0,0)`;
    slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',String(!(i>=index&&i<index+visibleCount()))));
  };
  const go=(dir)=>{
    const max=maxIndex(); if(!max) return;
    index+=dir; if(index<0) index=max; if(index>max) index=0; update();
  };
  prev?.addEventListener('click',()=>go(-1));
  next?.addEventListener('click',()=>go(1));
  viewport.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();go(-1)} if(e.key==='ArrowRight'){e.preventDefault();go(1)}});
  window.addEventListener('resize',()=>requestAnimationFrame(update));
  update();
})();

/* ===== Destination gallery carousel + image/video lightbox ===== */
(function(){
  const gallery=document.querySelector('[data-gallery-slider]');
  if(!gallery) return;
  const viewport=gallery.querySelector('.gallery-viewport');
  const track=gallery.querySelector('.gallery-track');
  const slides=Array.from(track.querySelectorAll('.gallery-slide'));
  const prev=gallery.querySelector('[data-gallery-prev]');
  const next=gallery.querySelector('[data-gallery-next]');
  let index=0;

  const visibleCount=()=>{
    if(window.innerWidth<=600) return 1;
    if(window.innerWidth<=900) return 2;
    return 3;
  };
  const maxIndex=()=>Math.max(0,slides.length-visibleCount());
  const update=()=>{
    index=Math.min(index,maxIndex());
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    const step=(slides[0]?.getBoundingClientRect().width||0)+gap;
    track.style.transform=`translate3d(${-index*step}px,0,0)`;
  };
  const go=(dir)=>{
    const max=maxIndex();
    if(!max) return;
    index+=dir;
    if(index<0) index=max;
    if(index>max) index=0;
    update();
  };
  prev?.addEventListener('click',()=>go(-1));
  next?.addEventListener('click',()=>go(1));
  viewport?.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}
    if(e.key==='ArrowRight'){e.preventDefault();go(1)}
  });
  window.addEventListener('resize',()=>requestAnimationFrame(update));
  update();
})();

/* ===== Shared media lightbox gallery ===== */
(function(){
  const lightbox=document.querySelector('[data-vo-lightbox]');
  if(!lightbox) return;
  const content=lightbox.querySelector('[data-lightbox-content]');
  const caption=lightbox.querySelector('[data-lightbox-caption]');
  const count=lightbox.querySelector('[data-lightbox-count]');
  const closeButtons=lightbox.querySelectorAll('[data-lightbox-close]');
  const lbPrev=lightbox.querySelector('[data-lightbox-prev]');
  const lbNext=lightbox.querySelector('[data-lightbox-next]');
  let lightboxGroup='';
  let current=0;
  let lastFocus=null;

  const mediaItems=()=>Array.from(document.querySelectorAll(
    `[data-lightbox-type][data-lightbox-src][data-lightbox-group="${lightboxGroup}"]`
  ));

  const render=(direction=0)=>{
    const items=mediaItems();
    if(!items.length) return;

    current=(current+items.length)%items.length;
    const item=items[current];
    const type=item.dataset.lightboxType;
    const src=item.dataset.lightboxSrc;
    const title=item.dataset.lightboxTitle ||
      item.closest('.testimonial')?.querySelector('.person')?.textContent?.trim() ||
      'Preview';

    content.classList.remove('vo-lightbox-slide-left','vo-lightbox-slide-right');
    void content.offsetWidth;
    if(direction < 0) content.classList.add('vo-lightbox-slide-left');
    if(direction > 0) content.classList.add('vo-lightbox-slide-right');

    content.innerHTML='';

    if(type==='video'){
      const video=document.createElement('video');
      video.controls=true;
      video.autoplay=true;
      video.playsInline=true;
      video.preload='metadata';
      video.setAttribute('aria-label',title);
      const poster=item.dataset.lightboxPoster;
      if(poster) video.poster=poster;
      video.src=src;
      content.appendChild(video);
      video.play().catch(()=>{});
    }else{
      const img=document.createElement('img');
      img.src=src;
      img.alt=title;
      img.decoding='async';
      content.appendChild(img);
    }

    if(caption) caption.textContent=title;
    if(count) count.textContent=`${current+1} / ${items.length}`;
    lbPrev.hidden=items.length<2;
    lbNext.hidden=items.length<2;
  };

  const open=(item)=>{
    lightboxGroup=item.dataset.lightboxGroup || '';
    const items=mediaItems();
    current=Math.max(0,items.indexOf(item));
    lastFocus=document.activeElement;

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('vo-lightbox-open');
    render();
    lightbox.querySelector('.vo-lightbox-close')?.focus();
  };

  const close=()=>{
    const video=content.querySelector('video');
    if(video){
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    content.innerHTML='';
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('vo-lightbox-open');
    lightboxGroup='';
    lastFocus?.focus?.();
  };

  const move=(dir)=>{
    const items=mediaItems();
    if(items.length<2) return;
    current=(current+dir+items.length)%items.length;
    render(dir);
  };

  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-lightbox-type][data-lightbox-src]');
    if(trigger){
      e.preventDefault();
      open(trigger);
    }
  });

  closeButtons.forEach(b=>b.addEventListener('click',close));
  lbPrev?.addEventListener('click',()=>move(-1));
  lbNext?.addEventListener('click',()=>move(1));

  content.addEventListener('click',e=>e.stopPropagation());

  document.addEventListener('keydown',e=>{
    if(!lightbox.classList.contains('is-open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') move(-1);
    if(e.key==='ArrowRight') move(1);
  });
})();
/* Luxury interaction polish — tactile click state + viewport-friendly image motion. */
document.addEventListener('pointerdown', function (event) {
  const target = event.target.closest('.btn, .cases-arrow, .testimonial-arrow, .gallery-arrow, .hero-slider-line');
  if (!target) return;
  target.classList.add('is-pressed');
  window.setTimeout(() => target.classList.remove('is-pressed'), 180);
}, { passive: true });

/* ===== Media event slider — one event visible at a time ===== */
(function(){
  const slider=document.querySelector('[data-event-slider]');
  if(!slider) return;
  const viewport=slider.querySelector('.event-slider-viewport');
  const track=slider.querySelector('.event-slider-track');
  const slides=Array.from(track?.querySelectorAll('.event-slide')||[]);
  const prev=slider.querySelector('[data-event-prev]');
  const next=slider.querySelector('[data-event-next]');
  const current=slider.querySelector('[data-event-current]');
  const total=slider.querySelector('[data-event-total]');
  if(!viewport||!track||!slides.length) return;
  let index=0;
  if(total) total.textContent=String(slides.length).padStart(2,'0');
  const update=()=>{
    index=Math.max(0,Math.min(index,slides.length-1));
    track.style.transform=`translate3d(${-index*100}%,0,0)`;
    slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));
    if(current) current.textContent=String(index+1).padStart(2,'0');
    if(prev) prev.disabled=slides.length<=1;
    if(next) next.disabled=slides.length<=1;
  };
  const go=(dir)=>{
    if(slides.length<=1) return;
    index=(index+dir+slides.length)%slides.length;
    update();
  };
  prev?.addEventListener('click',()=>go(-1));
  next?.addEventListener('click',()=>go(1));
  viewport.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
    if(e.key==='ArrowRight'){e.preventDefault();go(1);}
  });
  update();
})();


/* ===== Contact office tabs ===== */
(function(){
  const panel=document.querySelector('[data-office-panel]');
  if(!panel) return;
  const tabs=Array.from(panel.querySelectorAll('[data-office-tab]'));
  const name=panel.querySelector('[data-office-name]');
  const address=panel.querySelector('[data-office-address]');
  const map=panel.querySelector('[data-office-map]');
  if(!tabs.length||!name||!address||!map) return;

  const offices={
    dubai:{
      name:'Dubai',
      eyebrow:'Global Office',
      address:'#73, G Floor, Al Fahidi Plaza Souq Al Kabeer, Dubai, UAE',
      map:'https://maps.google.com/?q=73+G+Floor+Al+Fahidi+Plaza+Souq+Al+Kabeer+Dubai+UAE'
    },
    georgia:{
      name:'Georgia',
      eyebrow:'Regional Office',
      address:'#7, 01 Floor, Vere Business Center 120/2, L2, Tbilisi, Georgia',
      map:'https://maps.google.com/?q=Vere+Business+Center+Tbilisi+Georgia'
    },
    almaty:{
      name:'Almaty',
      eyebrow:'Regional Office',
      address:'Al-Farabi Avenue Business Center 120/62, Almaty 050044, Kazakhstan',
      map:'https://maps.google.com/?q=Al-Farabi+Avenue+120%2F62+Almaty+Kazakhstan'
    },
    baku:{
      name:'Baku',
      eyebrow:'Regional Office',
      address:'#3, G Floor, Icherisheher, Qasr Street, 50 Donga 1, Baku, Azerbaijan',
      map:'https://maps.google.com/?q=Icherisheher+Qasr+Street+Baku+Azerbaijan'
    },
    japan:{
      name:'Japan',
      eyebrow:'Regional Office',
      address:'2-6-6 Hitotsubashi, Chiyoda-ku, Tokyo 101-0003, Japan',
      map:'https://maps.google.com/?q=2-6-6+Hitotsubashi+Chiyoda+Tokyo+Japan'
    },
    vietnam:{
      name:'Vietnam',
      eyebrow:'Regional Office',
      address:'R18, 5th Floor, 71 Nguyen Chi Thanh Street, Giang Vo Ward, Hanoi, Vietnam',
      map:'https://maps.google.com/?q=71+Nguyen+Chi+Thanh+Hanoi+Vietnam'
    },
    kenya:{
      name:'Kenya',
      eyebrow:'Regional Office',
      address:'Thome, Off Northern Bypass, Nairobi, Kenya',
      map:'https://maps.google.com/?q=Thome+Northern+Bypass+Nairobi+Kenya'
    },
    tanzania:{
      name:'Tanzania',
      eyebrow:'Destination Office',
      address:'Tanzania destination operations — contact the Voyage 1 team for local office details.',
      map:'https://maps.google.com/?q=Voyage+1+DMC+Tanzania'
    },
    'south-africa':{
      name:'South Africa',
      eyebrow:'Destination Office',
      address:'South Africa destination operations — contact the Voyage 1 team for local office details.',
      map:'https://maps.google.com/?q=Voyage+1+DMC+South+Africa'
    }
  };

  function select(key){
    const office=offices[key]||offices.dubai;
    tabs.forEach(tab=>{
      const active=tab.dataset.officeTab===key;
      tab.classList.toggle('active',active);
      tab.setAttribute('aria-selected',String(active));
    });
    const detail=panel.querySelector('.office-detail');
    if(detail){
      detail.classList.remove('is-changing');
      void detail.offsetWidth;
      detail.classList.add('is-changing');
    }
    name.textContent=office.name;
    address.textContent=office.address;
    map.href=office.map;
  }

  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>select(tab.dataset.officeTab));
    tab.addEventListener('keydown',e=>{
      if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return;
      e.preventDefault();
      const i=tabs.indexOf(tab);
      const next=(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      tabs[next].focus();
      select(tabs[next].dataset.officeTab);
    });
  });
})();

/* VO_TEAM_PROFILE_NAV */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.team-card[data-profile]').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (event) {
      if (event.target.closest('a')) return;
      var target = card.getAttribute('data-profile');
      if (target) window.location.href = target;
    });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        var target = card.getAttribute('data-profile');
        if (target) window.location.href = target;
      }
    });
  });
});
