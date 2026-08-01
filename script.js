const canvas = document.getElementById("lilyCanvas");
const ctx = canvas.getContext("2d");
const loading = document.getElementById("loading");

let W = 0;
let H = 0;
let dpr = 1;

let particles = [];
let imageDataCanvas;
let imageDataCtx;

const image = new Image();
image.src = "lily.png";

/* =========================================
   CANVAS BOYUTU
========================================= */

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * dpr;
  canvas.height = H * dpr;

  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* =========================================
   GÖRSELİ PARÇACIKLARA ÇEVİR
========================================= */

function createParticles() {
  particles = [];

  imageDataCanvas = document.createElement("canvas");
  imageDataCtx = imageDataCanvas.getContext(
    "2d",
    {
      willReadFrequently: true
    }
  );

  /*
    Görseli önce küçük bir canvas'a çiziyoruz.
    Böylece milyonlarca değil,
    kontrollü sayıda parçacık oluşuyor.
  */

  const maxImageWidth = Math.min(
    W * 0.82,
    950
  );

  const maxImageHeight = Math.min(
    H * 0.82,
    850
  );

  const imageRatio =
    image.width / image.height;

  let drawWidth = maxImageWidth;
  let drawHeight =
    drawWidth / imageRatio;

  if (drawHeight > maxImageHeight) {
    drawHeight = maxImageHeight;
    drawWidth =
      drawHeight * imageRatio;
  }

  imageDataCanvas.width =
    Math.floor(drawWidth);

  imageDataCanvas.height =
    Math.floor(drawHeight);

  imageDataCtx.drawImage(
    image,
    0,
    0,
    imageDataCanvas.width,
    imageDataCanvas.height
  );

  const pixels =
    imageDataCtx.getImageData(
      0,
      0,
      imageDataCanvas.width,
      imageDataCanvas.height
    ).data;

  const offsetX =
    (W - imageDataCanvas.width) / 2;

  const offsetY =
    (H - imageDataCanvas.height) / 2;

  /*
    2 veya 3 pikselde bir örnek alıyoruz.
    Bu sayı hem kaliteli hem performanslı.
  */

  const step =
    W < 700 ? 3 : 2;

  for (
    let y = 0;
    y < imageDataCanvas.height;
    y += step
  ) {
    for (
      let x = 0;
      x < imageDataCanvas.width;
      x += step
    ) {
      const index =
        (y * imageDataCanvas.width + x) * 4;

      const r =
        pixels[index];

      const g =
        pixels[index + 1];

      const b =
        pixels[index + 2];

      const a =
        pixels[index + 3];

      /*
        Siyah arka planı at.
        Sadece lilyumun parlak
        ve renkli bölümleri kalsın.
      */

      const brightness =
        (r + g + b) / 3;

      const isBlack =
        brightness < 20;

      if (
        a < 50 ||
        isBlack
      ) {
        continue;
      }

      /*
        Çok karanlık alanları
        daha seyrek göster.
      */

      if (
        brightness < 55 &&
        Math.random() > 0.25
      ) {
        continue;
      }

      particles.push({
        baseX:
          offsetX + x,

        baseY:
          offsetY + y,

        x:
          offsetX + x,

        y:
          offsetY + y,

        r,
        g,
        b,

        alpha:
          Math.min(
            1,
            0.25 +
            brightness / 255
          ),

        size:
          brightness > 190
            ? 1.35
            : 1,

        phase:
          Math.random() *
          Math.PI *
          2,

        speed:
          0.45 +
          Math.random() *
          0.9,

        movement:
          0.7 +
          Math.random() *
          2.6,

        /*
          Her parçacığın hareketi
          aynı olmayacak.
        */

        drift:
          Math.random() *
          Math.PI *
          2
      });
    }
  }
}

/* =========================================
   ANİMASYON
========================================= */

function animate(time) {
  const t =
    time * 0.001;

  /*
    Siyah arka plan.
    Düşük opacity sayesinde
    videodaki gibi hafif iz oluşur.
  */

  ctx.fillStyle =
    "rgba(0, 0, 0, 0.22)";

  ctx.fillRect(
    0,
    0,
    W,
    H
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

    /*
      Lilyumun tamamı çok hafif
      nefes alıyormuş gibi hareket eder.
    */

    const globalWaveX =
      Math.sin(
        t * 0.42
      ) *
      3;

    const globalWaveY =
      Math.cos(
        t * 0.35
      ) *
      2;

    /*
      Her parçacığın kendi
      küçük akışı.
    */

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
        p.drift
      ) *
      p.movement;

    p.x =
      p.baseX +
      globalWaveX +
      waveX;

    p.y =
      p.baseY +
      globalWaveY +
      waveY;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(
        ${p.r},
        ${p.g},
        ${p.b},
        ${p.alpha}
      )`;

    ctx.fill();
  }

  ctx.globalCompositeOperation =
    "source-over";

  requestAnimationFrame(
    animate
  );
}

/* =========================================
   BAŞLAT
========================================= */

image.onload = () => {
  resize();

  createParticles();

  loading.classList.add(
    "hide"
  );

  requestAnimationFrame(
    animate
  );
};

image.onerror = () => {
  loading.textContent =
    "LILY.PNG NOT FOUND";
};

window.addEventListener(
  "resize",
  () => {
    if (
      image.complete &&
      image.naturalWidth > 0
    ) {
      resize();
      createParticles();
    }
  }
);
