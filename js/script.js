// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu after clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Contact form (front-end only placeholder) =====
const sendMessageBtn = document.getElementById('sendMessageBtn');
const formNote = document.getElementById('formNote');

if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formNote.textContent = 'Please fill in all fields before sending.';
            formNote.style.color = '#FF8A8A';
            return;
        }

        // Placeholder: connect this to your backend / email service later.
        formNote.textContent = `Thanks, ${name}! Your message has been noted.`;
        formNote.style.color = '#22D3B8';

        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    });
}
