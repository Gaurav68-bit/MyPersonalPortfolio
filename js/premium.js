/* ============================================
   PREMIUM.JS — Top 1% Interactive Features
   ============================================ */

// ---- Cinematic Page Loader ----
const pageLoader = document.getElementById('pageLoader');
window.addEventListener('load', () => {
    setTimeout(() => {
        pageLoader?.classList.add('loaded');
        document.body.classList.add('page-loaded');
        setTimeout(() => pageLoader?.classList.add('done'), 800);
    }, 2000);
});

// ---- Custom Cursor ----
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll(
        'a, button, input, select, textarea, .btn, .service-card, .testimonial-card, .project-card, .social-link, .nav-link, .stack-badge, .cmd-item, .theme-toggle, .process-step'
    );

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
}

// ---- Scroll Progress Bar ----
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = progress + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ---- Word Rotator ----
const wordTrack = document.getElementById('wordRotatorTrack');

if (wordTrack) {
    const words = wordTrack.querySelectorAll('.word-rotator-word');
    let currentWord = 0;

    setInterval(() => {
        words[currentWord].classList.add('exit');
        words[currentWord].classList.remove('active');

        currentWord = (currentWord + 1) % words.length;

        words[currentWord].classList.remove('exit');
        words[currentWord].classList.add('active');

        // Clean up exit class after transition
        setTimeout(() => {
            words.forEach((w, i) => {
                if (i !== currentWord) w.classList.remove('exit');
            });
        }, 600);
    }, 3000);
}

// ---- Hero Glass Card — Live Time ----
const heroLocalTime = document.getElementById('heroLocalTime');

function updateHeroTime() {
    if (!heroLocalTime) return;
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
    heroLocalTime.textContent = now.toLocaleTimeString('en-US', options);
}

updateHeroTime();
setInterval(updateHeroTime, 30000);

// ---- Terminal Typing Effect ----
const terminalBody = document.getElementById('terminalBody');

const terminalSequence = [
    { type: 'command', text: 'gaurav init new-project' },
    { type: 'output', text: '▸ Scaffolding MERN stack...' },
    { type: 'output', text: '▸ Configuring REST API...' },
    { type: 'output', text: '▸ Setting up AI pipeline...' },
    { type: 'success', text: '✓ Project ready in 2.3s' },
    { type: 'pause', duration: 1200 },
    { type: 'command', text: 'gaurav deploy --production' },
    { type: 'output', text: '▸ Building optimized bundle...' },
    { type: 'output', text: '▸ Running tests... 24/24 passed' },
    { type: 'success', text: '✓ Live at https://your-app.com' },
    { type: 'pause', duration: 3000 },
];

async function typeText(element, text, speed = 40) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await new Promise(r => setTimeout(r, speed + Math.random() * 20));
    }
}

async function runTerminal() {
    if (!terminalBody) return;

    while (true) {
        terminalBody.innerHTML = '';

        for (const step of terminalSequence) {
            if (step.type === 'pause') {
                await new Promise(r => setTimeout(r, step.duration));
                continue;
            }

            const line = document.createElement('div');
            line.className = 'terminal-line';

            if (step.type === 'command') {
                line.innerHTML = '<span class="prompt">$</span> <span class="command"></span><span class="typing-cursor"></span>';
                terminalBody.appendChild(line);
                const cmdSpan = line.querySelector('.command');
                await typeText(cmdSpan, step.text, 45);
                line.querySelector('.typing-cursor').remove();
                await new Promise(r => setTimeout(r, 400));
            } else {
                const colorClass = step.type === 'success' ? 'success' : '';
                line.innerHTML = `<span class="${colorClass}">${step.text}</span>`;
                line.style.opacity = '0';
                line.style.transform = 'translateY(6px)';
                terminalBody.appendChild(line);
                await new Promise(r => setTimeout(r, 50));
                line.style.transition = 'all 0.3s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
                await new Promise(r => setTimeout(r, 350));
            }
        }

        await new Promise(r => setTimeout(r, 4000));
    }
}

const terminalEl = document.querySelector('.hero-terminal');
if (terminalEl) {
    const termObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(runTerminal, 2000);
            termObserver.disconnect();
        }
    }, { threshold: 0.3 });
    termObserver.observe(terminalEl);
}

// ---- Floating CTA ----
const floatingCta = document.getElementById('floatingCta');
const contactSection = document.getElementById('contact');

function updateFloatingCta() {
    if (!floatingCta) return;
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('hero')?.offsetHeight || 0;
    const contactTop = contactSection?.offsetTop || Infinity;

    if (scrollY > heroHeight * 0.8 && scrollY < contactTop - 600) {
        floatingCta.classList.add('visible');
    } else {
        floatingCta.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateFloatingCta, { passive: true });

// ---- Testimonial Auto-Highlight ----
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

function cycleTestimonials() {
    if (testimonialCards.length === 0) return;
    testimonialCards.forEach(card => card.classList.remove('highlighted'));
    testimonialCards[currentTestimonial].classList.add('highlighted');
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
}

if (testimonialCards.length > 0) {
    setInterval(cycleTestimonials, 4000);
    setTimeout(cycleTestimonials, 500);
}

// ---- Theme Toggle ----
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('gs-theme') || 'dark';
if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : next);
        if (next === 'dark') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('gs-theme', next);
    });
}

