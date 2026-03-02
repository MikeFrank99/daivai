import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// INITIALIZATION
// ==========================================
export function initAnimations() {
    console.log("Initializing GSAP animations...");

    initTextAppear();
    initStickerAnimation();
    initColorTransition();
    initEventsSlider();
    initFooterAnimation();
    resizeCondensoText();
    initReflectionFix();
    initArrowAnimation();
    initLogoBounce();
    initLogoExplosion();

    // Event listeners
    window.addEventListener("resize", () => {
        resizeCondensoText();
        // Refresh ScrollTrigger on resize to ensure correct calculations
        ScrollTrigger.refresh();
    });

    // Handle font loading
    if (document.fonts) {
        document.fonts.ready.then(() => {
            console.log("Fonts loaded, resizing...");
            resizeCondensoText();
            // Re-run reflection fix and refresh ScrollTrigger
            setTimeout(() => {
                initReflectionFix();
                ScrollTrigger.refresh();
            }, 100);
        });
    }

    // Ensure ScrollTrigger refreshes after everything (images, css) is fully loaded
    // This is crucial for Firefox and sometimes Chrome on slower connections
    window.addEventListener("load", () => {
        console.log("Window loaded, refreshing GSAP...");
        resizeCondensoText();
        ScrollTrigger.refresh();

        // Double check a bit later to be safe
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    });
}

// ==========================================
// PARALLAX EFFECT
// ==========================================






// ==========================================
// UTILITIES (KEPT FROM ORIGINAL)
// ==========================================

// RESIZE CONDENSO TEXT
function resizeCondensoText() {
    const elements = document.querySelectorAll(".condenso-text");

    if (elements.length === 0) return;

    const viewportWidth = document.documentElement.clientWidth;
    const targetPercentage = 0.9;
    const targetWidth = viewportWidth * targetPercentage;

    elements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        // Backup current state
        const originalWhiteSpace = el.style.whiteSpace;
        const originalTransform = el.style.transform;
        const originalWidth = el.style.width;

        // Set test state for calculation
        el.style.whiteSpace = "nowrap";
        el.style.width = "auto";
        el.style.display = "inline-block";
        el.style.fontSize = "100px";

        const currentWidth = el.getBoundingClientRect().width;

        if (currentWidth > 0) {
            const ratio = targetWidth / currentWidth;
            const newFontSize = 100 * ratio;

            el.style.fontSize = `${newFontSize}px`;
        }

        // Restore/Set final state favoring centering
        el.style.whiteSpace = originalWhiteSpace;
        el.style.width = "100%"; // Force full width for text-align: center
        el.style.display = "flex"; // Use flex for better span centering
        el.style.justifyContent = "center";
        el.style.textAlign = "center";
        el.style.transform = originalTransform;
    });
}

// MOBILE REFLECTION FIX
function needsReflectionFix() {
    // Check for Firefox (has issues with background-attachment: fixed + background-clip: text)
    const isFirefox = /Firefox/i.test(navigator.userAgent);

    // Check for any mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check for iPad OS (disguised as MacIntel)
    const isPadOS = (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    return isFirefox || isMobile || isPadOS;
}

function initReflectionFix() {
    if (needsReflectionFix()) {
        document.documentElement.classList.add("is-mobile-fix");

        // Target all elements that have the reflection class
        const reflectiveElements = document.querySelectorAll(".shine-reflection");

        if (reflectiveElements.length === 0) return;

        function updateElementTops() {
            reflectiveElements.forEach((el) => {
                if (el instanceof HTMLElement) {
                    const rect = el.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const elementTop = rect.top + scrollTop;
                    el.style.setProperty("--element-top", elementTop.toString());
                }
            });
        }

        function updateScrollY() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            document.documentElement.style.setProperty("--scroll-y", scrollY.toString());
        }

        // Initial calculation
        updateElementTops();
        updateScrollY();

        // Update loop
        window.addEventListener("scroll", () => {
            requestAnimationFrame(updateScrollY);
        }, { passive: true });

        // Recalculate positions on resize (address bar show/hide) and orientation change
        window.addEventListener("resize", () => {
            updateElementTops();
            // Force scroll update too
            updateScrollY();
        });
    }
}

