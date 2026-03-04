document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       EMAILJS CONFIGURATION
       ============================================================ */
    const EMAILJS_SERVICE_ID  = 'service_52dileb';
    const EMAILJS_TEMPLATE_ID = 'template_jmsfo6i';
    const EMAILJS_PUBLIC_KEY  = 'tmOdPy3aAWo9Wuphh';

    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }


    /* ============================================================
       DYNAMIC YEAR IN FOOTER
       ============================================================ */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ============================================================
       DARK / LIGHT THEME TOGGLE
       ============================================================ */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon   = document.getElementById('themeIcon');
    const html        = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'bx bx-moon' : 'bx bx-sun';
        }
    }


    /* ============================================================
       HAMBURGER MENU
       ============================================================ */
    const menuToggle = document.getElementById('menuToggle');
    const mainNav    = document.getElementById('mainNav');

    if (menuToggle && mainNav) {

        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('active');
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('click', (e) => {
            if (
                mainNav.classList.contains('active') &&
                !mainNav.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) closeNav();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) closeNav();
        });

        function closeNav() {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }


    /* ============================================================
       SMOOTH SCROLL
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* ============================================================
       ACTIVE NAV LINK ON SCROLL
       ============================================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-40% 0px -55% 0px'
    });

    sections.forEach(sec => navObserver.observe(sec));


    /* ============================================================
       SCROLL-REVEAL FOR CARDS
       ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    document.querySelectorAll(
        '.service-box, .skill-box, .edu-card, .cert-card, .tl-card'
    ).forEach(el => revealObserver.observe(el));


    /* ============================================================
       BACK TO TOP BUTTON
       ============================================================ */
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ============================================================
       CONTACT FORM  —  EmailJS
       ============================================================ */
    const contactForm = document.getElementById('contactForm');
    const formStatus  = document.getElementById('formStatus');
    const submitBtn   = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin" aria-hidden="true"></i> Sending...';
            setStatus('', '');

            const templateParams = {
                from_name:  contactForm.querySelector('#name').value.trim(),
                from_email: contactForm.querySelector('#email').value.trim(),
                subject:    contactForm.querySelector('#subject').value.trim(),
                message:    contactForm.querySelector('#message').value.trim(),
            };

            try {
                if (
                    EMAILJS_SERVICE_ID  === ''  ||
                    EMAILJS_TEMPLATE_ID === '' ||
                    EMAILJS_PUBLIC_KEY  === ''
                ) {
                    throw new Error('EmailJS is not configured yet. Please add your Service ID, Template ID, and Public Key in script.js.');
                }

                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

                setStatus('success', '✓ Message sent! I\'ll get back to you within 24 hours.');
                contactForm.reset();

            } catch (err) {
                console.error('EmailJS error:', err);
                setStatus('error', '✗ ' + (err.message || 'Something went wrong. Please try again or email me directly.'));
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }

    function setStatus(type, message) {
        if (!formStatus) return;
        formStatus.className = 'form-status' + (type ? ` ${type}` : '');
        formStatus.textContent = message;
    }

});