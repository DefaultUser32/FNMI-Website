// --- Main JavaScript for FNMI Art Showcase ---

// --- State ---
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

// Feed State
let feedQueue = [];
let feedShowImpact = false;
let feedLoadedItems = [];
let feedCurrentIndex = 0;
let feedScrollOffset = 0;
let feedIsTransitioning = false;
let feedIsScrolling = false;
let feedScrollTimeout = null;
let feedLastScrollTime = 0;
let feedScrollVelocity = 0;
let feedIsLocked = false;

// Feed Constants
const ITEMS_TO_LOAD = 6;
const SNAP_THRESHOLD = 0.2;
const CENTER_RESET_DELAY = 500;
const LOCK_DURATION = 1150;

// Track the current section
let currentSection = 'welcome';

// --- DOM Elements ---
let artistImage;
let artistName;
let artistOrigin;
let progressBar;
let progressFill;
let artistGrid;
let activeArtistImageContainer;
let activeArtistImg;
let activeArtistName;
let artistSelect;
let backToMainBtn;
let feedView;
let feedCarouselContainer;
let feedInfoBox;
let feedInfoEyeToggle;
let feedInfoBoxContent;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialize DOM Elements
    artistImage = document.querySelector('.artist-image');
    artistName = document.querySelector('.artist-name');
    artistOrigin = document.querySelector('.artist-origin');
    progressBar = document.querySelector('.progress-bar');
    progressFill = document.querySelector('.progress-fill');
    artistGrid = document.getElementById('artist-grid');
    activeArtistImageContainer = document.getElementById('active-artist-image');
    activeArtistImg = document.getElementById('active-artist-img');
    activeArtistName = document.getElementById('active-artist-name');
    artistSelect = document.getElementById('artist-select');
    backToMainBtn = document.getElementById('back-to-main');
    feedView = document.getElementById('feed-view');
    feedCarouselContainer = document.getElementById('feed-carousel-container');
    feedInfoBox = document.getElementById('feed-info-box');
    feedInfoEyeToggle = document.getElementById('feed-info-eye-toggle');
    feedInfoBoxContent = feedInfoBox.querySelector('.feed-info-box-content');

    // Initialize artist selector
    const artistSelectorBtn = document.getElementById('artist-selector-btn');
    const artistSelectorDropdown = document.getElementById('artist-selector-dropdown');

    if (artistSelectorBtn && artistSelectorDropdown) {
        // Populate dropdown
        artists.forEach(artist => {
            const item = document.createElement('div');
            item.className = 'artist-selector-item';
            item.textContent = artist.name;
            item.addEventListener('click', () => {
                showArtistDetail(artist.id);
                artistSelectorDropdown.classList.remove('show');
            });
            artistSelectorDropdown.appendChild(item);
        });

        // Toggle dropdown on button click
        artistSelectorBtn.addEventListener('click', () => {
            artistSelectorDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!artistSelectorBtn.contains(e.target) && !artistSelectorDropdown.contains(e.target)) {
                artistSelectorDropdown.classList.remove('show');
            }
        });
    }

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
                const newSrc = randomArtist.background;
                if (!backgroundImage.src.endsWith(randomArtist.background)) {
                    backgroundImage.style.opacity = '0';
                    backgroundImage.src = newSrc;
                    backgroundImage.onload = () => {
                        gsap.to(backgroundImage, { opacity: 1, duration: 0.35 });
                    };
                } else {
                    backgroundImage.style.opacity = '1';
                }
            }
        }
    }

    function showSection(sectionId) {
        setRandomBackground();
        const welcomeSection = document.getElementById('welcome');
        const feedViewSection = document.getElementById('feed-view');
        const artistDetailSection = document.getElementById('artist-detail-section');
        // Hide all sections first
        welcomeSection.style.display = 'none';
        feedViewSection.style.display = 'none';
        artistDetailSection.style.display = 'none';
        // Show the selected section
        if (sectionId === 'welcome') {
            welcomeSection.style.display = '';
            feedViewSection.classList.add('hidden');
        } else if (sectionId === 'feed') {
            feedViewSection.style.display = '';
            feedViewSection.classList.remove('hidden');
            initializeFeed();
        } else if (sectionId === 'artist') {
            artistDetailSection.style.display = '';
        }
        currentSection = sectionId;
        window.scrollTo(0, 0);
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
            artistImage.src = artist.image;
            artistName.textContent = artist.name;
            artistOrigin.textContent = artist.origin;
        } else {
            artistImage.style.opacity = '0';
            artistName.style.opacity = '0';
            artistOrigin.style.opacity = '0';
            progressContainer.style.opacity = '0';
            gsap.to([artistImage, artistName, artistOrigin, progressContainer], { opacity: 0, duration: 0.15, onComplete: () => {
                artistImage.src = artist.image;
                artistName.textContent = artist.name;
                artistOrigin.textContent = artist.origin;
                gsap.to([artistImage, artistName, artistOrigin, progressContainer], { opacity: 1, duration: 0.25, ease: 'power2.out' });
            }});
        }
        updateActiveArtist(artist);
    }

    function updateActiveArtist(artist) {
        if (!artist) return;
        if (activeArtistImageContainer && activeArtistImg && activeArtistName) {
            activeArtistImg.src = artist.image;
            activeArtistName.textContent = artist.name;
            activeArtistImageContainer.style.display = 'block';
        }
    }

    // --- Progress Bar ---
    function updateProgressBar() {
        if (progressPaused || isDragging) return;
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
    function getLinkIconFA(url) {
        if (/instagram\.com/.test(url)) return 'fab fa-instagram';
        if (/twitter\.com|x\.com/.test(url)) return 'fab fa-twitter';
        if (/facebook\.com/.test(url)) return 'fab fa-facebook-f';
        if (/tiktok\.com/.test(url)) return 'fab fa-tiktok';
        if (/youtube\.com/.test(url)) return 'fab fa-youtube';
        if (/linkedin\.com/.test(url)) return 'fab fa-linkedin-in';
        if (/news|article|cbc|globeandmail|nytimes|theguardian/.test(url)) return 'fas fa-newspaper';
        return 'fas fa-globe';
    }

    function showArtistDetail(artistId) {
        const artist = artists.find(a => a.id === artistId) || artists[0];
        document.querySelector('.artist-detail-image').src = artist.image;
        document.querySelector('.artist-detail-image').alt = artist.name;
        document.querySelector('.artist-detail-name').textContent = artist.name;
        const metaBox = document.querySelector('.artist-detail-meta');
        metaBox.innerHTML = '';
        if (artist.identity) {
            const identityDiv = document.createElement('div');
            identityDiv.textContent = artist.identity;
            identityDiv.style.fontWeight = 'bold';
            metaBox.appendChild(identityDiv);
        }
        if (artist.specificIdentity) {
            const specDiv = document.createElement('div');
            specDiv.textContent = artist.specificIdentity;
            metaBox.appendChild(specDiv);
        }
        if (artist.pronouns) {
            const pronounDiv = document.createElement('div');
            pronounDiv.textContent = artist.pronouns;
            metaBox.appendChild(pronounDiv);
        }
        if (artist.birthYear) {
            const ageDiv = document.createElement('div');
            ageDiv.textContent = artist.birthYear;
            metaBox.appendChild(ageDiv);
        }
        if (artist.links && artist.links.length > 0) {
            const linksDiv = document.createElement('div');
            linksDiv.className = 'artist-links';
            artist.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                const icon = document.createElement('i');
                icon.className = getLinkIconFA(link.url);
                a.appendChild(icon);
                linksDiv.appendChild(a);
            });
            metaBox.appendChild(linksDiv);
        }
        document.querySelector('.artist-detail-bio-text').textContent = artist.bio || '';
        const bioBox = document.querySelector('.artist-detail-bio');
        let worksBox = bioBox.querySelector('.artist-works-list');
        if (worksBox) worksBox.remove();
        if (artistSelect) artistSelect.value = artist.id;
        // --- Works Bar and Viewer ---
        const worksBar = document.getElementById('artist-works-bar');
        const workViewer = document.getElementById('artist-work-viewer');
        worksBar.innerHTML = '';
        workViewer.innerHTML = '';
        if (artist.works && artist.works.length > 0) {
            let selectedWorkIdx = 0;
            function renderWork(idx) {
                selectedWorkIdx = idx;
                // Highlight selected button
                Array.from(worksBar.children).forEach((btn, i) => {
                    btn.classList.toggle('selected', i === idx);
                });
                // Render media (like feed)
                workViewer.innerHTML = '';
                const work = artist.works[idx];
                if (!work) return;
                let currentMediaIdx = 0;
                const mediaList = work.media || [];
                // Create columns first (move above renderMedia/showNewMedia)
                const infoCol = document.createElement('div');
                infoCol.className = 'artist-work-info-col';
                const mediaCol = document.createElement('div');
                mediaCol.className = 'artist-work-media-col';
                // Info toggle below media (now in left column)
                let showImpact = false;
                const toggleDiv = document.createElement('div');
                toggleDiv.className = 'feed-info-toggle';
                const meaningBtn = document.createElement('button');
                meaningBtn.className = 'feed-info-toggle-btn active';
                meaningBtn.id = 'artist-toggle-meaning';
                meaningBtn.textContent = 'Meaning';
                const impactBtn = document.createElement('button');
                impactBtn.className = 'feed-info-toggle-btn';
                impactBtn.id = 'artist-toggle-impact';
                impactBtn.textContent = 'Impact';
                toggleDiv.appendChild(meaningBtn);
                toggleDiv.appendChild(impactBtn);
                // Info text
                const infoDiv = document.createElement('div');
                infoDiv.className = 'artist-info-text';
                infoDiv.style.width = '100%';
                infoDiv.style.marginTop = '1.1rem';
                infoDiv.style.textAlign = 'center';
                function updateInfoText() {
                    if (showImpact && work.impact) {
                        infoDiv.textContent = work.impact;
                    } else {
                        infoDiv.textContent = work.description || '';
                    }
                }
                meaningBtn.addEventListener('click', () => {
                    showImpact = false;
                    meaningBtn.classList.add('active');
                    impactBtn.classList.remove('active');
                    updateInfoText();
                });
                impactBtn.addEventListener('click', () => {
                    showImpact = true;
                    impactBtn.classList.add('active');
                    meaningBtn.classList.remove('active');
                    updateInfoText();
                });
                updateInfoText();
                // Add work title above info text
                const titleDiv = document.createElement('div');
                titleDiv.className = 'artist-work-title';
                titleDiv.textContent = work.title || '';
                infoCol.appendChild(titleDiv);
                infoCol.appendChild(toggleDiv);
                infoCol.appendChild(infoDiv);
                // Patch renderMedia/showNewMedia to append to mediaCol instead of workViewer
                let currentMediaEl = null;
                let updateArrowState = () => {};
                function renderMedia(fade = false) {
                    if (currentMediaEl) {
                        if (fade) {
                            gsap.to(currentMediaEl, { opacity: 0, duration: 0.25, onComplete: () => {
                                mediaCol.removeChild(currentMediaEl);
                                showNewMedia();
                            }});
                        } else {
                            mediaCol.removeChild(currentMediaEl);
                            showNewMedia();
                        }
                    } else {
                        showNewMedia();
                    }
                }
                function showNewMedia() {
                    const media = mediaList[currentMediaIdx];
                    let el;
                    if (media.type === 'image') {
                        el = document.createElement('img');
                        el.src = media.url;
                        el.alt = work.title;
                    } else if (media.type === 'video') {
                        el = document.createElement('video');
                        el.src = media.url;
                        el.controls = true;
                        el.muted = true;
                        el.loop = true;
                        el.playsInline = true;
                    }
                    el.style.opacity = '0';
                    mediaCol.appendChild(el);
                    gsap.to(el, { opacity: 1, duration: 0.25 });
                    currentMediaEl = el;
                    updateArrowState();
                }
                // Media navigation arrows (if multiple)
                if (mediaList.length > 1) {
                    const leftArrow = document.createElement('button');
                    leftArrow.className = 'feed-media-arrow feed-media-arrow-left';
                    leftArrow.innerHTML = '&#x2B05;';
                    const rightArrow = document.createElement('button');
                    rightArrow.className = 'feed-media-arrow feed-media-arrow-right';
                    rightArrow.innerHTML = '&#x27A1;';
                    updateArrowState = function() {
                        leftArrow.disabled = currentMediaIdx === 0;
                        rightArrow.disabled = currentMediaIdx === mediaList.length - 1;
                    };
                    leftArrow.addEventListener('click', () => {
                        if (currentMediaIdx > 0) {
                            currentMediaIdx--;
                            renderMedia(true);
                        }
                    });
                    rightArrow.addEventListener('click', () => {
                        if (currentMediaIdx < mediaList.length - 1) {
                            currentMediaIdx++;
                            renderMedia(true);
                        }
                    });
                    mediaCol.appendChild(leftArrow);
                    mediaCol.appendChild(rightArrow);
                }
                renderMedia(false);
                // Clear and append both columns to workViewer
                workViewer.innerHTML = '';
                workViewer.appendChild(infoCol);
                workViewer.appendChild(mediaCol);
            }
            artist.works.forEach((work, idx) => {
                const btn = document.createElement('button');
                btn.className = 'artist-work-btn';
                btn.textContent = work.title || `Work ${idx + 1}`;
                btn.addEventListener('click', () => renderWork(idx));
                worksBar.appendChild(btn);
            });
            renderWork(0);
        }
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
        if (currentSection === 'welcome') return;
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
        if (currentSection === 'feed') return;
        showSection('feed');
        setActiveBarButton('bar-feed');
        initializeFeed();
    });
    document.getElementById('bar-artist').addEventListener('click', () => {
        if (currentSection === 'artist') return;
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

    // --- Feed Logic ---
    function buildFeedQueue() {
        feedQueue = [];
        artists.forEach(artist => {
            if (artist.works && artist.works.length > 0) {
                artist.works.forEach((work, workIdx) => {
                    if (work.media && work.media.length > 0) {
                        feedQueue.push({ artist, work, artistId: artist.id, workIndex: workIdx });
                    }
                });
            }
        });
        // Shuffle feedQueue
        for (let i = feedQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [feedQueue[i], feedQueue[j]] = [feedQueue[j], feedQueue[i]];
        }
        // Save order to localStorage
        const feedOrder = feedQueue.map(item => ({ artistId: item.artistId, workIndex: item.workIndex }));
        localStorage.setItem('feedQueueOrder', JSON.stringify(feedOrder));
        return feedQueue.length > 0;
    }

    function restoreFeedQueue() {
        const feedOrderRaw = localStorage.getItem('feedQueueOrder');
        if (!feedOrderRaw) return false;
        try {
            const feedOrder = JSON.parse(feedOrderRaw);
            feedQueue = feedOrder.map(({ artistId, workIndex }) => {
                const artist = artists.find(a => a.id === artistId);
                if (!artist || !artist.works[workIndex]) return null;
                return { artist, work: artist.works[workIndex], artistId, workIndex };
            }).filter(Boolean);
            return feedQueue.length > 0;
        } catch {
            return false;
        }
    }

    function saveFeedCurrentIndex() {
        localStorage.setItem('feedCurrentIndex', String(feedCurrentIndex));
    }
    function restoreFeedCurrentIndex() {
        const idx = parseInt(localStorage.getItem('feedCurrentIndex'), 10);
        if (!isNaN(idx) && idx >= 0 && idx < feedQueue.length) {
            feedCurrentIndex = idx;
        }
    }

    function initializeFeed() {
        if (!feedView || !feedCarouselContainer || !feedInfoBox) return;
        feedView.classList.remove('hidden');
        feedView.classList.add('feed-view');
        feedView.style.display = 'block';
        feedCarouselContainer.innerHTML = '';
        feedLoadedItems = [];
        // --- Swipe to Scroll Hint ---
        let swipeHint = document.getElementById('feed-swipe-hint');
        if (!swipeHint) {
            swipeHint = document.createElement('div');
            swipeHint.id = 'feed-swipe-hint';
            swipeHint.textContent = 'Swipe to scroll';
            swipeHint.style.position = 'fixed';
            swipeHint.style.left = '50%';
            swipeHint.style.bottom = '2.5rem';
            swipeHint.style.transform = 'translateX(-50%)';
            swipeHint.style.background = 'rgba(24,36,56,0.92)';
            swipeHint.style.color = '#ffe066';
            swipeHint.style.fontSize = '1.05rem';
            swipeHint.style.fontWeight = '600';
            swipeHint.style.padding = '0.5rem 1.2rem';
            swipeHint.style.borderRadius = '1.2rem';
            swipeHint.style.boxShadow = '0 2px 12px rgba(0,0,0,0.13)';
            swipeHint.style.zIndex = '9999';
            swipeHint.style.pointerEvents = 'none';
            swipeHint.style.transition = 'opacity 0.4s';
            swipeHint.style.opacity = '1';
            document.body.appendChild(swipeHint);
        }
        swipeHint.style.display = 'block';
        // --- End Swipe to Scroll Hint ---
        let hasItems = restoreFeedQueue();
        if (!hasItems) {
            hasItems = buildFeedQueue();
            if (!hasItems) {
                showNoItemsMessage();
                return;
            }
        }
        restoreFeedCurrentIndex();
        const loaded = loadMoreItems();
        if (!loaded) {
            showNoItemsMessage();
            return;
        }
        // Ensure the first item is not a video
        if (feedLoadedItems.length > 0 && feedLoadedItems[0].work.media && feedLoadedItems[0].work.media.length > 0 && feedLoadedItems[0].work.media[0].type === 'video') {
            let swapIdx = -1;
            for (let i = 1; i < feedLoadedItems.length; i++) {
                if (feedLoadedItems[i].work.media && feedLoadedItems[i].work.media.length > 0 && feedLoadedItems[i].work.media[0].type === 'image') {
                    swapIdx = i;
                    break;
                }
            }
            if (swapIdx !== -1) {
                const temp = feedLoadedItems[0];
                feedLoadedItems[0] = feedLoadedItems[swapIdx];
                feedLoadedItems[swapIdx] = temp;
            }
        }
        updateCarousel();
        feedView.addEventListener('wheel', handleWheel, { passive: false });
        // --- Hide Swipe Hint on First Scroll ---
        function dismissSwipeHint() {
            if (swipeHint && swipeHint.style.display !== 'none') {
                swipeHint.style.opacity = '0';
                setTimeout(() => { swipeHint.style.display = 'none'; }, 400);
            }
        }
        feedView.addEventListener('wheel', dismissSwipeHint, { once: true });
        feedView.addEventListener('touchstart', dismissSwipeHint, { once: true });
    }

    function showNoItemsMessage() {
        const msg = document.createElement('div');
        msg.textContent = 'No works available.';
        msg.style.color = '#fff';
        msg.style.fontSize = '2rem';
        msg.style.textAlign = 'center';
        msg.style.marginTop = '30vh';
        feedCarouselContainer.appendChild(msg);
            if (feedInfoBox) feedInfoBox.classList.remove('visible');
    }

    function createFeedItem(item, isCurrent) {
        const { artist, work } = item;
        const wrapper = document.createElement('div');
        wrapper.className = 'feed-stack-item';
        const mediaWrapper = document.createElement('div');
        mediaWrapper.className = 'feed-stack-media';
        mediaWrapper.id = 'feed-media-wrapper';

        // --- Media Navigation State ---
        let currentMediaIndex = 0;
        const mediaList = work.media || [];

        // --- Arrow Buttons ---
        const leftArrow = document.createElement('button');
        leftArrow.className = 'feed-media-arrow feed-media-arrow-left';
        leftArrow.innerHTML = '&#x2B05;';

        const rightArrow = document.createElement('button');
        rightArrow.className = 'feed-media-arrow feed-media-arrow-right';
        rightArrow.innerHTML = '&#x27A1;';

        // --- Helper to update arrow state ---
        function updateArrowState() {
            leftArrow.disabled = currentMediaIndex === 0;
            rightArrow.disabled = currentMediaIndex === mediaList.length - 1;
            leftArrow.style.opacity = leftArrow.disabled ? '0.25' : '0.7';
            rightArrow.style.opacity = rightArrow.disabled ? '0.25' : '0.7';
            leftArrow.style.cursor = leftArrow.disabled ? 'default' : 'pointer';
            rightArrow.style.cursor = rightArrow.disabled ? 'default' : 'pointer';
        }

        // --- Render Media with Fade ---
        let currentMediaEl = null;
        function renderMedia(fade = false) {
            if (currentMediaEl) {
                if (fade) {
                    gsap.to(currentMediaEl, { opacity: 0, duration: 0.25, onComplete: () => {
                        mediaWrapper.removeChild(currentMediaEl);
                        showNewMedia();
                    }});
                } else {
                    mediaWrapper.removeChild(currentMediaEl);
                    showNewMedia();
                }
            } else {
                showNewMedia();
            }
        }
        function showNewMedia() {
            const media = mediaList[currentMediaIndex];
            let el;
            if (media.type === 'image') {
                el = document.createElement('img');
                el.src = media.url;
                el.alt = work.title;
                el.className = 'feed-media';
            } else if (media.type === 'video') {
                el = document.createElement('video');
                el.src = media.url;
                el.className = 'feed-media';
                el.controls = true;
                el.muted = true;
                el.loop = true;
                el.playsInline = true;
            }
            el.style.opacity = '0';
            mediaWrapper.appendChild(el);
            gsap.to(el, { opacity: 1, duration: 0.25 });
            currentMediaEl = el;
            updateArrowState();
        }

        // --- Arrow Event Listeners ---
        leftArrow.addEventListener('click', () => {
            if (currentMediaIndex > 0) {
                currentMediaIndex--;
                renderMedia(true);
            }
        });
        rightArrow.addEventListener('click', () => {
            if (currentMediaIndex < mediaList.length - 1) {
                currentMediaIndex++;
                renderMedia(true);
            }
        });

        // --- Initial Render ---
        if (mediaList.length > 0) {
            renderMedia(false);
            if (mediaList.length > 1) {
                mediaWrapper.appendChild(leftArrow);
                mediaWrapper.appendChild(rightArrow);
            }
        }
        wrapper.appendChild(mediaWrapper);
        return wrapper;
    }

    function loadMoreItems() {
        const startIndex = feedLoadedItems.length;
        const newItems = feedQueue.slice(startIndex, startIndex + ITEMS_TO_LOAD);
        if (newItems.length === 0) return false;
        feedLoadedItems = [...feedLoadedItems, ...newItems];
        return true;
    }

    function updateCarousel() {
        if (!feedCarouselContainer) return;
        const translateY = -feedCurrentIndex * window.innerHeight;
        feedCarouselContainer.style.transform = `translateY(${translateY}px)`;
        if (feedCarouselContainer.childElementCount !== feedLoadedItems.length) {
            feedCarouselContainer.innerHTML = '';
            for (let i = 0; i < feedLoadedItems.length; i++) {
                const item = createFeedItem(feedLoadedItems[i], i === feedCurrentIndex);
                feedCarouselContainer.appendChild(item);
            }
        }
        updateInfoBox();
    }

    function updateInfoBox() {
        if (!feedInfoBox || !feedLoadedItems[feedCurrentIndex]) {
            if (feedInfoBox) feedInfoBox.classList.remove('visible');
            return;
        }
        const { artist, work } = feedLoadedItems[feedCurrentIndex];
        const title = document.getElementById('feed-info-title');
        const description = document.getElementById('feed-info-text');
        const meta = document.getElementById('feed-info-meta');
        const impactToggle = document.getElementById('feed-toggle-impact');
        const meaningToggle = document.getElementById('feed-toggle-meaning');
        if (title) title.textContent = work.title || '';
        if (meta) {
            let metaHTML = '';
            if (artist && artist.name && artist.id) {
                metaHTML += `<a href="#" class="feed-meta-artist-link" data-artist-id="${artist.id}">${artist.name}</a>`;
            }
            if (artist && artist.name && artist.id && work.medium) metaHTML += '<span class="feed-meta-dot"></span>';
            if (work.medium) metaHTML += `<span>${work.medium}</span>`;
            if ((work.medium || (artist && artist.name && artist.id)) && work.year) metaHTML += '<span class="feed-meta-dot"></span>';
            if (work.year) metaHTML += `<span>${work.year}</span>`;
            meta.innerHTML = metaHTML;
            // Add click event to artist link
            const artistLink = meta.querySelector('.feed-meta-artist-link');
            if (artistLink) {
                artistLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    showArtistDetail(artist.id);
                    setActiveBarButton('bar-artist');
                    showSection('artist');
                });
            }
        }
        if (description) description.textContent = feedShowImpact ? (work.impact || 'No impact statement.') : (work.description || '');
        if (impactToggle && meaningToggle) {
            if (feedShowImpact) {
                impactToggle.classList.add('active');
                meaningToggle.classList.remove('active');
            } else {
                impactToggle.classList.remove('active');
                meaningToggle.classList.add('active');
            }
            impactToggle.onclick = () => {
                feedShowImpact = true;
                updateInfoBox();
            };
            meaningToggle.onclick = () => {
                feedShowImpact = false;
                updateInfoBox();
            };
        }
        requestAnimationFrame(() => {
            feedInfoBox.classList.add('visible');
        });
        feedInfoBox.style.display = 'flex';
        feedInfoBox.style.zIndex = '100';
    }

    function handleWheel(e) {
        if (feedIsLocked) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        if (feedIsTransitioning) return;
        feedIsScrolling = true;
        if (feedScrollTimeout) clearTimeout(feedScrollTimeout);
        const vh = window.innerHeight;
        const delta = e.deltaY;
        const now = performance.now();
        if (feedLastScrollTime > 0) {
            const timeDiff = now - feedLastScrollTime;
            if (timeDiff > 0) {
                feedScrollVelocity = delta / timeDiff;
            }
        }
        feedLastScrollTime = now;
        feedScrollOffset -= delta;
        if (Math.abs(feedScrollOffset) > vh * SNAP_THRESHOLD) {
            if (feedScrollOffset > 0 && feedCurrentIndex > 0) {
                snapToIndex(feedCurrentIndex - 1);
            } else if (feedScrollOffset < 0 && feedCurrentIndex < feedLoadedItems.length - 1) {
                snapToIndex(feedCurrentIndex + 1);
            } else {
                snapToIndex(feedCurrentIndex);
            }
        } else {
            updateCarousel();
        }
        feedScrollTimeout = setTimeout(() => {
            feedIsScrolling = false;
            resetToCenter();
        }, CENTER_RESET_DELAY);
    }

    // --- Feed Carousel Navigation ---
    function cancelMomentum() {
        feedCarouselContainer.style.transition = 'none';
        feedCarouselContainer.offsetHeight;
        feedScrollOffset = 0;
        feedScrollVelocity = 0;
        feedLastScrollTime = 0;
        updateCarousel();
        requestAnimationFrame(() => {
            feedCarouselContainer.style.transition = '';
        });
    }

    function snapToIndex(newIndex) {
        if (feedIsTransitioning) return;
        feedIsTransitioning = true;
        feedCurrentIndex = newIndex;
        saveFeedCurrentIndex();
        cancelMomentum();
        feedIsLocked = true;
        setTimeout(() => { feedIsLocked = false; }, LOCK_DURATION);
        if (newIndex >= feedLoadedItems.length - 2) {
            const hasMore = loadMoreItems();
            if (!hasMore) feedCurrentIndex = 0;
        }
        feedCarouselContainer.style.transition = 'transform 0.5s cubic-bezier(0.4,0.8,0.4,1)';
        updateCarousel();
        setTimeout(() => {
            feedCarouselContainer.style.transition = '';
            feedIsTransitioning = false;
        }, 500);
    }

    function resetToCenter() {
        if (feedIsScrolling || feedIsTransitioning) return;
        const vh = window.innerHeight;
        const currentOffset = -feedCurrentIndex * vh + feedScrollOffset;
        if (Math.abs(currentOffset) > 1) {
            cancelMomentum();
            feedCarouselContainer.style.transition = 'transform 0.3s cubic-bezier(0.4,0.8,0.4,1)';
            updateCarousel();
            setTimeout(() => {
                feedCarouselContainer.style.transition = '';
            }, 300);
        }
    }

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
    function initializeArtistShowcase() {
        if (!artists || artists.length === 0) return;
        const artist = artists[0];
        if (artistImage) artistImage.src = artist.image;
        if (artistName) artistName.textContent = artist.name;
        if (artistOrigin) artistOrigin.textContent = artist.origin;
        updateArtistShowcase(artist, true);
        updateActiveArtist(artist);
        startProgress();
        setActiveBarButton('bar-home');
    }
    initializeArtistShowcase();
    initializeAnimations();

    // --- Main Nav Bar Section Navigation ---
    // Update nav button and content-section IDs to match their visible text
    const navIdMap = {
        'power-of-art': 'art-is-power',
        'art-as-resistance': 'art-is-change',
        'art-impact': 'art-is-presence',
        'challenges': 'art-is-empathy',
        'social-media': 'art-is-continuity'
    };
    // Update nav-item and content-section IDs
    document.querySelectorAll('.nav-item').forEach(btn => {
        const oldId = btn.getAttribute('data-section');
        if (navIdMap[oldId]) {
            btn.setAttribute('data-section', navIdMap[oldId]);
        }
    });
    document.querySelectorAll('.content-section').forEach(sec => {
        if (navIdMap[sec.id]) {
            sec.id = navIdMap[sec.id];
        }
    });
    // Set the first nav-item and content-section as active by default
    document.querySelectorAll('.nav-item').forEach((btn, idx) => {
        if (idx === 0) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    document.querySelectorAll('.content-section').forEach((sec, idx) => {
        if (idx === 0) sec.classList.add('active');
        else sec.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sectionId = btn.getAttribute('data-section');
            document.querySelectorAll('.content-section').forEach(sec => {
                sec.classList.remove('active');
            });
            const target = document.getElementById(sectionId);
            if (target) target.classList.add('active');
        });
    });

    // --- Feed Info Toggle Buttons ---
    const feedToggleMeaning = document.getElementById('feed-toggle-meaning');
    const feedToggleImpact = document.getElementById('feed-toggle-impact');
    if (feedToggleMeaning && feedToggleImpact) {
        feedToggleMeaning.addEventListener('click', () => {
            feedShowImpact = false;
            updateInfoBox();
        });
        feedToggleImpact.addEventListener('click', () => {
            feedShowImpact = true;
            updateInfoBox();
        });
    }

    // --- Eye Toggle Logic ---
    function setFeedInfoBoxVisibility(visible) {
        if (!feedInfoBox) return;
        if (visible) {
            feedInfoBox.classList.add('visible');
            localStorage.setItem('feedInfoBoxVisible', '1');
        } else {
            feedInfoBox.classList.remove('visible');
            localStorage.setItem('feedInfoBoxVisible', '0');
        }
    }
    if (feedInfoEyeToggle) {
        feedInfoEyeToggle.addEventListener('click', () => {
            const isVisible = feedInfoBox.classList.contains('visible');
            setFeedInfoBoxVisibility(!isVisible);
        });
    }
    // On load, restore state
    const savedInfoBoxVisible = localStorage.getItem('feedInfoBoxVisible');
    if (savedInfoBoxVisible === '0') {
        setFeedInfoBoxVisibility(false);
    } else {
        setFeedInfoBoxVisibility(true);
    }
}); 