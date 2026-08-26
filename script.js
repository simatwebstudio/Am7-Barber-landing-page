(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initCarousel(root) {
    var track = root.querySelector('.gallery__track');
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

    function go(direction) {
      var maxScroll = track.scrollWidth - track.clientWidth;
      var atStart = track.scrollLeft <= 2;
      var atEnd = track.scrollLeft >= maxScroll - 2;

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
  }

  function initHotspots(root) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll('.hotspot'));
    var detail = root.querySelector('.shop__detail');

    if (!buttons.length || !detail) return;

    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) { item.setAttribute('aria-pressed', 'false'); });
        button.setAttribute('aria-pressed', 'true');
        detail.querySelector('span').textContent = String(index + 1).padStart(2, '0');
        detail.querySelector('strong').textContent = button.dataset.title;
        detail.querySelector('p').textContent = button.dataset.copy;
      });
    });
  }

  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  document.querySelectorAll('[data-hotspots]').forEach(initHotspots);

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}());
