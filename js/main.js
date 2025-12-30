/**
 * Main JavaScript for Rebuilt Website
 * Handles Modal, Tabs, Mobile Menu, and EmailJS
 */

// Initialize EmailJS
(function () {
    // Check if emailjs is loaded
    if (typeof emailjs !== 'undefined') {
        // 기존 v1 키 유지
        emailjs.init("Rf0ufR-4pRr0PfEFD");
    } else {
        console.error("EmailJS not loaded");
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    initModal();
    initTabs();
    initMobileMenu();
    initScrollEffects();
});

/* --- Modal Popup Logic --- */
function initModal() {
    // index.html의 ID "promoModal"과 매칭
    const modal = document.getElementById('promoModal');
    if (!modal) return;

    // Check cookie
    const hidePopup = getCookie('hidePopup');
    if (hidePopup !== 'yes') {
        // Show modal after a short delay for better UX
        setTimeout(() => {
            modal.classList.add('open');
        }, 500);
    }
}

function closeModal() {
    const modal = document.getElementById('promoModal');
    if (modal) modal.classList.remove('open');
}

function closeForToday() {
    // Set cookie for 1 day
    document.cookie = 'hidePopup=yes;path=/;max-age=86400';
    closeModal();
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// Global scope for HTML onclick access
window.closeModal = closeModal;
window.closeForToday = closeForToday;

/* --- Tabs Logic --- */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length === 0) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/* --- Mobile Menu Logic --- */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (toggle && navUl) {
        toggle.addEventListener('click', () => {
            navUl.classList.toggle('show');
            // Change icon if needed (optional)
        });

        // Close menu when clicking a link
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('show');
            });
        });
    }
}

/* --- Scroll Effects --- */
function initScrollEffects() {
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            header.style.background = 'rgba(30, 41, 59, 1)'; // Solid color on scroll
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(30, 41, 59, 0.95)';
        }
    });
}

/* --- EmailJS Logic --- */
function sendMail(event) {
    event.preventDefault(); // Prevent form submission

    const btn = document.querySelector('.btn-submit');
    const originalText = btn.innerText;

    // Loading state
    btn.innerText = '전송 중...';
    btn.disabled = true;

    // v1, v2 공통으로 사용하는 ID들
    const templateParams = {
        from_name: document.getElementById('name').value.trim(),
        contact: document.getElementById('contactInput').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value
    };

    emailjs.send("service_ek3cxkv", "template_pj3ga78", templateParams)
        .then(() => {
            alert("문의가 성공적으로 접수되었습니다. 확인 후 연락드리겠습니다.");
            document.getElementById('contactForm').reset();
        })
        .catch((error) => {
            alert("전송 실패: " + JSON.stringify(error));
            console.error('EmailJS Error:', error);
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
}

window.sendMail = sendMail;