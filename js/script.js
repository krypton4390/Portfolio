// script.js
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

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

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // Navbar Scrolled Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for anchor links
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

    // Active Link Highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - navbar.offsetHeight - 100)) {
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

    // Intersection Observer for Scroll Animations (Fade in)
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    const faders = document.querySelectorAll('.fade-in');
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Project Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow to restart animation
                    card.style.animation = 'fadeInCard 0.5s ease forwards';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.classList.remove('hide');
                        card.style.animation = 'none';
                        card.offsetHeight; // trigger reflow to restart animation
                        card.style.animation = 'fadeInCard 0.5s ease forwards';
                    } else {
                        card.classList.add('hide');
                    }
                }
            });
        });
    });

    // Contact Form Submission to Email (bkalyan439@gmail.com) via FormSubmit AJAX API
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            // Premium Feedback: Loading State
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-circle-notch fa-spin"></i>';
            
            // Detect if running locally via file:// protocol
            // (AJAX is blocked by browsers under file:// due to CORS origin restrictions)
            if (window.location.protocol === 'file:') {
                console.log('Running locally via file:// - falling back to traditional HTML POST submission.');
                // Allow standard form POST submission to proceed
                return;
            }
            
            // If running on a web server (localhost, GitHub Pages, Vercel etc.), use seamless AJAX
            e.preventDefault(); // Prevent page reload
            
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
                
                // Show Success Message
                formSuccess.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
                formSuccess.classList.remove('hidden');
                
                // Clear inputs
                contactForm.reset();
                
                // Hide message after 6 seconds
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 6000);
            })
            .catch(error => {
                console.error('FormSubmit AJAX Error, falling back to standard submission:', error);
                // Fallback: Submit the form traditionally
                contactForm.submit();
            });
        });
    }

    // Hashnode Blog Fetch
    async function fetchHashnodePosts() {
        const GQL_ENDPOINT = 'https://gql.hashnode.com/';
        const hashnodeContainer = document.getElementById('hashnode-posts');
        
        if (!hashnodeContainer) return;

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
                hashnodeContainer.innerHTML = ''; // Clear loading spinner
                
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
                                <img src="${post.coverImage?.url || 'images/blog-placeholder.jpg'}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/400x200?text=Blog+Post'">
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
});