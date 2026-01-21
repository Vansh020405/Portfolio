
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor-halo');
    const hero = document.querySelector('.hero');
    const magneticElements = document.querySelectorAll('.magnetic');

    // Mouse state
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Configuration
    // Configuration "Luxury Motion"
    const speed = 0.08; // Slower/smoother inertia

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update CSS variables for gradient morphing
        if (hero) {
            const xPct = (mouseX / window.innerWidth) * 100;
            const yPct = (mouseY / window.innerHeight) * 100;
            hero.style.setProperty('--mouse-x', `${xPct}%`);
            hero.style.setProperty('--mouse-y', `${yPct}%`);
        }
    });

    // Animation Loop
    const animate = () => {
        // Lerp (Linear Interpolation) for inertia
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;

        cursorX += distX * speed;
        cursorY += distY * speed;

        // Apply transform
        if (cursor) {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        }

        requestAnimationFrame(animate);
    };

    animate();

    // Magnetic Effect Logic
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate distance from center of the element
            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;

            const x = mouseX - elCenterX;
            const y = mouseY - elCenterY;

            // Move element towards mouse (intensity 0.3 - closer/softer)
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

            // Expand cursor on hover
            if (cursor) cursor.classList.add('hover-active');
        });

        el.addEventListener('mouseleave', () => {
            // Reset position with CSS transition
            el.style.transform = `translate(0px, 0px)`;

            // Reset cursor
            if (cursor) cursor.classList.remove('hover-active');
        });
    });

    // Before/After Comparison Slider Logic
    const compWrapper = document.querySelector('.comparison-wrapper');
    const afterLayer = document.getElementById('after-layer');
    const sliderHandle = document.getElementById('slider-handle');

    if (compWrapper && afterLayer && sliderHandle) {
        compWrapper.addEventListener('mousemove', (e) => {
            const rect = compWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            let percent = (x / rect.width) * 100;

            // Clamp percentage between 0 and 100
            percent = Math.max(0, Math.min(100, percent));

            afterLayer.style.width = `${percent}%`;
            sliderHandle.style.left = `${percent}%`;
        });
    }

    // Scroll Reveal Animation (Existing)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
});
