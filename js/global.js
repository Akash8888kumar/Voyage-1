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

  document.querySelectorAll('.testimonial-video-trigger[data-lightbox-src]').forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      const lightbox = document.querySelector('[data-vo-lightbox]');
      // The current pages do not use a gallery slider, so the existing lightbox
      // initializer is intentionally bypassed. Open the bundled MP4 directly.
      if (!lightbox) {
        event.preventDefault();
        window.open(trigger.getAttribute('data-lightbox-src'), '_blank', 'noopener,noreferrer');
      } else {
        // If a lightbox exists but is not initialized, still provide a working CTA.
        event.preventDefault();
        window.open(trigger.getAttribute('data-lightbox-src'), '_blank', 'noopener,noreferrer');
      }
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
  if (window.AOS) {
    AOS.init({ duration: 850, easing: 'ease-out-cubic', once: true, offset: 70, disable: false });
  }

  // FAQ accordion: one clear open state with a smooth height animation.
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        if (openItem === item) return;
        openItem.classList.remove('is-open');
        const openTrigger = openItem.querySelector('.faq-trigger');
        if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Sticky header: add a subtle shadow once the page scrolls
  const header = document.querySelector('.vo-header');
  if (header) {
    const onHeaderScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
  }

  const toggle = document.querySelector('.vo-mobile-toggle');
  const menu = document.querySelector('.vo-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.textContent = open ? '×' : '☰';
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 900 && link.classList.contains('vo-menu-link')) return;
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.textContent = '☰';
      });
    });
  }

  // Mobile dropdowns: tap the parent to reveal its submenu with smooth animation.
  document.querySelectorAll('.vo-menu-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (window.innerWidth > 900) return;
      const wrap = link.closest('.vo-dropdown-wrap');
      if (!wrap) return;
      event.preventDefault();
      
      // Toggle the mobile-open class for animation
      const isOpen = wrap.classList.toggle('mobile-open');
      
      // Smooth rotation of chevron
      const chevron = link.querySelector('.vo-chevron');
      if (chevron) {
        if (isOpen) {
          chevron.style.transform = 'rotate(180deg)';
        } else {
          chevron.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // Keep frontend validation active without adding any backend behavior.
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
      }
    });
  });
});

/* Home hero slider — 9 optimized local destination images, 4-second autoplay + line controls */
(function(){
  const slider = document.querySelector('.vo-hero-slider');
  if (!slider) return;
  const controls = document.querySelector('[data-hero-controls]');
  const images = [
    'assets/images/UAE.jpg',
    'assets/images/georgia.jpg',
    'assets/images/Kazakhstan.jpg',
    'assets/images/Azerbaijan.jpg',
    'assets/images/Japan.jpg',
    'assets/images/Vietnam.jpg',
    'assets/images/Kenya.jpg',
    'assets/images/tanzania.jpg',
    'assets/images/South-Africa.jpg'
  ];
  let index=0, timer;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (controls) {
    controls.innerHTML='';
    images.forEach((_,i)=>{
      const b=document.createElement('button');
      b.type='button'; b.className='hero-slider-line';
      b.setAttribute('aria-label',`Show hero image ${i+1}`);
      b.addEventListener('click',()=>show(i,true));
      controls.appendChild(b);
    });
  }
  const updateControls=()=>controls?.querySelectorAll('.hero-slider-line').forEach((b,i)=>b.classList.toggle('is-active',i===index));
  const show=(next,user=false)=>{
    index=(next+images.length)%images.length;
    slider.classList.add('is-changing');
    const heroContent = document.querySelector('.page-home .hero-content');
    if (heroContent) { heroContent.classList.remove('hero-content-refresh'); void heroContent.offsetWidth; heroContent.classList.add('hero-content-refresh'); }
    window.setTimeout(()=>{ slider.style.backgroundImage=`url("${images[index]}")`; slider.classList.remove('is-changing'); },260);
    updateControls();
    if(user) restart();
  };
  images.forEach(src=>{const im=new Image(); im.src=src;});
  slider.style.backgroundImage=`url("${images[0]}")`; updateControls();
  const stop=()=>window.clearInterval(timer);
  const restart=()=>{stop(); if(!reduced.matches) timer=window.setInterval(()=>show(index+1),4000);};
  document.addEventListener('visibilitychange',()=>document.hidden?stop():restart());
  controls?.addEventListener('mouseenter',stop); controls?.addEventListener('mouseleave',restart);
  restart();
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

  /* Shared media lightbox: gallery images + testimonial videos */
  const lightbox=document.querySelector('[data-vo-lightbox]');
  if(!lightbox) return;
  const content=lightbox.querySelector('[data-lightbox-content]');
  const caption=lightbox.querySelector('[data-lightbox-caption]');
  const count=lightbox.querySelector('[data-lightbox-count]');
  const closeButtons=lightbox.querySelectorAll('[data-lightbox-close]');
  const lbPrev=lightbox.querySelector('[data-lightbox-prev]');
  const lbNext=lightbox.querySelector('[data-lightbox-next]');
  let lightboxGroup='';
  const mediaItems=()=>Array.from(document.querySelectorAll(`[data-lightbox-type][data-lightbox-src][data-lightbox-group="${lightboxGroup}"]`));
  let current=0;
  let lastFocus=null;

  const render=()=>{
    const items=mediaItems();
    if(!items.length) return;
    current=(current+items.length)%items.length;
    const item=items[current];
    const type=item.dataset.lightboxType;
    const src=item.dataset.lightboxSrc;
    const title=item.dataset.lightboxTitle || item.closest('.testimonial')?.querySelector('.person')?.textContent?.trim() || 'Preview';
    content.innerHTML='';
    if(type==='video'){
      const video=document.createElement('video');
      video.controls=true; video.autoplay=true; video.playsInline=true;
      video.preload='metadata';
      const poster=item.dataset.lightboxPoster;
      if(poster) video.poster=poster;
      video.src=src;
      content.appendChild(video);
      video.play().catch(()=>{});
    }else{
      const img=document.createElement('img');
      img.src=src; img.alt=title; img.decoding='async';
      content.appendChild(img);
    }
    if(caption) caption.textContent=title;
    if(count) count.textContent=`${current+1} / ${items.length}`;
    lbPrev.hidden=items.length<2; lbNext.hidden=items.length<2;
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
    if(video) video.pause();
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
    render();
  };

  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-lightbox-type][data-lightbox-src]');
    if(trigger){e.preventDefault();open(trigger);}
  });
  closeButtons.forEach(b=>b.addEventListener('click',close));
  lbPrev?.addEventListener('click',()=>move(-1));
  lbNext?.addEventListener('click',()=>move(1));
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
