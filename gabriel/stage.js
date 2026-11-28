// Gabriel, coming soon: the stage. Draws MeeGabriel (gabriel.js, Rev 1.1, a copy of the Jarvis master in
// docs/Mee Agents/Gabriel/gabriel.js) through four scenes on a 19.5 s loop, each with its own clock so its action plays
// from the start: Hello and the idea orb (as on his own site), the herald's trumpet, the scroll of revelation, then Done
// (an idea sent up to the glowing cloud). The very light heavenly touches are drawn on his own pages only (Logan
// 2026-11-28 08:54 UTC); the twinkling stars are on here for the same reason. Pause button; still frame under reduced motion.
(function () {
  var el = document.getElementById('gabriel'); if (!el || !window.MeeGabriel) return;
  var ctx = el.getContext('2d');
  var SCENES = [
    { len: 7,   x: .42, opts: function (t) { return { sparkles: true, left: 'down', right: t < 2.6 ? 'wave' : 'vision', load: t > 1.6 && t < 2.3 ? .85 : .12 }; } },
    { len: 4,   x: .5,  opts: function () { return { sparkles: true, left: 'down', right: 'herald', bubble: false, load: .35 }; } },
    { len: 4,   x: .5,  opts: function () { return { sparkles: true, left: 'down', right: 'scroll', bubble: false, load: .25 }; } },
    { len: 4.5, x: .46, opts: function () { return { sparkles: true, left: 'down', right: 'thumb', bubble: false, load: .1 }; } }
  ];
  var LOOP = SCENES.reduce(function (s, x) { return s + x.len; }, 0);
  function scene(t) { var u = t % LOOP; for (var i = 0; i < SCENES.length; i++) { if (u < SCENES[i].len) return [SCENES[i], u]; u -= SCENES[i].len; } return [SCENES[0], 0]; }
  function grid(w, h, hy) { ctx.save(); ctx.strokeStyle = 'rgba(255,250,238,.06)'; ctx.lineWidth = 1;
    for (var i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(w / 2 + i * w * .02, hy); ctx.lineTo(w / 2 + i * w * .14, h); ctx.stroke(); }
    for (var j = 0; j < 7; j++) { var y = hy + Math.pow(j / 6, 1.8) * (h - hy); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.restore(); }
  function heaven(w, h, t) { ctx.save();
    var g = ctx.createRadialGradient(w * .5, -h * .1, 0, w * .5, -h * .1, h * .9); g.addColorStop(0, 'rgba(255,246,226,.07)'); g.addColorStop(1, 'rgba(255,246,226,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (var i = 0; i < 5; i++) { var x = w * (.2 + i * .15), sw = w * .05; ctx.beginPath(); ctx.moveTo(x - sw * .3, 0); ctx.lineTo(x + sw * .3, 0);
      ctx.lineTo(x + sw + (i - 2) * w * .04, h * .75); ctx.lineTo(x - sw + (i - 2) * w * .04, h * .75); ctx.closePath();
      ctx.fillStyle = 'rgba(255,246,226,' + (.018 + .012 * Math.sin(t * .4 + i * 1.3)) + ')'; ctx.fill(); }
    for (var m = 0; m < 9; m++) { var u = ((t * .03 + m / 9) % 1), mx = w * ((m * .37) % 1), my = h * (.75 - u * .7);
      ctx.beginPath(); ctx.arc(mx + Math.sin(t * .5 + m) * 8, my, 1.6 + (m % 3) * .6, 0, 6.283); ctx.fillStyle = 'rgba(255,240,200,' + (.25 * Math.sin(u * Math.PI)) + ')'; ctx.fill(); }
    ctx.restore(); }
  function frame(t) { var w = el.width, h = el.height, sc = scene(t), s = sc[0], lt = sc[1], k = 2.25 * w / 900;
    ctx.clearRect(0, 0, w, h); heaven(w, h, t); grid(w, h, h * .78);
    ctx.save(); ctx.translate(w * s.x, h * .86 + Math.sin(t * 2.2) * 3); ctx.scale(k, k);
    MeeGabriel.draw(ctx, lt, 1, s.opts(lt)); ctx.restore(); }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paused = !!reduce, t = reduce ? 3.4 : 0, last = null;
  var btn = document.getElementById('anim-toggle'), icon = document.getElementById('anim-icon');
  function sync() { if (!btn) return; btn.setAttribute('aria-pressed', paused ? 'true' : 'false'); btn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    if (icon) icon.setAttribute('d', paused ? 'M3 1.5v11l9-5.5z' : 'M3 2h3v10H3zM8 2h3v10H8z'); }
  if (btn) btn.addEventListener('click', function () { paused = !paused; last = null; sync(); });
  sync();
  function tick(now) { if (!paused) { if (last != null) t += Math.min(.1, (now - last) / 1000); last = now; } frame(t); requestAnimationFrame(tick); }
  frame(t); requestAnimationFrame(tick);
})();