// ==========================================
// STICKER ANIMATION
// ==========================================
// ==========================================
// STICKER ANIMATION
// ==========================================
function initStickerAnimation() {
    // Original sticker (Right) - vertical peel (top to bottom)
    createSticker('sticker-wrapper', 'sticker-container', 'vertical');

    // Second sticker (Left) - horizontal peel (left to right)
    createSticker('sticker-wrapper-left', 'sticker-container-left', 'horizontal');
}

function createSticker(wrapperId, containerId, direction = 'vertical') {
    const wrapper = document.getElementById(wrapperId);
    const container = document.getElementById(containerId);
    const shadow = document.getElementById(`${containerId}-shadow`);

    if (!wrapper || !container) return;

    const isHorizontal = direction === 'horizontal';

    // Use fewer slices for performance
    const numSlices = 20;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // CSS dimensions
    const styles = window.getComputedStyle(wrapper);
    const containerSize = isHorizontal
        ? (parseInt(styles.width) || (isMobile ? 300 : 450))
        : (parseInt(styles.height) || (isMobile ? 300 : 450));
    const sliceSize = containerSize / numSlices;
    const slices = [];

    // Create slices
    for (let i = 0; i < numSlices; i++) {
        const slice = document.createElement('div');
        slice.classList.add('slice');

        if (isHorizontal) {
            // Vertical slices for horizontal peel
            slice.style.width = `${sliceSize + 1}px`;
            slice.style.height = `100%`;
            slice.style.top = `0px`;
            slice.style.left = `0px`;
            slice.style.backgroundPosition = `-${i * sliceSize}px 0px`;
            slice.style.backgroundSize = `${containerSize}px 100%`;
            slice.style.transformOrigin = 'left center';
        } else {
            // Horizontal slices for vertical peel
            slice.style.height = `${sliceSize + 1}px`;
            slice.style.width = `100%`;
            slice.style.top = `0px`;
            slice.style.left = `0px`;
            slice.style.backgroundPosition = `0px -${i * sliceSize}px`;
            slice.style.backgroundSize = `100% ${containerSize}px`;
            slice.style.transformOrigin = 'top center';
        }

        slice.style.zIndex = numSlices + 100 - i;
        container.appendChild(slice);
        slices.push(slice);
    }

    const animState = { progress: 0 };

    // Initialize setters for each slice
    const setters = slices.map(slice => ({
        x: gsap.quickSetter(slice, "x", "px"),
        y: gsap.quickSetter(slice, "y", "px"),
        z: gsap.quickSetter(slice, "z", "px"),
        rotateX: gsap.quickSetter(slice, "rotateX", "deg"),
        rotateY: gsap.quickSetter(slice, "rotateY", "deg")
    }));

    function updateSlices() {
        const progress = animState.progress;

        // Animate shadow
        if (shadow) {
            const shadowOpacity = progress * 0.3;
            const shadowBlur = 30 * (1 - progress);
            const shadowScale = 1.2 - (progress * 0.2);
            gsap.set(shadow, {
                opacity: shadowOpacity,
                filter: `blur(${shadowBlur}px) brightness(0)`,
                scale: shadowScale
            });
        }

        const maxCurl = 30;
        const startAngle = maxCurl * (1 - progress);
        const totalBend = 220 * (1 - progress);
        const anglePerSlice = totalBend / numSlices;

        let currentPos = 0;
        let currentZ = 0;
        let cumulativeAngle = startAngle;

        for (let i = 0; i < numSlices; i++) {
            const s = setters[i];
            const slice = slices[i];

            if (isHorizontal) {
                // Horizontal peel: rotate on Y axis, move on X
                s.x(currentPos);
                s.y(0);
                s.z(currentZ);
                s.rotateY(-cumulativeAngle); // Negative for left-to-right curl
                s.rotateX(0);
            } else {
                // Vertical peel: rotate on X axis, move on Y
                s.x(0);
                s.y(currentPos);
                s.z(currentZ);
                s.rotateX(cumulativeAngle);
                s.rotateY(0);
            }

            // Calculate shading based on angle - slices facing away get darker
            // Normalize angle to 0-1 range where 0 = flat, 1 = fully tilted
            const normalizedAngle = Math.min(Math.abs(cumulativeAngle) / 90, 1);
            // Brightness: 1 = normal, lower = darker. More angled = darker
            const brightness = 1 - (normalizedAngle * 0.4);
            slice.style.filter = `brightness(${brightness})`;

            const rad = (cumulativeAngle * Math.PI) / 180;
            currentPos += sliceSize * Math.cos(rad);
            currentZ += sliceSize * Math.sin(rad);
            cumulativeAngle += anglePerSlice;
        }
    }

    // GSAP ScrollTrigger
    gsap.to(animState, {
        progress: 1,
        ease: "power1.out",
        scrollTrigger: {
            trigger: `#${wrapperId}`,
            start: "top 80%", // Delayed start (was top bottom)
            end: "top 20%",   // Slightly shifted end
            scrub: 1
        },
        onUpdate: updateSlices
    });

    // Initial render
    updateSlices();
}

