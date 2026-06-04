const navLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
const mobileLinks = Array.from(document.querySelectorAll('.mobile-nav a[href^="#"]'));
const allNavLinks = [...navLinks, ...mobileLinks];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

function headerHeight() {
  const header = document.querySelector('.site-header');
  return header ? header.offsetHeight : 0;
}

function targetTop(section) {
  const rect = section.getBoundingClientRect();
  return rect.top + window.pageYOffset - headerHeight() - 14;
}

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

function setActiveNavFromId(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

function setActiveNav() {
  const viewportLine = window.pageYOffset + headerHeight() + 90;
  let current = sections[0];

  for (const section of sections) {
    if (viewportLine >= section.offsetTop) {
      current = section;
    }
  }

  if (current) setActiveNavFromId(current.id);
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
}

allNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    setActiveNavFromId(target.id);
    closeMenu();

    window.scrollTo({
      top: targetTop(target),
      behavior: 'smooth'
    });

    history.pushState(null, '', href);
  });
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      setActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

window.addEventListener('load', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        window.scrollTo({ top: targetTop(target), behavior: 'auto' });
        setActiveNavFromId(target.id);
      }, 0);
      return;
    }
  }

  setActiveNav();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1120) closeMenu();
  setActiveNav();
});
