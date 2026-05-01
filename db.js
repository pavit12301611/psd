// ===== FRONTEND DATABASE CLIENT =====
// Paste this into your main site's script files or add <script src="db.js"> to your HTML

(function() {
    const API = '/.netlify/functions';

    // ===== TRACK PAGE VIEW =====
    async function trackView() {
        try {
            await fetch(`${API}/views`, { method: 'POST' });
        } catch (e) { /* silent fail */ }
    }

    // ===== TRACK ANALYTICS EVENT =====
    async function trackEvent(type, data = {}) {
        try {
            await fetch(`${API}/analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data })
            });
        } catch (e) { /* silent fail */ }
    }

    // ===== CONTACT FORM SUBMISSION =====
    async function submitContact(name, email, message) {
        const res = await fetch(`${API}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send message');
        return data;
    }

    // ===== GET VIEW COUNT =====
    async function getViews() {
        try {
            const res = await fetch(`${API}/views`);
            const data = await res.json();
            return data.views || 0;
        } catch { return 0; }
    }

    // ===== AUTO INIT =====
    document.addEventListener('DOMContentLoaded', () => {
        // Track page view
        trackView();

        // Track section visibility
        const sections = document.querySelectorAll('section[id]');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    trackEvent('section_view', { section: entry.target.id });
                }
            });
        }, { threshold: 0.5 });
        sections.forEach(s => sectionObserver.observe(s));

        // Track project clicks
        document.querySelectorAll('.project-row, .project-item').forEach(el => {
            el.addEventListener('click', () => {
                const name = el.querySelector('h3')?.textContent || 'unknown';
                trackEvent('project_click', { project: name });
            });
        });

        // Track contact button clicks
        document.querySelectorAll('a[href="#contact"], .nav-cta').forEach(el => {
            el.addEventListener('click', () => {
                trackEvent('contact_click', {});
            });
        });

        // Wire up contact form if it exists
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = contactForm.querySelector('button[type=submit],.btn-primary,.submit-btn');
                const originalHTML = btn?.innerHTML;

                const name = contactForm.querySelector('input[type=text],#name')?.value || '';
                const email = contactForm.querySelector('input[type=email],#email')?.value || '';
                const message = contactForm.querySelector('textarea,#message')?.value || '';

                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<span>Sending...</span>';
                }

                try {
                    await submitContact(name, email, message);
                    if (btn) {
                        btn.innerHTML = '<span>✓ Message Sent!</span>';
                        btn.style.background = '#34c759';
                    }
                    contactForm.reset();
                    setTimeout(() => {
                        if (btn) {
                            btn.innerHTML = originalHTML;
                            btn.style.background = '';
                            btn.disabled = false;
                        }
                    }, 4000);
                } catch (err) {
                    if (btn) {
                        btn.innerHTML = `<span>⚠ ${err.message}</span>`;
                        btn.style.background = '#ff3b30';
                        setTimeout(() => {
                            btn.innerHTML = originalHTML;
                            btn.style.background = '';
                            btn.disabled = false;
                        }, 4000);
                    }
                }
            });
        }
    });

    // Expose globally
    window.PortfolioDB = { trackEvent, trackView, submitContact, getViews };
})();