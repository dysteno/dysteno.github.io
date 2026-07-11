/**
 * Main JavaScript
 * Handles Modal, Tabs, Mobile Menu, Scroll Effects, and EmailJS
 */

// Initialize EmailJS (@emailjs/browser v4) — 문의 폼이 있는 페이지에서만 필요
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: "Rf0ufR-4pRr0PfEFD" });
    } else if (document.getElementById('contactForm')) {
        console.error("EmailJS not loaded");
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    initModal();
    initTabs();
    initMobileMenu();
    initScrollEffects();
    initFooterYear();
    initCareerYears();
    initQuoteCalc();
    initQuotePrefill();
    initScrollReveal();
});

/* --- 스크롤 등장 애니메이션 (IntersectionObserver, 미지원 시 항상 표시) --- */
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
        '.service-card, .process-step, .history-list li, .faq-item, .quote-calc, ' +
        '.about-container, .contact-container, .pricing-table-wrap, .process-trust'
    );
    if (targets.length === 0) return;

    document.documentElement.classList.add('js');

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 5) * 70 + 'ms';
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));
}

/* --- 방송 자막 경력 연차 자동 갱신 (2017년 시작 기준: 2026년=9년, 매년 1월 1일 +1) --- */
function initCareerYears() {
    const years = new Date().getFullYear() - 2017;
    document.querySelectorAll('.js-bc-years').forEach(el => {
        el.textContent = years;
    });
}

/* --- 푸터 연도 자동 갱신 --- */
function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
}

/* --- Modal Popup Logic (프로모션 팝업) --- */
let lastFocusedBeforePopup = null;

function restorePopupFocus() {
    if (lastFocusedBeforePopup && typeof lastFocusedBeforePopup.focus === 'function') {
        lastFocusedBeforePopup.focus();
    }
    lastFocusedBeforePopup = null;
}

function closeModal() {
    const overlay = document.getElementById('popupsOverlay');
    if (overlay) overlay.classList.remove('open');
    restorePopupFocus();
}

function closeForToday() {
    document.cookie = 'hidePopup=yes;path=/;max-age=86400';
    closeModal();
}

function initModal() {
    const overlay = document.getElementById('popupsOverlay');
    const promoCard = document.getElementById('promoCard');
    if (!overlay || !promoCard) return;

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    // 카드 밖(배경) 클릭으로 닫기
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('popups-wrapper')) closeModal();
    });

    if (getCookie('hidePopup') === 'yes') return;

    setTimeout(() => {
        lastFocusedBeforePopup = document.activeElement;
        overlay.classList.add('open');
        const firstBtn = overlay.querySelector('.modal-btn');
        if (firstBtn) firstBtn.focus();
    }, 500);
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// Global scope for HTML onclick access
window.closeModal = closeModal;
window.closeForToday = closeForToday;

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

/* --- 간편 견적 계산기 --- */
function initQuoteCalc() {
    const calc = document.getElementById('quoteCalc');
    if (!calc) return;

    // 요금표 구간 (분 이내 / 만원 단위) — index.html 요금표와 동기화 유지
    const BRACKETS = [
        { max: 3, call: 2, field: 4 },
        { max: 5, call: 4, field: 6 },
        { max: 10, call: 6, field: 8 },
        { max: 20, call: 10, field: 12 },
        { max: 30, call: 12, field: 14 },
        { max: 40, call: 14, field: 16 },
        { max: 50, call: 16, field: 18 },
        { max: 60, call: 18, field: 20 }
    ];

    const minutesEl = document.getElementById('recMinutes');
    const resultEl = document.getElementById('quoteResult');
    const ctaBtn = document.getElementById('quoteContactBtn');
    // 같은 페이지에 문의 폼이 있으면 클릭 시 문의 내용 자동 입력, 없으면 쿼리로 전달
    const messageEl = document.getElementById('message');

    let currentSummary = '';

    function update() {
        const type = calc.querySelector('input[name="recType"]:checked').value;
        const typeName = type === 'call' ? '통화 녹음' : '현장 녹음';
        const mins = parseInt(minutesEl.value, 10);

        if (!mins || mins < 1) {
            resultEl.textContent = '녹음 길이를 분 단위로 입력해 주세요.';
            currentSummary = '';
            return;
        }

        const bracket = BRACKETS.find(b => mins <= b.max);

        if (!bracket) {
            resultEl.textContent = '60분을 초과하는 분량은 개별 견적으로 안내해 드립니다. 아래 버튼으로 문의해 주세요.';
            currentSummary = '[간편 견적 계산기 문의]\n- 녹음 종류: ' + typeName + '\n- 녹음 길이: 약 ' + mins + '분 (60분 초과)\n정확한 견적을 부탁드립니다.';
        } else {
            const price = type === 'call' ? bracket.call : bracket.field;
            resultEl.textContent = '예상 요금: ' + price + '만원 (부가세 별도 · ' + bracket.max + '분 이내 구간)';
            currentSummary = '[간편 견적 계산기 문의]\n- 녹음 종류: ' + typeName + '\n- 녹음 길이: 약 ' + mins + '분\n- 예상 요금: ' + price + '만원 (부가세 별도)\n정확한 견적을 부탁드립니다.';
        }

        // 문의 폼이 다른 페이지에 있으면 쿼리 파라미터로 내용 전달
        if (!messageEl && ctaBtn) {
            ctaBtn.href = '../index.html?quote=' + encodeURIComponent(currentSummary) + '#contact';
        }
    }

    calc.querySelectorAll('input[name="recType"]').forEach(r => r.addEventListener('change', update));
    minutesEl.addEventListener('input', update);

    if (messageEl && ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            if (currentSummary && !messageEl.value.trim()) messageEl.value = currentSummary;
        });
    }

    update();
}

/* --- 견적 계산기 쿼리 파라미터로 문의 내용 자동 입력 --- */
function initQuotePrefill() {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    const quote = new URLSearchParams(location.search).get('quote');
    if (quote && !messageEl.value.trim()) messageEl.value = quote;
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
