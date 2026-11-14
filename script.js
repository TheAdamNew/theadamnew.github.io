document.documentElement.classList.add('js');

const nav = document.getElementById('nav');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

document.addEventListener('click', (event) => {
    if (!navMenu?.classList.contains('open')) return;
    if (navMenu.contains(event.target) || navToggle?.contains(event.target)) return;
    closeMenu();
});

function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);

    const scrollPosition = window.scrollY + 140;
    let currentId = '';

    navLinks.forEach((link) => {
        const id = link.getAttribute('href')?.slice(1);
        if (!id) return;
        const section = document.getElementById(id);
        if (!section) return;

        if (scrollPosition >= section.offsetTop) {
            currentId = id;
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

let navFrame = null;
window.addEventListener('scroll', () => {
    if (navFrame) return;
    navFrame = window.requestAnimationFrame(() => {
        updateNav();
        navFrame = null;
    });
}, { passive: true });

updateNav();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href) return;

        event.preventDefault();

        if (href === '#') {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            closeMenu();
            return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        const offset = 84;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        closeMenu();
    });
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const delay = reduceMotion ? 0 : Number(entry.target.dataset.delay || 0);
            window.setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);

            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((element) => {
        const group = element.closest('.services-grid, .projects-grid, .process-grid, .toolkit');
        if (group && !reduceMotion) {
            const siblings = Array.from(group.querySelectorAll('.reveal'));
            const index = siblings.indexOf(element);
            if (index > 0) {
                element.dataset.delay = String(index * 80);
                element.style.transitionDelay = `${index * 80}ms`;
            }
        }
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => element.classList.add('visible'));
}
