document.addEventListener('DOMContentLoaded', () => {

    /* EmailJS config */
    const EMAILJS_SERVICE_ID  = 'service_52dileb';
    const EMAILJS_TEMPLATE_ID = 'template_jmsfo6i';
    const EMAILJS_PUBLIC_KEY  = 'tmOdPy3aAWo9Wuphh';

    if (typeof emailjs !== 'undefined') emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    /* Footer year */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* Theme toggle */
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    applyTheme(localStorage.getItem('theme') || 'dark');

    themeToggle?.addEventListener('click', () => {
        applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    /* Mobile nav */
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const open = mainNav.classList.toggle('active');
            menuToggle.classList.toggle('open', open);
            menuToggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') &&
                !mainNav.contains(e.target) && !menuToggle.contains(e.target)) closeNav();
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

    /* Smooth scroll offset for sticky header */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const headerH = document.querySelector('header')?.offsetHeight ?? 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* Back to top */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* Contact form */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        setStatus('', '');

        const params = {
            from_name:  form.querySelector('#name').value.trim(),
            from_email: form.querySelector('#email').value.trim(),
            subject:    'New message from portfolio contact form',
            message:    form.querySelector('#message').value.trim(),
        };

        try {
            if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
                throw new Error('EmailJS is not configured yet.');
            }
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
            setStatus('success', "Message sent — I'll get back to you within 24 hours.");
            form.reset();
        } catch (err) {
            console.error('EmailJS error:', err);
            setStatus('error', err.message || 'Something went wrong. Please email me directly.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    function setStatus(type, message) {
        if (!status) return;
        status.className = 'form-status' + (type ? ` ${type}` : '');
        status.textContent = message;
    }

});