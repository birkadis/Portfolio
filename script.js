// Scale the fixed 1200px canvas down on narrow screens (Figma prototype "min-zoom").
(function () {
  var root = document.documentElement;
  function fit() {
    // clientWidth = layout viewport (stays at device width on phones even
    // while the unscaled 1200px canvas would overflow it).
    var w = Math.min(root.clientWidth || window.innerWidth, window.screen && screen.width ? Math.max(screen.width, 320) : Infinity);
    var z = Math.min(1, w / 1200);
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
    function next() {
      slides[i].classList.remove('on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('on');
    }
    var auto = parseInt(car.getAttribute('data-auto') || '0', 10);
    if (auto > 0) {
      setInterval(next, auto);
    } else {
      car.addEventListener('click', next);
      car.setAttribute('role', 'button');
      car.setAttribute('tabindex', '0');
      car.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
      });
    }
  });
})();
