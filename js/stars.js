/* ============================================
   STARS.JS — Twinkling Star Effect
   ============================================ */

(function () {
    const STAR_COUNT = 3;          // stars visible at once
    const BLINK_SPEED = 120;       // ms per blink toggle (~4-5 blinks/sec)
    const BLINK_TIMES = 8;         // total toggles (4 full blinks)
    const PAUSE_MIN = 400;         // min ms before next star spawns
    const PAUSE_MAX = 1200;        // max ms before next star spawns

    const container = document.createElement('div');
    container.className = 'twinkle-container';
    document.body.appendChild(container);

    function createStar() {
        const star = document.createElement('div');
        star.className = 'twinkle-star';

        // Random position across the viewport
        star.style.left = (10 + Math.random() * 80) + 'vw';
        star.style.top = (10 + Math.random() * 80) + 'vh';

        // Random size (2-5px)
        const size = 2 + Math.random() * 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        container.appendChild(star);

        // Blink sequence
        let count = 0;
        const blinkInterval = setInterval(() => {
            star.style.opacity = star.style.opacity === '0' ? '1' : '0';
            count++;
            if (count >= BLINK_TIMES) {
                clearInterval(blinkInterval);
                star.style.opacity = '0';
                setTimeout(() => star.remove(), 150);
            }
        }, BLINK_SPEED);
    }

    function spawnLoop() {
        createStar();
        const delay = PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN);
        setTimeout(spawnLoop, delay);
    }

    // Start multiple staggered loops
    for (let i = 0; i < STAR_COUNT; i++) {
        setTimeout(spawnLoop, i * 500);
    }
})();
