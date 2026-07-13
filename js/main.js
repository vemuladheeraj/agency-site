document.addEventListener('DOMContentLoaded', () => {
    applySiteConfig();
    initMobileMenu();
    initHeaderScroll();
    initActiveNav();
    initCardGlow();
    initContactForm();
    initFaqAccordion();
    initPortfolioFilters();
});

function applySiteConfig() {
    if (typeof SITE_CONFIG === 'undefined') return;

    const whatsappMap = {
        'whatsapp-quote': SITE_CONFIG.whatsappMessages.quote,
        'whatsapp-contact': SITE_CONFIG.whatsappMessages.contact,
        'whatsapp-cta': SITE_CONFIG.whatsappMessages.cta
    };

    document.querySelectorAll('[data-site-link]').forEach(el => {
        const key = el.getAttribute('data-site-link');

        if (whatsappMap[key]) {
            el.href = buildWhatsAppUrl(whatsappMap[key]);
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
        } else if (key === 'phone') {
            el.href = buildWhatsAppUrl(SITE_CONFIG.whatsappMessages.contact);
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
            if (el.hasAttribute('data-site-text')) {
                el.textContent = SITE_CONFIG.phoneDisplay;
            }
        } else if (key === 'email') {
            el.href = `mailto:${SITE_CONFIG.email}`;
            if (el.hasAttribute('data-site-text')) {
                el.textContent = SITE_CONFIG.email;
            }
        } else if (key === 'linkedin') {
            el.href = SITE_CONFIG.social.linkedin;
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
        } else if (key === 'instagram') {
            el.href = SITE_CONFIG.social.instagram;
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
        } else if (key === 'calendly') {
            el.href = SITE_CONFIG.calendly;
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
        }
    });

    document.querySelectorAll('a[target="_blank"]:not([rel])').forEach(el => {
        el.rel = 'noopener noreferrer';
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    const setMenuOpen = (open) => {
        navMenu.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        const spans = menuToggle.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    };

    menuToggle.addEventListener('click', () => {
        setMenuOpen(!navMenu.classList.contains('open'));
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        const isActive = linkPath === currentPath || (currentPath === '' && linkPath === 'index.html');
        link.classList.toggle('active', isActive);
    });
}

function initCardGlow() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('agency-contact-form');
    if (!contactForm || typeof SITE_CONFIG === 'undefined') return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('form-submit-btn');
        const originalText = submitBtn.textContent;

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const businessType = document.getElementById('business-type').value;
        const service = document.getElementById('service').value;
        const budget = document.getElementById('budget').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !businessType || !service || !budget) {
            showToast('Please fill out all required fields.');
            return;
        }

        submitBtn.textContent = 'Sending Request...';
        submitBtn.disabled = true;

        fetch(`https://formsubmit.co/ajax/${SITE_CONFIG.formEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                business_scale: businessType,
                service_needed: service,
                budget_range: budget,
                message
            })
        })
        .then(res => res.json())
        .then(data => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            if (data.success === 'true' || data.success === true) {
                showToast('Project request sent! Check your inbox to confirm activation.');
                saveOfflineLead({ name, email, businessType, service, budget, message });
                contactForm.reset();
            } else {
                showToast('Submission error. Saved offline. We will review.');
                saveOfflineLead({ name, email, businessType, service, budget, message });
            }
        })
        .catch(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showToast('Connection issue. Inquiry saved locally.');
            saveOfflineLead({ name, email, businessType, service, budget, message });
        });
    });
}

function saveOfflineLead(leadData) {
    const lead = { ...leadData, timestamp: new Date().toISOString() };
    const currentSubmissions = JSON.parse(localStorage.getItem('agency_leads') || '[]');
    currentSubmissions.push(lead);
    localStorage.setItem('agency_leads', JSON.stringify(currentSubmissions));
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<div class="toast-icon">✓</div><div class="toast-message"></div>';
        document.body.appendChild(toast);
    }

    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 5000);
}

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

function initPortfolioFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterTabs.length === 0 || portfolioCards.length === 0) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                const show = filterValue === 'all' || categories.includes(filterValue);
                card.style.display = show ? 'flex' : 'none';
                if (show) {
                    card.style.opacity = '0';
                    requestAnimationFrame(() => { card.style.opacity = '1'; });
                }
            });
        });
    });
}
