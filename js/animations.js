/* ============================================
   ANIMATIONS.JS — Scroll Animations & Counters
   ============================================ */

// ---- Intersection Observer for reveal animations ----
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve after revealing (performance)
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
});

revealElements.forEach(el => revealObserver.observe(el));

// ---- Counter Animation ----
const counters = document.querySelectorAll('.counter');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5,
});

// Observe the trust section
const trustSection = document.getElementById('trust');
if (trustSection) {
    counterObserver.observe(trustSection);
}

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// ---- Parallax effect on hero orbs ----
const heroOrbs = document.querySelectorAll('.hero-gradient-orb');

function handleParallax() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return; // Performance: skip when not visible

    heroOrbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.05;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

window.addEventListener('scroll', handleParallax, { passive: true });

// ---- Magnetic effect on CTA buttons ----
const magneticBtns = document.querySelectorAll('.btn-primary');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ---- Tilt effect on service cards ----
const tiltCards = document.querySelectorAll('.service-card, .testimonial-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
    });
});

// ---- Border Flash Light Trace ----
const flashElements = document.querySelectorAll('.border-flash');

const flashObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger the flash for siblings
            setTimeout(() => {
                entry.target.classList.add('flash-active');
                // Remove class after animation so it can re-trigger if needed
                entry.target.addEventListener('animationend', () => {
                    entry.target.classList.remove('flash-active');
                }, { once: true });
            }, i * 300);
            flashObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3,
});

flashElements.forEach(el => flashObserver.observe(el));
