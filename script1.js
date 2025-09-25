document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-list a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Get all sections and video elements
    const sections = document.querySelectorAll('.section');
    const videos = {
        'home': document.getElementById('home-video'),
        'about': document.getElementById('about-video'),
        'skills': document.getElementById('skills-video'),
        'projects': document.getElementById('projects-video'),
        'contact': document.getElementById('contact-video')
    };

    // New, more robust function to control video visibility
    function showVideo(videoId) {
        // First, hide all videos
        Object.keys(videos).forEach(key => {
            videos[key].classList.remove('video-bg-visible', 'section-bg-video-visible');
        });

        // Then, show only the correct one
        const videoToShow = videos[videoId];
        if (videoToShow) {
            videoToShow.classList.add('video-bg-visible', 'section-bg-video-visible');
        }
    }

    // Set the initial video to be visible on load
    showVideo('home');

    // A single Intersection Observer for all sections and video backgrounds
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                showVideo(targetId);
            }
        });
    }, { threshold: 0.5 }); // Adjust threshold to control when video swaps

    sections.forEach(section => {
        videoObserver.observe(section);
    });

    // A single Intersection Observer for content animations
    const contentObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                switch (targetId) {
                    case 'about':
                        const aboutHeading = document.querySelector('#about h2');
                        if (aboutHeading) {
                            aboutHeading.innerHTML = aboutHeading.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
                            anime.timeline({ loop: false })
                                .add({
                                    targets: '#about .letter',
                                    scale: [0.3, 1],
                                    opacity: [0, 1],
                                    translateZ: 0,
                                    easing: "easeOutExpo",
                                    duration: 600,
                                    delay: (el, i) => 70 * (i + 1)
                                });
                        }
                        anime({
                            targets: '#about p',
                            opacity: [0, 1],
                            translateY: [20, 0],
                            delay: 1000,
                            easing: 'easeInOutQuad',
                            duration: 1000
                        });
                        break;
                    case 'skills':
                        animateTitles('#skills .animated-heading');
                        anime({
                            targets: '.skill-item',
                            opacity: [0, 1],
                            translateX: [-50, 0],
                            delay: anime.stagger(200),
                            easing: 'easeInOutQuad'
                        });
                        break;
                    case 'projects':
                        animateTitles('#projects .animated-heading');
                        anime({
                            targets: '.project-card',
                            opacity: [0, 1],
                            translateY: [50, 0],
                            delay: anime.stagger(200),
                            easing: 'easeInOutQuad'
                        });
                        break;
                    case 'contact':
                        animateTitles('#contact .animated-heading');
                        anime({
                            targets: '#contact p, .contact-links',
                            opacity: [0, 1],
                            translateY: [20, 0],
                            delay: anime.stagger(100),
                            easing: 'easeInOutQuad'
                        });
                        break;
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Animate the title text in each section
    function animateTitles(target) {
        const titleElement = document.querySelector(target);
        if (titleElement) {
            titleElement.innerHTML = titleElement.textContent.replace(/\S/g, "<span class='char'>$&</span>");

            anime({
                targets: target + ' .char',
                translateY: [
                    { value: -45, easing: 'easeOutExpo', duration: 800 },
                    { value: 0, easing: 'easeOutBounce', duration: 1000 }
                ],
                rotate: [
                    { value: -360, duration: 800, easing: 'easeInOutSine' },
                    { value: 0, duration: 1000, easing: 'easeInOutSine' }
                ],
                delay: anime.stagger(50),
                loop: false
            });
        }
    }

    // Start observing all sections except the home section
    document.querySelectorAll('.section:not(#home)').forEach(section => {
        contentObserver.observe(section);
    });

    // Typing animation for the home section title
    const welcomeText = document.querySelector('.welcome-text');
    const textToType = "";
    let charIndex = 0;
    
    function typeText() {
        if (charIndex < textToType.length) {
            welcomeText.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        } else {
            // Once typing is done, reveal the subheading and button
            document.querySelector('.intro-subtext').classList.add('visible');
            document.querySelector('.cta-button').classList.add('visible');
        }
    }
    // Start typing animation on page load
    typeText();

    // Navbar light trail effect
    const lightTrail = document.getElementById('navbar-light-trail');
    const navBarEl = document.querySelector('.nav-bar');
    navBarEl.addEventListener('mousemove', (e) => {
        const navBarRect = navBarEl.getBoundingClientRect();
        const xPos = e.clientX - navBarRect.left;
        const yPos = e.clientY - navBarRect.top;

        anime({
            targets: lightTrail,
            left: xPos,
            top: yPos,
            easing: 'easeOutCubic',
            duration: 500,
        });
    });
    
    // Return the trail to its default position when the cursor leaves the navbar
    navBarEl.addEventListener('mouseleave', () => {
        anime({
            targets: lightTrail,
            left: '0px',
            top: '0px',
            easing: 'easeOutQuint',
            duration: 1000
        });
    });

    // Combined scroll logic for both navbar and video fade
    const navBar = document.querySelector('.nav-bar');
    const navScrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar fade-in
        if (scrollY > navScrollThreshold) {
            navBar.classList.add('nav-bar-scrolled');
        } else {
            navBar.classList.remove('nav-bar-scrolled');
        }
    });

    // Dark Mode Toggle
    const modeToggleBtn = document.getElementById('mode-toggle');
    const body = document.body;

    // Function to set the theme and update the icon
    function setTheme(theme) {
        const modeIcon = modeToggleBtn.querySelector('i');
        if (theme === 'light') {
            body.classList.add('light-mode');
            modeIcon.classList.remove('fa-moon');
            modeIcon.classList.add('fa-sun');
        } else {
            body.classList.remove('light-mode');
            modeIcon.classList.remove('fa-sun');
            modeIcon.classList.add('fa-moon');
        }
    }

    // Check for saved theme preference in local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // Add click event listener to the toggle button
    modeToggleBtn.addEventListener('click', () => {
        // Toggle the theme
        if (body.classList.contains('light-mode')) {
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            setTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });
    // Function to handle the button animations
function animateCtaButton() {
    const ctaButton = document.querySelector('.cta-button');
    const ctaIcon = ctaButton.querySelector('i');

    // Animation on button hover
    ctaButton.addEventListener('mouseenter', () => {
        anime({
            targets: ctaButton,
            scale: 1.05,
            duration: 500,
            easing: 'easeOutQuad'
        });
        anime({
            targets: ctaIcon,
            translateX: 5,
            rotate: 360,
            duration: 800,
            easing: 'easeOutQuad'
        });
    });

    // Animation when mouse leaves the button
    ctaButton.addEventListener('mouseleave', () => {
        anime({
            targets: ctaButton,
            scale: 1,
            duration: 500,
            easing: 'easeOutQuad'
        });
        anime({
            targets: ctaIcon,
            translateX: 0,
            rotate: 0,
            duration: 800,
            easing: 'easeOutQuad'
        });
    });

    // Animation on button click
    ctaButton.addEventListener('click', () => {
        anime({
            targets: ctaButton,
            scale: [1, 0.95],
            rotate: '10deg',
            duration: 100,
            easing: 'easeInOutSine',
            direction: 'alternate',
            complete: () => {
                anime({
                    targets: ctaButton,
                    scale: 1,
                    rotate: '0deg',
                    duration: 500,
                    easing: 'easeOutBack'
                });
            }
        });
    });
}
animateCtaButton();
});