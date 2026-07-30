const şu canvas = document.getElementById("lilyCanvas");
const ctx = canvas.getContext("2d");

const loading = document.getElementById("loading");

let width;
let height;
let dpr;

let particles = [];

const PARTICLE_COUNT = 9000;

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

/* --------------------------------------------------
   LILY SHAPE
-------------------------------------------------- */

function createPetal(
  centerX,
  centerY,
  angle,
  petalLength,
  petalWidth,
  count,
  color
) {
  for (let i = 0; i < count; i++) {
    const t = Math.random();

    const distance = t * petalLength;

    const curve =
      Math.sin(t * Math.PI) *
      petalWidth;

    const side = random(-1, 1);

    const localX =
      distance +
      Math.cos(t * Math.PI) *
      petalLength *
      0.12;

    const localY =
      side *
      curve *
      random(0.2, 1);

    const x =
      centerX +
      localX * Math.cos(angle) -
      localY * Math.sin(angle);

    const y =
      centerY +
      localX * Math.sin(angle) +
      localY * Math.cos(angle);

    particles.push({
      x,
      y,

      baseX: x,
      baseY: y,

      size: random(0.35, 1.8),

      color,

      phase: random(0, Math.PI * 2),

      speed: random(0.4, 1.5),

      movement: random(1, 5),

      alpha: random(0.25, 1),

      type: "petal"
    });
  }
}

function createLily(
  centerX,
  centerY,
  scale = 1
) {
  const pinkColors = [
    [255, 45, 145],
    [255, 85, 175],
    [255, 125, 205],
    [255, 175, 225],
    [255, 215, 240]
  ];

  /* 6 büyük pembe taç yaprak */

  for (let p = 0; p < 6; p++) {
    const angle =
      (Math.PI * 2 / 6) * p -
      Math.PI / 2;

    createPetal(
      centerX,
      centerY,
      angle,
      random(105, 145) * scale,
      random(45, 65) * scale,
      850,
      pinkColors[
        Math.floor(
          Math.random() *
          pinkColors.length
        )
      ]
    );
  }

  /* Lilyumun parlak merkezi */

  for (let i = 0; i < 650; i++) {
    const angle =
      Math.random() *
      Math.PI *
      2;

    const radius =
      Math.pow(
        Math.random(),
        1.8
      ) *
      35 *
      scale;

    const x =
      centerX +
      Math.cos(angle) *
      radius;

    const y =
      centerY +
      Math.sin(angle) *
      radius;

    particles.push({
      x,
      y,

      baseX: x,
      baseY: y,

      size: random(0.5, 2.2),

      color: [
        255,
        random(175, 230),
        random(40, 110)
      ],

      phase: random(
        0,
        Math.PI * 2
      ),

      speed: random(
        0.7,
        2
      ),

      movement: random(
        1,
        5
      ),

      alpha: random(
        0.4,
        1
      ),

      type: "center"
    });
  }

  /* Yeşil sap */

  for (let i = 0; i < 1000; i++) {
    const t = Math.random();

    const y =
      centerY +
      20 * scale +
      t *
      300 *
      scale;

    const curve =
      Math.sin(
        t *
        Math.PI
      ) *
      30 *
      scale;

    const x =
      centerX +
      curve +
      random(
        -8,
        8
      ) *
      scale;

    particles.push({
      x,
      y,

      baseX: x,
      baseY: y,

      size: random(
        0.4,
        1.6
      ),

      color: [
        random(
          70,
          130
        ),

        random(
          180,
          255
        ),

        random(
          100,
          170
        )
      ],

      phase: random(
        0,
        Math.PI * 2
      ),

      speed: random(
        0.3,
        1
      ),

      movement: random(
        1,
        4
      ),

      alpha: random(
        0.25,
        0.9
      ),

      type: "stem"
    });
  }
}

/* --------------------------------------------------
   BACKGROUND PARTICLES
-------------------------------------------------- */

function createFloatingParticles() {
  for (let i = 0; i < 800; i++) {
    const x =
      random(
        0,
        width
      );

    const y =
      random(
        0,
        height
      );

    particles.push({
      x,
      y,

      baseX: x,
      baseY: y,

      size: random(
        0.2,
        1.1
      ),

      color: [
        255,
        random(
          40,
          150
        ),

        random(
          120,
          220
        )
      ],

      phase: random(
        0,
        Math.PI * 2
      ),

      speed: random(
        0.15,
        0.5
      ),

      movement: random(
        3,
        15
      ),

      alpha: random(
        0.05,
        0.35
      ),

      type: "dust"
    });
  }
}

/* --------------------------------------------------
   CREATE SCENE
-------------------------------------------------- */

function buildScene() {
  particles = [];

  const scale =
    Math.min(
      width,
      height
    ) /
    650;

  createLily(
    width / 2,
    height * 0.42,
    scale
  );

  createFloatingParticles();
}

/* --------------------------------------------------
   ANIMATION
-------------------------------------------------- */

function animate(time) {
  const t =
    time *
    0.001;

  ctx.fillStyle =
    "rgba(0, 0, 0, 0.18)";

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  ctx.globalCompositeOperation =
    "lighter";

  for (
    let i = 0;
    i < particles.length;
    i++
  ) {
    const p =
      particles[i];

    const waveX =
      Math.sin(
        t *
        p.speed +
        p.phase
      ) *
      p.movement;

    const waveY =
      Math.cos(
        t *
        p.speed *
        0.8 +
        p.phase
      ) *
      p.movement;

    const x =
      p.baseX +
      waveX;

    const y =
      p.baseY +
      waveY;

    const glow =
      p.type ===
      "center"
        ? 1.5
        : 1;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      p.size *
      glow,
      0,
      Math.PI *
      2
    );

    const [
      r,
      g,
      b
    ] =
      p.color;

    ctx.fillStyle =
      `rgba(${r}, ${g}, ${b}, ${p.alpha})`;

    ctx.fill();
  }

  ctx.globalCompositeOperation =
    "source-over";

  requestAnimationFrame(
    animate
  );
}

/* --------------------------------------------------
   START
-------------------------------------------------- */

resizeCanvas();

buildScene();

setTimeout(() => {
  loading.classList.add(
    "hide"
  );
}, 700);

requestAnimationFrame(
  animate
);

window.addEventListener(
  "resize",
  () => {
    resizeCanvas();
    buildScene();
  }
);b no
