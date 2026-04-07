/* ============================================
   MAIN.JS — Core Functionality
   ============================================ */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ---- Mobile menu toggle ----
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ---- Active nav link highlighting ----
const sections = document.querySelectorAll('section[id]');
const navLinkElements = document.querySelectorAll('.nav-link:not(.btn-nav-cta)');

function highlightActiveSection() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinkElements.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection, { passive: true });

// Add active-link style
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active-link {
        color: var(--text-primary) !important;
        background: var(--glass-hover);
    }
`;
document.head.appendChild(activeStyle);

// ---- Contact Form Handling ----
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    // --- Form Micro-Interactions: Float Labels on Focus ---
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });
        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('focused');
            if (field.value) field.parentElement.classList.add('filled');
            else field.parentElement.classList.remove('filled');
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Flying send animation
        submitBtn.classList.add('loading');

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Fly away animation
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('sent');

            setTimeout(() => {
                contactForm.innerHTML = `
                    <div class="form-success">
                        <div style="font-size:3rem;margin-bottom:16px;">🎉</div>
                        <h3>Message Sent!</h3>
                        <p>Thanks for reaching out! I'll get back to you within 24 hours.</p>
                    </div>
                `;
            }, 600);
        } catch (error) {
            submitBtn.classList.remove('loading');
            alert('Something went wrong. Please try again or email me directly.');
        }
    });
}

// ---- Hide scroll indicator on scroll ----
const scrollIndicator = document.getElementById('scrollIndicator');
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
}, { passive: true });

// ---- Profile image fallback ----
const profileImg = document.getElementById('profileImg');
if (profileImg) {
    profileImg.addEventListener('error', () => {
        profileImg.parentElement.innerHTML = `
            <div class="about-image-fallback">GS</div>
        `;
    });
}

// ---- Copyright year ----
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace('2026', new Date().getFullYear());
}

// ---- Form Focus Glow Style ----
const formStyle = document.createElement('style');
formStyle.textContent = `
    .form-group.focused label {
        color: var(--accent-cyan);
    }
    .form-group.focused input,
    .form-group.focused textarea,
    .form-group.focused select {
        border-color: var(--accent-purple);
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12), 0 0 20px rgba(124, 58, 237, 0.06);
    }
`;
document.head.appendChild(formStyle);
