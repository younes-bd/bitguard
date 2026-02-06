// initialization

const RESPONSIVE_WIDTH = 1024

let headerWhiteBg = false
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")

function onHeaderClickOutside(e) {
    if (collapseHeaderItems && !collapseHeaderItems.contains(e.target)) {
        toggleHeader()
    }
}

function toggleHeader() {
    if (!collapseHeaderItems || !collapseBtn) return

    if (isHeaderCollapsed) {
        collapseHeaderItems.classList.add("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "90vh"
        collapseBtn.classList.remove("bi-list")
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed")
        isHeaderCollapsed = false
        document.body.classList.add("modal-open")
        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)
    } else {
        collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "0vh"
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed")
        collapseBtn.classList.add("bi-list")
        document.body.classList.remove("modal-open")
        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)
    }
}

function responsive() {
    if (!isHeaderCollapsed) {
        toggleHeader()
    }
    if (window.innerWidth > RESPONSIVE_WIDTH) {
        if (collapseHeaderItems) collapseHeaderItems.style.height = ""
    } else {
        isHeaderCollapsed = true
    }
}

if (collapseBtn && collapseHeaderItems) {
    responsive()
    window.addEventListener("resize", responsive)
}

// Remove dark mode entirely and enforce light mode
function enforceLightMode() {
    document.documentElement.classList.remove("tw-dark");
    document.body.classList.remove("tw-dark");
    localStorage.setItem("theme", "light");
    localStorage.setItem("color-theme", "light");

    // Hide any toggle buttons
    const toggleBtn = document.querySelector("#theme-toggle");
    if (toggleBtn) toggleBtn.style.display = "none";
}

// Run immediately
enforceLightMode();

// Run again on DOM loaded to ensure it sticks
document.addEventListener('DOMContentLoaded', enforceLightMode);

// Watch for attribute changes just in case
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            if (document.documentElement.classList.contains("tw-dark")) {
                enforceLightMode();
            }
        }
    });
});
observer.observe(document.documentElement, { attributes: true });

// Video modal functions (global - called from HTML onclick)
function openVideo() {
    const videoBg = document.querySelector("#video-container-bg")
    const videoContainer = document.querySelector("#video-container")

    if (videoBg && videoContainer) {
        videoBg.classList.remove("tw-scale-0", "tw-opacity-0")
        videoBg.classList.add("tw-scale-100", "tw-opacity-100")
        videoContainer.classList.remove("tw-scale-0")
        videoContainer.classList.add("tw-scale-100")
        document.body.classList.add("modal-open")
    }
}

function closeVideo() {
    const videoBg = document.querySelector("#video-container-bg")
    const videoContainer = document.querySelector("#video-container")

    if (videoContainer && videoBg) {
        videoContainer.classList.add("tw-scale-0")
        videoContainer.classList.remove("tw-scale-100")
        setTimeout(() => {
            videoBg.classList.remove("tw-scale-100", "tw-opacity-100")
            videoBg.classList.add("tw-scale-0", "tw-opacity-0")
        }, 400)
        document.body.classList.remove("modal-open")
    }
}