// ==========================================
// COLOR TRANSITION ON SCROLL
// ==========================================
function initColorTransition() {
    // Try to find the homepage trigger, or the page header for other pages
    const trigger = document.getElementById('ultimi-eventi') || document.querySelector('.page-header-section');
    const body = document.body;

    // If no trigger at all and no reflection elements, we can skip
    const textElements = document.querySelectorAll('.condenso-text.shine-reflection, .info-paragraph.shine-reflection');
    if (!trigger && textElements.length === 0) return;

    // Get colors from CSS variables for consistency
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue('--primary-color').trim(); // Red
    const secondaryColor = rootStyle.getPropertyValue('--secondary-color').trim(); // Yellow

    // Helper to parse hex to rgb
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    const yellowRGB = hexToRgb(secondaryColor) || { r: 245, g: 229, b: 144 };
    const redRGB = hexToRgb(primaryColor) || { r: 251, g: 96, b: 104 };

    // State object for GSAP animation
    const colorState = { progress: 0 };

    // Function to interpolate between two RGB values
    function lerpColor(from, to, t) {
        return {
            r: Math.round(from.r + (to.r - from.r) * t),
            g: Math.round(from.g + (to.g - from.g) * t),
            b: Math.round(from.b + (to.b - from.b) * t)
        };
    }

    // Update function called on each scroll frame
    function updateColors() {
        const progress = colorState.progress;

        // Background: red (#FB6068) -> yellow (#F5E590)
        const bgColor = lerpColor(redRGB, yellowRGB, progress);
        body.style.backgroundColor = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;

        // Text gradient: yellow -> red (inverse of background)
        const textColor = lerpColor(yellowRGB, redRGB, progress);
        const gradientValue = `linear-gradient(to bottom,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 0) 5%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 1) 25%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 1) 85%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 0) 100%)`;

        textElements.forEach(el => {
            // Only update the gradient image, preserve other properties
            el.style.setProperty('background-image', gradientValue, 'important');

            // Only enforce fixed attachment on desktop/non-mobile
            if (!needsReflectionFix()) {
                el.style.setProperty('background-attachment', 'fixed', 'important');
                el.style.setProperty('background-position', 'center', 'important');
                el.style.setProperty('background-size', '100vw 100vh', 'important');
                el.style.setProperty('background-repeat', 'no-repeat', 'important');
            }

            el.style.setProperty('-webkit-background-clip', 'text', 'important');
            el.style.setProperty('background-clip', 'text', 'important');
            el.style.setProperty('color', 'transparent', 'important');
            // Stroke color: yellow -> red
            el.style.setProperty('-webkit-text-stroke-color', `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`, 'important');
        });

        // Update arrow masks (fill) - they need the gradient but NOT background-clip: text
        const arrowMasks = document.querySelectorAll('.arrow-fill-mask.shine-reflection');
        arrowMasks.forEach(el => {
            el.style.setProperty('background-image', gradientValue, 'important');

            if (!needsReflectionFix()) {
                el.style.setProperty('background-attachment', 'fixed', 'important');
                el.style.setProperty('background-position', 'center', 'important');
                el.style.setProperty('background-size', '100vw 100vh', 'important');
                el.style.setProperty('background-repeat', 'no-repeat', 'important');
            }
            // Do NOT set background-clip: text here, as it hides the div if there's no text
        });

        // Update arrow icons stroke
        const arrowIcons = document.querySelectorAll('.arrow-icon, .arrow-icon *');
        arrowIcons.forEach(el => {
            el.style.setProperty('stroke', `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`, 'important');
        });
    }

    // ScrollTrigger with scrub for smooth scroll-linked animation
    // ONLY if the specific trigger exists (homepage behavior)
    if (trigger && trigger.id === 'ultimi-eventi') {
        gsap.to(colorState, {
            progress: 1,
            ease: "none",
            scrollTrigger: {
                trigger: trigger,
                start: "top 80%",      // Start transition earlier
                end: "top center",     // Complete when title reaches center
                scrub: 1,              // Reduced lag from 2s to 1s for better responsiveness
                fastScrollEnd: true,   // Force completion if scrolled past quickly
                onLeave: () => {
                    // Double safety: force final state
                    if (colorState.progress < 1) {
                        colorState.progress = 1;
                        updateColors();
                    }
                },
                onLeaveBack: () => {
                    // Double safety: force start state
                    if (colorState.progress > 0) {
                        colorState.progress = 0;
                        updateColors();
                    }
                }
            },
            onUpdate: updateColors
        });
    }

    // Initial state / Apply colors once for pages without transition
    updateColors();
}

