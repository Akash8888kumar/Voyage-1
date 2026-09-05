
/* Voyage 1 site loader — shown once per browsing session, not on every internal page. */
(function(){
  const loader = document.querySelector('[data-site-loader]');
  if (!loader) return;

  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem('voyage-loader-seen') === '1'; } catch (e) {}

  if (alreadySeen) {
    document.documentElement.classList.add('vo-loader-skip');
    document.documentElement.classList.remove('vo-is-loading');
    loader.remove();
    return;
  }

  const startedAt = performance.now();
  const minimumDisplay = 720;
  let hiding = false;
  document.documentElement.classList.add('vo-is-loading');

  const hideLoader = () => {
    if (hiding) return;
    hiding = true;
    const elapsed = performance.now() - startedAt;
    window.setTimeout(() => {
      try { sessionStorage.setItem('voyage-loader-seen', '1'); } catch (e) {}
      loader.classList.add('is-leaving');
      document.documentElement.classList.remove('vo-is-loading');
      window.dispatchEvent(new CustomEvent('voyage:loader-leaving'));
      window.setTimeout(() => loader.remove(), 700);
    }, Math.max(0, minimumDisplay - elapsed));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader, { once: true });
  } else {
    hideLoader();
  }

  // Never let a slow remote resource keep the page covered.
  window.setTimeout(hideLoader, 2200);
})();

/* Static-site CTA fallbacks: enquiry forms open the visitor's mail client; video testimonial buttons open the local video when no lightbox is available. */
function wireStaticCtas() {
  document.querySelectorAll('form#contact-enquiry-form, form#uae-enquiry-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) lines.push(key.replace(/_/g, ' ')+': '+String(value).trim());
      });
      const subject = form.id === 'uae-enquiry-form' ? 'UAE Journey Enquiry — Voyage 1' : 'New Enquiry — Voyage 1';
      const body = 'Hello Voyage 1 Team,\\n\\nI would like to enquire about the following:\\n\\n' + lines.join('\\n') + '\\n\\nThank you.';
      window.location.href = 'mailto:info@voyage-one.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  });
}

/* Voyage 1 — shared frontend behavior */

function toggleCard(button) {
  const card = button.closest('.dest-card');
  if (!card) return;
  const expanded = card.classList.toggle('expanded');
  button.setAttribute('aria-expanded', String(expanded));
  button.textContent = expanded ? 'Read Less ↑' : 'Read More →';
}


document.addEventListener('DOMContentLoaded', wireStaticCtas);

document.addEventListener('DOMContentLoaded', function () {
  // Career links can carry a role/subject into the shared enquiry form.
  var params = new URLSearchParams(window.location.search);
  var role = params.get('role');
  var subject = params.get('subject');
  var requirements = document.getElementById('requirements');
  if (requirements && (role || subject)) {
    var label = role ? 'Career enquiry — ' + role : 'Career enquiry';
    requirements.value = label + '\n\nI would like to learn more about opportunities at Voyage 1.';
    requirements.focus({ preventScroll: true });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Native reveal engine. The class is placed in <head> before first paint, so nothing flashes or snaps.
  const revealItems = Array.from(document.querySelectorAll('[data-aos]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  revealItems.forEach(function (item) {
    const rawDelay = parseInt(item.getAttribute('data-aos-delay') || '0', 10);
    const rawDuration = parseInt(item.getAttribute('data-aos-duration') || '900', 10);
    const delay = Number.isFinite(rawDelay) ? Math.min(Math.max(rawDelay, 0), 520) : 0;
    const duration = Number.isFinite(rawDuration) ? Math.min(Math.max(rawDuration, 700), 1250) : 900;
    item.style.setProperty('--vo-reveal-delay', delay + 'ms');
    item.style.setProperty('--vo-reveal-duration', duration + 'ms');

    // Repeated cards enter in a gentle sequence instead of appearing as one abrupt block.
    if (!item.hasAttribute('data-aos-delay')) {
      const row = item.parentElement;
      if (row && row.children.length > 1 && row.children.length <= 10) {
        const siblingIndex = Array.prototype.indexOf.call(row.children, item);
        item.style.setProperty('--vo-reveal-delay', Math.min(siblingIndex * 65, 325) + 'ms');
      }
    }
  });

  if (reduceMotion || !revealItems.length) {
    revealItems.forEach(function (item) { item.classList.add('aos-animate'); });
  } else {
    document.documentElement.classList.add('js-reveal');

    // A section that contains separately animated children acts only as a shell.
    // This prevents a hidden parent from making its child animation appear to jump in suddenly.
    document.querySelectorAll('section[data-aos]').forEach(function(section) {
      const nested = section.querySelector('[data-aos]');
      if (nested) {
        section.classList.add('vo-reveal-shell', 'aos-animate');
      }
    });

    // Hero and service strip use their own transitions and should be immediately paintable.
    revealItems.filter(function(item) {
      return item.closest('.hero') || item.classList.contains('service-strip');
    }).forEach(function(item) {
      item.classList.add('aos-animate');
    });

    const reveal = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        window.requestAnimationFrame(function() {
          entry.target.classList.add('aos-animate');
        });
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    revealItems.forEach(function(item) {
      if (item.classList.contains('aos-animate')) return;
      reveal.observe(item);
    });
  }

  // FAQ accordion.
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        if (openItem === item) return;
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Sticky header shadow. Bootstrap owns navbar collapse/dropdown behavior.
  const header = document.querySelector('.vo-header');
  if (header) {
    const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  // Collapse the mobile Bootstrap navbar after selecting a real destination/page link.
  const navCollapse = document.getElementById('voyageNavbar');
  if (navCollapse && window.bootstrap) {
    navCollapse.querySelectorAll('a:not(.dropdown-toggle)').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
        }
      });
    });
  }

  // Keep frontend validation active without adding backend behavior.
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
      }
    });
  });
});

