/**
 * Central site configuration — update contact details here once.
 */
const SITE_CONFIG = {
    phone: '918074773982',
    phoneDisplay: '+91-8074773982',
    email: 'hello@gravitydigital.in',
    formEmail: 'appworks.dheeraj@gmail.com',
    siteUrl: 'https://gravitydigital.in',
    siteName: 'Gravity Digital',
    whatsappMessages: {
        quote: "Hi Gravity Digital, I'd like to get a free quote.",
        contact: "Hi Gravity Digital, I'd like to discuss a project.",
        cta: 'Hi Gravity Digital, I am interested in building a website or automation tool.'
    },
    social: {
        linkedin: 'https://linkedin.com/company/gravity-digital',
        instagram: 'https://instagram.com/gravitydigital'
    },
    calendly: 'https://calendly.com'
};

function buildWhatsAppUrl(message) {
    return `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(message)}`;
}
