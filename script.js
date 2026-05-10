/* ============================================================
   script.js  –  Prime.Creative
   Interactions: header scroll, blob animation,
   hamburger menu, scroll-reveal
   ============================================================ */

(function() {
    'use strict';

    /* ----------------------------------------------------------
       1. HEADER – shrink + shadow on scroll
    ---------------------------------------------------------- */
    const header = document.getElementById('header');

    function onScroll() {
        if (window.scrollY > 20) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* Inject scrolled style dynamically */
    const style = document.createElement('style');
    style.textContent = `
    .header--scrolled {
      box-shadow: 0 4px 32px rgba(0,0,0,0.10);
    }
  `;
    document.head.appendChild(style);


    /* ----------------------------------------------------------
       2. HAMBURGER MENU
    ---------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('.header__nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);

            // animate spans
            const spans = hamburger.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans.forEach(s => { s.style.transform = '';
                    s.style.opacity = ''; });
            }
        });

        // Close on nav link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                hamburger.querySelectorAll('span').forEach(s => {
                    s.style.transform = '';
                    s.style.opacity = '';
                });
            });
        });
    }


    /* ----------------------------------------------------------
       3. BLOB MOUSE PARALLAX (subtle)
    ---------------------------------------------------------- */
    const blobs = document.querySelectorAll('.blob');

    document.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx; // -1 .. 1
        const dy = (e.clientY - cy) / cy;

        blobs.forEach((blob, i) => {
            const factor = (i + 1) * 6;
            const tx = dx * factor;
            const ty = dy * factor;
            blob.style.transform = `translate(${tx}px, ${ty}px)`;
        });
    });


    /* ----------------------------------------------------------
       4. SCROLL REVEAL (IntersectionObserver)
    ---------------------------------------------------------- */
    function addRevealClasses() {
        const targets = [
            { selector: '.service__item', delay: 0 },
            { selector: '.case-card', delay: true },
            { selector: '.col-card', delay: true },
            { selector: '.contact__inner', delay: 0 },
            { selector: '.case__grid-header', delay: 0 },
            { selector: '.column__grid-header', delay: 0 },
            { selector: '.section__header-mask', delay: 0 },
        ];

        targets.forEach(({ selector, delay }) => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal');
                if (delay === true) {
                    el.classList.add(`reveal-delay-${(i % 3) + 1}`);
                }
            });
        });
    }

    addRevealClasses();

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ----------------------------------------------------------
       5. SCROLL INDICATOR – hide after first scroll
    ---------------------------------------------------------- */
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }, { passive: true });
    }


    /* ----------------------------------------------------------
       6. SMOOTH ANCHOR SCROLL (offset for fixed header)
    ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();

            const headerH = header ? header.offsetHeight + 20 : 100;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* ----------------------------------------------------------
       7. EVENT / CTA BUTTON – pulse effect
    ---------------------------------------------------------- */
    document.querySelectorAll('.event-arrow, .pill-btn, .contact__icon-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s';
        });
    });


    /* ----------------------------------------------------------
       8. CASE / COLUMN CARDS – stagger on reveal
    ---------------------------------------------------------- */
    function staggerGrid(containerSelector, itemSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const items = container.querySelectorAll(itemSelector);
        items.forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.1}s`;
        });
    }

    staggerGrid('.case__cards', '.case-card');
    staggerGrid('.column__cards', '.col-card');


    /* ----------------------------------------------------------
       9. WATERMARK text mask animation on scroll
    ---------------------------------------------------------- */
    const watermarks = document.querySelectorAll('.section__watermark');

    const wObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0.55';
                entry.target.style.transform = 'translateX(0)';
                wObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    watermarks.forEach(w => {
        w.style.opacity = '0';
        w.style.transform = 'translateX(-30px)';
        w.style.transition = 'opacity 1s ease, transform 1s ease';
        wObserver.observe(w);
    });

})();
