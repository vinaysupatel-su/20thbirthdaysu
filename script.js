// Countdown Timer
const targetDate = new Date("December 14, 2033 00:00:00").getTime();
const countdownEl = document.getElementById("countdown");
const titleEl = document.getElementById("countdown-title");
const revealBtn = document.getElementById("revealBtn");

if (countdownEl) {
  setInterval(() => {
    const now = new Date().getTime();
    let distance = targetDate - now;

    if (distance > 0) {
      // Countdown
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownEl.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      if (revealBtn) revealBtn.disabled = true;
    } else {
      // Upcount
      distance = now - targetDate;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownEl.innerHTML = `Unlocked ${days}d ${hours}h ${minutes}m ${seconds}s ago 🎉`;
      titleEl.innerHTML = "Your gift is now unlocked!";
      if (revealBtn) revealBtn.disabled = false;
    }
  }, 1000);

  if (revealBtn) {
    revealBtn.addEventListener("click", () => {
      window.location.href = "gift.html";
    });
  }
}

// Slideshow
let slideIndex = 0;
function showSlides() {
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  for (let i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" active", "");
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 3000);
}
if (document.getElementsByClassName("mySlides").length > 0) showSlides();

// Confetti Animation (gift.html)
if (document.getElementById("confetti-canvas")) {
  const confettiCanvas = document.getElementById("confetti-canvas");
  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const confetti = Array.from({ length: 100 }).map(() => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 100,
    color: `hsl(${Math.random() * 360},100%,50%)`,
    tilt: Math.random() * 10 - 10
  }));

  function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.forEach((c, i) => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y, c.r, c.r);
      ctx.fill();
    });
    updateConfetti();
  }

  function updateConfetti() {
    confetti.forEach((c) => {
      c.y += Math.cos(c.d) + 1 + c.r / 2;
      c.x += Math.sin(c.d);
      if (c.y > confettiCanvas.height) {
        c.y = 0;
        c.x = Math.random() * confettiCanvas.width;
      }
    });
  }

  setInterval(drawConfetti, 20);
}
