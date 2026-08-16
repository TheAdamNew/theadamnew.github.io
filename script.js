const nav = document.getElementById('nav');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursor) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }
});

function animateCursorFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    if (cursorFollower) {
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
    }
    
    requestAnimationFrame(animateCursorFollower);
}
animateCursorFollower();

const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .about-card, .testimonial-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor?.classList.add('hover');
        cursorFollower?.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hover');
        cursorFollower?.classList.remove('hover');
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    const sections = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                sections.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach((el, index) => {
    const parent = el.closest('.services-grid, .projects-grid, .testimonials-grid, .stats');
    if (parent) {
        const siblings = Array.from(parent.querySelectorAll('.reveal'));
        const siblingIndex = siblings.indexOf(el);
        el.dataset.delay = siblingIndex * 100;
    }
    revealObserver.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