// ---- Command Palette ----
const cmdPalette = document.getElementById('cmdPalette');
const cmdInput = document.getElementById('cmdInput');
const cmdList = document.getElementById('cmdList');
const kbdHint = document.getElementById('kbdHint');

function openCmdPalette() {
    cmdPalette?.classList.add('active');
    setTimeout(() => cmdInput?.focus(), 100);
    kbdHint?.classList.add('hidden');
}

function closeCmdPalette() {
    cmdPalette?.classList.remove('active');
    if (cmdInput) cmdInput.value = '';
    cmdList?.querySelectorAll('.cmd-item').forEach(i => i.classList.remove('hidden', 'active'));
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (cmdPalette?.classList.contains('active')) closeCmdPalette();
        else openCmdPalette();
    }
    if (e.key === 'Escape') closeCmdPalette();
});

cmdPalette?.addEventListener('click', (e) => {
    if (e.target === cmdPalette) closeCmdPalette();
});

// Filter commands
cmdInput?.addEventListener('input', () => {
    const query = cmdInput.value.toLowerCase();
    cmdList?.querySelectorAll('.cmd-item').forEach(item => {
        const cmd = item.getAttribute('data-cmd') || '';
        item.classList.toggle('hidden', !cmd.includes(query));
    });
});

// Select command
cmdList?.addEventListener('click', (e) => {
    const item = e.target.closest('.cmd-item');
    if (item) {
        closeCmdPalette();
    }
});

// ---- Process Line Animation ----
const processLine = document.getElementById('processLine');
if (processLine) {
    const processObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            processLine.classList.add('animate');
            processObserver.disconnect();
        }
    }, { threshold: 0.3 });
    processObserver.observe(processLine);
}

// ---- Konami Code Easter Egg ----
const konamiCode = [38,38,40,40,37,39,37,39,66,65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            triggerConfetti();
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerConfetti() {
    const colors = ['#7c3aed', '#06b6d4', '#22c55e', '#fbbf24', '#f43f5e'];
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: ${6 + Math.random() * 6}px;
            height: ${6 + Math.random() * 6}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            z-index: 100002;
            pointer-events: none;
            animation: confettiFall ${2 + Math.random() * 3}s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }

    // Add confetti keyframes if not already present
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ---- Enhanced Console Branding ----
console.log(`
%c ╔═══════════════════════════════════╗
 ║   ⚡ Built by Gaurav Sarma ⚡    ║
 ╠═══════════════════════════════════╣
 ║  Full-Stack Dev & AI Specialist  ║
 ║  Press Ctrl+K to navigate        ║
 ║  Try the Konami code ;)          ║
 ╚═══════════════════════════════════╝
`, 'color: #7c3aed; font-family: monospace; font-size: 12px;');

// ---- Mouse Parallax on Hero ----
const heroContent = document.querySelector('.hero-content');
const heroOrbs = document.querySelectorAll('.hero-gradient-orb');

if (heroContent && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

        heroContent.style.transform = `translate(${xPercent * 5}px, ${yPercent * 5}px)`;

        heroOrbs.forEach((orb, i) => {
            const speed = (i + 1) * 8;
            orb.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
        });
    });
}

console.log('%c🚀 Premium features loaded', 'color: #06b6d4; font-size: 12px;');

// ---- Music Controller ----
const music1 = document.getElementById('music1');
const music2 = document.getElementById('music2');
const musicBtn = document.getElementById('musicToggle');
const aboutSec = document.getElementById('about');

if (music1 && music2 && musicBtn) {
    let playing = false;
    let muted = false;
    let activeTrack = music1;
    let onAbout = false;

    music1.loop = true;
    music2.loop = true;
    music1.volume = 0.3;
    music2.volume = 0.3;

    function playActive() {
        activeTrack.play().then(() => {
            playing = true;
            musicBtn.classList.add('playing');
            musicBtn.classList.remove('muted');
        }).catch(err => {
            console.log('Music play blocked:', err.message);
        });
    }

    // Start music on first click anywhere
    function initMusic() {
        if (playing) return;
        playActive();
        document.removeEventListener('click', initMusic);
        document.removeEventListener('touchstart', initMusic);
    }

    document.addEventListener('click', initMusic);
    document.addEventListener('touchstart', initMusic);

    // Toggle mute/unmute
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!playing && !muted) {
            // First click — start music
            playActive();
            return;
        }

        muted = !muted;
        if (muted) {
            activeTrack.pause();
            musicBtn.classList.add('muted');
            musicBtn.classList.remove('playing');
        } else {
            activeTrack.play().catch(() => {});
            musicBtn.classList.remove('muted');
            musicBtn.classList.add('playing');
        }
    });

    // Switch track when entering/leaving About section
    if (aboutSec) {
        const musicObserver = new IntersectionObserver((entries) => {
            const entering = entries[0].isIntersecting;
            if (entering === onAbout) return; // no change
            onAbout = entering;

            if (!playing || muted) {
                activeTrack = entering ? music2 : music1;
                return;
            }

            // Pause current, switch, play new
            activeTrack.pause();
            activeTrack = entering ? music2 : music1;
            activeTrack.play().catch(() => {});
        }, { threshold: 0.3 });

        musicObserver.observe(aboutSec);
    }
}

