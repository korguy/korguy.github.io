/*
 * Liquid glass refraction for `.glass` elements.
 *
 * The lens model is ported from ybouane/liquidglass (MIT): a rounded-rect SDF with a
 * half-circle bevel height field, refracted through both surfaces of a biconvex pill.
 * Instead of rasterising the page into WebGL, the per-pixel refraction offsets are baked
 * into a displacement map once per element size and applied live through
 * `backdrop-filter: url(#filter)`, so content can scroll underneath at compositor cost.
 *
 * Only Chromium supports SVG filters in backdrop-filter; other browsers keep the CSS
 * frosted-glass fallback from style.css. Tuning lives in CSS custom properties:
 *   --lg-refract  refraction strength (library default 0.69)
 *   --lg-depth    bevel depth in px (library "zRadius")
 *   --lg-blur     frost blur in px
 *   --lg-saturate backdrop saturation multiplier
 */
(function () {
  var brands = navigator.userAgentData && navigator.userAgentData.brands;
  if (!brands || !brands.some(function (b) { return b.brand === 'Chromium'; })) return;

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var defs = document.getElementById('glass-defs');
  var filters = {};

  function smoothstep(a, b, x) {
    var t = Math.min(Math.max((x - a) / (b - a), 0), 1);
    return t * t * (3 - 2 * t);
  }

  function roundedRectSDF(px, py, bx, by, r) {
    var qx = Math.abs(px) - bx + r;
    var qy = Math.abs(py) - by + r;
    return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
  }

  function bevelHeight(d, zR) {
    if (d <= 0) return 0;
    if (d >= zR) return zR;
    return Math.sqrt(d * (2 * zR - d));
  }

  // Returns {url, scale}: an RGBA PNG whose R/G channels encode the x/y sample offset.
  function displacementMap(w, h, radius, zR, refract) {
    var hx = w / 2, hy = h / 2;
    var r = Math.min(radius, hx, hy);
    var e = 2;
    var refrPow = 1 - 1 / 1.5;
    var ox = new Float32Array(w * h);
    var oy = new Float32Array(w * h);
    var max = 0.5;

    function inset(px, py) { return -roundedRectSDF(px, py, hx, hy, r); }

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var px = x + 0.5 - hx;
        var py = y + 0.5 - hy;
        var inside = inset(px, py);
        if (inside <= 0) continue;

        var gx = (bevelHeight(inset(px + e, py), zR) - bevelHeight(inset(px - e, py), zR)) / (2 * e);
        var gy = (bevelHeight(inset(px, py + e), zR) - bevelHeight(inset(px, py - e), zR)) / (2 * e);
        var thickNorm = (bevelHeight(inside, zR) * 2) / Math.max(zR * 2, 1);
        var depth = smoothstep(0, zR, inside);

        // Biconvex: entry + exit refraction plus a through-thickness term, then a gentle
        // pull toward the centre so the middle of the lens reads as slightly magnified.
        var k = refrPow * (2 + thickNorm * 0.5) * refract * 30;
        var i = y * w + x;
        ox[i] = gx * k - (px / Math.max(hx, 1)) * refract * 4 * depth;
        oy[i] = gy * k - (py / Math.max(hy, 1)) * refract * 4 * depth;
        max = Math.max(max, Math.abs(ox[i]), Math.abs(oy[i]));
      }
    }

    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    var img = ctx.createImageData(w, h);
    var scale = max * 2;
    for (var j = 0; j < w * h; j++) {
      img.data[j * 4] = Math.round(255 * (0.5 + ox[j] / scale));
      img.data[j * 4 + 1] = Math.round(255 * (0.5 + oy[j] / scale));
      img.data[j * 4 + 2] = 128;
      img.data[j * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return { url: canvas.toDataURL(), scale: scale };
  }

  function num(style, name, fallback) {
    var v = parseFloat(style.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }

  function apply(el) {
    var w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    var style = getComputedStyle(el);
    var radius = parseFloat(style.borderTopLeftRadius) || 0;
    var refract = num(style, '--lg-refract', 0.69);
    var depth = num(style, '--lg-depth', 40);
    var blur = num(style, '--lg-blur', 0);
    var saturate = num(style, '--lg-saturate', 1);

    var key = [w, h, Math.min(radius, w / 2, h / 2), refract, depth, blur, saturate].join('_');
    var id = 'lg-' + key.replace(/\./g, 'p');
    if (!filters[id]) {
      var map = displacementMap(w, h, radius, Math.min(depth, w / 2, h / 2), refract);
      var filter = document.createElementNS(SVG_NS, 'filter');
      filter.setAttribute('id', id);
      filter.setAttribute('x', 0);
      filter.setAttribute('y', 0);
      filter.setAttribute('width', w);
      filter.setAttribute('height', h);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      filter.setAttribute('primitiveUnits', 'userSpaceOnUse');
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      filter.innerHTML =
        '<feImage href="' + map.url + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="map"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + map.scale.toFixed(2) + '" xChannelSelector="R" yChannelSelector="G" result="refracted"/>' +
        '<feGaussianBlur in="refracted" stdDeviation="' + blur + '" result="frosted"/>' +
        '<feColorMatrix in="frosted" type="saturate" values="' + saturate + '"/>';
      defs.appendChild(filter);
      filters[id] = true;
    }
    el.style.backdropFilter = 'url(#' + id + ')';
    el.style.webkitBackdropFilter = 'url(#' + id + ')';
    el.classList.add('glass-refract');
  }

  var observer = new ResizeObserver(function (entries) {
    entries.forEach(function (entry) { apply(entry.target); });
  });
  document.querySelectorAll('.glass').forEach(function (el) { observer.observe(el); });
})();
