import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

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
    initParallaxHero();
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
        }, 300); // Reduced from 500
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
    const groups = document.querySelectorAll('.gradient-text-group');
    const viewportWidth = document.documentElement.clientWidth;
    const isDesktop = viewportWidth >= 769;
    const desktopTargetPercentage = 0.98;
    const mobileTargetPercentage = 0.9;
    const targetWidth = viewportWidth * (isDesktop ? desktopTargetPercentage : mobileTargetPercentage);

    if (groups.length > 0) {
        if (isDesktop) {
            // Desktop: We want consistency across pages for certain titles
            // We define a reference ratio based on the longest title ("ULTIMI EVENTI")
            // so that shorter titles on other pages match its height.
            const REFERENCE_WIDTH_AT_100PX = 800; // Significantly reduced to make titles much bigger
            const systemGlobalRatio = targetWidth / REFERENCE_WIDTH_AT_100PX;
            const systemGlobalFontSize = 100 * systemGlobalRatio;

            const otherGroupData = [];

            groups.forEach(group => {
                const elements = Array.from(group.querySelectorAll(".condenso-text"));
                if (elements.length === 0) return;

                // Check if this group contains "main-section-title"
                const isMainTitle = elements.some(el => el.classList.contains('main-section-title'));

                if (isMainTitle) {
                    // Apply the system-wide uniform font size
                    elements.forEach(el => {
                        el.style.whiteSpace = "nowrap";
                        el.style.width = "auto";
                        el.style.display = "flex";
                        el.style.justifyContent = "center";
                        el.style.alignItems = "center";
                        el.style.textAlign = "center";
                        el.style.fontSize = `${systemGlobalFontSize}px`;
                    });
                } else {
                    // Other groups (like Admin) still fit to their own width
                    elements.forEach(el => {
                        el.style.whiteSpace = "nowrap";
                        el.style.width = "auto";
                        el.style.display = "inline-block";
                        el.style.fontSize = "100px";
                    });

                    const computedGap = parseFloat(window.getComputedStyle(group).gap) || 0;
                    // If computedGap is 0 but we are on desktop, we use a fallback that matches CSS (0.75em = 75px relative to 100px font-size)
                    const totalGapWidth = (computedGap > 0 ? computedGap : 75) * (elements.length - 1);

                    let totalWidthAt100px = totalGapWidth;
                    elements.forEach(el => {
                        totalWidthAt100px += el.getBoundingClientRect().width;
                    });

                    if (totalWidthAt100px > 0) {
                        otherGroupData.push({
                            elements,
                            ratio: targetWidth / totalWidthAt100px
                        });
                    }
                }
            });

            // Apply specific min-ratio only for the non-main titles on the current page
            if (otherGroupData.length > 0) {
                const minRatio = Math.min(...otherGroupData.map(d => d.ratio));
                const finalFontSize = 100 * minRatio;

                otherGroupData.forEach(data => {
                    data.elements.forEach(el => {
                        el.style.fontSize = `${finalFontSize}px`;
                        el.style.width = "auto";
                        el.style.display = "flex";
                        el.style.justifyContent = "center";
                        el.style.alignItems = "center";
                        el.style.textAlign = "center";
                    });
                });
            }
        } else {
            // ... (rest of mobile logic)
            // Mobile: Size groups individually as they are stacked
            groups.forEach(group => {
                const elements = Array.from(group.querySelectorAll(".condenso-text"));
                elements.forEach((el) => {
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

                    el.style.width = "100%";
                    el.style.display = "flex";
                    el.style.justifyContent = "center";
                    el.style.textAlign = "center";
                });
            });
        }
    }

    // Process any independent condenso-text not in a group (if any)
    const independentElements = document.querySelectorAll(".condenso-text:not(.gradient-text-group .condenso-text)");
    independentElements.forEach((el) => {
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

        el.style.width = "100%";
        el.style.display = "flex";
        el.style.justifyContent = "center";
        el.style.textAlign = "center";
    });
}

// MOBILE REFLECTION FIX
function needsReflectionFix() {
    // We now use the calculated fix for all browsers to ensure robustness
    // across different rendering engines and when transforms are present.
    return true;
}

