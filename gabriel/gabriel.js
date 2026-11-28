// Gabriel, the Gabriel Mee agent (vMia: virtual micro interactive agent). Rev 1, 2026-11-28.
// Brief (Logan 2026-11-28 06:08 UTC): "create a MEE agent called Gabriel, use angel gabriel as a reference and build out
//   based on my existing preferences within the Mee's"; the product's main idea is "divine information": (/god) mode
//   responses to, and ideas from, whatever is put in.
// The reference is the messenger who brings understanding: a herald with a trumpet, a scroll and a lily, a halo and small
// wings. An original chibi character; no painting, statue or existing mascot copied, and no claim to be divine.
// Built to the Mee agent protocols (docs/Mee Agents/README sections 3, 3a and 4), ported one for one from Albert and Jiro:
//   1. the Mee agent coat in the parent project's colours: Gabriel celestial indigo with halo-gold trim, notched lapels,
//      shirt and tie, three buttons, breast pocket with piping and a quill (Albert has pens), hip pockets, the Gabriel mark
//      (a halo ring round a four-point star of light) on the left chest and as a sleeve patch, "GABRIEL · AI agent" badge
//   2. big, identifiable actions, each with its own cue in the accent colour
//   3. live filaments that grow as he processes: here rays of light rising from his hair (the "radiance"); minimal when
//      idle, more, longer and faster with gold data packets as load rises
//   plus the antenna to the server (a feather quill ending in a glowing node), the floating halo, small wireframe wings,
//   sparkles, and the thinking-dots then icon-and-tick bubble.
// House style = the Doxie chibi style. Ground midnight #0a0c24, ivory ink, halo gold accent, dawn rose second accent.
//
// MeeGabriel.draw(ctx, t, a, opts)   local space: feet at 0,0, head centre 0,-124. t = seconds, a = alpha.
//   opts.coat   default MeeGabriel.coats.gb (the coat in the parent project's colours)
//   opts.left / opts.right   'down' (rest, holds a lily) 'wave' 'point' 'thumb' 'herald' 'scroll' 'vision'
//   opts.wings  false hides the wings.   opts.halo false hides the halo.
//   opts.bubble false hides the speech bubble.   opts.load 0..1, how much he is processing (rays of light)
(function (root) {
  var C = { paper: '255,250,238', gold: '243,201,105', goldHi: '255,236,170', dawn: '246,164,140', sky: '150,196,246',
            lilac: '190,170,255', blush: '242,140,130', ink: '16,18,48', deep: '9,11,32' };
  var COATS = {
    gb: { name: 'Gabriel colours', fill: '38,34,86', trim: '243,201,105', badge: true },
    white: { name: 'White coat (record only)', fill: '44,46,96', trim: '255,250,238', badge: false },
    badge: { name: 'White coat + badge (record only)', fill: '44,46,96', trim: '255,250,238', badge: true }
  };
  function rgba(c, a) { return 'rgba(' + c + ',' + a + ')'; }
  function sk(ctx, col, a, w) { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
  function fl(ctx, col, a) { ctx.fillStyle = rgba(col, a); ctx.fill(); }
  function ease(t0, dur, t) { var v = Math.max(0, Math.min(1, (t - t0) / dur)); return v * v * (3 - 2 * v); }
  function pop(x) { x = Math.max(0, Math.min(1, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function star(ctx, x, y, r, col, a) { ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); fl(ctx, col, a); }
  // the Gabriel mark, small: a halo ring round a four-point star of light
  function logo(ctx, x, y, s, a) { ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.ellipse(0, 0, s * 1.15, s * 1.15, 0, 0, 6.283); sk(ctx, C.gold, a, Math.max(.9, s * .28));
    star(ctx, 0, 0, s * .85, C.goldHi, a); ctx.restore(); }
  // a radiant orb of light: the "divine information" itself (the Vision cue and the bubble icon)
  function radiant(ctx, x, y, r, a, t) { ctx.save(); ctx.translate(x, y);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.2); g.addColorStop(0, rgba(C.goldHi, a * .55)); g.addColorStop(1, rgba(C.gold, 0));
    ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, 6.283); ctx.fillStyle = g; ctx.fill();
    for (var i = 0; i < 8; i++) { var q = i * Math.PI / 4 + t * .6, l = i % 2 ? 1.35 : 1.9;
      ctx.beginPath(); ctx.moveTo(Math.cos(q) * r * 1.05, Math.sin(q) * r * 1.05); ctx.lineTo(Math.cos(q) * r * l, Math.sin(q) * r * l); sk(ctx, C.gold, a * .9, Math.max(1, r * .14)); }
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); fl(ctx, C.deep, a); sk(ctx, C.gold, a, Math.max(1.2, r * .16));
    star(ctx, 0, 0, r * .72, C.goldHi, a); ctx.restore(); }
  function tick(ctx, x, y, r, a, col) { ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); fl(ctx, C.deep, a); sk(ctx, col, a, 2.2);
    ctx.beginPath(); ctx.moveTo(x - r * .45, y + r * .02); ctx.lineTo(x - r * .1, y + r * .38); ctx.lineTo(x + r * .5, y - r * .36); sk(ctx, col, a, 2.6); }
  // a lily: the herald's flower (rest pose)
  function lily(ctx, x, y, dx, dy, len, a, t) { var ex = x + dx * len, ey = y + dy * len, sw = Math.sin(t * 2) * 1.2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + dx * len * .5 + sw, y + dy * len * .5, ex, ey); sk(ctx, '150,210,150', a, 1.8);
    ctx.beginPath(); ctx.ellipse(x + dx * len * .55 + 3, y + dy * len * .55, 3.4, 1.6, .6, 0, 6.283); fl(ctx, '150,210,150', a * .7);
    for (var p = -1; p <= 1; p++) { var q = Math.atan2(dy, dx) + p * .7; ctx.beginPath(); ctx.moveTo(ex, ey);
      ctx.quadraticCurveTo(ex + Math.cos(q - .4) * 7, ey + Math.sin(q - .4) * 7, ex + Math.cos(q) * 9, ey + Math.sin(q) * 9);
      ctx.quadraticCurveTo(ex + Math.cos(q + .4) * 7, ey + Math.sin(q + .4) * 7, ex, ey); fl(ctx, C.paper, a * .35); sk(ctx, C.paper, a, 1.4); }
    ctx.beginPath(); ctx.arc(ex, ey, 1.4, 0, 6.283); fl(ctx, C.gold, a); }

  // --- antenna: a feather quill rising from the crown, ending in the glowing gold node (tip at 3 + sway, -220) ------------
  function antenna(ctx, x, y, a, t) { var P = [], L = 40;
    for (var i = 0; i <= 24; i++) { var u = i / 24, sw = Math.sin(t * 2.4) * 2 * u; P.push([x + Math.sin(u * 3.2) * 4 * u + sw, y - u * L]); }
    for (var b = 3; b < 21; b += 2) { var p = P[b], q = P[b + 1], nx = -(q[1] - p[1]), ny = q[0] - p[0], nl = Math.sqrt(nx * nx + ny * ny) || 1, w = 5.5 * Math.sin((b / 24) * Math.PI);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + nx / nl * w, p[1] + ny / nl * w - 3); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - nx / nl * w, p[1] - ny / nl * w - 3); sk(ctx, C.paper, a * .55, 1.1); }
    ctx.beginPath(); P.forEach(function (p, k) { if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); sk(ctx, C.paper, a, 2.4);
    var e = P[P.length - 1], glow = .55 + .45 * Math.sin(t * 5);
    ctx.beginPath(); ctx.arc(e[0], e[1] - 3, 4.6, 0, 6.283); fl(ctx, C.gold, a);
    ctx.beginPath(); ctx.arc(e[0], e[1] - 3, 8 + 3 * glow, 0, 6.283); sk(ctx, C.gold, a * .45 * glow, 2); }
  // --- the halo: a tilted gold ring floating over his head; back half drawn before the head, front half after -------------
  // Rev 1.1 (Logan 08:52 UTC): "when gabriel is processing i want is halo to increase in elecrtical activity while moving
  // up above his head, change color and conductivity reponse with intensity". With load 0..1 the halo lifts up to 36 above
  // his head, its colour runs gold -> hot white -> electric blue -> white-violet, and it crackles: more, longer, faster arcs round the
  // ring, and at high load arcs leap up off it and down toward his head (the conduction). At rest it is as Rev 1.
  function hcol(load) {   // gold -> hot white -> electric blue -> white-violet (no muddy mix between gold and blue)
    var S = [[0, [243, 201, 105]], [.35, [243, 201, 105]], [.5, [255, 246, 226]], [.72, [120, 210, 255]], [1, [226, 210, 255]]];
    for (var i = 1; i < S.length; i++) if (load <= S[i][0]) { var u = (load - S[i - 1][0]) / (S[i][0] - S[i - 1][0]);
      return S[i - 1][1].map(function (v, k) { return Math.round(v + (S[i][1][k] - v) * u); }).join(','); }
    return S[S.length - 1][1].join(','); }
  function hash(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
  function bolt(ctx, x1, y1, x2, y2, seed, jag, col, a, w) { var n = 6; ctx.beginPath(); ctx.moveTo(x1, y1);
    for (var i = 1; i < n; i++) { var u = i / n; ctx.lineTo(x1 + (x2 - x1) * u + (hash(seed + i) - .5) * jag, y1 + (y2 - y1) * u + (hash(seed + i + 9) - .5) * jag); }
    ctx.lineTo(x2, y2); sk(ctx, col, a * .35, w * 3); sk(ctx, col, a, w); }
  function halo(ctx, a, t, half, load) { load = Math.max(0, Math.min(1, load || 0));
    var y = -176 - 36 * load + Math.sin(t * (1.6 + 3 * load)) * (2.2 + 1.5 * load), glow = .6 + .4 * Math.sin(t * (2.2 + 9 * load));
    var col = hcol(load), from = half === 'back' ? Math.PI : 0, to = half === 'back' ? 6.283 : Math.PI;
    ctx.beginPath(); ctx.ellipse(0, y, 33, 8, 0, from, to); sk(ctx, col, a * (.3 + .35 * load) * glow, 9 + 8 * load);
    ctx.beginPath(); ctx.ellipse(0, y, 33, 8, 0, from, to); sk(ctx, col, a, 3 + load);
    if (load < .2 || half !== 'front') return;
    var step = Math.floor(t * (8 + 22 * load)), n = Math.round(2 + 10 * (load - .2) / .8), w = 1 + 1.2 * load;   // arcs round the ring
    for (var i = 0; i < n; i++) { var q0 = hash(step * 13 + i) * 6.283, span = .35 + .9 * load * hash(step * 7 + i), q1 = q0 + span;
      bolt(ctx, Math.cos(q0) * 33, y + Math.sin(q0) * 8, Math.cos(q1) * 33, y + Math.sin(q1) * 8, step * 31 + i * 5, 6 + 10 * load, col, a * (.5 + .5 * hash(step + i * 3)), w);
      if (load > .45 && hash(step * 3 + i) > .55) { var ox = Math.cos(q0) * 33, oy = y + Math.sin(q0) * 8, d = 8 + 22 * load * hash(step * 5 + i);   // sparks out
        bolt(ctx, ox, oy, ox * (1 + d / 33), oy - 4 - d * .4, step * 17 + i, 5, col, a * .7, w * .8); } }
    if (load > .6) { var k = (load - .6) / .4, tip = [-14 + 28 * hash(step * 23), y - 30 - 14 * k];   // conduction: up into the air and down to his head
      if (hash(step * 11) < .4 + .5 * k) bolt(ctx, -10 + 20 * hash(step), y - 6, tip[0], tip[1], step * 41, 10, col, a * k, w);
      if (hash(step * 19) < .3 + .5 * k) bolt(ctx, -24 + 48 * hash(step * 2), y + 6, -20 + 40 * hash(step * 4), -164, step * 53, 9, col, a * k * .9, w * .9); }
  }
  // --- wings: small wireframe wings from behind the shoulders, faint tint, slow beat ---------------------------------------
  function wings(ctx, a, t) { var beat = Math.sin(t * 1.8) * .07;
    [-1, 1].forEach(function (s) { ctx.save(); ctx.translate(13 * s, -68); ctx.rotate(-s * (.18 + beat)); ctx.scale(s, 1);
      // outline: a rounded upper edge sweeping up and out, then a lower edge of soft round feather tips back to the root
      var tips = [[70, -38], [72, -22], [66, -8], [56, 4], [42, 12], [26, 14]];
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(10, -40, 44, -58, 70, -38);
      for (var i = 1; i < tips.length; i++) { var p = tips[i - 1], q = tips[i], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        ctx.quadraticCurveTo(mx + 7, my + 6, q[0], q[1]); }
      ctx.quadraticCurveTo(10, 14, 0, 0); fl(ctx, C.paper, a * .24); sk(ctx, C.paper, a * .95, 2.4);
      // inner rows of rounded coverts, and long flight-feather lines toward each tip
      ctx.beginPath(); [[14, -18, 30, -30, 44, -28], [24, -20, 38, -24, 50, -18]].forEach(function (r) {
        ctx.moveTo(r[0], r[1]); ctx.quadraticCurveTo(r[2], r[3] + 8, r[4], r[5]); });
      for (var k = 0; k < 4; k++) { var cx = 18 + k * 9, cy = -24 + k * 3; ctx.moveTo(cx - 5, cy); ctx.arc(cx, cy, 5, Math.PI, 0, true); }
      sk(ctx, C.paper, a * .45, 1.2);
      ctx.beginPath(); tips.slice(1).forEach(function (q) { ctx.moveTo(q[0] * .45 + 4, q[1] * .45 - 6); ctx.lineTo(q[0] - 5, q[1] - 2); }); sk(ctx, C.paper, a * .35, 1.1);
      ctx.beginPath(); ctx.moveTo(4, -6); ctx.bezierCurveTo(14, -40, 44, -54, 66, -38); sk(ctx, C.gold, a * .35, 1.4);
      ctx.restore(); }); }

  // --- hair and the live rays of light ---------------------------------------------------------------------------------
  function curls(ctx, a) { ctx.beginPath(); ctx.moveTo(-42, -134);
    [[-44, -156], [-34, -170], [-18, -177], [0, -179], [18, -177], [34, -170], [44, -156], [42, -134]].forEach(function (p, i, arr) {
      var prev = i ? arr[i - 1] : [-42, -134], mx = (prev[0] + p[0]) / 2, my = (prev[1] + p[1]) / 2, ox = mx * .12, oy = (my + 124) * .12;
      ctx.quadraticCurveTo(mx + ox, my + oy - 5, p[0], p[1]); });
    fl(ctx, C.paper, a * .14); sk(ctx, C.paper, a, 3); }
  // Live rays (Albert Rev 1.2 protocol, Logan 2026-11-26 09:50: "make it minimal and as albert processes more information
  // animate more stringy hair fibers"). Each ray is a soft line of light that rises out of his hair, ripples a little,
  // pulses in length and fades at its tip; load (0..1) adds rays, lengthens and speeds them and sends gold data packets
  // out along them. At load 0 only five short quiet rays show (the minimal state).
  var FIL = (function () { var out = [], seed = 23; function r() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var i = 0; i < 22; i++) out.push({ g: Math.PI * (1.08 + .84 * r()), len: 16 + 16 * r(), sp: 1.2 + 1.6 * r(), ph: r() * 6.283, curl: (r() - .5) * 1.4, k: r() });
    [1.14, 1.27, 1.38, 1.64, 1.8].forEach(function (g, j) { out[j].g = Math.PI * g; out[j].k = j / 60; });   // clear of the antenna
    return out.sort(function (x, y) { return x.k - y.k; }); })();
  function rays(ctx, a, t, load) {
    var n = Math.round(5 + 17 * load), fast = 1 + 2.2 * load;
    for (var i = 0; i < n && i < FIL.length; i++) { var f = FIL[i];
      var grow = i < 5 ? 1 : Math.min(1, (load * 17 - (i - 5)) * 1.5); if (grow <= 0) continue;
      if (Math.abs(f.g - Math.PI * 1.5) < .1) continue;
      var pulse = .5 + .5 * Math.sin(t * f.sp * fast + f.ph), L = f.len * (.7 + .3 * pulse) * (1 + 1.3 * load) * grow;
      var r0 = 52 + 3 * Math.abs(Math.sin(f.g * 3)), g2 = f.g + f.curl * .06 * Math.sin(t * .9 * fast + f.ph);
      var bx = Math.cos(f.g) * r0, by = -124 + Math.sin(f.g) * r0, ex = Math.cos(g2) * (r0 + L), ey = -124 + Math.sin(g2) * (r0 + L);
      var ux = -(ey - by), uy = ex - bx, ul = Math.sqrt(ux * ux + uy * uy) || 1; ux /= ul; uy /= ul;
      var P = []; for (var q = 0; q <= 14; q++) { var u = q / 14, w = Math.sin(u * 6 - t * 3 * fast + f.ph) * L * .05 * u;
        P.push([bx + (ex - bx) * u + ux * w, by + (ey - by) * u + uy * w]); }
      var gr = ctx.createLinearGradient(bx, by, ex, ey);
      gr.addColorStop(0, rgba(C.goldHi, a * (i < 5 ? .95 : .8))); gr.addColorStop(.6, rgba(C.gold, a * (.45 + .35 * load))); gr.addColorStop(1, rgba(C.gold, 0));
      ctx.beginPath(); P.forEach(function (p, k) { if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.strokeStyle = gr; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
      if (load > .15 && (i % 2 === 0 || load > .6)) { var v = (t * (.7 + f.sp * .3) * fast + f.k * 5) % 1, pp = P[Math.min(14, Math.floor(v * 14))];
        ctx.beginPath(); ctx.arc(pp[0], pp[1], 1.6, 0, 6.283); fl(ctx, C.goldHi, a * (1 - v) * Math.min(1, load * 2)); }
    }
  }

  // --- the Mee agent coat (README 3a), in Gabriel colours ------------------------------------------------------------------
  function coatBody(ctx, a, t, coat) {
    var f = coat.fill, tr = coat.trim;
    ctx.beginPath(); ctx.moveTo(-17, -81); ctx.quadraticCurveTo(-24, -60, -38, -21); ctx.quadraticCurveTo(0, -15, 38, -21);
    ctx.quadraticCurveTo(24, -60, 17, -81); ctx.closePath(); fl(ctx, f, a); sk(ctx, C.paper, a, 3);
    // shirt and tie in the V (tie in the accent)
    ctx.beginPath(); ctx.moveTo(-8, -81); ctx.lineTo(0, -56); ctx.lineTo(8, -81); ctx.closePath(); fl(ctx, C.deep, a);
    ctx.beginPath(); ctx.moveTo(-6, -80); ctx.lineTo(0, -73); ctx.lineTo(6, -80); sk(ctx, C.paper, a, 2);
    ctx.beginPath(); ctx.moveTo(0, -73); ctx.lineTo(-2.4, -68); ctx.lineTo(0, -59); ctx.lineTo(2.4, -68); ctx.closePath(); fl(ctx, C.gold, a * .95);
    // notched lapels
    [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.moveTo(9 * s, -82); ctx.lineTo(18 * s, -78); ctx.lineTo(15 * s, -71); ctx.lineTo(19 * s, -69);
      ctx.lineTo(2 * s, -50); sk(ctx, tr, a, 2.4); });
    // front edge and three buttons
    ctx.beginPath(); ctx.moveTo(2, -50); ctx.lineTo(3, -19); sk(ctx, C.paper, a * .8, 2);
    [-43, -34, -25].forEach(function (y) { ctx.beginPath(); ctx.arc(7, y, 1.9, 0, 6.283); fl(ctx, C.paper, a * .25); sk(ctx, C.paper, a * .9, 1.3); });
    // the parent's mark on the left chest; breast pocket with trim piping and a quill (Albert has pens)
    logo(ctx, 16.5, -63, 3.4, a);
    ctx.beginPath(); ctx.moveTo(10, -56); ctx.lineTo(23, -56); ctx.lineTo(24, -46); ctx.lineTo(11, -46); ctx.closePath(); sk(ctx, C.paper, a * .7, 1.6);
    ctx.beginPath(); ctx.moveTo(13.5, -55); ctx.quadraticCurveTo(12, -62, 10.5, -67); sk(ctx, C.paper, a, 1.5);
    ctx.beginPath(); ctx.ellipse(11.6, -63.5, 1.6, 4, -.25, 0, 6.283); fl(ctx, C.paper, a * .35); sk(ctx, C.paper, a * .8, 1);
    ctx.beginPath(); ctx.moveTo(19.5, -55); ctx.lineTo(20.4, -61); sk(ctx, C.gold, a, 2.2);
    ctx.beginPath(); ctx.moveTo(10, -56); ctx.lineTo(23, -56); sk(ctx, tr, a, 2);
    // hip pockets
    [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.moveTo(14 * s, -36); ctx.lineTo(29 * s, -37); sk(ctx, tr, a * .9, 2);
      ctx.beginPath(); ctx.moveTo(14.5 * s, -36); ctx.lineTo(15 * s, -27); ctx.moveTo(29 * s, -37); ctx.lineTo(31 * s, -28); sk(ctx, C.paper, a * .5, 1.4); });
    // ID badge "GABRIEL · AI agent", clipped to the breast pocket (README section 4, label rule)
    if (coat.badge) { ctx.save(); ctx.translate(17, -44); ctx.rotate(.04);
      ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(0, -5); sk(ctx, C.paper, a * .8, 1.4);
      ctx.beginPath(); ctx.rect(-13, -5, 29, 12); fl(ctx, C.deep, a); sk(ctx, tr, a, 1.5);
      ctx.beginPath(); ctx.rect(-11, -3, 4.5, 7); fl(ctx, C.paper, a * .25);
      ctx.fillStyle = rgba(C.paper, a); ctx.font = '700 3px -apple-system, "Segoe UI", Helvetica, Arial, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('GABRIEL', -5, 0.6); ctx.font = '500 2.8px -apple-system, "Segoe UI", Helvetica, Arial, sans-serif'; ctx.fillStyle = rgba(C.gold, a);
      ctx.fillText('AI agent', -5, 4.6); ctx.restore(); }
  }

  // --- arms (Albert Rev 1.1 protocol): big, distinct moves, each with its own cue in the accent ---------------------------
  //   wave   (Hello)            big side-to-side swing, motion arcs and a fading trail of the arm
  //   point  (Got it)           finger pumps up, a burst of rays and a star at the fingertip
  //   thumb  (Done)             thumbs-up pops with a ring and tick badge, then sends an idea up into a glowing cloud (Rev 1.1)
  //   herald (Working)          raises the herald's trumpet, sound arcs roll out of the bell, tick when the message is out
  //   scroll (Revelation)       a scroll floats out beside him and unrolls, lines of light write themselves on it, a sparkle (Rev 1.1)
  //   vision (Here's the idea)  palm lifts and glows; the idea orb rises off it and floats out beside him (Rev 1.1, ideaOrb)
  //   wand   (Rev 1.1)          while the other arm acts, the free hand raises the herald's wand with its sound arcs
  // Rev 1.1 (Logan 08:50 UTC): arms set further out from the body and lengthened to Albert's Rev 1.1 arm protocol (upper 21, forearm 18)
  var POSES = { down: [22, 10], wave: [100, 142], point: [100, 160], thumb: [42, 112], herald: [76, 128], scroll: [54, 76], vision: [50, 84], wand: [46, 118] };
  var ARM = { sx: 20, upper: 21, fore: 18 };
  function dir(deg, s) { var r = deg * Math.PI / 180; return [s * Math.sin(r), Math.cos(r)]; }
  function angles(pose, t) {
    var p = POSES[pose] || POSES.down, up = p[0], fo = p[1];
    if (pose === 'wave') { up += 6 * Math.sin(t * 7); fo += 38 * Math.sin(t * 7); }
    if (pose === 'point') { var k = Math.pow(Math.max(0, Math.sin(t * 4)), 3); up += 8 * k; fo += 10 * k; }
    if (pose === 'thumb') { var b = pop((t % 1.6) / .35); up += 10 * (1 - b); fo -= 18 * (1 - b); }
    if (pose === 'herald' || pose === 'wand') { var h = Math.pow(Math.max(0, Math.sin(t * 3)), 2); up += 6 * h; fo += 8 * h; }
    if (pose === 'scroll') { fo += 6 * Math.sin(t * 1.4); }
    if (pose === 'vision') { fo -= 10 * (.5 + .5 * Math.sin(t * 2.4)); }
    return [up, fo];
  }
  function geom(s, pose, t) {
    var g = angles(pose, t), sh = [ARM.sx * s, -76], d1 = dir(g[0], s), d2 = dir(g[1], s);
    var el = [sh[0] + d1[0] * ARM.upper, sh[1] + d1[1] * ARM.upper], wr = [el[0] + d2[0] * ARM.fore, el[1] + d2[1] * ARM.fore];
    return { sh: sh, el: el, wr: wr, d1: d1, d2: d2 };
  }
  function trumpet(ctx, d, n, s, a, t) { var L = 34, bx = d[0] * L, by = d[1] * L;
    ctx.beginPath(); ctx.moveTo(-d[0] * 4, -d[1] * 4); ctx.lineTo(bx, by); sk(ctx, C.gold, a, 2.6);
    ctx.beginPath(); ctx.moveTo(d[0] * 8 + n[0] * 2.6, d[1] * 8 + n[1] * 2.6); ctx.lineTo(d[0] * 20 + n[0] * 2.6, d[1] * 20 + n[1] * 2.6); sk(ctx, C.gold, a * .7, 1.4);
    ctx.beginPath(); ctx.moveTo(bx + n[0] * 1.5, by + n[1] * 1.5); ctx.lineTo(bx + d[0] * 9 + n[0] * 8, by + d[1] * 9 + n[1] * 8);
    ctx.lineTo(bx + d[0] * 9 - n[0] * 8, by + d[1] * 9 - n[1] * 8); ctx.lineTo(bx - n[0] * 1.5, by - n[1] * 1.5); ctx.closePath(); fl(ctx, C.gold, a * .35); sk(ctx, C.gold, a, 2.2);
    var mx = bx + d[0] * 11, my = by + d[1] * 11, ang = Math.atan2(d[1], d[0]);
    for (var k = 0; k < 3; k++) { var ph = (t * 1.2 + k / 3) % 1; ctx.beginPath(); ctx.arc(mx, my, 6 + ph * 26, ang - .55, ang + .55); sk(ctx, C.gold, a * (1 - ph) * .9, 2.2 - ph); }
    var cyc = (t % 3.2) / 3.2; if (cyc > .78) { var tp = pop((cyc - .78) / .12); tick(ctx, mx + 14 * s, my - 22, 7 * tp, a, C.gold); } }
  // Rev 1.1: the scroll floats out beside him (clear of his body and wings), held to his hand by a dotted thread of light
  var SCROLL = { dx: 68, dy: -60 };
  function scroll(ctx, s, a, t) { var u = (t % 3.6) / 3.6, open = pop(Math.min(1, u * 2.2)), h = 8 + 46 * open, w = 32;
    var out = pop(Math.min(1, u * 4)), sx = s * SCROLL.dx * out, sy = SCROLL.dy * out + Math.sin(t * 1.8) * 2.5;
    ctx.setLineDash([2, 4]); ctx.lineDashOffset = -t * 10; ctx.beginPath(); ctx.moveTo(0, -4); ctx.quadraticCurveTo(sx * .3, sy * .9, sx - s * (w / 2 + 2), sy + 6);
    sk(ctx, C.gold, a * .75 * out, 1.6); ctx.setLineDash([]);
    ctx.save(); ctx.translate(sx, sy);
    ctx.beginPath(); ctx.rect(-w / 2, 0, w, h); fl(ctx, C.paper, a * .18); sk(ctx, C.paper, a, 1.8);
    [0, h].forEach(function (y) { ctx.beginPath(); ctx.ellipse(0, y, w / 2 + 3, 2.6, 0, 0, 6.283); fl(ctx, C.deep, a); sk(ctx, C.gold, a, 1.8); });
    var lines = Math.floor(open * 5); for (var i = 0; i < lines; i++) { var ly = 7 + i * 7, lw = (i === lines - 1 ? Math.min(1, (u * 2.2 * 5) % 1 + .2) : 1) * (w - 8 - (i % 2) * 5);
      ctx.beginPath(); ctx.moveTo(-w / 2 + 4, ly); ctx.lineTo(-w / 2 + 4 + lw, ly); sk(ctx, C.gold, a * .95, 1.6); }
    if (u > .6) { var sp = Math.max(0, Math.sin((u - .6) / .4 * Math.PI)); star(ctx, w / 2 + 6, -4, 2 + 7 * sp, C.goldHi, a * sp); }
    ctx.restore(); }
  function hand(ctx, kind, x, y, d, s, a, t) {
    var n = [-d[1], d[0]], ang = Math.atan2(d[1], d[0]);
    ctx.save(); ctx.translate(x, y);
    if (kind === 'wave' || kind === 'vision') {
      if (kind === 'vision') { var gw = .5 + .5 * Math.sin(t * 6);      // the palm glows; the idea orb itself floats outside him (ideaOrb)
        var pg = ctx.createRadialGradient(0, -6, 0, 0, -6, 16); pg.addColorStop(0, rgba(C.goldHi, a * (.35 + .3 * gw))); pg.addColorStop(1, rgba(C.gold, 0));
        ctx.beginPath(); ctx.arc(0, -6, 16, 0, 6.283); ctx.fillStyle = pg; ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 0, 6.4, 0, 6.283); fl(ctx, C.ink, a); sk(ctx, C.paper, a, 2.6);
      ctx.beginPath(); for (var i = -1.5; i <= 1.5; i++) { var g = ang + i * .34, bx = Math.cos(g) * 5.8, by = Math.sin(g) * 5.8;
        ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(g) * 5.4, by + Math.sin(g) * 5.4); } sk(ctx, C.paper, a, 2.6);
      var tg = ang - s * 1.35; ctx.beginPath(); ctx.moveTo(Math.cos(tg) * 5.8, Math.sin(tg) * 5.8); ctx.lineTo(Math.cos(tg) * 10.5, Math.sin(tg) * 10.5); sk(ctx, C.paper, a, 2.6);
      if (kind === 'wave') { var sw = Math.cos(t * 7);
        [0, 1, 2].forEach(function (q) { ctx.beginPath(); ctx.arc(0, 0, 15 + q * 5, ang - .7, ang + .7); sk(ctx, C.gold, a * (.85 - q * .25) * Math.abs(sw), 2.2 - q * .4); }); }
    } else {
      if (kind === 'herald' || kind === 'wand') trumpet(ctx, d, n, s, a, t);
      if (kind === 'scroll') scroll(ctx, s, a, t);
      if (kind === 'rest') lily(ctx, 0, 0, d[0] * .3 + s * .5, -1, 20, a, t);
      var sc = kind === 'thumb' ? 1 + .18 * Math.max(0, 1 - ((t % 1.6) / .5)) : 1; ctx.scale(sc, sc);
      ctx.beginPath(); ctx.arc(0, 0, 6.2, 0, 6.283); fl(ctx, C.ink, a); sk(ctx, C.paper, a, 2.6);
      ctx.beginPath(); for (var k = -1; k <= 1; k++) { ctx.moveTo(d[0] * 1.5 + n[0] * k * 2.4, d[1] * 1.5 + n[1] * k * 2.4); ctx.lineTo(d[0] * 5 + n[0] * k * 2.4, d[1] * 5 + n[1] * k * 2.4); }
      sk(ctx, C.paper, a * .7, 1.3);
      if (kind === 'point') { ctx.beginPath(); ctx.moveTo(d[0] * 4.5, d[1] * 4.5); ctx.lineTo(d[0] * 15, d[1] * 15); sk(ctx, C.paper, a, 3);
        var k2 = Math.pow(Math.max(0, Math.sin(t * 4)), 3), tipx = d[0] * 22, tipy = d[1] * 22;
        for (var r = 0; r < 8; r++) { var gg = r * Math.PI / 4 + .2; ctx.beginPath(); ctx.moveTo(tipx + Math.cos(gg) * (5 + 3 * k2), tipy + Math.sin(gg) * (5 + 3 * k2));
          ctx.lineTo(tipx + Math.cos(gg) * (9 + 11 * k2), tipy + Math.sin(gg) * (9 + 11 * k2)); sk(ctx, C.gold, a * (.35 + .65 * k2), 2.4); }
        star(ctx, tipx, tipy, 3.5 + 3 * k2, C.paper, a); }
      if (kind === 'thumb') { ctx.beginPath(); ctx.moveTo(-1.5 * s, -5); ctx.lineTo(-1.5 * s, -14); sk(ctx, C.paper, a, 3.6);
        ctx.beginPath(); ctx.arc(-1.5 * s, -14, 1.6, 0, 6.283); fl(ctx, C.paper, a);
        var bp = pop(((t % 1.6) - .15) / .3); if (bp > 0) tick(ctx, 16 * s, -14, 7 * bp, a, C.gold);
        if ((t % 1.6) < .5) { var ring = (t % 1.6) / .5; ctx.beginPath(); ctx.arc(-1.5 * s, -10, 8 + 14 * ring, 0, 6.283); sk(ctx, C.gold, a * (1 - ring) * .7, 1.8); } }
    }
    ctx.restore();
  }
  // the idea orb (vision, Rev 1.1): rises off the palm, floats out beside him, clear of his body and wings, and holds there
  // as a big idea bubble: thought-bubble beads back to the palm, a double ring, turning rays, orbiting sparks, a spinning star
  var ORB = { cycle: 4.4, lead: 1.8, dx: 100, dy: -92, r: 22 };
  function ideaOrb(ctx, wx, wy, s, a, t) {
    var u = ((t + ORB.lead) % ORB.cycle) / ORB.cycle, go = pop(Math.min(1, u / .22)), fade = u > .9 ? 1 - (u - .9) / .1 : 1;
    var fx = wx + s * ORB.dx, fy = wy + ORB.dy + Math.sin(t * 2.1) * 3.5, cx = wx + s * 30 * go, cy = wy - 4 - (ORB.dy * -1 + 30) * go * .5;
    var x = wx + (fx - wx) * go + (cx - wx) * (1 - go) * go * .9, y = wy - 6 + (fy - wy + 6) * go + (cy - wy) * (1 - go) * go * .6;
    var r = (5 + (ORB.r - 5) * go) * (1 + .05 * Math.sin(t * 4.2)), A = a * fade;
    if (go > .55) for (var k = 0; k < 3; k++) { var f = (k + 1) / 4, bead = 2.4 + k * 1.6, bp = pop((go - .55) / .45 * 3 - k);   // thought-bubble beads
      if (bp > 0) { ctx.beginPath(); ctx.arc(wx + (x - wx) * f, wy - 8 + (y - wy + 8) * f - Math.sin(f * Math.PI) * 10, bead * bp, 0, 6.283); fl(ctx, C.deep, A * .9); sk(ctx, C.gold, A, 1.6); } }
    ctx.save(); ctx.translate(x, y);
    var g = ctx.createRadialGradient(0, 0, r * .4, 0, 0, r * 2.6); g.addColorStop(0, rgba(C.goldHi, A * .5)); g.addColorStop(1, rgba(C.gold, 0));
    ctx.beginPath(); ctx.arc(0, 0, r * 2.6, 0, 6.283); ctx.fillStyle = g; ctx.fill();
    for (var i = 0; i < 12; i++) { var q = i * Math.PI / 6 + t * .5, l = i % 2 ? 1.5 : 1.95 + .15 * Math.sin(t * 5 + i);   // turning rays
      ctx.beginPath(); ctx.moveTo(Math.cos(q) * r * 1.22, Math.sin(q) * r * 1.22); ctx.lineTo(Math.cos(q) * r * l, Math.sin(q) * r * l); sk(ctx, C.gold, A * .9, i % 2 ? 1.6 : 2.6); }
    ctx.setLineDash([3, 4]); ctx.lineDashOffset = -t * 12; ctx.beginPath(); ctx.arc(0, 0, r * 1.14, 0, 6.283); sk(ctx, C.goldHi, A * .8, 1.5); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); fl(ctx, C.deep, A); sk(ctx, C.paper, A, 3);
    ctx.beginPath(); ctx.arc(0, 0, r * .84, 0, 6.283); sk(ctx, C.gold, A, 2.2);
    ctx.save(); ctx.rotate(Math.sin(t * 1.3) * .35); var st = r * (.62 + .06 * Math.sin(t * 4.2));
    star(ctx, 0, 0, st, C.goldHi, A); ctx.rotate(Math.PI / 4); star(ctx, 0, 0, st * .5, C.gold, A * .7); ctx.restore();
    ctx.beginPath(); ctx.arc(-r * .3, -r * .32, r * .5, Math.PI * 1.05, Math.PI * 1.45); sk(ctx, C.paper, A * .7, 2);   // glint
    for (var m = 0; m < 3; m++) { var o = t * 1.6 + m * 2.094, ox = Math.cos(o) * r * 1.55, oy = Math.sin(o) * r * .62 - r * .1;   // orbiting sparks
      star(ctx, ox, oy, 2.6 + 1.6 * Math.max(0, Math.sin(o)), m % 2 ? C.paper : C.goldHi, A); }
    if (u > .86) { var bu = (u - .86) / .14; ctx.beginPath(); ctx.arc(0, 0, r * (1.2 + 1.6 * bu), 0, 6.283); sk(ctx, C.goldHi, a * (1 - bu) * .8, 2.4); }
    ctx.restore();
  }
  // Done (Rev 1.1, Logan 08:51 UTC: "when gabriel is done, have him send an idea to an ominoulsly glowing cloud"):
  // after the thumb pops, a small idea orb leaves his hand and arcs up into a dark cloud glowing from within; the cloud
  // takes it in with a flash and a flicker of light, then smoulders until the next one
  var CLOUD = { dx: 74, dy: -150, cycle: 3.2 };
  function cloudSend(ctx, hx, hy, s, a, t) {
    var u = (t % CLOUD.cycle) / CLOUD.cycle, cx = hx + s * CLOUD.dx, cy = hy + CLOUD.dy + Math.sin(t * 1.1) * 3;
    var hit = u > .62 && u < .82 ? Math.sin((u - .62) / .2 * Math.PI) : 0, glow = .45 + .2 * Math.sin(t * 2.3) + .5 * hit;
    var g = ctx.createRadialGradient(cx, cy + 4, 4, cx, cy + 4, 70); g.addColorStop(0, 'rgba(178,120,255,' + (a * .55 * glow) + ')');
    g.addColorStop(.5, 'rgba(246,164,140,' + (a * .18 * glow) + ')'); g.addColorStop(1, 'rgba(120,80,200,0)');
    ctx.beginPath(); ctx.arc(cx, cy + 4, 70, 0, 6.283); ctx.fillStyle = g; ctx.fill();
    var P = [[-26, 6, 15], [-10, -6, 19], [10, -9, 17], [26, 2, 14], [0, 8, 16], [-18, 12, 11], [18, 12, 11]];
    ctx.beginPath(); P.forEach(function (q) { ctx.moveTo(cx + q[0] + q[2], cy + q[1]); ctx.arc(cx + q[0], cy + q[1], q[2], 0, 6.283); });
    ctx.fillStyle = 'rgba(28,22,58,' + a + ')'; ctx.fill();
    P.forEach(function (q, i) { ctx.beginPath(); ctx.arc(cx + q[0], cy + q[1], q[2], Math.PI * (1.05 + i * .02), Math.PI * 1.95); sk(ctx, '214,190,255', a * (.55 + .4 * glow), 2); });
    ctx.beginPath(); ctx.moveTo(cx - 38, cy + 20); ctx.lineTo(cx + 38, cy + 20); sk(ctx, '214,190,255', a * .35, 1.4);
    var ig = ctx.createRadialGradient(cx, cy + 2, 0, cx, cy + 2, 24); ig.addColorStop(0, 'rgba(255,236,200,' + (a * .65 * glow) + ')'); ig.addColorStop(1, 'rgba(178,120,255,0)');
    ctx.beginPath(); ctx.arc(cx, cy + 2, 24, 0, 6.283); ctx.fillStyle = ig; ctx.fill();
    [[-14, 2], [12, -2]].forEach(function (e, k) { var ew = .5 + .5 * Math.sin(t * 1.7 + k); ctx.beginPath(); ctx.ellipse(cx + e[0], cy + e[1], 3.4, 1.4 + 1.2 * glow, 0, 0, 6.283); fl(ctx, C.goldHi, a * (.35 + .6 * glow) * ew); });
    if (hit > .3) { ctx.beginPath(); ctx.moveTo(cx + 4, cy + 18); ctx.lineTo(cx - 3, cy + 30); ctx.lineTo(cx + 4, cy + 31); ctx.lineTo(cx - 4, cy + 44); sk(ctx, C.goldHi, a * hit, 2.4); }
    if (u > .22 && u < .66) { var f = pop((u - .22) / .44), ox = hx + (cx - hx) * f - s * Math.sin(f * Math.PI) * 18, oy = hy - 14 + (cy - hy + 14) * f - Math.sin(f * Math.PI) * 30;
      for (var k = 1; k <= 4; k++) { var fb = Math.max(0, f - k * .05); ctx.beginPath();
        ctx.arc(hx + (cx - hx) * fb - s * Math.sin(fb * Math.PI) * 18, hy - 14 + (cy - hy + 14) * fb - Math.sin(fb * Math.PI) * 30, 4 - k * .7, 0, 6.283); fl(ctx, C.gold, a * (.6 - k * .12)); }
      radiant(ctx, ox, oy, 7 * (1 - .4 * f), a, t); }
    if (hit > 0) { ctx.beginPath(); ctx.arc(cx, cy, 30 + 30 * (u - .62) / .2, 0, 6.283); sk(ctx, '214,190,255', a * hit * .6, 2); }
  }
  function arm(ctx, s, pose, a, t, coat) {
    if (pose === 'wave' || pose === 'herald' || pose === 'wand') [.16, .08].forEach(function (dt, k) { var gh = geom(s, pose, t - dt);   // fading arm trail
      ctx.beginPath(); ctx.moveTo(gh.sh[0], gh.sh[1]); ctx.lineTo(gh.el[0], gh.el[1]); ctx.lineTo(gh.wr[0] + gh.d2[0] * 5, gh.wr[1] + gh.d2[1] * 5);
      sk(ctx, C.gold, a * (k ? .3 : .15), 12); });
    var g = geom(s, pose, t), d1 = g.d1, d2 = g.d2, sh = g.sh, el = g.el, wr = g.wr;
    ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(el[0], el[1]); ctx.lineTo(wr[0], wr[1]);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(C.paper, a); ctx.lineWidth = 18; ctx.stroke();
    ctx.strokeStyle = rgba(coat.fill, a); ctx.lineWidth = 12.2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(el[0] - d1[0] * 3, el[1] - d1[1] * 3); ctx.lineTo(el[0] + d2[0] * 3, el[1] + d2[1] * 3); sk(ctx, C.paper, a * .35, 1.2);
    var n2 = [-d2[1], d2[0]], cf = [wr[0] - d2[0] * 3.5, wr[1] - d2[1] * 3.5];
    ctx.beginPath(); ctx.moveTo(cf[0] + n2[0] * 6, cf[1] + n2[1] * 6); ctx.lineTo(cf[0] - n2[0] * 6, cf[1] - n2[1] * 6); sk(ctx, coat.trim, a, 2.8);
    if (coat.badge && s < 0) { var pm = [sh[0] + d1[0] * 8, sh[1] + d1[1] * 8]; ctx.beginPath(); ctx.arc(pm[0], pm[1], 4.6, 0, 6.283); fl(ctx, C.deep, a); sk(ctx, coat.trim, a, 1.3);
      logo(ctx, pm[0], pm[1], 2.1, a); }
    hand(ctx, pose === 'down' ? 'rest' : pose, wr[0] + d2[0] * 4.5, wr[1] + d2[1] * 4.5, d2, s, a, t);
    if (pose === 'vision') ideaOrb(ctx, wr[0] + d2[0] * 4.5, wr[1] + d2[1] * 4.5, s, a, t);
    if (pose === 'thumb') cloudSend(ctx, wr[0] + d2[0] * 4.5, wr[1] + d2[1] * 4.5, s, a, t);
  }

  function mee(ctx, t, a, opts) {
    opts = opts || {}; var coat = opts.coat || COATS.gb;
    var blink = (t % 3.6) > 3.44 || (t > .2 && t < .34);
    var right = opts.right || (t > .5 && t < 2.6 ? 'wave' : 'vision'), left = opts.left || 'down';
    // the wand in every action (Logan 08:50 UTC): a free resting hand raises the animated wand while the other arm acts
    if (opts.wand !== false && left === 'down' && right !== 'down' && right !== 'herald') left = 'wand';
    if (opts.wand !== false && right === 'down' && left !== 'down' && left !== 'herald') right = 'wand';
    var load = opts.load != null ? opts.load : (opts.bubble !== false && t > 1.6 && t < 2.3 ? .8 : .1);
    ctx.beginPath(); ctx.ellipse(0, 2, 32, 6, 0, 0, 6.283); sk(ctx, C.paper, a * .25, 2);
    if (opts.wings !== false) wings(ctx, a, t);
    if (opts.halo !== false) halo(ctx, a, t, 'back', load);
    ctx.beginPath(); ctx.moveTo(-9, -24); ctx.lineTo(-9, -8); ctx.moveTo(9, -24); ctx.lineTo(9, -8); sk(ctx, C.paper, a, 3);
    // sandals: oval soles in the accent with a strap
    ctx.beginPath(); ctx.ellipse(-12, -5, 9, 4.5, 0, 0, 6.283); ctx.moveTo(21, -5); ctx.ellipse(12, -5, 9, 4.5, 0, 0, 6.283); sk(ctx, C.gold, a, 2.5);
    ctx.beginPath(); ctx.moveTo(-15, -9); ctx.lineTo(-9, -4); ctx.moveTo(15, -9); ctx.lineTo(9, -4); sk(ctx, C.gold, a * .8, 1.4);
    coatBody(ctx, a, t, coat);
    rays(ctx, a, t, load);
    curls(ctx, a);
    ctx.beginPath(); ctx.arc(0, -124, 44, 0, 6.283); fl(ctx, C.ink, a); sk(ctx, C.paper, a, 3);
    // soft fringe of curls over the forehead
    ctx.beginPath(); ctx.arc(0, -124, 44, Math.PI * 1.08, Math.PI * 1.92); ctx.lineTo(41, -140); ctx.quadraticCurveTo(0, -150, -41, -140); fl(ctx, C.paper, a * .14);
    ctx.beginPath(); [[-30, -150, -20, -138], [-14, -153, -8, -140], [2, -154, 4, -140], [16, -153, 14, -140], [30, -150, 26, -139]].forEach(function (f) { ctx.moveTo(f[0], f[1]); ctx.bezierCurveTo(f[0] + 9, f[1] + 1, f[2] + 6, f[3] - 6, f[2], f[3]); }); sk(ctx, C.paper, a * .8, 1.9);
    // Rev 1.1 (Logan 08:53 UTC: "remove the little indicato / antennae above gabriel, make this a global change"): no antenna;
    // the halo is his link to the server. opts.antenna: true draws the Rev 1 quill again.
    if (opts.antenna === true) antenna(ctx, 3, -177, a, t);
    if (opts.halo !== false) halo(ctx, a, t, 'front', load);
    [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.moveTo(11 * s, -118); ctx.quadraticCurveTo(18 * s, -123, 25 * s, -119.5); sk(ctx, C.paper, a, 2.6); });
    [-1, 1].forEach(function (s) { var ex = 18 * s, ey = -103;
      if (blink) { ctx.beginPath(); ctx.moveTo(ex - 8, ey); ctx.quadraticCurveTo(ex, ey - 8, ex + 8, ey); sk(ctx, C.paper, a, 3); }
      else { ctx.beginPath(); ctx.ellipse(ex, ey, 8.5, 11, 0, 0, 6.283); fl(ctx, C.deep, a); sk(ctx, C.paper, a, 2.4);
        ctx.beginPath(); ctx.ellipse(ex, ey + 2.5, 6.2, 7.2, 0, 0, 6.283); fl(ctx, C.gold, a * .95);
        ctx.beginPath(); ctx.ellipse(ex, ey + 3.5, 3, 3.6, 0, 0, 6.283); fl(ctx, '120,84,20', a * .8);
        ctx.beginPath(); ctx.arc(ex - 2.8, ey - 4, 3.2, 0, 6.283); fl(ctx, C.paper, a); ctx.beginPath(); ctx.arc(ex + 2.8, ey + 4.8, 1.5, 0, 6.283); fl(ctx, C.paper, a); }
      ctx.beginPath(); ctx.moveTo(ex + 7 * s, ey - 9); ctx.lineTo(ex + 11 * s, ey - 12); sk(ctx, C.paper, a * .9, 1.8);
      ctx.beginPath(); ctx.ellipse(30 * s, -86, 6.5, 3.6, 0, 0, 6.283); fl(ctx, C.blush, a * .4);
      ctx.beginPath(); for (var q = -1; q <= 1; q++) { ctx.moveTo(30 * s + q * 4 - 2, -84); ctx.lineTo(30 * s + q * 4 + 2, -89); } sk(ctx, C.blush, a * .9, 1.4); });
    ctx.beginPath(); ctx.arc(0, -92, 1.6, 0, 6.283); fl(ctx, C.paper, a * .8);
    ctx.beginPath(); ctx.arc(-3, -85, 3, 0, Math.PI); ctx.moveTo(6, -85); ctx.arc(3, -85, 3, 0, Math.PI); sk(ctx, C.paper, a, 2);
    arm(ctx, -1, left, a, t, coat); arm(ctx, 1, right, a, t, coat);
    // Rev 1.1 (Logan 08:54 UTC): only the character travels; the twinkling stars round him are drawn only where asked
    // (opts.sparkles: true, on his own page)
    if (opts.sparkles === true) [[-72, -160, 0], [70, -40, 1.3], [-70, -24, 2.1], [72, -190, 3]].forEach(function (p, i) { var tw = Math.max(0, Math.sin(t * 2.6 + p[2]));
      star(ctx, p[0], p[1], 4 + 4 * tw, i % 2 ? C.paper : C.gold, a * tw); });
    var b = opts.bubble === false ? 0 : ease(1.6, .35, t); if (b > 0) { var dots = t < 2.3; ctx.save(); ctx.translate(96, -236); ctx.scale(b, b);
      ctx.beginPath(); ctx.moveTo(-32, -20); ctx.lineTo(32, -20); ctx.quadraticCurveTo(40, -20, 40, -12); ctx.lineTo(40, 12); ctx.quadraticCurveTo(40, 20, 32, 20); ctx.lineTo(-14, 20); ctx.lineTo(-26, 34); ctx.lineTo(-22, 20); ctx.lineTo(-32, 20); ctx.quadraticCurveTo(-40, 20, -40, 12); ctx.lineTo(-40, -12); ctx.quadraticCurveTo(-40, -20, -32, -20); fl(ctx, C.deep, a * .92); sk(ctx, C.paper, a, 2.5);
      if (dots) { for (var d = 0; d < 3; d++) { ctx.beginPath(); ctx.arc(-12 + d * 12, 0, 3.2, 0, 6.283); fl(ctx, C.paper, a * (.35 + .65 * (Math.floor(t * 6) % 3 === d))); } }
      else { radiant(ctx, -12, 0, 7, a, t); ctx.beginPath(); ctx.moveTo(12, 1); ctx.lineTo(18, 8); ctx.lineTo(29, -8); sk(ctx, C.gold, a, 3.5); }
      ctx.restore(); }
  }
  root.MeeGabriel = { draw: mee, palette: C, coats: COATS, poses: Object.keys(POSES), logo: logo, radiant: radiant, antennaTip: [0, -186], haloTop: [0, -186] };   // no antenna since Rev 1.1: the server line meets the halo
})(this);
