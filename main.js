document.addEventListener('DOMContentLoaded', () => {

    
    initIntro();

    function initIntro() {
        const intro = document.getElementById('intro');
        if (!intro) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            intro.remove();
            return;
        }

        const header = intro.querySelector('.logo-header');
        const letters = intro.querySelectorAll('.logo');

        document.body.style.overflow = 'hidden';

        const letterInDelay = 70;   
        const letterOutDelay = 40;  
        const holdTime = 550;       

        
        letters.forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), 200 + i * letterInDelay);
        });

        const lineInTime = 200 + letters.length * letterInDelay;
        setTimeout(() => header.classList.add('active'), lineInTime);

        
        const fadeStart = lineInTime + holdTime;
        setTimeout(() => {
            letters.forEach((el, i) => {
                setTimeout(() => el.classList.add('fade'), i * letterOutDelay);
            });
        }, fadeStart);

        
        const overlayHideTime = fadeStart + letters.length * letterOutDelay + 400;
        setTimeout(() => {
            intro.classList.add('hide');
            document.body.style.overflow = '';
        }, overlayHideTime);

        
        setTimeout(() => {
            intro.remove();
        }, overlayHideTime + 800);
    }

    const revealTargets = document.querySelectorAll(
        '.reveal, .performance, .final-cta'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');

                
                if (entry.target.classList.contains('performance')) {
                    animateCounters(entry.target);
                }

                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));

        function animateCounters(scope) {
        const counters = scope.querySelectorAll('.counter');

        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const isDecimal = !Number.isInteger(target);
            const duration = 1500; // ms
            const startTime = performance.now();

            function tick(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                counter.textContent = isDecimal
                    ? current.toFixed(1)
                    : Math.round(current);

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = isDecimal ? target.toFixed(1) : target;
                }
            }

            requestAnimationFrame(tick);
        });
    }

    
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            counter.textContent = Number.isInteger(target) ? target : target.toFixed(1);
        });
        document.querySelectorAll('.reveal, .performance, .final-cta')
            .forEach(el => el.classList.add('show'));
    }


     const swatches = document.querySelectorAll('.swatch');
    const shineRect = document.getElementById('shineRect');
 
    function triggerShine() {
        if (!shineRect || prefersReducedMotion) return;
        shineRect.classList.remove('run');
        void shineRect.getBBox(); // force reflow so the animation can restart
        shineRect.classList.add('run');
    }
 
    swatches.forEach(btn => {
        btn.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.documentElement.style.setProperty('--accent', btn.dataset.color);
            triggerShine();
        });
    });
    
});

  
    const swatches = document.querySelectorAll('.swatch');
    const layers = [document.getElementById('carLayerA'), document.getElementById('carLayerB')];
    let activeLayer = 0; // index into `layers` of the currently visible photo
 
    function setCarPhoto(src) {
        const current = layers[activeLayer];
        if (current.getAttribute('src') === src) return; // already showing this color
 
        const next = layers[1 - activeLayer];
        next.onload = () => {
            next.classList.add('show');
            current.classList.remove('show');
            activeLayer = 1 - activeLayer;
        };
        next.src = src;
    }
 
    swatches.forEach(btn => {
        btn.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            setCarPhoto(btn.dataset.image);
        });
    });