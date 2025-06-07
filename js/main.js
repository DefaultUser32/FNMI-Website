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

    // Function to update artist showcase
    function updateArtistShowcase(index) {
        const artist = artists[index];
        
        // Fade out current content
        artistImage.style.opacity = '0';
        artistName.style.opacity = '0';
        artistOrigin.style.opacity = '0';

        // Update content after fade out
        setTimeout(() => {
            artistImage.src = artist.image;
            artistImage.alt = artist.name;
            artistName.textContent = artist.name;
            artistOrigin.textContent = artist.origin;
            // Fade in new content
            artistImage.style.opacity = '1';
            artistName.style.opacity = '1';
            artistOrigin.style.opacity = '1';
        }, 500);
    }

    function updateProgressBar() {
        if (progressPaused) return;
        const now = Date.now();
        const elapsed = now - progressStartTime;
        let progress = Math.min(1, elapsed / progressDuration);
        progressFill.style.width = `${progress * 100}%`;
        if (progress >= 1) {
            currentArtistIndex = (currentArtistIndex + 1) % artists.length;
            updateArtistShowcase(currentArtistIndex);
            startProgress();
        } else {
            requestAnimationFrame(updateProgressBar);
        }
    }

    function startProgress() {
        progressStartTime = Date.now();
        progressPaused = false;
        progressFill.style.width = '0%';
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
                updateArtistShowcase(currentArtistIndex);
                startProgress();
            }
        }
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progress = clickX / progressBar.offsetWidth;
        progressFill.style.width = `${progress * 100}%`;
        progressStartTime = Date.now() - progress * progressDuration;
        progressPaused = false;
        requestAnimationFrame(updateProgressBar);
        if (progress >= 1) {
            currentArtistIndex = (currentArtistIndex + 1) % artists.length;
            updateArtistShowcase(currentArtistIndex);
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
        updateArtistShowcase(currentArtistIndex);
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

    // Render artist grid buttons
    const artistGrid = document.getElementById('artist-grid');
    if (artistGrid && typeof artists !== 'undefined') {
        artists.forEach(artist => {
            const btn = document.createElement('button');
            btn.className = 'artist-grid-btn';
            btn.textContent = artist.name;
            btn.onclick = () => {
                window.location.href = `artist.html?id=${artist.id}`;
            };
            artistGrid.appendChild(btn);
        });
    }

    // Make artist portrait clickable
    const artistImageContainer = document.querySelector('.artist-image-container');
    if (artistImageContainer && typeof artists !== 'undefined') {
        artistImageContainer.onclick = () => {
            const artist = artists[currentArtistIndex];
            window.location.href = `artist.html?id=${artist.id}`;
        };
    }
}); 