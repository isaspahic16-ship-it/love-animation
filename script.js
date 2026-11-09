
/* =================================
   LOVE.exe - INTERACTIVE EXPERIENCE
================================= */

// MUSIC PLAYER

const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const musicText = document.getElementById("musicText");

musicButton.addEventListener("click", async () => {

    if (music.paused) {

        try {
            await music.play();
            musicText.textContent = "PAUSE OUR SONG";
        } catch (error) {
            console.error("Music could not play:", error);
            musicText.textContent = "CHECK MUSIC FILE";
        }

    } else {

        music.pause();
        musicText.textContent = "PLAY OUR SONG";

    }

});


/* =================================
   HEART MADE OF WORDS
================================= */

const section = document.getElementById("heartSection");
const formation = document.getElementById("heartFormation");

const words = [];

// Generate heart coordinates

for (let y = -1.15; y <= 1.15; y += 0.09) {

    for (let x = -1.2; x <= 1.2; x += 0.09) {

        const equation =
            Math.pow(x * x + y * y - 1, 3)
            - x * x * y * y * y;

        if (equation <= 0) {

            words.push({
                x: x * 225,
                y: -y * 185
            });

        }

    }

}

// Shuffle the points for a more natural formation

words.sort(() => Math.random() - 0.5);

const heartWords = [];

// Create the actual text elements

words.forEach((point, index) => {

    const word = document.createElement("span");

    word.className = "heart-word";
    word.textContent = "I LOVE YOU";

    formation.appendChild(word);

    heartWords.push({

        element: word,

        targetX: point.x,
        targetY: point.y,

        startX: (Math.random() - 0.5) * 1000,
        startY: (Math.random() - 0.5) * 700,

        delay: index / words.length * 0.35

    });

});


/* =================================
   RESPONSIVE HEART
================================= */

function resizeHeart() {

    const scale = Math.min(
        1,
        (window.innerWidth - 30) / 600,
        (window.innerHeight - 180) / 480
    );

    formation.style.setProperty(
        "--heart-scale",
        Math.max(0.35, scale)
    );

}

window.addEventListener("resize", resizeHeart);

resizeHeart();


/* =================================
   SCROLL ANIMATION
================================= */

let ticking = false;

function updateHeart() {

    const rect = section.getBoundingClientRect();

    const scrollDistance =
        section.offsetHeight - window.innerHeight;

    const progress = Math.max(
        0,
        Math.min(
            1,
            -rect.top / scrollDistance
        )
    );

    heartWords.forEach((word) => {

        // Each word appears at a different time

        let p = Math.max(
            0,
            Math.min(
                1,
                (progress - word.delay) / 0.55
            )
        );

        // Smooth easing

        p = p * p * (3 - 2 * p);

        // Move words into their heart positions

        const x =
            word.startX +
            (word.targetX - word.startX) * p;

        const y =
            word.startY +
            (word.targetY - word.startY) * p;

        word.element.style.left =
            `calc(50% + ${x}px)`;

        word.element.style.top =
            `calc(50% + ${y}px)`;

        word.element.style.opacity = p;

        word.element.style.transform =
            `translate(-50%, -50%) scale(${0.5 + p * 0.5})`;

    });

    ticking = false;

}

// Only update when the visitor scrolls

window.addEventListener("scroll", () => {

    if (!ticking) {

        requestAnimationFrame(updateHeart);
        ticking = true;

    }

}, { passive: true });

updateHeart();


/* =================================
   FLOATING BACKGROUND PARTICLES
================================= */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

function createParticles() {

    particles = [];

    for (let i = 0; i < 65; i++) {

        particles.push({

            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,

            size: Math.random() * 2 + 0.5,

            speed: Math.random() * 0.5 + 0.2,

            opacity: Math.random() * 0.7 + 0.2

        });

    }

}

function animateParticles() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    particles.forEach((p) => {

        p.y -= p.speed;

        if (p.y < -10) {

            p.y = window.innerHeight + 10;
            p.x = Math.random() * window.innerWidth;

        }

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255, 120, 170, ${p.opacity})`;

        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff477e";

        ctx.fill();

    });

    requestAnimationFrame(animateParticles);

}

resizeCanvas();
createParticles();

window.addEventListener("resize", () => {

    resizeCanvas();
    createParticles();

});

animateParticles();
