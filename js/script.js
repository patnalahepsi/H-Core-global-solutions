// ===== Page switching (Home / About / Services / Process / Careers / Contact) =====
const pages = document.querySelectorAll('.page');
const navLinkEls = document.querySelectorAll('.nav-link');

function showPage(pageId) {
    let found = false;

    pages.forEach((page) => {
        const match = page.id === pageId;
        page.classList.toggle('active', match);
        if (match) found = true;
    });

    if (!found) {
        document.getElementById('home')?.classList.add('active');
        pageId = 'home';
    }

    navLinkEls.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + pageId);
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
    return pageId;
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        const targetPage = document.getElementById(targetId);
        if (targetPage && targetPage.classList.contains('page')) {
            e.preventDefault();
            history.pushState(null, '', '#' + targetId);
            showPage(targetId);
        }
    });
});

window.addEventListener('popstate', () => {
    const pageId = window.location.hash.replace('#', '') || 'home';
    showPage(pageId);
});

showPage(window.location.hash.replace('#', '') || 'home');

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Stat counter animation =====
const statNumbers = document.querySelectorAll('.stat-number');

function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 900;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(progress * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

if (statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    statNumbers.forEach((el) => statsObserver.observe(el));
}

// ===== Search =====
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchNote = document.getElementById('searchNote');

if (searchToggle && searchBar && searchInput) {
    searchToggle.addEventListener('click', () => {
        const isOpen = searchBar.classList.toggle('open');
        searchToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) searchInput.focus();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runSearch(searchInput.value);
    });
}

function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach((el) => {
        el.outerHTML = el.innerHTML;
    });
}

function runSearch(query) {
    clearHighlights();
    const q = query.trim().toLowerCase();
    if (!q) {
        if (searchNote) searchNote.textContent = '';
        return;
    }

    const searchable = ['h1', 'h2', 'h3', 'p', 'li', 'span'];
    let matchEl = null;
    let matchPage = null;

    for (const page of pages) {
        const candidates = page.querySelectorAll(searchable.join(','));
        for (const el of candidates) {
            if (el.children.length === 0 && el.textContent.toLowerCase().includes(q)) {
                matchEl = el;
                matchPage = page.id;
                break;
            }
        }
        if (matchEl) break;
    }

    if (matchEl && matchPage) {
        history.pushState(null, '', '#' + matchPage);
        showPage(matchPage);

        const regex = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
        matchEl.innerHTML = matchEl.textContent.replace(regex, '<span class="search-highlight">$1</span>');

        setTimeout(() => {
            matchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);

        if (searchNote) searchNote.textContent = 'Found on ' + matchPage;
    } else if (searchNote) {
        searchNote.textContent = 'No matches found';
    }
}

// ===== Careers: prefill role from clicked "Apply" button =====
const appRoleSelect = document.getElementById('appRole');

document.querySelectorAll('.apply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        if (appRoleSelect && role) {
            [...appRoleSelect.options].forEach((opt) => {
                if (opt.value === role || opt.textContent.trim() === role) {
                    appRoleSelect.value = opt.value;
                }
            });
        }
    });
});

// ===== Application form: file name display + Formspree check =====
const applicationForm = document.getElementById('applicationForm');
const fileInput = document.getElementById('appResume');
const fileZone = document.getElementById('fileUploadZone');
const fileLabel = document.getElementById('fileUploadLabel');
const applicationNote = document.getElementById('applicationNote');

if (fileInput && fileZone && fileLabel) {
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            fileLabel.textContent = '📄 ' + fileInput.files[0].name;
            fileZone.classList.add('has-file');
        } else {
            fileLabel.textContent = '📎 Click to upload, or drag your resume here (PDF or Word, max 5MB)';
            fileZone.classList.remove('has-file');
        }
    });

    ['dragover', 'dragleave', 'drop'].forEach((evt) => {
        fileZone.addEventListener(evt, (e) => {
            e.preventDefault();
            fileZone.classList.toggle('drag-over', evt === 'dragover');
        });
    });
}

if (applicationForm) {
    applicationForm.addEventListener('submit', (e) => {
        const notConfigured = applicationForm.getAttribute('action').includes('YOUR_FORM_ID');
        if (notConfigured) {
            e.preventDefault();
            applicationNote.textContent =
                'This form isn\u2019t connected yet \u2014 the site owner needs to add a Formspree endpoint before applications can be received.';
            applicationNote.style.color = '#E23D3D';
        }
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
            formNote.style.color = '#E23D3D';
            return;
        }

        formNote.textContent = `Thanks, ${name}! Your message has been noted.`;
        formNote.style.color = '#12B7A0';

        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
    });
}
