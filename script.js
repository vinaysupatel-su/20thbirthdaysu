// Unlock date: 14 Dec 2033
const unlockDate = new Date("Dec 14, 2024 00:00:00").getTime();

const countdownEl = document.getElementById("countdown");
const revealBtn = document.getElementById("revealBtn");

if (countdownEl) {
  setInterval(() => {
    const now = new Date().getTime();
    let distance = unlockDate - now;

    if (distance > 0) {
      // Countdown
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownEl.innerHTML = `⏳ Unlocks in ${days}d ${hours}h ${minutes}m ${seconds}s`;
      if (revealBtn) revealBtn.disabled = true;
    } else {
      // Upcount
      distance = now - unlockDate;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      countdownEl.innerHTML = `🎉 Gift unlocked ${days} days ago!`;
      if (revealBtn) {
        revealBtn.disabled = false;
        revealBtn.onclick = () => window.location.href = "gift.html";
      }
    }
  }, 1000);
}

// Slideshow for gift page
let slideIndex = 0;
function showSlides() {
  let slides = document.getElementsByClassName("slide");
  for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 4000); // 4 sec
}
if (document.querySelector(".slideshow-container")) showSlides();

// Confetti on gift page
if (document.getElementById("confetti-canvas")) {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let confetti = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 10,
  }));

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,182,193,0.9)";
    ctx.beginPath();
    confetti.forEach((c, i) => {
      ctx.moveTo(c.x, c.y);
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
    });
    ctx.fill();
    update();
  }

  function update() {
    confetti.forEach((c) => {
      c.y += Math.cos(c.d) + 1;
      c.x += Math.sin(c.d) * 2;
      if (c.y > canvas.height) {
        c.x = Math.random() * canvas.width;
        c.y = -10;
      }
    });
  }

  setInterval(drawConfetti, 20);
}

