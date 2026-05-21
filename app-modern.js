document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]');
  var nav = document.querySelector('[data-nav]');
  var menuButton = document.querySelector('[data-menu-button]');
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.site-nav a');
  var revealItems = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');
  var lightbox = document.querySelector('[data-lightbox]');
  var lightboxImage = document.querySelector('[data-lightbox-image]');
  var lightboxTitle = document.querySelector('[data-lightbox-title]');
  var closeLightbox = document.querySelector('[data-lightbox-close]');
  var contactForm = document.querySelector('[data-contact-form]');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 32);

    var current = 'accueil';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 150) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuButton.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  function animateCounter(item) {
    if (item.dataset.done === 'true') {
      return;
    }

    item.dataset.done = 'true';
    var target = Number(item.dataset.count);
    var startedAt = null;

    function frame(time) {
      if (!startedAt) {
        startedAt = time;
      }

      var progress = Math.min((time - startedAt) / 1200, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      item.textContent = Math.round(target * eased).toLocaleString('fr-FR');

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
    counters.forEach(animateCounter);
  }

  document.querySelectorAll('[data-image]').forEach(function (item) {
    item.addEventListener('click', function () {
      lightboxImage.src = item.dataset.image;
      lightboxTitle.textContent = item.dataset.title || '';

      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      }
    });
  });

  closeLightbox.addEventListener('click', function () {
    lightbox.close();
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var data = new FormData(contactForm);
    var subject = encodeURIComponent('Demande de devis - Chichaoua Bennes');
    var body = encodeURIComponent(
      'Nom: ' + data.get('name') + '\n' +
      'Telephone: ' + data.get('phone') + '\n' +
      'Besoin: ' + data.get('service') + '\n\n' +
      'Message:\n' + data.get('message')
    );

    window.location.href = 'mailto:contact@chichaouabennes.ma?subject=' + subject + '&body=' + body;
  });
});
