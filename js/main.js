document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // DOM Elements
    const artistImage = document.querySelector('.artist-image');
    const artistName = document.querySelector('.artist-name');
    const artistOrigin = document.querySelector('.artist-origin');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const artistGrid = document.getElementById('artist-grid');
    const activeArtistImageContainer = document.getElementById('active-artist-image');
    const activeArtistImg = document.getElementById('active-artist-img');
    const activeArtistName = document.getElementById('active-artist-name');
    const artistSelect = document.getElementById('artist-select');
    const backToMainBtn = document.getElementById('back-to-main');
    const feedView = document.getElementById('feed-view');

    // State
    let currentArtistIndex = 0;
    let progressStartTime = null;
    let progressPaused = false;
    let progressDuration = 7000; // 7 seconds
    let isDragging = false;
    let startX;
    let startWidth;
    let isProgressBarVisible = true;
    let hoveredArtist = null;
    let selectedArtistId = artists[0].id;

    // --- Utility Functions ---
    function setActiveBarButton(id) {
        document.querySelectorAll('.bar-button').forEach(btn => btn.classList.remove('active'));
        if (id) document.getElementById(id).classList.add('active');
        if (id === 'bar-home') {
            const idx = artists.findIndex(a => a.id === selectedArtistId);
            if (idx !== -1) {
                currentArtistIndex = idx;
                updateArtistShowcase(artists[idx]);
                startProgress();
            }
        }
    }

    function setRandomBackground() {
        if (artists.length > 0) {
            const randomIndex = Math.floor(Math.random() * artists.length);
            const randomArtist = artists[randomIndex];
            const backgroundImage = document.querySelector('.background-image');
            if (backgroundImage) {
                const newSrc = `Images/Artist_Backgrounds/${randomArtist.background}`;
                if (backgroundImage.src.endsWith(randomArtist.background)) {
                    backgroundImage.style.opacity = '1';
                } else {
                    backgroundImage.style.opacity = '0';
                    backgroundImage.src = newSrc;
                    backgroundImage.onload = () => {
                        gsap.to(backgroundImage, { opacity: 1, duration: 0.35 });
                    };
                }
            }
        }
    }

    function showSection(sectionId) {
        setRandomBackground();
        document.getElementById('welcome').style.display = sectionId === 'welcome' ? '' : 'none';
        feedView.style.display = sectionId === 'feed' ? '' : 'none';
        document.getElementById('artist-detail-section').style.display = sectionId === 'artist' ? '' : 'none';
        window.scrollTo(0, 0); // Always scroll to top on section change
    }

    // --- Artist Showcase ---
    function updateArtistShowcase(artist, instant = false) {
        const progressContainer = document.querySelector('.progress-container');
        if (!artistImage || !artistName || !artistOrigin || !progressContainer) return;
        if (instant) {
            artistImage.style.opacity = '1';
            artistName.style.opacity = '1';
            artistOrigin.style.opacity = '1';
            progressContainer.style.opacity = '1';
            artistImage.src = `Images/Artist_Headshots/${artist.image}`;
            artistName.textContent = artist.name;
            artistOrigin.textContent = artist.origin;
        } else {
            artistImage.style.opacity = '0';
            artistName.style.opacity = '0';
            artistOrigin.style.opacity = '0';
            progressContainer.style.opacity = '0';
            gsap.to([artistImage, artistName, artistOrigin, progressContainer], { opacity: 0, duration: 0.15, onComplete: () => {
                artistImage.src = `Images/Artist_Headshots/${artist.image}`;
                artistName.textContent = artist.name;
                artistOrigin.textContent = artist.origin;
                artistImage.style.opacity = '0';
                artistName.style.opacity = '0';
                artistOrigin.style.opacity = '0';
                progressContainer.style.opacity = '0';
                gsap.to([artistImage, artistName, artistOrigin, progressContainer], { opacity: 1, duration: 0.25, ease: 'power2.out' });
            }});
        }
        updateActiveArtist(artist);
    }

    function updateActiveArtist(artist) {
        if (!artist) return;
        if (activeArtistImageContainer && activeArtistImg && activeArtistName) {
            activeArtistImg.src = `Images/Artist_Hedshots_Tight/${artist.image}`;
            activeArtistName.textContent = artist.name;
            activeArtistImageContainer.style.display = 'block';
        }
    }

    // --- Progress Bar ---
    function updateProgressBar() {
        if (progressPaused) return;
        if (isDragging) return;
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
        setTimeout(() => {
            progressFill.style.transition = `width ${progressDuration / 1000}s linear`;
            progressFill.style.width = '100%';
        }, 20);
        requestAnimationFrame(updateProgressBar);
    }

    // --- Progress Bar Events ---
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
        progressFill.style.transition = 'none';
        progressFill.style.width = `${progress * 100}%`;
        progressStartTime = Date.now() - progress * progressDuration;
        progressPaused = false;
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

    // --- Artist Grid ---
    if (artistGrid) {
        artistGrid.innerHTML = '';
        artists.forEach((artist, index) => {
            const button = document.createElement('button');
            button.className = 'artist-button';
            button.textContent = artist.name;
            button.addEventListener('mouseenter', () => {
                hoveredArtist = artist;
                progressFill.style.transition = 'none';
                progressFill.style.width = '0%';
                progressStartTime = Date.now();
                progressPaused = true;
                updateArtistShowcase(artist, true);
                updateActiveArtist(artist);
            });
            button.addEventListener('mouseleave', () => {
                hoveredArtist = null;
                progressPaused = false;
                startProgress();
            });
            button.addEventListener('click', () => {
                selectedArtistId = artist.id;
                showArtistDetail(artist.id);
                setActiveBarButton('bar-artist');
            });
            artistGrid.appendChild(button);
        });
    }

    // --- Main Artist Image Click ---
    artistImage.style.cursor = 'pointer';
    artistImage.addEventListener('click', () => {
        const artist = artists[currentArtistIndex];
        selectedArtistId = artist.id;
        showArtistDetail(artist.id);
        setActiveBarButton('bar-artist');
    });
    if (activeArtistImg) {
        activeArtistImg.style.cursor = 'pointer';
        activeArtistImg.addEventListener('click', () => {
            const imgFilename = activeArtistImg.src.split('/').pop();
            const artist = artists.find(a => a.image === imgFilename);
            if (artist) {
                selectedArtistId = artist.id;
                showArtistDetail(artist.id);
                setActiveBarButton('bar-artist');
            }
        });
    }

    // --- Artist Detail SPA ---
    function showArtistDetail(artistId) {
        const artist = artists.find(a => a.id === artistId) || artists[0];
        document.querySelector('.artist-detail-image').src = `Images/Artist_Headshots/${artist.image}`;
        document.querySelector('.artist-detail-image').alt = artist.name;
        document.querySelector('.artist-detail-name').textContent = artist.name;
        document.querySelector('.artist-detail-location').textContent = artist.origin;
        // Clear pronouns, age, and biography fields for now
        const pronouns = document.querySelector('.artist-detail-pronouns span');
        if (pronouns) pronouns.textContent = '';
        const age = document.querySelector('.artist-detail-age span');
        if (age) age.textContent = '';
        const bio = document.querySelector('.artist-detail-bio-text');
        if (bio) bio.textContent = '';
        if (artistSelect) artistSelect.value = artist.id;
        showSection('artist');
    }
    if (artistSelect) {
        artistSelect.innerHTML = '';
        artists.forEach((artist, idx) => {
            const option = document.createElement('option');
            option.value = artist.id;
            option.textContent = artist.name;
            artistSelect.appendChild(option);
        });
        artistSelect.addEventListener('change', (e) => {
            selectedArtistId = e.target.value;
            showArtistDetail(selectedArtistId);
        });
    }
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', () => {
            showSection('welcome');
            setActiveBarButton('bar-home');
            const idx = artists.findIndex(a => a.id === selectedArtistId);
            if (idx !== -1) {
                currentArtistIndex = idx;
                updateArtistShowcase(artists[idx]);
                startProgress();
            }
        });
    }

    // --- Debounce nav bar clicks ---
    function lockNavBar(duration = 500) {
        const navButtons = document.querySelectorAll('.bar-button, .nav-item');
        navButtons.forEach(btn => btn.disabled = true);
        setTimeout(() => {
            navButtons.forEach(btn => btn.disabled = false);
        }, duration);
    }

    // --- Bottom Bar Navigation ---
    document.getElementById('bar-home').addEventListener('click', () => {
        lockNavBar();
        showSection('welcome');
        setActiveBarButton('bar-home');
        const idx = artists.findIndex(a => a.id === selectedArtistId);
        if (idx !== -1) {
            currentArtistIndex = idx;
            updateArtistShowcase(artists[idx]);
            startProgress();
        }
    });
    document.getElementById('bar-feed').addEventListener('click', () => {
        lockNavBar();
        showSection('feed');
        setActiveBarButton('bar-feed');
    });
    document.getElementById('bar-artist').addEventListener('click', () => {
        lockNavBar();
        showArtistDetail(selectedArtistId);
        setActiveBarButton('bar-artist');
    });

    // --- Intersection Observer for Progress Bar ---
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

    // --- Feed Example (cleaned up, no placeholder content) ---
    function initializeFeed() {
        const feedContent = document.querySelector('.feed-content');
        // Feed is empty until real items are added
        feedContent.innerHTML = '';
    }
    initializeFeed();

    // --- Animations ---
    function initializeAnimations() {
        gsap.from('#welcome .content', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        const contentSections = document.querySelectorAll('.content-section');
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
    initializeArtistShowcase();
    initializeAnimations();
    initializeFeed();

    // --- Scroll Section Highlight (no isFeedOpen logic) ---
    window.addEventListener('scroll', () => {
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });

    // --- Initialize Artist Showcase ---
    function initializeArtistShowcase() {
        for (let i = artists.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [artists[i], artists[j]] = [artists[j], artists[i]];
        }
        updateArtistShowcase(artists[currentArtistIndex]);
        startProgress();
    }

    setActiveBarButton('bar-home'); // Highlight Home icon on load
}); 