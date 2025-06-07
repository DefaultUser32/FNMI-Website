document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Artist showcase elements
    const artistImage = document.querySelector('.artist-image');
    const artistName = document.querySelector('.artist-name');
    const artistOrigin = document.querySelector('.artist-origin');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');

    let currentArtistIndex = 0;
    let progressStartTime = null;
    let progressPaused = false;
    let progressDuration = 7000; // 7 seconds
    let isDragging = false;
    let startX;
    let startWidth;
    let isProgressBarVisible = true;
    let hoveredArtist = null;
    let activeArtist = null;

    // Render artist grid buttons (move this up so DOM elements are ready before any function uses them)
    const artistGrid = document.getElementById('artist-grid');
    const activeArtistImageContainer = document.getElementById('active-artist-image');
    const activeArtistImg = document.getElementById('active-artist-img');
    const activeArtistName = document.getElementById('active-artist-name');

    if (artistGrid) {
        artists.forEach((artist, index) => {
            const button = document.createElement('button');
            button.className = 'artist-button';
            button.textContent = artist.name;

            button.addEventListener('mouseenter', () => {
                hoveredArtist = artist;
                // Reset progress bar
                progressFill.style.transition = 'none';
                progressFill.style.width = '0%';
                progressStartTime = Date.now();
                progressPaused = true; // Pause the timer
                // Set artist showcase to hovered artist (fade in)
                fadeToArtist(artist);
                // Set background and right image with fade
                updateActiveArtist(artist);
            });
            button.addEventListener('mouseleave', () => {
                hoveredArtist = null;
                progressPaused = false; // Resume the timer
                startProgress(); // Restart the progress
            });
            button.addEventListener('click', () => {
                currentArtistIndex = index;
                updateArtistShowcase(artist);
                updateActiveArtist(artist);
            });
            artistGrid.appendChild(button);
        });
    }

    // Function to update artist showcase
    function updateArtistShowcase(artist) {
        const artistImage = document.querySelector('.artist-image');
        const artistName = document.querySelector('.artist-name');
        const artistOrigin = document.querySelector('.artist-origin');
        // const progressFill = document.querySelector('.progress-fill'); // No longer needed here

        if (!artistImage || !artistName || !artistOrigin) return;

        // Fade out current content
        artistImage.style.opacity = '0';
        artistName.style.opacity = '0';
        artistOrigin.style.opacity = '0';

        setTimeout(() => {
            artistImage.src = `Images/Artist_Headshots/${artist.image}`;
            artistName.textContent = artist.name;
            artistOrigin.textContent = artist.origin;
            setTimeout(() => {
                artistImage.style.opacity = '1';
                artistName.style.opacity = '1';
                artistOrigin.style.opacity = '1';
            }, 50);
        }, 500);

        // Always update the preview below to match the current artist
        updateActiveArtist(artist);
    }

    function updateProgressBar() {
        if (progressPaused) return;
        if (isDragging) {
            // Only update width if dragging
            return;
        }
        const now = Date.now();
        const elapsed = now - progressStartTime;
        let progress = Math.min(1, elapsed / progressDuration);
        if (progress >= 1) {
            currentArtistIndex = (currentArtistIndex + 1) % artists.length;
            updateArtistShowcase(artists[currentArtistIndex]);
            startProgress();
        } else {
            requestAnimationFrame(updateProgressBar);
        }
    }

    function startProgress() {
        progressStartTime = Date.now();
        progressPaused = false;
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        // Animate to 100%
        setTimeout(() => {
            progressFill.style.transition = `width ${progressDuration / 1000}s linear`;
            progressFill.style.width = '100%';
        }, 20);
        requestAnimationFrame(updateProgressBar);
    }

    progressBar.addEventListener('mousedown', (e) => {
        progressPaused = true;
        isDragging = true;
        startX = e.clientX;
        startWidth = progressFill.offsetWidth;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const progressBarWidth = progressBar.offsetWidth;
            const newWidth = Math.max(0, Math.min(progressBarWidth, startWidth + deltaX));
            const progress = (newWidth / progressBarWidth);
            progressFill.style.width = `${progress * 100}%`;
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            const progress = (progressFill.offsetWidth / progressBar.offsetWidth);
            progressStartTime = Date.now() - progress * progressDuration;
            progressPaused = false;
            requestAnimationFrame(updateProgressBar);
            if (progress >= 1) {
                currentArtistIndex = (currentArtistIndex + 1) % artists.length;
                updateArtistShowcase(artists[currentArtistIndex]);
                startProgress();
            }
        }
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progress = clickX / progressBar.offsetWidth;
        // Snap immediately to cursor position
        progressFill.style.transition = 'none';
        progressFill.style.width = `${progress * 100}%`;
        progressStartTime = Date.now() - progress * progressDuration;
        progressPaused = false;
        // Animate from clicked position to 100% over the remaining time
        const remaining = (1 - progress) * progressDuration;
        setTimeout(() => {
            progressFill.style.transition = `width ${remaining / 1000}s linear`;
            progressFill.style.width = '100%';
        }, 20);
        requestAnimationFrame(updateProgressBar);
        if (progress >= 1) {
            currentArtistIndex = (currentArtistIndex + 1) % artists.length;
            updateArtistShowcase(artists[currentArtistIndex]);
            startProgress();
        }
    });

    // Initialize artist showcase
    function initializeArtistShowcase() {
        // Shuffle artists array
        for (let i = artists.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [artists[i], artists[j]] = [artists[j], artists[i]];
        }

        // Show first artist
        updateArtistShowcase(artists[currentArtistIndex]);
        startProgress();
    }

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    let currentSection = 'power-of-art';

    // Feed toggle
    const feedToggle = document.getElementById('feed-toggle');
    const feedView = document.getElementById('feed-view');
    let isFeedOpen = false;

    // Initialize sections
    contentSections.forEach(section => {
        if (section.id === 'welcome') {
            section.classList.add('active');
        }
    });

    // Navigation click handlers
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.dataset.section;
            navigateToSection(targetSection);
        });
    });

    // Feed toggle handler
    feedToggle.addEventListener('click', () => {
        isFeedOpen = !isFeedOpen;
        feedView.classList.toggle('active');
        feedToggle.querySelector('i').classList.toggle('fa-arrow-right');
        feedToggle.querySelector('i').classList.toggle('fa-arrow-left');
    });

    // Navigation function
    function navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        // Update active states
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        // Update current section
        currentSection = sectionId;
    }

    // Initialize animations
    function initializeAnimations() {
        // Welcome section animation
        gsap.from('#welcome .content', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        // Section animations
        contentSections.forEach(section => {
            gsap.from(section.querySelectorAll('.content > *'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top center',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out'
            });
        });

        // Impact grid animations
        const impactItems = document.querySelectorAll('.impact-item');
        impactItems.forEach(item => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.6,
                y: 30,
                opacity: 0,
                ease: 'power2.out'
            });
        });
    }

    // Initialize feed items
    function initializeFeed() {
        const feedContent = document.querySelector('.feed-content');
        // Example feed items - replace with actual content
        const feedItems = [
            {
                image: 'path/to/image1.jpg',
                title: 'Traditional Beading',
                description: 'Exploring the intricate art of traditional Indigenous beading.'
            },
            {
                image: 'path/to/image2.jpg',
                title: 'Modern Interpretations',
                description: 'Contemporary artists reimagining traditional techniques.'
            }
            // Add more items as needed
        ];

        feedItems.forEach(item => {
            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item';
            feedItem.innerHTML = `
                <div class="feed-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="feed-text">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            feedContent.appendChild(feedItem);
        });
    }

    // Initialize everything
    initializeArtistShowcase();
    initializeAnimations();
    initializeFeed();

    // Handle scroll events
    window.addEventListener('scroll', () => {
        if (!isFeedOpen) {
            contentSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSection = section.id;
                    contentSections.forEach(s => s.classList.remove('active'));
                    section.classList.add('active');
                }
            });
        }
    });

    // Load artists array from artists.js
    // (assume artists.js is loaded before this script)

    // Set initial artist and background image
    if (artists.length > 0) {
        updateArtistShowcase(artists[0]);
        // Pick a random background on page load
        const randomIndex = Math.floor(Math.random() * artists.length);
        const randomArtist = artists[randomIndex];
        const backgroundImage = document.querySelector('.background-image');
        if (backgroundImage) {
            backgroundImage.src = `Images/Artist_Backgrounds/${randomArtist.background}`;
            backgroundImage.style.opacity = '1';
        }
    } else {
        // Set a default background image if no artists
        const backgroundImage = document.querySelector('.background-image');
        if (backgroundImage) {
            backgroundImage.src = 'Images/Artist_Backgrounds/Nunavut.png';
            backgroundImage.style.opacity = '1';
        }
    }

    // Intersection Observer for progress bar visibility
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isProgressBarVisible = entry.isIntersecting;
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                if (isProgressBarVisible) {
                    progressFill.style.transition = 'width 5s linear';
                    progressFill.style.width = '100%';
                } else {
                    progressFill.style.transition = 'none';
                    progressFill.style.width = '0%';
                }
            }
        });
    }, { threshold: 0.5 });

    // Fade in artist showcase (headshot, name, origin)
    function fadeToArtist(artist) {
        if (!artist) return;
        const artistImage = document.querySelector('.artist-image');
        const artistName = document.querySelector('.artist-name');
        const artistOrigin = document.querySelector('.artist-origin');
        if (!artistImage || !artistName || !artistOrigin) return;
        gsap.to([artistImage, artistName, artistOrigin], { opacity: 0, duration: 0.3, onComplete: () => {
            artistImage.src = `Images/Artist_Headshots/${artist.image}`;
            artistName.textContent = artist.name;
            artistOrigin.textContent = artist.origin;
            gsap.to([artistImage, artistName, artistOrigin], { opacity: 1, duration: 0.5 });
        }});
    }

    function updateActiveArtist(artist) {
        if (!artist) {
            console.warn('No artist provided to updateActiveArtist');
            return;
        }
        // Only update the tight headshot and name next to the buttons
        if (activeArtistImageContainer && activeArtistImg && activeArtistName) {
            activeArtistImg.src = `Images/Artist_Hedshots_Tight/${artist.image}`;
            activeArtistName.textContent = artist.name;
            activeArtistImageContainer.style.display = 'block';
        }
    }
}); 