// ==========================================
// EVENTS INFINITE SLIDER
// ==========================================
function initEventsSlider() {
    const wrapper = document.querySelector('.events-slider-wrapper');
    const slider = document.getElementById('events-slider');

    if (!wrapper || !slider) return;

    const cards = slider.querySelectorAll('.event-card');
    if (cards.length === 0) return;

    // Clone cards at the beginning and end for infinite effect
    const cardsArray = Array.from(cards);

    // Clone all cards and append to end
    cardsArray.forEach(card => {
        const clone = card.cloneNode(true);
        slider.appendChild(clone);
    });

    // Clone all cards and prepend to beginning
    cardsArray.reverse().forEach(card => {
        const clone = card.cloneNode(true);
        slider.insertBefore(clone, slider.firstChild);
    });

    // Calculate dimensions
    const cardWidth = cards[0].offsetWidth;
    const gap = 16; // 1rem
    const originalSetWidth = (cardWidth + gap) * cards.length;

    // Set initial scroll position to the middle (original cards)
    wrapper.scrollLeft = originalSetWidth;

    let isScrolling = false;

    wrapper.addEventListener('scroll', () => {
        if (isScrolling) return;

        const scrollLeft = wrapper.scrollLeft;
        const maxScroll = slider.scrollWidth - wrapper.clientWidth;

        // If scrolled to the cloned section at the end, jump back
        if (scrollLeft >= originalSetWidth * 2 - cardWidth) {
            isScrolling = true;
            wrapper.scrollLeft = originalSetWidth + (scrollLeft - originalSetWidth * 2 + cardWidth);
            requestAnimationFrame(() => { isScrolling = false; });
        }

        // If scrolled to the cloned section at the beginning, jump forward
        if (scrollLeft <= cardWidth) {
            isScrolling = true;
            wrapper.scrollLeft = originalSetWidth + scrollLeft;
            requestAnimationFrame(() => { isScrolling = false; });
        }
    });
}