/* Home hero slider — true layered 100vh slides with opening video. */
(function(){
  const slider = document.querySelector('[data-hero-slider]');
  if (!slider) return;

  const hero = slider.closest('.hero');
  const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
  const controls = document.querySelector('[data-hero-controls]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const IMAGE_DURATION = 5000;
  let index = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
  let timer = null;

  const typeOf = slide => slide?.dataset.slideType || 'image';
  const activeVideo = slide => slide?.querySelector('[data-hero-video]') || null;

  const stopTimer = () => {
    if (timer) window.clearTimeout(timer);
    timer = null;
  };

  const updateControls = () => {
    if (!controls) return;
    controls.querySelectorAll('.hero-slider-line').forEach((button, i) => {
      const active = i === index;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const refreshHeroContent = () => {
    const content = hero?.querySelector('.hero-content');
    if (!content) return;
    content.classList.remove('hero-content-refresh');
    void content.offsetWidth;
    content.classList.add('hero-content-refresh');
  };

  const scheduleNext = () => {
    stopTimer();
    if (document.hidden) return;
    if (typeOf(slides[index]) !== 'image') return;
    timer = window.setTimeout(() => show(index + 1, { reason: 'auto' }), IMAGE_DURATION);
  };

  const playCurrentVideo = (restart = false) => {
    const slide = slides[index];
    if (typeOf(slide) !== 'video') return;
    const video = activeVideo(slide);
    if (!video) return;

    video.controls = false;
    video.removeAttribute('controls');
    video.muted = true;
    video.defaultMuted = true;

    if (restart) {
      try { video.currentTime = 0; } catch (e) {}
    }

    // Wait until the loader starts leaving so the visitor sees the film from frame one.
    const loaderVisible = Boolean(document.querySelector('[data-site-loader]:not(.is-leaving)'));
    if (loaderVisible) {
      video.pause();
      try { video.currentTime = 0; } catch (e) {}
      return;
    }

    if (reduced.matches) {
      video.pause();
      timer = window.setTimeout(() => show(index + 1, { reason: 'reduced-motion' }), IMAGE_DURATION);
      return;
    }

    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        // If autoplay is blocked, keep the poster visible and continue the carousel.
        stopTimer();
        timer = window.setTimeout(() => show(index + 1, { reason: 'autoplay-fallback' }), IMAGE_DURATION);
      });
    }
  };

  function show(next, options = {}) {
    if (!slides.length) return;
    stopTimer();

    const normalized = (next + slides.length) % slides.length;
    const previous = slides[index];
    const incoming = slides[normalized];

    // Clicking the already-active video dot restarts the film cleanly.
    if (normalized === index) {
      if (typeOf(incoming) === 'video' && options.reason === 'user') playCurrentVideo(true);
      else if (typeOf(incoming) === 'image') scheduleNext();
      return;
    }

    const previousVideo = activeVideo(previous);
    if (previousVideo) previousVideo.pause();

    previous?.classList.remove('is-active');
    previous?.setAttribute('aria-hidden', 'true');

    index = normalized;
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');

    const isVideo = typeOf(incoming) === 'video';
    hero?.classList.toggle('is-video-active', isVideo);
    updateControls();
    refreshHeroContent();

    if (isVideo) playCurrentVideo(true);
    else scheduleNext();
  }

  if (controls) {
    controls.innerHTML = '';
    slides.forEach((slide, i) => {
      const button = document.createElement('button');
      const isVideo = typeOf(slide) === 'video';
      const name = isVideo ? 'Opening film' : (slide.dataset.label || `Slide ${i + 1}`);
      button.type = 'button';
      button.className = 'hero-slider-line';
      button.setAttribute('aria-label', `Show ${name}`);
      button.addEventListener('click', () => show(i, { reason: 'user' }));
      controls.appendChild(button);
    });
  }

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    const video = activeVideo(slide);
    if (!video) return;
    video.controls = false;
    video.removeAttribute('controls');
    video.addEventListener('ended', () => {
      if (slides[index] === slide) show(index + 1, { reason: 'video-ended' });
    });
  });

  hero?.classList.toggle('is-video-active', typeOf(slides[index]) === 'video');
  updateControls();

  // The first slide is the film. It begins only when the branded loader clears.
  if (!document.querySelector('[data-site-loader]:not(.is-leaving)')) {
    if (typeOf(slides[index]) === 'video') playCurrentVideo(true);
    else scheduleNext();
  }

  window.addEventListener('voyage:loader-leaving', () => {
    if (typeOf(slides[index]) === 'video') playCurrentVideo(true);
    else scheduleNext();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
      activeVideo(slides[index])?.pause();
      return;
    }
    if (typeOf(slides[index]) === 'video') playCurrentVideo(false);
    else scheduleNext();
  });

  controls?.addEventListener('mouseenter', () => {
    if (typeOf(slides[index]) === 'image') stopTimer();
  });
  controls?.addEventListener('mouseleave', () => {
    if (typeOf(slides[index]) === 'image') scheduleNext();
  });
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

/* Keep AOS responsive after viewport changes and newly revealed layouts. */
window.addEventListener('load', function () {
  if (window.AOS) window.setTimeout(() => AOS.refreshHard(), 120);
});

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
