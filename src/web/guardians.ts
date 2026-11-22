/**
 * Bicycle Guardians (theory11) back — procedural recreation.
 * Near-black panel, silver "engraving" at 4 value levels: faint circuit
 * blocks / mid scrollwork-rays-rings / bright frame dots-bolts-bezel /
 * brightest archangel figure groups. 180-degree rotational symmetry.
 * Deterministic, pure canvas 2D.
 */

export function drawGuardiansBack(ctx: CanvasRenderingContext2D) {
  const W = 512, H = 716, CX = 256, CY = 358;
  /**
   * value levels
   */
  const GROUND = '#17171a';
  /**
   * mid scroll/rays/rings
   */
  const VB = '#6a6a70';
  /**
   * bright frame dots / bolts / bezel
   */
  const VC = '#a9adb8';
  /**
   * angels
   */
  const VD = '#d8d8dc';
  const DARK = '#141417';
  /**
   * engraving hatch over bright fills
   */
  const INKD = 'rgba(23,23,26,0.65)';
  const MED_R = 125, MED_TY = 225, MED_BY = 491;
  const CC_R = 75, CC_RI = 57;

  function mulberry32(a: number) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * ---- panel + keyline ----
   */
  const PX = 26, PY = 28, PW = W - 52, PH = H - 56;
  ctx.fillStyle = GROUND;
  ctx.fillRect(PX, PY, PW, PH);
  ctx.strokeStyle = VC; ctx.lineWidth = 1;
  ctx.strokeRect(PX + 1.5, PY + 1.5, PW - 3, PH - 3);
  ctx.save();
  ctx.beginPath(); ctx.rect(PX + 2, PY + 2, PW - 4, PH - 4); ctx.clip();

  /**
   * ---- circuit blocks (value a, very subtle punch-card field) ----
   */
  const rnd = mulberry32(0xC0FFEE);
  for (let x = 42; x < 466; x += 16) {
    let y = 46;
    while (y < 660) {
      const w = 6 + rnd() * 12, h = 6 + rnd() * 16;
      const bx = x + w / 2, by = y + h / 2;
      const dxc = Math.abs(bx - CX);
      const dens = dxc > 120 ? 0.62 : dxc > 70 ? 0.28 : 0.10;
      const dT = Math.hypot(bx - CX, by - MED_TY);
      const dB = Math.hypot(bx - CX, by - MED_BY);
      const dC = Math.hypot(bx - CX, by - CY);
      if (rnd() < dens && dT > 128 && dB > 128 && dC > 80) {
        const g = 0.5 + rnd() * 0.5;
        if (rnd() < 0.25) {
          ctx.strokeStyle = 'rgba(70,70,80,' + (0.4 * g).toFixed(2) + ')';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + rnd() * 3, y, w, h);
        } else {
          ctx.fillStyle = 'rgba(70,70,80,' + (0.38 * g).toFixed(2) + ')';
          ctx.fillRect(x + rnd() * 3, y, w, h);
        }
      }
      y += h + 4 + rnd() * 10;
    }
  }

  /**
   * ---- central circle (drawn first; figures overlap it) ----
   */
  (function centralCircle() {
    ctx.fillStyle = DARK;
    ctx.beginPath(); ctx.arc(CX, CY, CC_R, 0, 7); ctx.fill();
    /**
     * dense radial hatch band (rope/cog)
     */
    ctx.strokeStyle = VB; ctx.lineWidth = 0.8;
    for (let k = 0; k < 160; k++) {
      const a = k * Math.PI / 80;
      ctx.beginPath();
      ctx.moveTo(CX + CC_RI * Math.cos(a), CY + CC_RI * Math.sin(a));
      ctx.lineTo(CX + CC_R * Math.cos(a), CY + CC_R * Math.sin(a));
      ctx.stroke();
    }
    ctx.strokeStyle = VC; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(CX, CY, CC_R, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.arc(CX, CY, CC_RI, 0, 7); ctx.stroke();
    /**
     * faint 4-fold rosette, just above ground value
     */
    ctx.strokeStyle = '#202026'; ctx.lineWidth = 1.4;
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + Math.PI / 4;
      const px2 = CX + 40 * Math.cos(a), py2 = CY + 40 * Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.quadraticCurveTo(CX + 44 * Math.cos(a - 0.5), CY + 44 * Math.sin(a - 0.5), px2, py2);
      ctx.quadraticCurveTo(CX + 44 * Math.cos(a + 0.5), CY + 44 * Math.sin(a + 0.5), CX, CY);
      ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(CX, CY, 12, 0, 7); ctx.stroke();
    /**
     * side studs on the horizontal centerline
     */
    [-1, 1].forEach(function (s) {
      const x = CX + s * CC_R, y = CY;
      ctx.strokeStyle = VC; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.stroke();
      ctx.fillStyle = VC;
      ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + s * 6, y - 4); ctx.lineTo(x + s * 12, y); ctx.lineTo(x + s * 6, y + 4);
      ctx.closePath(); ctx.fill();
    });
  })();

  /**
   * C-curl fern/paisley engraving: double-line spiral with leaf barbs
   */
  function scroll(cx: number, cy: number, R: number, dir: number) {
    ctx.strokeStyle = '#74747c';
    [0, 2.6].forEach(function (off) {
      ctx.lineWidth = off ? 0.9 : 1.4;
      ctx.beginPath();
      for (let t = 0; t <= 1.001; t += 0.02) {
        const th = -Math.PI / 2 + dir * t * Math.PI * 3.4;
        const r = (R - off) * (1 - 0.8 * t);
        const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.lineWidth = 1;
    for (let i = 1; i <= 7; i++) {
      const t = i * 0.045;
      const th = -Math.PI / 2 + dir * t * Math.PI * 3.4;
      const r = R * (1 - 0.8 * t);
      const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 7 * Math.cos(th) - 3, y + 7 * Math.sin(th) - 7,
        x + 12 * Math.cos(th), y + 12 * Math.sin(th) - 2);
      ctx.stroke();
    }
  }

  /**
   * corner hex-nut emblem
   */
  function bolt(x: number, y: number) {
    ctx.strokeStyle = VC; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI / 6 + k * Math.PI / 3;
      const px2 = x + 14 * Math.cos(a), py2 = y + 14 * Math.sin(a);
      if (k === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
    }
    ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.stroke();
    ctx.fillStyle = VC;
    ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
  }

  /**
   * machined shaft running diagonally inward from a corner bolt
   */
  function lance(x0: number, y0: number, tx: number, ty: number) {
    const dx = tx - x0, dy = ty - y0, L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const len = 130;
    ctx.strokeStyle = '#84848c'; ctx.lineWidth = 1;
    [-1.8, 1.8].forEach(function (o) {
      ctx.beginPath();
      ctx.moveTo(x0 + nx * o, y0 + ny * o);
      ctx.lineTo(x0 + ux * len + nx * o, y0 + uy * len + ny * o);
      ctx.stroke();
    });
    ctx.fillStyle = VC;
    ctx.beginPath();
    ctx.moveTo(x0 + ux * (len + 16), y0 + uy * (len + 16));
    ctx.lineTo(x0 + ux * len + nx * 4.5, y0 + uy * len + ny * 4.5);
    ctx.lineTo(x0 + ux * len - nx * 4.5, y0 + uy * len - ny * 4.5);
    ctx.closePath(); ctx.fill();
  }

  /**
   * fill the medallion disc minus the central circle (they overlap)
   */
  function fillMedallion(my: number, r: number) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.arc(CX, CY, CC_R + 1, 0, 2 * Math.PI);
    /**
     * everywhere except the central disc
     */
    ctx.clip('evenodd');
    ctx.beginPath();
    ctx.arc(CX, my, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  /**
   * ==== symmetric half content (top medallion), then rotated 180deg ====
   */
  function half() {
    const MX = CX, MY = MED_TY;

    /**
     * ---- sunburst rays (value b) ----
     */
    const rr = mulberry32(0xBADA55);
    ctx.strokeStyle = 'rgba(115,115,125,0.5)';
    ctx.lineWidth = 0.65;
    function rayFan(cx: number, cy: number, r0: number, side: number, n: number) {
      for (let i = 0; i < n; i++) {
        const a = (side > 0 ? 0 : Math.PI) + (rr() - 0.5) * 1.25;
        const r1 = r0 + 4 + rr() * 8, r2 = r0 + 18 + rr() * 48;
        ctx.beginPath();
        ctx.moveTo(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a));
        ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
        ctx.stroke();
      }
    }
    rayFan(MX, MY, MED_R - 4, 1, 26); rayFan(MX, MY, MED_R - 4, -1, 26);
    rayFan(CX, CY, CC_R + 4, 1, 30); rayFan(CX, CY, CC_R + 4, -1, 30);
    /**
     * longer accent rays from the central circle toward the frame
     */
    ctx.lineWidth = 0.55;
    for (let i = 0; i < 16; i++) {
      const a = (i % 2 ? 0 : Math.PI) + (rr() - 0.5) * 0.8;
      const r2 = 130 + rr() * 85;
      ctx.beginPath();
      ctx.moveTo(CX + (CC_R + 8) * Math.cos(a), CY + (CC_R + 8) * Math.sin(a));
      ctx.lineTo(CX + r2 * Math.cos(a), CY + r2 * Math.sin(a));
      ctx.stroke();
    }

    /**
     * ---- acanthus scrolls between rim and frame ----
     */
    scroll(102, 208, 46, 1);
    scroll(140, 292, 24, -1);
    scroll(410, 208, 46, -1);
    scroll(372, 292, 24, 1);
    scroll(86, 300, 18, 1);
    scroll(426, 300, 18, -1);
    scroll(158, 322, 20, -1);
    scroll(354, 322, 20, 1);

    /**
     * ---- medallion interior lift (excluding the central disc) ----
     */
    ctx.fillStyle = '#1d1d22';
    fillMedallion(MY, MED_R - 2);
    /**
     * rings: full circles except the arc hidden by the central circle
     */
    ctx.strokeStyle = '#85858d';
    [MED_R, MED_R - 6, MED_R - 13].forEach(function (r, i) {
      const D = CY - MY;
      const s = (r * r + D * D - CC_R * CC_R) / (2 * D * r);
      const gap = Math.asin(Math.min(1, s));
      ctx.lineWidth = i === 0 ? 1.4 : 1;
      ctx.beginPath();
      ctx.arc(MX, MY, r, Math.PI - gap, gap + 2 * Math.PI);
      ctx.stroke();
    });
    /**
     * watch-bezel ticks outside the rim (skip across the central circle)
     */
    ctx.strokeStyle = VC; ctx.lineWidth = 1;
    for (let k = 0; k < 72; k++) {
      const a = k * Math.PI / 36;
      const mx2 = MX + (MED_R + 6.5) * Math.cos(a), my2 = MY + (MED_R + 6.5) * Math.sin(a);
      if (Math.hypot(mx2 - CX, my2 - CY) < CC_R + 3) continue;
      ctx.beginPath();
      ctx.moveTo(MX + (MED_R + 3) * Math.cos(a), MY + (MED_R + 3) * Math.sin(a));
      ctx.lineTo(MX + (MED_R + 10) * Math.cos(a), MY + (MED_R + 10) * Math.sin(a));
      ctx.stroke();
    }

    /**
     * ---- corner bolts + lances (cross behind the wings) ----
     */
    bolt(66, 68); bolt(W - 66, 68);
    lance(76, 78, MX - 50, MY - 50);
    lance(W - 76, 78, MX + 50, MY - 50);

    /**
     * ---- faint glow behind the figure ----
     */
    const g = ctx.createRadialGradient(MX, MY + 10, 10, MX, MY + 10, 118);
    g.addColorStop(0, 'rgba(130,130,142,0.22)');
    g.addColorStop(1, 'rgba(130,130,142,0)');
    ctx.fillStyle = g;
    fillMedallion(MY, MED_R - 3);

    /**
     * ---- the archangel group ----
     */
    angel();
  }

  function angel() {
    const AX = 256;

    /**
     * --- great wings: arm curve sweeping up-and-out toward the top
     * corners; three rows of dense overlapping round-tipped feathers
     * hang from it, rotating from "down by the body" to "up-and-out"
     * at the tip. Dark under-strokes give the separations.
     */
    function wing(side: number) {
      /**
       * shoulder root
       */
      const SXW = AX + side * 14, SYW = 148;
      /**
       * arm control
       */
      const CXW = AX + side * 34, CYW = 70;
      /**
       * wrist/tip
       */
      const TXW = AX + side * 90, TYW = 78;
      function armPt(t: number) {
        const u = 1 - t;
        return [
          u * u * SXW + 2 * u * t * CXW + t * t * TXW,
          u * u * SYW + 2 * u * t * CYW + t * t * TYW
        ];
      }
      function fDir(t: number) {
        /**
         * down near body -> up-and-out at tip
         */
        const aDeg = 95 - 120 * t;
        return side > 0 ? aDeg * Math.PI / 180 : Math.PI - aDeg * Math.PI / 180;
      }
      function fLen(t: number) { return 32 + 26 * Math.pow(t, 1.3); }
      function row(n: number, t0: number, t1: number, scale: number, w: number, fill: string, sep: string) {
        for (let k = n - 1; k >= 0; k--) {
          const t = t0 + (t1 - t0) * k / (n - 1);
          const p = armPt(t), a = fDir(t), L = fLen(t) * scale;
          const tx2 = p[0] + L * Math.cos(a), ty2 = p[1] + L * Math.sin(a);
          const mx2 = (p[0] + tx2) / 2, my2 = (p[1] + ty2) / 2 + L * 0.09;
          ctx.lineCap = 'round';
          ctx.strokeStyle = sep; ctx.lineWidth = w + 1.6;
          ctx.beginPath(); ctx.moveTo(p[0], p[1]);
          ctx.quadraticCurveTo(mx2, my2, tx2, ty2); ctx.stroke();
          ctx.strokeStyle = fill; ctx.lineWidth = w;
          ctx.beginPath(); ctx.moveTo(p[0], p[1]);
          ctx.quadraticCurveTo(mx2, my2, tx2, ty2); ctx.stroke();
          /**
           * fine engraving shading along the vane
           */
          ctx.strokeStyle = 'rgba(23,23,26,0.32)'; ctx.lineWidth = 0.5;
          const nx = -Math.sin(a), ny = Math.cos(a);
          [-w * 0.26, w * 0.22].forEach(function (o) {
            ctx.beginPath();
            ctx.moveTo(p[0] + nx * o + (tx2 - p[0]) * 0.2, p[1] + ny * o + (ty2 - p[1]) * 0.2);
            ctx.quadraticCurveTo(mx2 + nx * o, my2 + ny * o, tx2 + nx * o * 0.4, ty2 + ny * o * 0.4);
            ctx.stroke();
          });
          ctx.lineCap = 'butt';
        }
      }
      /**
       * long slender primaries (base layer)
       */
      row(20, 0.04, 1.0, 1.0, 8, VD, 'rgba(23,23,26,0.8)');
      /**
       * medium row over their bases
       */
      row(14, 0.02, 0.9, 0.55, 7.5, '#c6c6cd', 'rgba(23,23,26,0.7)');
      /**
       * short rounded coverts hugging the arm
       */
      row(9, 0.0, 0.55, 0.3, 8.5, VD, 'rgba(23,23,26,0.7)');
      /**
       * bright arm ridge covering the feather roots
       */
      ctx.lineCap = 'round';
      ctx.strokeStyle = VD; ctx.lineWidth = 6.5;
      ctx.beginPath(); ctx.moveTo(SXW, SYW);
      ctx.quadraticCurveTo(CXW, CYW, TXW, TYW); ctx.stroke();
      ctx.strokeStyle = 'rgba(23,23,26,0.5)'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(SXW, SYW + 3.5);
      ctx.quadraticCurveTo(CXW, CYW + 3.5, TXW, TYW + 3.5); ctx.stroke();
      ctx.lineCap = 'butt';
    }
    wing(-1);
    wing(1);

    /**
     * --- the archangel: solid bright figure standing in the medallion ---
     */
    ctx.save();
    ctx.translate(256, 0); ctx.scale(1.12, 1); ctx.translate(-256, 0);
    /**
     * legs in greaves, slightly apart
     */
    ctx.fillStyle = VD;
    /**
     * left leg
     */
    ctx.beginPath();
    ctx.moveTo(243, 210); ctx.lineTo(252, 210);
    ctx.lineTo(251, 274); ctx.lineTo(244, 274); ctx.closePath(); ctx.fill();
    /**
     * right leg
     */
    ctx.beginPath();
    ctx.moveTo(260, 210); ctx.lineTo(269, 210);
    ctx.lineTo(268, 274); ctx.lineTo(261, 274); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INKD; ctx.lineWidth = 0.8;
    [222, 238, 256].forEach(function (yy) {
      ctx.beginPath(); ctx.moveTo(244, yy); ctx.quadraticCurveTo(248, yy + 2, 252, yy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(261, yy); ctx.quadraticCurveTo(265, yy + 2, 268, yy); ctx.stroke();
    });
    /**
     * small feet on the fallen figure
     */
    ctx.fillStyle = VD;
    ctx.fillRect(239, 274, 13, 6);
    ctx.fillRect(261, 274, 13, 6);

    /**
     * tasset skirt: overlapping plates
     */
    ctx.fillStyle = '#cfcfd5';
    [-1.5, -0.5, 0.5, 1.5].forEach(function (s) {
      ctx.beginPath();
      ctx.moveTo(256 + s * 8 - 5, 182);
      ctx.lineTo(256 + s * 8 + 5, 182);
      ctx.lineTo(256 + s * 10.5 + 5.5, 212);
      ctx.lineTo(256 + s * 10.5 - 5.5, 212);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = INKD; ctx.lineWidth = 0.8; ctx.stroke();
    });

    /**
     * breastplate: one bright shape, broad shoulders to narrow waist
     */
    ctx.fillStyle = VD;
    ctx.beginPath();
    ctx.moveTo(238, 134);
    ctx.lineTo(274, 134);
    ctx.quadraticCurveTo(272, 162, 265, 184);
    ctx.lineTo(247, 184);
    ctx.quadraticCurveTo(240, 162, 238, 134);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INKD; ctx.lineWidth = 0.9;
    [148, 160, 172].forEach(function (yy) {
      ctx.beginPath(); ctx.moveTo(244, yy); ctx.quadraticCurveTo(256, yy + 4, 268, yy); ctx.stroke();
    });
    /**
     * pauldrons
     */
    ctx.fillStyle = '#c7c7cd';
    ctx.beginPath(); ctx.arc(239, 138, 7, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(273, 138, 7, 0, 7); ctx.fill();

    /**
     * neck + head with hair mass
     */
    ctx.fillStyle = VD;
    ctx.fillRect(251, 122, 10, 12);
    ctx.beginPath(); ctx.arc(256, 112, 9.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#a9adb8';
    ctx.beginPath();
    ctx.arc(256, 109, 10, Math.PI * 0.9, Math.PI * 2.1);
    ctx.quadraticCurveTo(268, 118, 264, 124);
    ctx.quadraticCurveTo(262, 116, 256, 114);
    ctx.quadraticCurveTo(250, 116, 248, 124);
    ctx.quadraticCurveTo(244, 118, 246, 112);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(23,23,26,0.5)'; ctx.lineWidth = 0.7;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(256 + i * 2.4, 102);
      ctx.quadraticCurveTo(256 + i * 3.4, 110, 256 + i * 4, 118 + Math.abs(i));
      ctx.stroke();
    }

    /**
     * --- spear in front of the body: vertical shaft on the centerline ---
     */
    ctx.strokeStyle = VD; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(AX, 88); ctx.lineTo(AX, 298); ctx.stroke();
    ctx.strokeStyle = 'rgba(23,23,26,0.45)'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(AX + 1.1, 98); ctx.lineTo(AX + 1.1, 295); ctx.stroke();
    ctx.fillStyle = VD;
    /**
     * small finial at top
     */
    ctx.beginPath();
    ctx.moveTo(AX, 72);
    ctx.quadraticCurveTo(AX + 4.5, 81, AX, 89);
    ctx.quadraticCurveTo(AX - 4.5, 81, AX, 72);
    ctx.closePath(); ctx.fill();
    /**
     * downward leaf spearhead aimed at the central circle
     */
    ctx.beginPath();
    ctx.moveTo(AX, 312);
    ctx.quadraticCurveTo(AX - 6.5, 300, AX - 2, 290);
    ctx.lineTo(AX + 2, 290);
    ctx.quadraticCurveTo(AX + 6.5, 300, AX, 312);
    ctx.closePath(); ctx.fill();

    /**
     * arms: bent, both hands gripping the shaft (chest + waist)
     */
    ctx.strokeStyle = '#cdcdd3'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    /**
     * right arm: shoulder -> elbow out -> hand at chest
     */
    ctx.beginPath();
    ctx.moveTo(272, 140); ctx.lineTo(283, 158); ctx.lineTo(261, 151);
    ctx.stroke();
    /**
     * left arm: shoulder -> elbow out -> hand at waist
     */
    ctx.beginPath();
    ctx.moveTo(240, 140); ctx.lineTo(231, 166); ctx.lineTo(251, 184);
    ctx.stroke();
    ctx.lineCap = 'butt';
    /**
     * hands wrap the shaft
     */
    ctx.fillStyle = VD;
    ctx.beginPath(); ctx.arc(256.5, 151, 4.5, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(255.5, 184, 4.5, 0, 7); ctx.fill();
    ctx.restore();

    /**
     * --- round 6-spoke wheel shield at his left hip ---
     */
    const SX = 281, SY = 196, SR = 23;
    ctx.fillStyle = 'rgba(23,23,26,0.8)';
    ctx.beginPath(); ctx.arc(SX, SY, SR, 0, 7); ctx.fill();
    ctx.strokeStyle = VD; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(SX, SY, SR, 0, 7); ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(SX, SY, SR - 4.5, 0, 7); ctx.stroke();
    ctx.lineWidth = 2;
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3 + 0.3;
      ctx.beginPath(); ctx.moveTo(SX, SY);
      ctx.lineTo(SX + (SR - 4.5) * Math.cos(a), SY + (SR - 4.5) * Math.sin(a)); ctx.stroke();
    }
    ctx.fillStyle = VD;
    ctx.beginPath(); ctx.arc(SX, SY, 4, 0, 7); ctx.fill();

    /**
     * --- cloudy mass grounding the scene (value a/b) ---
     */
    const rc = mulberry32(0xFEED);
    for (let i = 0; i < 26; i++) {
      const a = rc() * Math.PI * 2, rr2 = rc() * 62;
      const bx = 256 + Math.cos(a) * rr2 * 1.35, by = 306 + Math.sin(a) * rr2 * 0.45;
      ctx.fillStyle = 'rgba(120,120,132,' + (0.05 + rc() * 0.07).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(bx, by, 10 + rc() * 16, 0, 7); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(140,140,152,0.35)'; ctx.lineWidth = 0.7;
    for (let i = 0; i < 9; i++) {
      const bx = 190 + rc() * 130, by = 298 + rc() * 26, rw = 12 + rc() * 20;
      ctx.beginPath();
      ctx.arc(bx, by, rw, Math.PI * (1.05 + rc() * 0.2), Math.PI * (1.85 + rc() * 0.15));
      ctx.stroke();
    }

    /**
     * --- fallen figure sprawled on its back beneath the angel ---
     */
    const F = '#9a9ea8';
    ctx.fillStyle = F;
    ctx.save();
    ctx.translate(248, 296); ctx.rotate(-0.1);
    ctx.beginPath(); ctx.ellipse(0, 0, 24, 12, 0, 0, 7); ctx.fill();
    ctx.restore();
    /**
     * head fallen back to one side
     */
    ctx.beginPath(); ctx.arc(214, 292, 7.5, 0, 7); ctx.fill();
    ctx.strokeStyle = F; ctx.lineCap = 'round';
    /**
     * arms flung out to each side
     */
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(234, 292); ctx.lineTo(200, 310); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(264, 290); ctx.lineTo(296, 281); ctx.stroke();
    /**
     * legs: one knee bent up, one sprawled
     */
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(266, 298); ctx.lineTo(287, 280); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(287, 280); ctx.lineTo(300, 298); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(264, 302); ctx.lineTo(298, 318); ctx.stroke();
    ctx.lineCap = 'butt';
    /**
     * ribcage hatch
     */
    ctx.strokeStyle = 'rgba(23,23,26,0.5)'; ctx.lineWidth = 0.7;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(232 + i * 6, 290); ctx.lineTo(236 + i * 6, 304);
      ctx.stroke();
    }
  }
  /**
   * ---- draw both halves (bottom = top rotated 180deg about center) ----
   */
  half();
  ctx.save();
  ctx.translate(CX, CY); ctx.rotate(Math.PI); ctx.translate(-CX, -CY);
  half();
  ctx.restore();

  /**
   * end panel clip
   */
  ctx.restore();

  /**
   * ---- beaded double pinstripe frame ----
   */
  ctx.strokeStyle = '#b8bcc6';
  ctx.lineCap = 'round';
  ctx.setLineDash([0.1, 4]);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(PX + 10, PY + 10, PW - 20, PH - 20);
  ctx.lineWidth = 1.2;
  ctx.strokeRect(PX + 15, PY + 15, PW - 30, PH - 30);
  ctx.setLineDash([]);
  ctx.lineCap = 'butt';
}