// ==========================================
// FOOTER ANIMATION
// ==========================================
function initFooterAnimation() {
    const footer = document.querySelector('.site-footer');
    const path = document.querySelector('#bouncy-path');

    if (!footer || !path) return;

    // Entry animation (fadeIn)
    // Entry animation (fadeIn) - REMOVED as per user request
    // Footer is now visible immediately

    // Initial control point Y
    const defaultY = 156;
    const proxy = { y: defaultY };

    // Function to update the path 'd' attribute
    const updatePath = () => {
        path.setAttribute('d', `M0-0.3C0-0.3,464,${proxy.y},1139,${proxy.y}S2278-0.3,2278-0.3V683H0V-0.3z`);
    };

    let resetTimer;

    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = self.getVelocity();
            // Distortion map: velocity -> Y offset
            const distortion = Math.min(Math.max(velocity / 30, -100), 100);

            gsap.to(proxy, {
                y: defaultY + distortion,
                duration: 0.1,
                ease: "none",
                overwrite: "auto",
                onUpdate: updatePath
            });

            // Elastic snap-back when scroll stops/slows
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                gsap.to(proxy, {
                    y: defaultY,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.3)",
                    overwrite: "auto",
                    onUpdate: updatePath
                });
            }, 50);
        }
    });
}

// ==========================================
// ARROW ANIMATION (VELOCITY)
// ==========================================
function initArrowAnimation() {
    const arrows = document.querySelectorAll('.arrow-icon');
    if (arrows.length === 0) return;

    // Use a proxy to tween the value smoothly
    const proxy = { y: 0 };
    let resetTimer;

    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = self.getVelocity();

            // "Gravity" effect:
            // Scroll Down (+ velocity) -> Arrows move Down (+ Y)
            // Scroll Up (- velocity) -> Arrows move Up (- Y)
            // User requested invert and reduce sensitivity (tuned to 80)
            const targetY = (velocity / 80);
            // Limit travel distance
            const clampedY = Math.max(Math.min(targetY, 100), -100);

            gsap.to(proxy, {
                y: clampedY,
                duration: 0.1,
                ease: "none",
                overwrite: "auto",
                onUpdate: () => {
                    arrows.forEach(arrow => {
                        arrow.style.transform = `translateY(${proxy.y}px)`;
                    });
                }
            });

            // Snap back when scrolling stops
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                gsap.to(proxy, {
                    y: 0,
                    duration: 1.0,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto",
                    onUpdate: () => {
                        arrows.forEach(arrow => {
                            arrow.style.transform = `translateY(${proxy.y}px)`;
                        });
                    }
                });
            }, 50);
        }
    });
}

// ==========================================
// LOGO BOUNCE ANIMATION
// ==========================================
function initLogoBounce() {
    const logo = document.getElementById('logo-svg');
    if (!logo) return;

    // Start way above screen and smaller (0.2 scale)
    gsap.set(logo, {
        y: -800,
        scale: 0.2,
        transformOrigin: "50% 100%"
    });



    const tl = gsap.timeline({
        delay: 0.2
    });

    // 1. Initial High Drop + Scale Up
    tl.to(logo, {
        y: 0,
        scale: 1, // Grow to full size
        scaleY: 1.2, // Maintain the wind stretch
        scaleX: 0.8,
        duration: 0.35,
        ease: "power2.in"
    })
        // 2. Heavy Squash 1
        .to(logo, {
            scaleY: 0.45,
            scaleX: 1.55,
            duration: 0.08,
            ease: "power3.out"
        })
        // 3. Bounce 1 (Up)
        .to(logo, {
            y: -300,
            scaleY: 1.25,
            scaleX: 0.75,
            duration: 0.3,
            ease: "power2.out"
        })
        // 4. Drop 2 (Down)
        .to(logo, {
            y: 0,
            scaleY: 1,
            scaleX: 1,
            duration: 0.3,
            ease: "power2.in"
        })
        // 5. Medium Squash 2
        .to(logo, {
            scaleY: 0.7,
            scaleX: 1.3,
            duration: 0.07,
            ease: "power2.out"
        })
        // 6. Bounce 2 (Up)
        .to(logo, {
            y: -100,
            scaleY: 1.1,
            scaleX: 0.9,
            duration: 0.2,
            ease: "power2.out"
        })
        // 7. Drop 3 (Down)
        .to(logo, {
            y: 0,
            scaleY: 1,
            scaleX: 1,
            duration: 0.2,
            ease: "power2.in"
        })
        // 8. Light Squash 3
        .to(logo, {
            scaleY: 0.9,
            scaleX: 1.1,
            duration: 0.06,
            ease: "power1.out"
        })
        // 9. Final Settle
        .to(logo, {
            scaleY: 1,
            scaleX: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)"
        });


}

