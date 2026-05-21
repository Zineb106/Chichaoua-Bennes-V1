document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var backToTop = document.createElement('button');

  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Retour en haut');
  backToTop.textContent = '^';
  document.body.appendChild(backToTop);

  function updateHeader() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 520);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var currentPage = window.location.pathname.split('/').pop() || 'index.php';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var target = link.getAttribute('href');
    if (target === currentPage || (currentPage === 'index.html' && target === 'index.php')) {
      link.classList.add('is-active');
    }
  });

  var revealItems = document.querySelectorAll('.reveal');
  var counterItems = document.querySelectorAll('[data-count]');

  function animateCounter(item) {
    if (item.dataset.counted === 'true') {
      return;
    }

    item.dataset.counted = 'true';
    var target = Number(item.dataset.count);
    var start = 0;
    var duration = 1100;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(start + (target - start) * eased);
      item.textContent = value.toLocaleString('fr-FR');

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });

    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterItems.forEach(function (item) {
      countObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
    counterItems.forEach(animateCounter);
  }
});
