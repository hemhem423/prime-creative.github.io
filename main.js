/* =====================================================
   Prime Creative — main.js
   ===================================================== */

(function() {
    'use strict';

    /* ─── Helpers ─── */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    /* ─── Header scroll ─── */
    const header = $('.header');
    if (header) {
        const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ─── Hamburger menu ─── */
    const hamburger = $('.header__hamburger');
    const mobileNav = $('.mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const open = hamburger.classList.toggle('is-open');
            mobileNav.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        $$('a', mobileNav).forEach(a =>
            a.addEventListener('click', () => {
                hamburger.classList.remove('is-open');
                mobileNav.classList.remove('is-open');
                document.body.style.overflow = '';
            })
        );
    }

    /* ─── Active nav link (current page) ─── */
    const currentFile = location.pathname.split('/').pop() || 'index.html';
    $$('.nav__list a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href === currentFile || (href === 'index.html' && currentFile === '')) {
            a.classList.add('is-current');
        }
    });

    /* ─── Fade-in on scroll ─── */
    const fadeEls = $$('.fade-in');
    if (fadeEls.length) {
        const io = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('is-active');
                    io.unobserve(e.target); }
            }), { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
        );
        fadeEls.forEach(el => io.observe(el));
    }

    /* ─── Smooth scroll for in-page anchors ─── */
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = $(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
    });

    /* ─── Works filter (works.html) ─── */
    const filterBtns = $$('.filter-btn');
    const workCards = $$('[data-category]');
    if (filterBtns.length && workCards.length) {
        filterBtns.forEach(btn =>
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                const cat = btn.dataset.filter;
                workCards.forEach(card => {
                    const show = cat === 'all' || card.dataset.category === cat;
                    card.style.display = show ? '' : 'none';
                    if (show) { card.classList.remove('is-active');
                        setTimeout(() => card.classList.add('is-active'), 30); }
                });
            })
        );
    }

    /* ─── FAQ accordion (plans.html) ─── */
    $$('.faq__item').forEach(item => {
        const q = $('.faq__q', item);
        if (!q) return;
        q.addEventListener('click', () => {
            const isOpen = item.classList.toggle('is-open');
            q.setAttribute('aria-expanded', String(isOpen));
        });
    });

    /* ─── Contact form submit ─── */
    const form = $('.js-contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const successEl = $('.form__success');
            if (successEl) {
                form.style.display = 'none';
                successEl.style.display = 'block';
                window.scrollTo({ top: successEl.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
            }
        });
    }

    /* ─── Typed / counter animation (about page) ─── */
    const counters = $$('.js-counter');
    if (counters.length) {
        const animateCounter = el => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1400;
            const step = target / (duration / 16);
            let current = 0;
            const tick = () => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current);
                if (current < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        const cio = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target);
                    cio.unobserve(e.target); } });
        }, { threshold: 0.5 });
        counters.forEach(el => cio.observe(el));
    }

})();