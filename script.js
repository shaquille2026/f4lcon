// ========== TYPING ANIMATION ==========
const phrases = [
  "They Pay Me $50K.",
  "They Ghost Me For 3 Months.",
  "They Give No Explanation.",
  "They Still Haven't Paid.",
  "We Want Justice."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 30 : 60;

  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 500;
  }

  setTimeout(type, speed);
}

setTimeout(type, 1000);

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => observer.observe(el));

// ========== COUNTER ANIMATION ==========
const countElements = document.querySelectorAll('.count');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

countElements.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ========== FALCON BACKGROUND ==========
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ========== REAL FALCON IMAGE ==========
// Load a real falcon photo (place falcon.png in the same folder)
const falconImg = new Image();
falconImg.src = 'falcon.png';

const falcon = {
  x: -300,
  y: canvas.height * 0.3,
  baseY: canvas.height * 0.3,
  speed: 2,
  width: 280,
  height: 140,
  opacity: 0.9,
  glideOffset: 0,
  tilt: 0,
  ready: false
};

falconImg.onload = () => { falcon.ready = true; };

// Faint star particles in the background
const stars = [];
for (let i = 0; i < 40; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.3,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.005
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const opacity = 0.1 + Math.sin(s.twinkle) * 0.1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
    ctx.fill();
  });

  // Update falcon position
  falcon.x += falcon.speed;
  falcon.glideOffset += 0.008;

  // Gentle vertical glide
  falcon.y = falcon.baseY + Math.sin(falcon.glideOffset) * 40;

  // Slight tilt following movement
  falcon.tilt = Math.cos(falcon.glideOffset) * 0.03;

  // Reset when off screen
  if (falcon.x > canvas.width + 350) {
    falcon.x = -350;
    falcon.baseY = canvas.height * (0.1 + Math.random() * 0.6);
    falcon.y = falcon.baseY;
    falcon.speed = 1.5 + Math.random() * 1;
    falcon.width = 240 + Math.random() * 80;
    falcon.height = falcon.width * 0.5;
    falcon.glideOffset = 0;
  }

  // Draw the falcon image
  if (falcon.ready) {
    ctx.save();
    ctx.translate(falcon.x + falcon.width / 2, falcon.y);
    ctx.rotate(falcon.tilt);
    ctx.globalAlpha = falcon.opacity;
    ctx.drawImage(falconImg, -falcon.width / 2, -falcon.height / 2, falcon.width, falcon.height);
    ctx.restore();
  }

  requestAnimationFrame(animate);
}

animate();

// ========== SMOOTH SCROLL FOR HERO HINT ==========
document.querySelector('.scroll-hint')?.addEventListener('click', () => {
  document.getElementById('who').scrollIntoView({ behavior: 'smooth' });
});
