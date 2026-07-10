/**
 * Main JavaScript
 * Handles Modal, Tabs, Mobile Menu, Scroll Effects, and EmailJS
 */

// Initialize EmailJS (@emailjs/browser v4)
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: "Rf0ufR-4pRr0PfEFD" });
    } else {
        console.error("EmailJS not loaded");
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    initModal();
    initTabs();
    initMobileMenu();
    initScrollEffects();
    initFooterYear();
});

/* --- 푸터 연도 자동 갱신 --- */
function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
}

/* --- Modal Popup Logic (한 오버레이에 두 카드 나란히) --- */
let lastFocusedBeforePopup = null;

function getPopupsEls() {
    return {
        overlay: document.getElementById('popupsOverlay'),
        promoCard: document.getElementById('promoCard'),
        feeCard: document.getElementById('feeCard')
    };
}

function hideOverlayIfBothHidden() {
    const { overlay, promoCard, feeCard } = getPopupsEls();
    if (!overlay || !promoCard || !feeCard) return;
    if (promoCard.classList.contains('popup-card-hidden') && feeCard.classList.contains('popup-card-hidden')) {
        overlay.classList.remove('open');
        restorePopupFocus();
    }
}

function restorePopupFocus() {
    if (lastFocusedBeforePopup && typeof lastFocusedBeforePopup.focus === 'function') {
        lastFocusedBeforePopup.focus();
    }
    lastFocusedBeforePopup = null;
}

function closeAllPopups() {
    const { overlay, promoCard, feeCard } = getPopupsEls();
    if (promoCard) promoCard.classList.add('popup-card-hidden');
    if (feeCard) feeCard.classList.add('popup-card-hidden');
    if (overlay) overlay.classList.remove('open');
    restorePopupFocus();
}

function initModal() {
    const { overlay, promoCard, feeCard } = getPopupsEls();
    if (!overlay || !promoCard || !feeCard) return;

    const showPromo = getCookie('hidePopup') !== 'yes';
    const showFee = getCookie('hideFeePopup') !== 'yes';

    if (!showPromo) promoCard.classList.add('popup-card-hidden');
    if (!showFee) feeCard.classList.add('popup-card-hidden');

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeAllPopups();
    });

    // 카드 밖(배경) 클릭으로 닫기
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('popups-wrapper')) closeAllPopups();
    });

    if (!showPromo && !showFee) return;

    setTimeout(() => {
        lastFocusedBeforePopup = document.activeElement;
        overlay.classList.add('open');
        const firstBtn = overlay.querySelector('.popup-card:not(.popup-card-hidden) .modal-btn');
        if (firstBtn) firstBtn.focus();
    }, 500);
}

function closeModal() {
    const { promoCard } = getPopupsEls();
    if (promoCard) promoCard.classList.add('popup-card-hidden');
    hideOverlayIfBothHidden();
}

function closeForToday() {
    document.cookie = 'hidePopup=yes;path=/;max-age=86400';
    closeModal();
}

function closeFeeModal() {
    const { feeCard } = getPopupsEls();
    if (feeCard) feeCard.classList.add('popup-card-hidden');
    hideOverlayIfBothHidden();
}

function closeFeeForToday() {
    document.cookie = 'hideFeePopup=yes;path=/;max-age=86400';
    closeFeeModal();
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// Global scope for HTML onclick access
window.closeModal = closeModal;
window.closeForToday = closeForToday;
window.closeFeeModal = closeFeeModal;
window.closeFeeForToday = closeFeeForToday;

/* --- Tabs Logic (ARIA + 키보드 방향키 지원) --- */
function initTabs() {
    const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length === 0) return;

    function activateTab(btn) {
        tabBtns.forEach(b => {
            const isActive = b === btn;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
            b.tabIndex = isActive ? 0 : -1;
        });
        tabContents.forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById(btn.getAttribute('data-tab'));
        if (targetContent) targetContent.classList.add('active');
    }

    tabBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => activateTab(btn));
        btn.addEventListener('keydown', (e) => {
            let idx = null;
            if (e.key === 'ArrowRight') idx = (i + 1) % tabBtns.length;
            else if (e.key === 'ArrowLeft') idx = (i - 1 + tabBtns.length) % tabBtns.length;
            else if (e.key === 'Home') idx = 0;
            else if (e.key === 'End') idx = tabBtns.length - 1;
            if (idx !== null) {
                e.preventDefault();
                tabBtns[idx].focus();
                activateTab(tabBtns[idx]);
            }
        });
    });
}

/* --- Mobile Menu Logic --- */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (!toggle || !navUl) return;

    function setMenuOpen(open) {
        navUl.classList.toggle('show', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    }

    toggle.addEventListener('click', () => {
        setMenuOpen(!navUl.classList.contains('show'));
    });

    // Close menu when clicking a link
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });
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

    // 허니팟: 숨은 필드에 값이 있으면 봇으로 판단하고 전송하지 않음
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) {
        document.getElementById('contactForm').reset();
        return;
    }

    const btn = document.querySelector('.btn-submit');
    const originalText = btn.innerText;

    // Loading state
    btn.innerText = '전송 중...';
    btn.disabled = true;

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
            alert("전송에 실패했습니다. 잠시 후 다시 시도해 주시거나, 전화(010-4020-0979) 또는 이메일로 문의해 주세요.");
            console.error('EmailJS Error:', error);
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
}

window.sendMail = sendMail;
