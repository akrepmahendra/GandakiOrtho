/* =====================================================================
   A. GLOBAL DYNAMIC LAYOUT ENGINE (HEADER / FOOTER INJECTOR)
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Inject components into matching semantic structural wrappers
    loadLayoutComponent('header', 'components/header.html', initializeMobileMenu);
    loadLayoutComponent('footer', 'components/footer.html');

    // Initialize page-specific scripts if elements are present on current viewport
    if (document.getElementById('eventModal')) {
        initializeEventPopup();
    }
    if (document.querySelector('.slide')) {
        initializeHeroSlider();
    }
});

function loadLayoutComponent(selector, filepath, callback = null) {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    fetch(filepath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load structural layout asset: ${filepath}`);
            return response.text();
        })
        .then(htmlContent => {
            targetElement.innerHTML = htmlContent;
            highlightActiveNav();
            if (callback) callback();
        })
        .catch(error => console.error("Layout Engine Exception:", error));
}

function highlightActiveNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("header nav a");

    navLinks.forEach(link => {
        const linkTarget = link.getAttribute("href");
        if (linkTarget === currentPath) {
            link.classList.add("text-blue-700", "font-bold", "border-b-2", "border-blue-700", "pb-1");
            link.classList.remove("hover:text-blue-700", "text-slate-600");
        }
    });
}

/* =====================================================================
   B. GLOBAL MOBILE NAVIGATION INTERACTION LOGIC
   ===================================================================== */
function initializeMobileMenu() {
    // Attached explicitly to accommodate layout injections dynamically
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuIcon = document.getElementById('menuIcon');
        
        if (!mobileMenu || !menuIcon) return;

        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    };
}

/* =====================================================================
   C. HOME-SPECIFIC PROMOTIONAL MODAL POPUP & COUNTDOWN
   ===================================================================== */
const GOA_EVENT_CONFIG = {
    isActive: true,                          
    targetDate: "Dec 18, 2026",              
    imagePath: "images/goacon2026.jpg"       
};

let countdownInterval = null;

function initializeEventPopup() {
    if (!GOA_EVENT_CONFIG.isActive) return;

    const modalEl = document.getElementById('eventModal');
    const targetTime = new Date(GOA_EVENT_CONFIG.targetDate).getTime();
    if (isNaN(targetTime) || !modalEl) return;

    const imgEl = document.getElementById('popupEventImage');
    if (imgEl && GOA_EVENT_CONFIG.imagePath) {
        imgEl.src = GOA_EVENT_CONFIG.imagePath;
    }

    setTimeout(() => {
        modalEl.classList.remove('hidden');
        modalEl.classList.add('flex');
    }, 800);

    updateCountdown(targetTime);
    countdownInterval = setInterval(() => updateCountdown(targetTime), 1000);

    // Dynamic dismiss bindings
    window.closeEventModal = function() {
        modalEl.classList.remove('flex');
        modalEl.classList.add('hidden');
        if (countdownInterval) clearInterval(countdownInterval);
    };

    window.addEventListener('click', (e) => {
        if (e.target === modalEl) window.closeEventModal();
    });
}

function updateCountdown(targetTime) {
    const now = new Date().getTime();
    const difference = targetTime - now;

    const headingEl = document.getElementById('countdownHeading');
    const daysBox = document.getElementById('daysBox');

    if (difference <= 0) {
        if (headingEl) headingEl.innerText = "Event Active / Expired";
        if (daysBox) daysBox.innerText = "00";
        if (countdownInterval) clearInterval(countdownInterval);
        return;
    }

    const totalDaysRemaining = Math.ceil(difference / (1000 * 60 * 60 * 24));
    if (daysBox) {
        daysBox.innerText = totalDaysRemaining.toString().padStart(2, '0');
    }
}

/* =====================================================================
   D. HOME-SPECIFIC BANNER SLIDER LOGIC
   ===================================================================== */
let currentIdx = 0;

function initializeHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    window.moveSlide = function(step) {
        currentIdx += step;
        if (currentIdx >= slides.length) currentIdx = 0;
        if (currentIdx < 0) currentIdx = slides.length - 1;

        slides.forEach((slide, idx) => {
            if (idx === currentIdx) {
                slide.classList.add('active', 'opacity-100');
                slide.classList.remove('opacity-0');
            } else {
                slide.classList.remove('active', 'opacity-100');
                slide.classList.add('opacity-0');
            }
        });
    };

    setInterval(() => window.moveSlide(1), 5000);
}