// ==========================================
// LOGO EXPLOSION (SCROLL TRIGGERED)
// ==========================================
function initLogoExplosion() {
    const pieces = document.querySelectorAll('.logo-piece');
    const hero = document.getElementById('hero');
    if (!pieces.length || !hero) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "100% top",
            scrub: 1,
        }
    });



    pieces.forEach((piece, i) => {
        // Calculate explosion vector from center
        const bbox = piece.getBBox();
        const centerX = 1000;
        const centerY = 558.5;
        const pX = bbox.x + bbox.width / 2;
        const pY = bbox.y + bbox.height / 2;

        const dirX = pX - centerX;
        const dirY = pY - centerY;

        // Large multiplier to ensure they go far outside the window
        const multiplier = 20 + Math.random() * 15;

        tl.to(piece, {
            x: dirX * multiplier,
            y: dirY * multiplier,
            rotation: Math.random() * 1080 - 540,
            duration: 1,
            ease: "power2.in"
        }, 0);
    });
}

// ==========================================
// TEXT APPEARANCE ANIMATIONS
// ==========================================
function initTextAppear() {
    const charsReveal = document.querySelectorAll('.reveal-chars');
    const linesReveal = document.querySelectorAll('.reveal-lines');

    // Split text into characters
    charsReveal.forEach(el => {
        // Only split if not already split
        if (el.querySelector('.reveal-char')) return;

        const text = el.textContent.trim();
        el.textContent = '';
        el.classList.add('reveal-text');

        // Capture original styles to ensure they apply to spans if needed
        // but mostly rely on 'inherit' in CSS

        [...text].forEach(char => {
            const span = document.createElement('span');
            span.classList.add('reveal-char');
            // Use nbsp for spaces to maintain width
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });

        const chars = el.querySelectorAll('.reveal-char');
        gsap.from(chars, {
            y: 50,
            opacity: 0,
            duration: 0.6, // Faster (from 0.8)
            stagger: 0.02, // Faster (from 0.03)
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: el,
                start: "top 80%", // Delayed start (was 95%)
                toggleActions: "play none none reverse"
            }
        });
    });

    // Split text into words/lines
    linesReveal.forEach(el => {
        if (el.querySelector('.reveal-line')) return;

        const text = el.textContent.trim();
        const words = text.split(/(\s+)/); // Preserve spaces
        el.textContent = '';
        el.classList.add('reveal-text');

        words.forEach(word => {
            if (word.trim().length === 0) {
                el.appendChild(document.createTextNode(word));
                return;
            }
            const span = document.createElement('span');
            span.classList.add('reveal-line');
            span.textContent = word;
            el.appendChild(span);
        });

        const wordSpans = el.querySelectorAll('.reveal-line');
        gsap.from(wordSpans, {
            y: 30,
            opacity: 0,
            duration: 0.6, // Faster (from 1)
            stagger: 0.03, // Much faster (from 0.08)
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 80%", // Delayed start (was 95%)
                toggleActions: "play none none reverse"
            }
        });
    });
}
