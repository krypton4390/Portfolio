// script.js - Premium Portfolio JavaScript
// GSAP & ScrollTrigger powered animations

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════════════
    // PRELOADER
    // ═══════════════════════════════════════════════════════════════
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 600);
        });
        // Fallback: hide after 3s max
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 3000);
    }

    // ═══════════════════════════════════════════════════════════════
    // THEME TOGGLE
    // ═══════════════════════════════════════════════════════════════
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            let theme = 'dark';
            if (document.body.classList.contains('light-theme')) {
                theme = 'light';
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            localStorage.setItem('theme', theme);
            // Dispatch dynamic theme event for 3D canvas synchronization
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // HERO TYPING ANIMATION
    // ═══════════════════════════════════════════════════════════════
    const heroElements = [
        { el: document.querySelector('.greeting'), speed: 50 },
        { el: document.querySelector('.name'), speed: 50 },
        { el: document.querySelector('.role'), speed: 40 },
        { el: document.querySelector('.hero-desc'), speed: 15 }
    ];

    if (heroElements[0].el) {
        // Prevent scroll-reveal from hiding the text while typing
        const heroTextCont = document.querySelector('.hero-text-box');
        if(heroTextCont) {
            heroTextCont.classList.remove('fade-in');
            heroTextCont.style.opacity = '1';
            heroTextCont.style.transform = 'translateY(0)';
        }

        // Store original texts and clear elements
        const texts = heroElements.map(item => {
            const text = item.el.textContent;
            item.el.textContent = '\u200B'; // Zero-width space to preserve block height
            return text;
        });

        const typeLine = (index) => {
            if (index >= heroElements.length) {
                // After typing is done, animate the CTA buttons
                animateHeroCTA();
                return;
            }
            
            const item = heroElements[index];
            const text = texts[index];
            item.el.textContent = ''; // clear space
            item.el.classList.add('typing-cursor');
            
            let i = 0;
            const typeChar = () => {
                if (i < text.length) {
                    item.el.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeChar, item.speed);
                } else {
                    item.el.classList.remove('typing-cursor');
                    setTimeout(() => typeLine(index + 1), 150);
                }
            };
            typeChar();
        };

        // Start typing after preloader completes
        setTimeout(() => typeLine(0), 900);
    }

    function animateHeroCTA() {
        const cta = document.querySelector('.hero-cta');
        if (cta && typeof gsap !== 'undefined') {
            gsap.fromTo(cta.children, 
                { opacity: 0, y: 20, scale: 0.95 },
                { 
                    opacity: 1, y: 0, scale: 1, 
                    duration: 0.6, 
                    stagger: 0.15, 
                    ease: 'back.out(1.7)' 
                }
            );
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // MOBILE MENU TOGGLE
    // ═══════════════════════════════════════════════════════════════
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // NAVBAR SCROLL EFFECT
    // ═══════════════════════════════════════════════════════════════
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ═══════════════════════════════════════════════════════════════
    // SMOOTH SCROLLING
    // ═══════════════════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                const navHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // ACTIVE LINK HIGHLIGHTING
    // ═══════════════════════════════════════════════════════════════
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - navbar.offsetHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // SCROLL-TRIGGERED REVEAL ANIMATIONS (GSAP + Fallback)
    // ═══════════════════════════════════════════════════════════════
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animate all fade-in elements
        const fadeEls = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
        fadeEls.forEach(el => {
            // Skip hero text box elements (handled by typing animation)
            if (el.closest('.hero-text-box')) return;

            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    el.classList.add('appear');
                }
            });
        });

        // Parallax effects for section titles
        document.querySelectorAll('.section-title').forEach(title => {
            gsap.fromTo(title, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });

    } else {
        // Fallback: IntersectionObserver
        const appearOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            });
        }, appearOptions);

        const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
        animatedElements.forEach(el => {
            appearOnScroll.observe(el);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // STATS COUNTER ANIMATION
    // ═══════════════════════════════════════════════════════════════
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // ms
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                el.textContent = target + '+';
                return;
            }
            el.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    }

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => statsObserver.observe(num));
    }

    // ═══════════════════════════════════════════════════════════════
    // SCROLL-TO-TOP BUTTON
    // ═══════════════════════════════════════════════════════════════
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // PROJECT CATEGORY FILTERING
    // ═══════════════════════════════════════════════════════════════
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = `fadeInCard 0.5s ease ${index * 0.08}s forwards`;
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.classList.remove('hide');
                        card.style.animation = 'none';
                        card.offsetHeight;
                        card.style.animation = `fadeInCard 0.5s ease ${index * 0.08}s forwards`;
                    } else {
                        card.classList.add('hide');
                    }
                }
            });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // MAGNETIC HOVER EFFECT ON BUTTONS (Desktop only)
    // ═══════════════════════════════════════════════════════════════
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // CONTACT FORM SUBMISSION (FormSubmit AJAX API)
    // ═══════════════════════════════════════════════════════════════
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-circle-notch fa-spin"></i>';
            
            // Local file:// fallback
            if (window.location.protocol === 'file:') {
                console.log('Running locally via file:// - falling back to traditional HTML POST submission.');
                return;
            }
            
            e.preventDefault();
            
            fetch("https://formsubmit.co/ajax/bkalyan439@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `New Portfolio Message from ${name}`
                })
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                
                formSuccess.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
                formSuccess.classList.remove('hidden');
                
                contactForm.reset();
                
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 6000);
            })
            .catch(error => {
                console.error('FormSubmit AJAX Error, falling back to standard submission:', error);
                contactForm.submit();
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // HASHNODE BLOG FETCH
    // ═══════════════════════════════════════════════════════════════
    async function fetchHashnodePosts() {
        const GQL_ENDPOINT = 'https://gql.hashnode.com';
        const hashnodeContainer = document.getElementById('hashnode-posts');
        
        if (!hashnodeContainer) return;

        // Skip fetching if running via file:// protocol (CORS blocks null origin preflight)
        if (window.location.protocol === 'file:') {
            console.warn('Hashnode API fetch skipped: running locally via file:// (CORS origin is null).');
            hashnodeContainer.innerHTML = `
                <div class="loading-spinner" style="font-size: 0.95rem; color: var(--text-muted); padding: 40px 0;">
                    <i class="fas fa-info-circle"></i> Hashnode posts can only load when hosted on a web server (HTTP/HTTPS). 
                    <br>
                    <a href="https://kalyanbhandari.hashnode.dev/" target="_blank" style="color: var(--accent); text-decoration: underline; margin-top: 8px; display: inline-block;">
                        Read posts directly on Hashnode <i class="fas fa-external-link-alt" style="font-size: 0.8em; margin-left: 2px;"></i>
                    </a>
                </div>
            `;
            return;
        }

        const query = `
            query GetPosts($host: String!) {
                publication(host: $host) {
                    posts(first: 3) {
                        edges {
                            node {
                                title
                                brief
                                slug
                                coverImage {
                                    url
                                }
                                publishedAt
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            host: 'kalyanbhandari.hashnode.dev'
        };

        try {
            const response = await fetch(GQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();
            const posts = result.data.publication.posts.edges;

            if (posts && posts.length > 0) {
                hashnodeContainer.innerHTML = '';
                
                posts.forEach(edge => {
                    const post = edge.node;
                    const date = new Date(post.publishedAt);
                    const formattedDate = new Intl.DateTimeFormat('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    }).format(date);

                    const postCard = `
                        <div class="blog-card fade-in appear">
                            <div class="blog-img">
                                <img src="${post.coverImage?.url || 'images/blog-placeholder.jpg'}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/400x200?text=Blog+Post'" loading="lazy">
                            </div>
                            <div class="blog-info">
                                <span class="blog-date">${formattedDate}</span>
                                <h3 class="blog-title">
                                    <a href="https://kalyanbhandari.hashnode.dev/${post.slug}" target="_blank">${post.title}</a>
                                </h3>
                                <p class="blog-brief">${post.brief}</p>
                                <a href="https://kalyanbhandari.hashnode.dev/${post.slug}" target="_blank" class="blog-link">
                                    Read Article <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    `;
                    hashnodeContainer.insertAdjacentHTML('beforeend', postCard);
                });
            } else {
                hashnodeContainer.innerHTML = '<p class="loading-spinner">No posts found.</p>';
            }
        } catch (error) {
            console.error('Error fetching Hashnode posts:', error);
            hashnodeContainer.innerHTML = '<p class="loading-spinner">Failed to load posts. Please check back later.</p>';
        }
    }

    fetchHashnodePosts();

    // ═══════════════════════════════════════════════════════════════
    // VANILLA TILT INITIALIZATION (for skill/service cards)
    // ═══════════════════════════════════════════════════════════════
    if (typeof VanillaTilt !== 'undefined') {
        // Only init on devices with hover (not mobile)
        if (window.matchMedia('(hover: hover)').matches) {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 8,
                speed: 400,
                glare: true,
                "max-glare": 0.12,
                scale: 1.02
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // GSAP PREMIUM ANIMATIONS
    // ═══════════════════════════════════════════════════════════════
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        
        // Skills cards stagger entrance
        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        once: true
                    }
                }
            );
        });

        // Timeline items stagger
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.fromTo(item, 
                { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
                {
                    opacity: 1, x: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });

        // Service cards hover-ready entrance
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        once: true
                    }
                }
            );
        });

        // Stats container entrance
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            gsap.fromTo(statsContainer, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: statsContainer,
                        start: 'top 90%',
                        once: true
                    }
                }
            );
        }

        // Contact wrapper entrance
        const contactWrapper = document.querySelector('.contact-wrapper');
        if (contactWrapper) {
            gsap.fromTo(contactWrapper, 
                { opacity: 0, y: 40, scale: 0.98 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contactWrapper,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // SMOOTH CURSOR GLOW EFFECT (desktop only)
    // ═══════════════════════════════════════════════════════════════
    if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
        const cursorGlow = document.createElement('div');
        cursorGlow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(0, 229, 255, 0.06) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(cursorGlow);

        let glowX = 0, glowY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            glowX = e.clientX;
            glowY = e.clientY;
        });

        function updateGlow() {
            currentX += (glowX - currentX) * 0.08;
            currentY += (glowY - currentY) * 0.08;
            cursorGlow.style.left = currentX + 'px';
            cursorGlow.style.top = currentY + 'px';
            requestAnimationFrame(updateGlow);
        }
        updateGlow();
    }

    // ═══════════════════════════════════════════════════════════════
    // PREMIUM CV/RESUME MODAL TOGGLE & PRINT
    // ═══════════════════════════════════════════════════════════════
    const viewCvBtn = document.getElementById('view-cv-btn');
    const cvModal = document.getElementById('cv-modal');
    const cvModalCloseBtn = document.getElementById('cv-modal-close-btn');
    const cvModalCloseBg = document.getElementById('cv-modal-close-bg');
    const cvPrintBtn = document.getElementById('cv-print-btn');

    if (viewCvBtn && cvModal) {
        const openModal = () => {
            cvModal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop body scroll
        };

        const closeModal = () => {
            cvModal.classList.remove('open');
            document.body.style.overflow = ''; // Restore body scroll
        };

        viewCvBtn.addEventListener('click', openModal);
        
        if (cvModalCloseBtn) cvModalCloseBtn.addEventListener('click', closeModal);
        if (cvModalCloseBg) cvModalCloseBg.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    if (cvPrintBtn) {
        cvPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }
});