/**
 * Initialize all interactive features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('=== DOM Content Loaded ===')

    // Initialize Playground
    initializePlayground()

    // Initialize Navigation Dropdowns
    initializeNavigationDropdowns()

    console.log('=== Interactive features initialized ===')
})

function initializePlayground() {
    console.log('Initializing Playground...')

    const promptPlayground = document.querySelector("#pixa-playground")
    const promptForm = document.querySelector("#prompt-form")

    console.log('Playground element:', promptPlayground)
    console.log('Form element:', promptForm)

    if (!promptPlayground || !promptForm) {
        console.warn('Playground elements not found!')
        return
    }

    try {
        const promptWindow = new Prompt("#pixa-playground")
        const promptInput = promptForm.querySelector("input[name='prompt']")
        const MAX_PROMPTS = 3

        console.log('Prompt window created:', promptWindow)
        console.log('Prompt input:', promptInput)

        promptForm.addEventListener("submit", (event) => {
            event.preventDefault()
            console.log('Form submitted!')

            if (promptWindow.promptList.length >= MAX_PROMPTS) {
                console.log('Max prompts reached')
                return false
            }

            if (promptInput && promptInput.value) {
                console.log('Adding prompt:', promptInput.value)
                promptWindow.addPrompt(promptInput.value)
                promptInput.value = ""
            }

            if (promptWindow.promptList.length >= MAX_PROMPTS) {
                const signUpPrompt = document.querySelector("#signup-prompt")
                if (signUpPrompt) {
                    signUpPrompt.classList.add("tw-scale-100")
                    signUpPrompt.classList.remove("tw-scale-0")
                }
                promptForm.querySelectorAll("input").forEach(e => { e.disabled = true })
            }

            return false
        })

        // Initialize dropdowns
        const dropdowns = document.querySelectorAll('.dropdown')
        console.log('Found dropdowns:', dropdowns.length)
        dropdowns.forEach(dropdown => {
            console.log('Initializing dropdown:', dropdown.id)
            new Dropdown(`#${dropdown.id}`, promptWindow.setAIModel)
        })

        console.log('✅ Playground initialized successfully')
    } catch (error) {
        console.error('❌ Error initializing playground:', error)
    }
}

function initializeNavigationDropdowns() {
    console.log('Initializing Navigation Dropdowns...')

    const navToggles = document.querySelectorAll(".nav-dropdown-toggle")
    console.log('Found nav toggles:', navToggles.length)

    navToggles.forEach(toggle => {
        const targetId = toggle.getAttribute("data-target")
        const dropdown = document.getElementById(targetId)

        if (!dropdown) {
            console.warn(`Dropdown not found for target: ${targetId}`)
            return
        }

        toggle.addEventListener("click", () => toggleNavDropdown(toggle, dropdown))
        dropdown.addEventListener("mouseleave", () => {
            if (window.innerWidth > RESPONSIVE_WIDTH) {
                navMouseLeave(toggle, dropdown)
            }
        })
        toggle.addEventListener("mouseenter", () => {
            if (window.innerWidth > RESPONSIVE_WIDTH) {
                openNavDropdown(toggle, dropdown)
            }
        })
        toggle.addEventListener("mouseleave", () => {
            if (window.innerWidth > RESPONSIVE_WIDTH) {
                navMouseLeave(toggle, dropdown)
            }
        })
    })

    console.log('✅ Navigation dropdowns initialized')
}

function toggleNavDropdown(toggle, dropdown) {
    if (dropdown.getAttribute("data-open") === "true") {
        closeNavDropdown(toggle, dropdown)
    } else {
        openNavDropdown(toggle, dropdown)
    }
}

function navMouseLeave(toggle, dropdown) {
    if (window.innerWidth > RESPONSIVE_WIDTH) {
        setTimeout(() => closeNavDropdown(toggle, dropdown), 100)
    }
}

function openNavDropdown(toggle, dropdown) {
    document.querySelectorAll(".nav-dropdown-list").forEach(d => {
        if (d !== dropdown) {
            d.classList.remove("tw-opacity-100", "tw-scale-100",
                "max-lg:tw-min-h-[450px]", "tw-min-w-[320px]", "max-lg:!tw-h-fit")
            d.setAttribute("data-open", false)
        }
    })

    dropdown.classList.add("tw-opacity-100", "tw-scale-100",
        "max-lg:tw-min-h-[450px]", "max-lg:!tw-h-fit", "tw-min-w-[320px]")
    dropdown.setAttribute("data-open", true)
}

function closeNavDropdown(toggle, dropdown) {
    if (window.innerWidth > RESPONSIVE_WIDTH && (dropdown.matches(":hover") || toggle.matches(":hover"))) {
        return
    }
    if (dropdown.matches(":hover")) {
        return
    }
    dropdown.classList.remove("tw-opacity-100", "tw-scale-100",
        "max-lg:tw-min-h-[450px]", "tw-min-w-[320px]", "max-lg:!tw-h-fit")
    dropdown.setAttribute("data-open", false)
}

/**
 * GSAP Animations - Load after everything else
 */
window.addEventListener('load', function () {
    console.log('=== Window Loaded - Initializing GSAP ===')

    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP library not loaded!')
        return
    }

    gsap.registerPlugin(ScrollTrigger)

    // Typed.js
    const typedElement = document.getElementById('prompts-sample')
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#prompts-sample', {
            strings: [
                "How to solve a rubik's cube? Step by step guide",
                "What's Pixa playground?",
                "How to build an AI SaaS App?",
                "How to integrate Pixa API?"
            ],
            typeSpeed: 80,
            smartBackspace: true,
            loop: true,
            backDelay: 2000,
        })
        console.log('✅ Typed.js initialized')
    }

    // Dashboard 3D animation
    const dashboard = document.getElementById("dashboard")
    if (dashboard) {
        gsap.to("#dashboard", {
            scale: 1,
            translateY: 0,
            rotateX: "0deg",
            scrollTrigger: {
                trigger: "#dashboard-container",
                start: window.innerWidth > RESPONSIVE_WIDTH ? "top 80%" : "top 70%",
                end: "bottom bottom",
                scrub: 1,
            }
        })
        console.log('✅ Dashboard animation initialized')
    }

    // FAQ Accordion
    const faqAccordion = document.querySelectorAll('.faq-accordion')
    console.log('Found FAQ accordions:', faqAccordion.length)

    faqAccordion.forEach(function (btn) {
        btn.addEventListener('click', function () {
            this.classList.toggle('active')
            let content = this.nextElementSibling
            let icon = this.querySelector(".bi-plus")

            if (content.style.maxHeight === '240px') {
                content.style.maxHeight = '0px'
                content.style.padding = '0px 18px'
                if (icon) icon.style.transform = "rotate(0deg)"
            } else {
                content.style.maxHeight = '240px'
                content.style.padding = '20px 18px'
                if (icon) icon.style.transform = "rotate(45deg)"
            }
            console.log('FAQ toggled')
        })
    })

    // Reveal animations
    const sections = document.querySelectorAll("section")
    console.log(`Found ${sections.length} sections for reveal animations`)

    sections.forEach((section, index) => {
        const revealElements = section.querySelectorAll(".reveal-up")

        if (revealElements.length === 0) return

        console.log(`Section ${index}: ${revealElements.length} reveal elements`)

        revealElements.forEach((element, elemIndex) => {
            gsap.fromTo(element,
                {
                    opacity: 1,
                    y: 80,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: elemIndex * 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        end: "top 60%",
                        toggleActions: "play none none none",
                    }
                }
            )
        })
    })

    setTimeout(() => {
        ScrollTrigger.refresh()
        console.log('✅ GSAP animations initialized and refreshed')
    }, 200)
})

// Refresh on resize
let resizeTimer
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh()
        }
    }, 250)
})
