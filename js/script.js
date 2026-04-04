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

    // Contact Form Submission Mock
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            // Show Success Message
            formSuccess.classList.remove('hidden');
            
            // Clear inputs
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
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