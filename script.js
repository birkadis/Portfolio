// Scale the fixed 1200px canvas down on narrow screens (Figma prototype "min-zoom").
(function () {
  var root = document.documentElement;
  // Canvas width: 1200px on the home/CV pages, the Figma frame width on case pages (data-w).
  var pg = document.querySelector('.page[data-w]');
  var base = pg ? parseFloat(pg.getAttribute('data-w')) : 1200;
  function fit() {
    // clientWidth = layout viewport (stays at device width on phones even
    // while the unscaled 1200px canvas would overflow it).
    var w = Math.min(root.clientWidth || window.innerWidth, window.screen && screen.width ? Math.max(screen.width, 320) : Infinity);
    var z = Math.min(1, w / base);
    root.style.setProperty('--z', String(z));
  }
  fit();
  window.addEventListener('resize', fit);
})();

// Carousels: every click switches to the next variant, exactly like the
// "On click → Change to" interactions in the Figma components.
// data-auto="500" makes a carousel advance on its own ("After delay 500ms").
(function () {
  var cars = document.querySelectorAll('.car');
  Array.prototype.forEach.call(cars, function (car) {
    var slides = car.querySelectorAll('img');
    if (slides.length < 2) return;
    var i = 0;

    // Paginator: the .dots element right after the carousel gets one dot per slide,
    // shows the current slide and jumps to a slide on click.
    var dotsBox = car.nextElementSibling && car.nextElementSibling.classList.contains('dots') ? car.nextElementSibling : null;
    var dots = [];
    if (dotsBox) {
      dotsBox.innerHTML = '';
      dotsBox.setAttribute('role', 'group');
      dotsBox.setAttribute('aria-label', 'Slides');
      Array.prototype.forEach.call(slides, function (_, k) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Slide ' + (k + 1) + ' of ' + slides.length);
        b.addEventListener('click', function (e) { e.stopPropagation(); go(k); });
        dotsBox.appendChild(b);
        dots.push(b);
      });
      // keep the paginator centred under its carousel
      var w = slides.length * 8 + (slides.length - 1) * 7;
      dotsBox.style.left = (parseFloat(car.style.left) + parseFloat(car.style.width) / 2 - w / 2) + 'px';
    }

    function go(k) {
      slides[i].classList.remove('on');
      if (dots[i]) { dots[i].classList.remove('on'); dots[i].removeAttribute('aria-current'); }
      i = (k + slides.length) % slides.length;
      slides[i].classList.add('on');
      if (dots[i]) { dots[i].classList.add('on'); dots[i].setAttribute('aria-current', 'true'); }
    }
    function next() { go(i + 1); }
    go(0);

    var auto = parseInt(car.getAttribute('data-auto') || '0', 10);
    if (auto > 0) {
      setInterval(next, auto);
    } else {
      car.addEventListener('click', next);
      car.setAttribute('role', 'button');
      car.setAttribute('tabindex', '0');
      car.addEventListener('keydown', function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); next(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
      });
    }
  });
})();
