const canvas = document.getElementById("lilyCanvas");
const ctx = canvas.getContext("2d");
const loading = document.getElementById("loading");

let W = 0;
let H = 0;

const particles = [];

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W;
  canvas.height = H;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function addParticle(x, y, size, r, g, b, alpha, move) {
  particles.push({
    x: x,
    y: y,

    baseX: x,
    baseY: y,

    size: size,

    r: r,
    g: g,
    b: b,

    alpha: alpha,

    move: move,

    speed: random(0.5, 1.5),

    phase: random(0, Math.PI * 2)
  });
}

/* PEMBE LILYUM */

function createLily() {
  particles.length = 0;

  const cx = W / 2;
  const cy = H * 0.43;

  const scale = Math.min(W, H) / 650;

  /* 6 TAÇ YAPRAK */

  for (let petal = 0; petal < 6; petal++) {

    const angle =
      petal *
      (Math.PI * 2 / 6) -
      Math.PI / 2;

    for (let i = 0; i < 500; i++) {

      const t = Math.random();

      const length =
        t *
        155 *
        scale;

      const width =
        Math.sin(t * Math.PI) *
        58 *
        scale;

      const side =
        random(-1, 1);

      const localX =
        length;

      const localY =
        side *
        width;

      const x =
        cx +
        localX * Math.cos(angle) -
        localY * Math.sin(angle);

      const y =
        cy +
        localX * Math.sin(angle) +
        localY * Math.cos(angle);

      const brightness =
        random(0.7, 1);

      addParticle(
        x,
        y,

        random(0.5, 1.8),

        255,

        55 + brightness * 100,

        140 + brightness * 90,

        random(0.3, 0.95),

        random(1, 4)
      );
    }
  }

  /* LILYUM MERKEZİ */

  for (let i = 0; i < 500; i++) {

    const angle =
      random(0, Math.PI * 2);

    const radius =
      Math.sqrt(Math.random()) *
      35 *
      scale;

    const x =
      cx +
      Math.cos(angle) *
      radius;

    const y =
      cy +
      Math.sin(angle) *
      radius;

    addParticle(
      x,
      y,

      random(0.7, 2.2),

      255,

      random(170, 230),

      random(30, 90),

      random(0.5, 1),

      random(1, 5)
    );
  }

  /* YEŞİL SAP */

  for (let i = 0; i < 900; i++) {

    const t =
      Math.random();

    const x =
      cx +
      Math.sin(t * 3) *
      20 *
      scale +
      random(-7, 7);

    const y =
      cy +
      20 +
      t *
      330 *
      scale;

    addParticle(
      x,
      y,

      random(0.4, 1.5),

      random(60, 120),

      random(170, 245),

      random(90, 160),

      random(0.25, 0.85),

      random(1, 4)
    );
  }
}

/* ANİMASYON */

function animate(time) {

  ctx.fillStyle =
    "rgba(0, 0, 0, 0.25)";

  ctx.fillRect(
    0,
    0,
    W,
    H
  );

  const t =
    time * 0.001;

  ctx.globalCompositeOperation =
    "lighter";

  for (let i = 0; i < particles.length; i++) {

    const p =
      particles[i];

    const x =
      p.baseX +
      Math.sin(
        t *
        p.speed +
        p.phase
      ) *
      p.move;

    const y =
      p.baseY +
      Math.cos(
        t *
        p.speed +
        p.phase
      ) *
      p.move;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;

    ctx.fill();
  }

  ctx.globalCompositeOperation =
    "source-over";

  requestAnimationFrame(
    animate
  );
}

/* BAŞLAT */

resize();

createLily();

/* Yazıyı kesin olarak gizle */

loading.style.opacity = "0";

loading.style.visibility = "hidden";

requestAnimationFrame(
  animate
);

window.addEventListener(
  "resize",
  () => {

    resize();

    createLily();

  }
);
