(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initCarousel(root) {
    var track = root.querySelector('[data-track]') || root.querySelector('.gallery__track');
    var cards = track ? Array.prototype.slice.call(track.children) : [];
    var previous = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var timer = null;
    var isVisible = false;
    var isPaused = false;

    if (!track || !cards.length) return;

    function stepSize() {
      var first = cards[0];
      var styles = window.getComputedStyle(track);
      return first.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || 0);
    }

    /* Le frecce restano spente quando non c'e' nulla da scorrere
       (es. tre card che entrano tutte nel viewport su desktop). */
    function syncControls() {
      var maxScroll = track.scrollWidth - track.clientWidth;
      var scrollable = maxScroll > 2;
      if (previous) previous.disabled = !scrollable;
      if (next) next.disabled = !scrollable;
    }

    function go(direction) {
      var maxScroll = track.scrollWidth - track.clientWidth;
      var atStart = track.scrollLeft <= 2;
      var atEnd = track.scrollLeft >= maxScroll - 2;

      if (maxScroll <= 2) return;

      if (direction > 0 && atEnd) {
        track.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else if (direction < 0 && atStart) {
        track.scrollTo({ left: maxScroll, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        track.scrollBy({ left: stepSize() * direction, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    function stopAutoplay() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function startAutoplay() {
      stopAutoplay();
      if (!reduceMotion && isVisible && !isPaused && !document.hidden) {
        timer = window.setInterval(function () { go(1); }, 5000);
      }
    }

    if (previous) previous.addEventListener('click', function () { go(-1); startAutoplay(); });
    if (next) next.addEventListener('click', function () { go(1); startAutoplay(); });

    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      }
    });

    root.addEventListener('mouseenter', function () { isPaused = true; stopAutoplay(); });
    root.addEventListener('mouseleave', function () { isPaused = false; startAutoplay(); });
    root.addEventListener('focusin', function () { isPaused = true; stopAutoplay(); });
    root.addEventListener('focusout', function () { isPaused = false; startAutoplay(); });
    document.addEventListener('visibilitychange', startAutoplay);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
        startAutoplay();
      }, { threshold: 0.25 }).observe(root);
    } else {
      isVisible = true;
      startAutoplay();
    }

    syncControls();
    window.addEventListener('resize', syncControls);
    if ('ResizeObserver' in window) new ResizeObserver(syncControls).observe(track);
  }

  /* Vetrina prodotti: tre slide che scorrono da sole, con pallini
     cliccabili generati dalle didascalie delle slide stesse. */
  function initSlideshow(root) {
    var track = root.querySelector('[data-slideshow-track]');
    var dotsBox = root.querySelector('[data-slideshow-dots]');
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var dots = [];
    var index = 0;
    var timer = null;
    var isVisible = false;
    var isPaused = false;

    if (!track || slides.length < 2) return;

    function show(next) {
      index = (next + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function stopAuto() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function startAuto() {
      stopAuto();
      if (!reduceMotion && isVisible && !isPaused && !document.hidden) {
        timer = window.setInterval(function () { show(index + 1); }, 4500);
      }
    }

    if (dotsBox) {
      slides.forEach(function (slide, i) {
        var caption = slide.querySelector('figcaption');
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Vedi ' + (caption ? caption.textContent : 'immagine ' + (i + 1)));
        dot.addEventListener('click', function () { show(i); startAuto(); });
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    root.addEventListener('mouseenter', function () { isPaused = true; stopAuto(); });
    root.addEventListener('mouseleave', function () { isPaused = false; startAuto(); });
    root.addEventListener('focusin', function () { isPaused = true; stopAuto(); });
    root.addEventListener('focusout', function () { isPaused = false; startAuto(); });
    document.addEventListener('visibilitychange', startAuto);

    show(0);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
        startAuto();
      }, { threshold: 0.35 }).observe(root);
    } else {
      isVisible = true;
      startAuto();
    }
  }

  /* Reel Instagram: il video parte quando la sezione entra in viewport,
     a fine riproduzione la schermata scorre in automatico sul logo. */
  function initReel(root) {
    var stage = root.querySelector('[data-reel-stage]');
    var video = root.querySelector('[data-reel-video]');
    var screen = root.querySelector('.phone__screen');
    var toggle = root.querySelector('[data-reel-toggle]');
    var toggleLabel = root.querySelector('[data-reel-toggle-label]');
    var sound = root.querySelector('[data-reel-sound]');
    var bar = root.querySelector('[data-reel-bar]');
    var replay = root.querySelector('[data-reel-replay]');
    var inView = false;

    if (!stage || !video) return;

    function state(value) {
      if (value === undefined) return stage.getAttribute('data-state');
      stage.setAttribute('data-state', value);
      return value;
    }

    function play() {
      var attempt = video.play();
      if (attempt && attempt.catch) {
        attempt.catch(function () { /* autoplay bloccato dal browser: resta il tasto play */ });
      }
    }

    function restart() {
      state('video');
      video.currentTime = 0;
      if (bar) bar.style.width = '0%';
      play();
    }

    video.addEventListener('play', function () {
      stage.classList.add('is-playing');
      if (toggleLabel) toggleLabel.textContent = 'Metti in pausa il video';
    });

    video.addEventListener('pause', function () {
      stage.classList.remove('is-playing');
      if (toggleLabel) toggleLabel.textContent = 'Riproduci il video';
    });

    video.addEventListener('timeupdate', function () {
      if (!bar || !video.duration) return;
      bar.style.width = (video.currentTime / video.duration * 100).toFixed(2) + '%';
    });

    video.addEventListener('ended', function () {
      if (bar) bar.style.width = '100%';
      state('logo');
    });

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (state() === 'logo') restart();
        else if (video.paused) play();
        else video.pause();
      });
    }

    if (replay) replay.addEventListener('click', restart);

    if (sound) {
      sound.addEventListener('click', function () {
        video.muted = !video.muted;
        sound.setAttribute('aria-pressed', video.muted ? 'false' : 'true');
        if (!video.muted && video.paused && state() !== 'logo') play();
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) video.pause();
      else if (inView && !reduceMotion && state() !== 'logo') play();
    });

    state('video');

    if ('IntersectionObserver' in window && screen) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (!inView) {
          video.pause();
          return;
        }
        if (reduceMotion) return;
        if (state() === 'logo') restart();
        else play();
      }, { threshold: 0.5 }).observe(screen);
    }
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  document.querySelectorAll('[data-slideshow]').forEach(initSlideshow);
  document.querySelectorAll('[data-reel]').forEach(initReel);

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}());
