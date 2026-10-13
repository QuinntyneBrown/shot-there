// Shared slide runtime: shows one <section> at a time.
// ?slide=N (1-based) or #N picks the slide; arrow keys step through when viewing by hand.
(function () {
  var body = document.body;
  var slides = Array.prototype.slice.call(document.querySelectorAll('body > section'));
  var parts = (body.dataset.parts || '').split('|');

  var header = document.createElement('header');
  header.className = 'deck-header';
  header.innerHTML = '<strong>ShotThere</strong><span></span><span class="part"></span>';
  header.children[1].textContent = 'Video ' + (body.dataset.videoNumber || '') + ' · ' + (body.dataset.videoTitle || '');
  var progress = document.createElement('div');
  progress.className = 'deck-progress';
  body.prepend(progress);
  body.prepend(header);

  // Sizes the screenshots in each .row to one shared height that fills the row,
  // upscaling small crops up to twice their pixel size.
  function fit(section) {
    section.querySelectorAll('.row').forEach(function (row) {
      var imgs = Array.prototype.slice.call(row.querySelectorAll('figure > img'));
      if (!imgs.length || imgs.some(function (im) { return !im.naturalWidth; })) return;
      imgs.forEach(function (im) { im.style.width = '0px'; im.style.height = '0px'; });
      var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      var caption = 0;
      imgs.forEach(function (im) {
        var cap = im.parentElement.querySelector('figcaption');
        if (cap) caption = Math.max(caption, cap.offsetHeight + 14);
      });
      var ratios = imgs.map(function (im) { return im.naturalWidth / im.naturalHeight; });
      var sum = ratios.reduce(function (a, b) { return a + b; }, 0);
      var h = Math.min(row.clientHeight - caption, (row.clientWidth - gap * (imgs.length - 1)) / sum);
      imgs.forEach(function (im, k) {
        var hk = Math.min(h, im.naturalHeight * 2);
        im.style.height = hk + 'px';
        im.style.width = hk * ratios[k] + 'px';
      });
    });
  }

  function show(n) {
    var i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
    fit(slides[i]);
    var part = Number(slides[i].dataset.part || 0);
    header.querySelector('.part').textContent = parts[part] || '';
    progress.style.width = ((i + 1) / slides.length) * 100 + '%';
    current = i;
  }

  var params = new URLSearchParams(location.search);
  var start = Number(params.get('slide') || location.hash.slice(1) || 1) - 1;
  var current = 0;
  show(isNaN(start) ? 0 : start);
  window.addEventListener('load', function () { fit(slides[current]); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
})();
