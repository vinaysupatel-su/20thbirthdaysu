/* ======================
   Common settings
   ====================== */

// Set your unlock date/time here (local browser time)
// Format: Month Day, Year HH:MM:SS or ISO string. Example below is 14 Dec 2033 at 10:00 local time:
const UNLOCK_AT = new Date("December 14, 2024 10:00:00").getTime();

// Helper to safely get element
const $ = (sel) => document.querySelector(sel);

// ------------- MUSIC TOGGLE (common) -------------
function initMusicToggle() {
  const audio = document.getElementById('bg-music');
  const btns = Array.from(document.querySelectorAll('#musicToggle'));
  if (!audio || btns.length === 0) return;

  // reflect state
  function updateBtnPlaying(isPlaying) {
    btns.forEach(b => b.textContent = isPlaying ? "❚❚" : "♪");
    btns.forEach(b => b.title = isPlaying ? "Pause music" : "Play music");
  }

  // default: paused (many browsers block autoplay)
  let isPlaying = false;
  updateBtnPlaying(isPlaying);

  btns.forEach(btn => {
    btn.addEventListener('click', async () => {
      // toggle
      if (!isPlaying) {
        try {
          await audio.play();
          isPlaying = true;
        } catch (e) {
          // browsers may block autoplay; user gesture required
          isPlaying = false;
        }
      } else {
        audio.pause();
        isPlaying = false;
      }
      updateBtnPlaying(isPlaying);
    });
  });

  // if user interacts anywhere, try to start if intended
  document.addEventListener('click', function tryStartOnce() {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        updateBtnPlaying(isPlaying);
      }).catch(()=>{/* ignore */});
    }
    document.removeEventListener('click', tryStartOnce);
  }, { once: true });
}

// ------------- COUNTDOWN / UPCOUNT (index) -------------
function initCountdownIndex() {
  const countdown = $('#countdown');
  const upcount = $('#upcount');
  const giftButton = $('#giftButton');

  if (!countdown) return;

  function tick() {
    const now = Date.now();
    if (now < UNLOCK_AT) {
      const diff = UNLOCK_AT - now;
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
      const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
      const secs = Math.floor((diff % (1000*60)) / 1000);
      countdown.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
      upcount.textContent = '';
      if (giftButton) giftButton.disabled = true;
    } else {
      const diff = now - UNLOCK_AT;
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
      const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
      const secs = Math.floor((diff % (1000*60)) / 1000);
      countdown.textContent = `Unlocked ✨`;
      upcount.textContent = `Since unlock: ${days}d ${hours}h ${mins}m ${secs}s`;
      if (giftButton) {
        giftButton.disabled = false;
        giftButton.onclick = () => { window.location.href = "gift.html"; };
      }
    }
  }

  tick();
  setInterval(tick, 1000);
}

// ------------- GIFT PAGE LOCK CHECK & COUNTDOWN -------------
function initGiftLock() {
  const lockedArea = $('#lockedArea');
  const revealArea = $('#revealArea');
  const giftCountdown = $('#giftCountdown');

  // preview param to force reveal for you
  const url = new URL(location.href);
  const PREVIEW = url.searchParams.get('preview') === '1';

  if (!lockedArea || !revealArea) return;

  function setLocked(msLeft) {
    lockedArea.classList.remove('hide');
    revealArea.classList.add('hide');
    if (giftCountdown) {
      if (msLeft > 0) {
        const d = Math.floor(msLeft / (1000*60*60*24));
        const h = Math.floor((msLeft % (1000*60*60*24)) / (1000*60*60));
        const m = Math.floor((msLeft % (1000*60*60)) / (1000*60));
        const s = Math.floor((msLeft % (1000*60)) / 1000);
        giftCountdown.textContent = `${d}d ${h}h ${m}m ${s}s`;
      } else {
        giftCountdown.textContent = `Unlocked ✨`;
      }
    }
  }
  function setReveal() {
    lockedArea.classList.add('hide');
    revealArea.classList.remove('hide');
    // start confetti and slideshow
    startConfetti();
    startSlideshow();
  }

  function tick() {
    if (PREVIEW) { setReveal(); return; }
    const now = Date.now();
    if (now < UNLOCK_AT) {
      setLocked(UNLOCK_AT - now);
    } else {
      setReveal();
    }
  }
  tick();
  setInterval(tick, 1000);
}

// ------------- SLIDESHOW (gift page) -------------
let slideTimer = null;
function startSlideshow() {
  const slides = Array.from(document.querySelectorAll('.slideshow .slide'));
  if (!slides.length) return;
  let idx = slides.findIndex(s => s.classList.contains('visible'));
  if (idx < 0) idx = 0;
  // ensure only idx visible
  slides.forEach((s,i)=> s.classList.toggle('visible', i === idx));
  clearInterval(slideTimer);
  slideTimer = setInterval(()=> {
    slides[idx].classList.remove('visible');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('visible');
  }, 3800);
}

// ------------- CONFETTI (gift page) -------------
function startConfetti() {
  const canvas = document.getElementById('confetti') || document.createElement('canvas');
  if (!canvas) return;
  canvas.id = 'confetti';
  canvas.className = 'confetti-canvas';
  if (!document.getElementById('confetti')) document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize(); addEventListener('resize', resize);

  // create particles
  const colors = ['#ff4d6d','#ff99c8','#fff1b6','#ffd27f','#ff7eb3'];
  let parts = Array.from({length: 220}).map(()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*-canvas.height,
    r: Math.random()*6+3,
    c: colors[(Math.random()*colors.length)|0],
    s: Math.random()*3+1,
    rot: Math.random()*360
  }));

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6);
      ctx.restore();
    });
    update();
  }
  function update(){
    parts.forEach(p=>{
      p.y += p.s + Math.cos(p.rot);
      p.x += Math.sin(p.rot)*0.5;
      p.rot += 2;
      if (p.y > canvas.height + 20) { p.y = -10; p.x = Math.random()*canvas.width; }
    });
  }
  setInterval(draw, 20);
}

/* ======================
   Initialize on DOM ready
   ====================== */
document.addEventListener('DOMContentLoaded', () => {
  initMusicToggle();
  initCountdownIndex();
  initGiftLock();
  // if gift page already open and unlocked, start reveal elements
  if (location.pathname.endsWith('gift.html')) {
    // slideshow start will be triggered by initGiftLock when unlocked/preview
  }
});