function initReflectionFix() {
    if (needsReflectionFix()) {
        document.documentElement.classList.add("is-mobile-fix");

        let reflectiveElements = [];

        function updateElementTops() {
            // Re-query elements each time to handle dynamic content
            reflectiveElements = document.querySelectorAll(".shine-reflection");
            
            reflectiveElements.forEach((el) => {
                if (el instanceof HTMLElement) {
                    const rect = el.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const elementTop = rect.top + scrollTop;
                    // Set top on parent
                    el.style.setProperty("--element-top", elementTop.toString());
                    
                    // Update children (spans) with their ACTUAL individual tops
                    const children = el.querySelectorAll('.reveal-char, .reveal-line');
                    children.forEach(child => {
                        if (child instanceof HTMLElement) {
                            const childRect = child.getBoundingClientRect();
                            const childTop = childRect.top + scrollTop;
                            child.style.setProperty("--element-top", childTop.toString());
                        }
                    });
                }
            });
        }

        function updateScrollY() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            document.documentElement.style.setProperty("--scroll-y", scrollY.toString());
        }

        // Delay initial calculation to ensure DOM/Layout is stable and fonts are loaded
        setTimeout(() => {
            updateElementTops();
            updateScrollY();
        }, 100);

        // Secondary check to catch late-loading fonts or layout shifts
        setTimeout(updateElementTops, 1000);

        // Update loop
        let isScrolling = false;
        window.addEventListener("scroll", () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    updateScrollY();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });

        // Recalculate positions on resize and orientation change
        window.addEventListener("resize", () => {
            // Use requestAnimationFrame to ensure we read after browser layout
            requestAnimationFrame(() => {
                updateElementTops();
                updateScrollY();
            });
        });
        
        // Expose it globally so it can be called after dynamic loads (like loadEvents)
        window.refreshReflection = updateElementTops;
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
    // Only trigger the color transition on the homepage where #ultimi-eventi or #prossimi-eventi exists
    const trigger = document.getElementById('ultimi-eventi') || document.getElementById('prossimi-eventi');
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
            transparent 0%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 0.05) 25%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 1) 40%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 1) 60%,
            rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, 0.05) 75%,
            transparent 100%)`;

        textElements.forEach(el => {
            // Only update the gradient image, preserve other properties
            el.style.setProperty('background-image', gradientValue, 'important');

            // Force the calculated fix behavior for all browsers
            // (The .is-mobile-fix class and its CSS handle this)
            el.style.setProperty('background-attachment', 'scroll', 'important');

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
            el.style.setProperty('background-attachment', 'scroll', 'important');
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
    if (trigger && (trigger.id === 'ultimi-eventi' || trigger.id === 'prossimi-eventi')) {
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
// ==========================================
// EVENTS CENTERED SLIDER (3 CARDS FOCUS)
// ==========================================
export function initEventsSlider() {
    const wrapper = document.querySelector('.events-slider-wrapper');
    const slider = document.getElementById('events-slider');

    if (!wrapper || !slider) return;

    // CLEANUP: Always remove old listeners and instances to prevent memory leaks and double-triggering
    if (wrapper.getAttribute('data-slider-initialized') === 'true') {
        const existingDrags = Draggable.get(wrapper);
        if (existingDrags) existingDrags.kill();
        
        // Remove old scroll listener if it exists
        if (wrapper._onScrollHandler) {
            wrapper.removeEventListener('scroll', wrapper._onScrollHandler);
        }
    }
    wrapper.setAttribute('data-slider-initialized', 'true');

    // Clean up ScrollTriggers related to this slider
    ScrollTrigger.getAll().forEach(t => {
        if (t.vars.scroller === wrapper || (t.trigger && (t.trigger === slider || t.trigger.classList.contains('event-card')))) {
            t.kill();
        }
    });

    // Fresh selection of cards (critical for dynamic content)
    const cards = Array.from(slider.querySelectorAll('.event-card'));
    if (cards.length === 0) return;

    // Pre-calculated data to avoid layout thrashing
    let cardData = [];
    let wrapperWidth = 0;
    const isDesktop = () => window.innerWidth >= 769;

    // Quick setters for performance
    const cardSetters = cards.map(card => ({
        scale: gsap.quickSetter(card, "scale"),
        opacity: gsap.quickSetter(card, "opacity"),
        zIndex: gsap.quickSetter(card, "zIndex"),
        x: gsap.quickSetter(card, "x", "px")
    }));

    function setupLayout() {
        wrapperWidth = wrapper.offsetWidth;
        const desktop = isDesktop();
        
        const cardWidth = cards[0].offsetWidth;
        const sidePadding = (wrapperWidth - cardWidth) / 2;
        
        slider.style.paddingLeft = `${sidePadding}px`;
        slider.style.paddingRight = `${sidePadding}px`;
        slider.style.gap = desktop ? "6vw" : "1.5rem";
        
        // Cache card centers relative to the slider container
        cardData = cards.map((card, i) => {
            // Force a thin layer and optimize
            gsap.set(card, { 
                willChange: "transform, opacity",
                rotationY: 0,
                boxShadow: "none",
                transformOrigin: "center center"
            });
            
            return {
                center: card.offsetLeft + (card.offsetWidth / 2)
            };
        });

        ScrollTrigger.refresh();
        
        setTimeout(() => {
            // Only scroll to start if we are not already in the middle of a drag
            if (!Draggable.get(wrapper)?.isDragging) {
                wrapper.scrollTo({ left: 0, behavior: 'instant' });
            }
        }, 100);
    }

    setupLayout();
    
    // Navigation State
    let currentIdx = 0;
    let ticking = false;

    const updateSlider = () => {
        const desktop = isDesktop();
        const scrollLeft = wrapper.scrollLeft;
        const wrapperCenter = scrollLeft + (wrapperWidth / 2);

        let closestIdx = currentIdx;
        let minDiff = Infinity;

        cardData.forEach((data, i) => {
            const distance = Math.abs(data.center - wrapperCenter);
            const signedDistance = data.center - wrapperCenter;
            const maxDistance = wrapperWidth / 1.1; // Range for effect
            const normalized = Math.min(1, distance / maxDistance);
            
            const setter = cardSetters[i];
            let scale, opacity, zIndex, xMove = 0;

            if (desktop) {
                // DESKTOP: Scale, opacity and horizontal overlap
                scale = 1.15 - (normalized * 0.3);
                opacity = 1 - (normalized * 0.5);
                zIndex = Math.round((1 - normalized) * 100);
                xMove = -signedDistance * 0.15 * normalized;
            } else {
                // MOBILE: Simplified clean scaling
                // Reduced range and intensity for mobile smoothness
                scale = 1.0 - (normalized * 0.14);
                opacity = 1.0 - (normalized * 0.45);
                zIndex = Math.round((1 - normalized) * 10);
            }
            
            setter.scale(scale);
            setter.opacity(opacity);
            setter.zIndex(zIndex);
            setter.x(xMove);

            if (distance < minDiff) {
                minDiff = distance;
                closestIdx = i;
            }
        });

        if (closestIdx !== currentIdx) {
            currentIdx = closestIdx;
        }
        
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateSlider);
            ticking = true;
        }
    };

    // Store the handler so we can remove it on next init
    wrapper._onScrollHandler = onScroll;
    wrapper.addEventListener('scroll', onScroll, { passive: true });

    // Desktop: Create Draggable instance
    if (window.innerWidth >= 769) {
        Draggable.create(wrapper, {
            type: "scrollLeft",
            edgeResistance: 0.5,
            dragClickables: true,
            allowEventDefault: true,
            onPress: () => gsap.killTweensOf(wrapper),
            onDrag: updateSlider,
            onClick: function(e) {
                const clickedCard = e.target.closest('.event-card');
                const isButton = e.target.closest('.btn-partecipa');
                
                if (clickedCard && !isButton) {
                    const index = cards.indexOf(clickedCard);
                    if (index !== -1) scrollToCard(index);
                }
            },
            onDragEnd: function() {
                const scrollLeft = wrapper.scrollLeft;
                const centerX = scrollLeft + (wrapper.offsetWidth / 2);
                
                let targetIdx = 0;
                let minDiff = Infinity;
                
                cardData.forEach((data, i) => {
                    const diff = Math.abs(centerX - data.center);
                    if (diff < minDiff) {
                        minDiff = diff;
                        targetIdx = i;
                    }
                });
                
                scrollToCard(targetIdx);
            }
        });
    }

    const scrollToCard = (index) => {
        if (index < 0 || index >= cards.length) return;
        
        gsap.killTweensOf(wrapper);
        currentIdx = index;
        const data = cardData[index];
        const scrollTarget = data.center - (wrapperWidth / 2);
        
        gsap.to(wrapper, {
            scrollLeft: scrollTarget,
            duration: 0.6,
            ease: "expo.out",
            overwrite: true,
            onUpdate: updateSlider
        });
    };

    // Update on resize
    if (wrapper._resizer) window.removeEventListener('resize', wrapper._resizer);
    wrapper._resizer = () => {
        setupLayout();
        updateSlider();
    };
    window.addEventListener('resize', wrapper._resizer);

    // Initial state
    updateSlider();
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
// PARALLAX HERO ANIMATION
// ==========================================
function initParallaxHero() {
    const mountains = document.getElementById('parallax-mountains');
    const trees = document.getElementById('parallax-trees');
    const sun = document.getElementById('parallax-sun');
    const logo = document.getElementById('hero-logo-yellow');
    const logoWrapper = document.getElementById('hero-logo-wrapper');

    if (!mountains || !trees || !sun || !logo) return;

    // Stato iniziale: tutto fuori schermo in basso
    const isMobile = window.innerWidth <= 768;
    gsap.set([mountains, trees], { y: '110vh' });
    gsap.set([sun, logo], { y: '150vh', opacity: 0 });
    gsap.set(".layer-1", { opacity: 0 });

    // Su mobile applichiamo la scala agli alberi tramite JS per non rompere l'animazione CSS
    if (isMobile) {
        gsap.set(trees, { scale: 0.8, transformOrigin: 'bottom center' });
    }

    const tl = gsap.timeline({
        delay: 0.1 // Reduced from 0.8
    });

    // 0. Il bagliore appare gradualmente
    tl.to(".layer-1", {
        opacity: isMobile ? 0.6 : 1,
        duration: 1.2, // Reduced from 2.5
        ease: "power2.inOut"
    }, 0);

    // 1. Le montagne salgono dal basso
    tl.to(mountains, {
        y: '0vh',
        duration: 1.5, // Reduced from 2.8
        ease: "expo.out"
    }, 0.2) // Reduced delay
        // 2. Gli alberi salgono con un leggero ritardo (effetto parallasse)
        .to(trees, {
            y: '0vh',
            duration: 1.2, // Reduced from 2.4
            ease: "power3.out"
        }, "-=1.1") // Adjusted offset
        // 3. Il sole e il logo sorgono da dietro e si fermano nella posizione finale
        .to([sun, logo], {
            y: '-20vh',
            opacity: 1,
            duration: 2.5, // Reduced from 4
            ease: "expo.out"
        }, "-=1.3") // Adjusted offset
        // 4. Il logo passa in primo piano
        .set(logoWrapper, {
            zIndex: 100
        }, "-=1.0")
        // 5. Avvio fluttuazione continua solo a fine timeline
        .add(() => {
            gsap.to([sun, logo], {
                y: "-=15",
                duration: 3,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        });
}

// ==========================================
// LOGO EXPLOSION & PARALLAX (SCROLL TRIGGERED)
// ==========================================
function initLogoExplosion() {
    const pieces = document.querySelectorAll('.logo-piece');
    const mountainsLayer = document.querySelector('.parallax-layer.layer-3');
    const sunLayer = document.querySelector('.parallax-layer.layer-2');
    const treesLayer = document.querySelector('.parallax-layer.layer-4');
    const logoWrapper = document.getElementById('hero-logo-wrapper');
    const container = document.getElementById('hero-parallax');

    if (!container) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero-parallax",
            start: "top top",
            end: "250% top",
            scrub: 2.5,
            invalidateOnRefresh: true
        }
    });

    // 1. Parallasse Alberi (Layer in primo piano)
    if (treesLayer) {
        tl.to(treesLayer, {
            y: '5vh',
            ease: "none"
        }, 0);
    }

    // 2. Parallasse Montagne
    if (mountainsLayer) {
        tl.to(mountainsLayer, {
            y: '25vh',
            ease: "none"
        }, 0);
    }

    // 3. Parallasse Sole e Logo Wrapper
    if (sunLayer) {
        tl.to(sunLayer, {
            y: '60vh',
            ease: "none"
        }, 0);
    }

    if (logoWrapper) {
        tl.to(logoWrapper, {
            y: '60vh',
            ease: "none"
        }, 0);
    }

    // 3. Esplosione Pezzi del Logo
    pieces.forEach((piece) => {
        const bbox = piece.getBBox();
        const centerX = 1000;
        const centerY = 558.5;
        const pX = bbox.x + bbox.width / 2;
        const pY = bbox.y + bbox.height / 2;

        const dirX = pX - centerX;
        const dirY = pY - centerY;

        const multiplier = 30 + Math.random() * 20;

        tl.to(piece, {
            x: dirX * multiplier,
            y: dirY * multiplier,
            rotation: Math.random() * 1080 - 540,
            ease: "sine.out"
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
