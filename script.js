const sections = document.querySelectorAll('.section');
const mainContainer = document.getElementById('mainContainer');
const progressBar = document.getElementById('progressBar');
const progressDots = document.querySelectorAll('.progress-dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const bgMusic = document.getElementById('bgMusic');
const startBtn = document.getElementById('startBtn');
const musicToggle = document.getElementById('musicToggle');
const typewriterText = document.getElementById('typewriter-text');
const allNextBtns = document.querySelectorAll('.next-section-btn');
const allPrevBtns = document.querySelectorAll('.prev-section-btn');

// Voice Note Section Elements
const playPart1Btn = document.getElementById('playPart1Btn');
const playPart2Btn = document.getElementById('playPart2Btn');
const audioPlayer1 = document.getElementById('audioPlayer1');
const audioPlayer2 = document.getElementById('audioPlayer2');
const voiceAudio1 = document.getElementById('voiceAudio1');
const voiceAudio2 = document.getElementById('voiceAudio2');
const playPauseBtn1 = document.getElementById('playPauseBtn1');
const playPauseBtn2 = document.getElementById('playPauseBtn2');
const muteBtn1 = document.getElementById('muteBtn1');
const muteBtn2 = document.getElementById('muteBtn2');
const currentTime1 = document.getElementById('currentTime1');
const currentTime2 = document.getElementById('currentTime2');
const totalTime1 = document.getElementById('totalTime1');
const totalTime2 = document.getElementById('totalTime2');
const audioPart2 = document.getElementById('audioPart2');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const waveBars1 = audioPlayer1 ? audioPlayer1.querySelectorAll('.wave-bar') : [];
const waveBars2 = audioPlayer2 ? audioPlayer2.querySelectorAll('.wave-bar') : [];

// ========== CONFIGURATION ==========
const typewriterMessages = [
    "Mere feelings ko shabdon mein bayaan karna mushkil hai...",
    "Lekin main try karta hoon...",
    "Har roz, har pal, dil mein ek ehsaas rehta hai...",
    "Ek ajeeb si khushi milti hai sochne se...",
    "Main seriously sochta hoon, seriously mehsoos karta hoon...",
    "Bas yeh kehna chahta hoon: feelings asli hain, dil se hain."
];

let currentSection = 0;
let isMusicPlaying = false;
let currentVoicePart = 1;
let typewriterInterval;

// ========== INITIALIZATION ==========
function init() {
    // Set first section as active
    updateSection();
    
    // Add blur effect on load
    document.body.classList.add('page-blur');
    setTimeout(() => {
        document.body.classList.remove('page-blur');
        document.body.classList.add('page-clear');
    }, 1500);
    
    // Add click events to navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', goToPrevSection);
    if (nextBtn) nextBtn.addEventListener('click', goToNextSection);
    
    // Add click events to progress dots
    progressDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSection(index);
        });
    });
    
    // Start button event
    if (startBtn) startBtn.addEventListener('click', startExperience);
    
    // Music toggle event
    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);
    
    // Voice note buttons events
    if (playPart1Btn) playPart1Btn.addEventListener('click', () => playVoiceNote(1));
    if (playPart2Btn) playPart2Btn.addEventListener('click', () => playVoiceNote(2));
    
    // Audio controls events
    if (playPauseBtn1) playPauseBtn1.addEventListener('click', () => toggleVoiceNote(1));
    if (playPauseBtn2) playPauseBtn2.addEventListener('click', () => toggleVoiceNote(2));
    if (muteBtn1) muteBtn1.addEventListener('click', () => toggleMute(1));
    if (muteBtn2) muteBtn2.addEventListener('click', () => toggleMute(2));
    
    // Section navigation buttons
    allNextBtns.forEach(btn => {
        btn.addEventListener('click', goToNextSection);
    });
    
    allPrevBtns.forEach(btn => {
        btn.addEventListener('click', goToPrevSection);
    });
    
    // Initialize confession text with typewriter effect
    if (typewriterText) startTypewriterEffect();
    
    // Initialize voice audios
    initializeAudioPlayer(1);
    initializeAudioPlayer(2);
    
    // Step indicators
    if (step1) step1.addEventListener('click', () => switchVoicePart(1));
    if (step2) step2.addEventListener('click', () => switchVoicePart(2));
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Auto-init video player if on videos page
    if (document.getElementById('customVideoPlayer')) {
        setTimeout(() => initializeVideoPlayer(), 300);
    }
    
    // Auto-init memory tree if on memory tree page
    if (window.location.pathname.includes('memory-tree.html')) {
        setTimeout(() => initializeMemoryTree(), 300);
    }
}

// ========== SECTION NAVIGATION ==========
function updateSection() {
    if (!mainContainer) return;
    mainContainer.style.transform = `translateX(-${currentSection * 100}vw)`;
    
    sections.forEach((section, index) => {
        if (index === currentSection) section.classList.add('active');
        else section.classList.remove('active');
    });
    
    if (progressBar) progressBar.style.width = `${((currentSection + 1) / sections.length) * 100}%`;
    
    progressDots.forEach((dot, index) => {
        if (index === currentSection) dot.classList.add('active');
        else dot.classList.remove('active');
    });
    
    if (prevBtn) prevBtn.disabled = currentSection === 0;
    if (nextBtn) nextBtn.disabled = currentSection === sections.length - 1;
    
    if (currentSection === 0 && nextBtn) nextBtn.style.visibility = 'hidden';
    else if (nextBtn) nextBtn.style.visibility = 'visible';
}

function goToSection(index) {
    if (index >= 0 && index < sections.length) {
        currentSection = index;
        updateSection();
    }
}

function goToNextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        updateSection();
    }
}

function goToPrevSection() {
    if (currentSection > 0) {
        currentSection--;
        updateSection();
    }
}

// ========== MUSIC & START ==========
function startExperience() {
    if (!bgMusic) return;
    bgMusic.volume = 0.5;
    bgMusic.play()
        .then(() => {
            isMusicPlaying = true;
            if (musicToggle) musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        })
        .catch(error => console.log("Music playback failed:", error));
    
    goToNextSection();
    
    if (startBtn) {
        startBtn.textContent = "Thank you for starting ";
        startBtn.innerHTML += '<i class="fas fa-heart"></i>';
        startBtn.disabled = true;
    }
}

function toggleMusic() {
    if (!bgMusic) return;
    if (isMusicPlaying) {
        bgMusic.pause();
        if (musicToggle) musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        bgMusic.play()
            .then(() => {
                if (musicToggle) musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            })
            .catch(error => console.log("Music playback failed:", error));
    }
    isMusicPlaying = !isMusicPlaying;
}

// ========== TYPEWRITER ==========
function startTypewriterEffect() {
    let currentMessage = 0;
    let currentChar = 0;
    let isDeleting = false;
    const typingSpeed = 50;
    const deletingSpeed = 30;
    const pauseBetweenMessages = 1500;
    
    if (!typewriterText) return;
    typewriterText.textContent = '';
    
    function type() {
        const currentText = typewriterMessages[currentMessage];
        
        if (isDeleting) {
            typewriterText.textContent = currentText.substring(0, currentChar - 1);
            currentChar--;
        } else {
            typewriterText.textContent = currentText.substring(0, currentChar + 1);
            currentChar++;
        }
        
        if (!isDeleting && currentChar === currentText.length) {
            isDeleting = true;
            clearTimeout(typewriterInterval);
            typewriterInterval = setTimeout(type, pauseBetweenMessages);
            return;
        }
        
        if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentMessage = (currentMessage + 1) % typewriterMessages.length;
        }
        
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        clearTimeout(typewriterInterval);
        typewriterInterval = setTimeout(type, speed);
    }
    
    typewriterInterval = setTimeout(type, typingSpeed);
}

// ========== VOICE NOTES ==========
function playVoiceNote(part) {
    const playBtn = part === 1 ? playPart1Btn : playPart2Btn;
    const audioPlayer = part === 1 ? audioPlayer1 : audioPlayer2;
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    
    if (audioPlayer) {
        audioPlayer.classList.remove('hidden');
        audioPlayer.classList.add('show');
    }
    if (playBtn) playBtn.style.display = 'none';
    
    switchVoicePart(part);
    
    if (voiceAudio) {
        voiceAudio.play()
            .then(() => {
                const playPauseBtn = part === 1 ? playPauseBtn1 : playPauseBtn2;
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                animateWaveBars(part, true);
            })
            .catch(error => console.log(`Voice note part ${part} playback failed:`, error));
    }
}

function toggleVoiceNote(part) {
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    const playPauseBtn = part === 1 ? playPauseBtn1 : playPauseBtn2;
    if (!voiceAudio) return;
    
    if (voiceAudio.paused) {
        voiceAudio.play();
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        animateWaveBars(part, true);
    } else {
        voiceAudio.pause();
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        animateWaveBars(part, false);
    }
}

function toggleMute(part) {
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    const muteBtn = part === 1 ? muteBtn1 : muteBtn2;
    if (!voiceAudio || !muteBtn) return;
    
    voiceAudio.muted = !voiceAudio.muted;
    muteBtn.innerHTML = voiceAudio.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
}

function initializeAudioPlayer(part) {
    const voiceAudio = part === 1 ? voiceAudio1 : voiceAudio2;
    const totalTimeEl = part === 1 ? totalTime1 : totalTime2;
    const currentTimeEl = part === 1 ? currentTime1 : currentTime2;
    const playPauseBtn = part === 1 ? playPauseBtn1 : playPauseBtn2;
    const waveBars = part === 1 ? waveBars1 : waveBars2;
    
    if (!voiceAudio) return;
    
    voiceAudio.addEventListener('loadedmetadata', () => {
        if (totalTimeEl) totalTimeEl.textContent = formatTime(voiceAudio.duration);
    });
    
    voiceAudio.addEventListener('timeupdate', () => {
        if (currentTimeEl) currentTimeEl.textContent = formatTime(voiceAudio.currentTime);
    });
    
    voiceAudio.addEventListener('play', () => {
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        animateWaveBars(part, true);
    });
    
    voiceAudio.addEventListener('pause', () => {
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        animateWaveBars(part, false);
    });
    
    voiceAudio.addEventListener('ended', () => {
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        animateWaveBars(part, false);
        
        if (part === 1 && audioPart2) {
            setTimeout(() => switchVoicePart(2), 1000);
        }
    });
}

function animateWaveBars(part, shouldAnimate) {
    const waveBars = part === 1 ? waveBars1 : waveBars2;
    waveBars.forEach(bar => {
        bar.style.animationPlayState = shouldAnimate ? 'running' : 'paused';
    });
}

function switchVoicePart(part) {
    if (part === currentVoicePart) return;
    
    if (currentVoicePart === 1 && voiceAudio1) {
        voiceAudio1.pause();
        if (playPauseBtn1) playPauseBtn1.innerHTML = '<i class="fas fa-play"></i>';
        animateWaveBars(1, false);
    } else if (currentVoicePart === 2 && voiceAudio2) {
        voiceAudio2.pause();
        if (playPauseBtn2) playPauseBtn2.innerHTML = '<i class="fas fa-play"></i>';
        animateWaveBars(2, false);
    }
    
    if (part === 2 && audioPart2) {
        audioPart2.classList.remove('hidden');
        audioPart2.classList.add('show');
    }
    
    if (step1 && step2) {
        if (part === 1) {
            step1.classList.add('active');
            step2.classList.remove('active');
        } else {
            step1.classList.remove('active');
            step2.classList.add('active');
        }
    }
    
    currentVoicePart = part;
}

// ========== KEYBOARD ==========
function handleKeyboardNavigation(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        goToNextSection();
        event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
        goToPrevSection();
        event.preventDefault();
    } else if (event.key === 'Home') {
        goToSection(0);
        event.preventDefault();
    } else if (event.key === 'End') {
        goToSection(sections.length - 1);
        event.preventDefault();
    } else if (event.key === 'm' || event.key === 'M') {
        toggleMusic();
        event.preventDefault();
    }
}

// ========== UTILITIES ==========
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ========== FINAL PAGE RESPONSE HANDLER ==========
const CONFIG = {
    method: 'whatsapp',
    phoneNumber: '+917019670262',
    page: 'final',
    timestamp: new Date().toISOString()
};

window.handleChoice = function(choice) {
    const choiceText = choice === 'time' ? 
        "Mujhe thoda time chahiye" : 
        "Hum baat kar sakte hain";
    
    const payload = {
        selected_option: choiceText,
        timestamp: CONFIG.timestamp,
        page: CONFIG.page,
        user_agent: navigator.userAgent
    };
    
    sendResponse(CONFIG.method, payload, choiceText);
    
    const choiceContainer = document.getElementById('choiceContainer');
    const confirmationMsg = document.getElementById('confirmationMessage');
    if (choiceContainer) choiceContainer.style.display = 'none';
    if (confirmationMsg) confirmationMsg.style.display = 'block';
};

function sendResponse(method, payload, choiceText) {
    switch(method) {
        case 'whatsapp':
            const message = encodeURIComponent(
                `Response from Emotional Confession:\n\n` +
                `Selected Option: ${choiceText}\n` +
                `Time: ${new Date().toLocaleString()}\n\n` +
                `This response was sent automatically from the website.`
            );
            window.open(`https://wa.me/${CONFIG.phoneNumber}?text=${message}`, '_blank');
            break;
        case 'email':
            const subject = encodeURIComponent('Response from Emotional Confession');
            const body = encodeURIComponent(
                `Selected Option: ${choiceText}\n` +
                `Time: ${payload.timestamp}\n` +
                `Page: ${payload.page}\n\n` +
                `This response was sent automatically from the website.`
            );
            window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
            break;
        default:
            console.log('User Choice:', payload);
    }
}

// ========== 🎬 VIDEOS PAGE - CUSTOM VIDEO PLAYER ==========
let videoPlayer = null;
const videoPlaylist = [
    { src: 'videos/video1.mp4', name: 'video1.mp4' },
    { src: 'videos/video2.mp4', name: 'video2.mp4' },
    { src: 'videos/video3.mp4', name: 'video3.mp4' }
];
let currentVideoIndex = 0;
let isVideoPlaying = false;
let videoVolume = 1;

window.initializeVideoPlayer = function() {
    if (!document.getElementById('customVideoPlayer')) return;
    
    videoPlayer = document.getElementById('customVideoPlayer');
    
    // Hide loading
    const loading = document.querySelector('.loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => loading.style.display = 'none', 500);
        }, 800);
    }
    
    loadVideo(currentVideoIndex);
    setupVideoListeners();
    
    const totalEl = document.getElementById('totalVideos');
    if (totalEl) totalEl.textContent = videoPlaylist.length;
};

function loadVideo(index) {
    if (!videoPlayer) return;
    
    currentVideoIndex = index;
    videoPlayer.src = videoPlaylist[index].src;
    videoPlayer.load();
    
    const currentIndexEl = document.getElementById('currentVideoIndex');
    const fileNameEl = document.getElementById('videoFileName');
    if (currentIndexEl) currentIndexEl.textContent = index + 1;
    if (fileNameEl) fileNameEl.textContent = videoPlaylist[index].name;
    
    const playBtn = document.getElementById('playPauseVideoBtn');
    if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('playing');
    }
    isVideoPlaying = false;
    
    updateVideoProgressBar(0);
    const currentTimeEl = document.getElementById('currentVideoTime');
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
}

function setupVideoListeners() {
    if (!videoPlayer) return;
    
    videoPlayer.addEventListener('loadedmetadata', () => {
        const duration = videoPlayer.duration;
        const totalEl = document.getElementById('totalVideoTime');
        if (totalEl) totalEl.textContent = formatTime(duration);
        const currentEl = document.getElementById('currentVideoTime');
        if (currentEl) currentEl.textContent = '0:00';
    });
    
    videoPlayer.addEventListener('timeupdate', () => {
        const current = videoPlayer.currentTime;
        const duration = videoPlayer.duration;
        if (!isNaN(duration)) {
            const progress = (current / duration) * 100;
            updateVideoProgressBar(progress);
            const currentEl = document.getElementById('currentVideoTime');
            if (currentEl) currentEl.textContent = formatTime(current);
        }
    });
    
    videoPlayer.addEventListener('ended', () => {
        if (currentVideoIndex < videoPlaylist.length - 1) playNextVideo();
        else playVideoByIndex(0);
    });
    
    videoPlayer.addEventListener('volumechange', () => {
        const volBtn = document.getElementById('volumeVideoBtn');
        if (!volBtn) return;
        const icon = volBtn.querySelector('i');
        if (videoPlayer.muted || videoPlayer.volume === 0) icon.className = 'fas fa-volume-mute';
        else if (videoPlayer.volume < 0.5) icon.className = 'fas fa-volume-down';
        else icon.className = 'fas fa-volume-up';
    });
    
    // Buttons
    const playBtn = document.getElementById('playPauseVideoBtn');
    if (playBtn) playBtn.addEventListener('click', toggleVideoPlayPause);
    
    const nextBtn = document.getElementById('nextVideoBtn');
    if (nextBtn) nextBtn.addEventListener('click', playNextVideo);
    
    const prevBtn = document.getElementById('prevVideoBtn');
    if (prevBtn) prevBtn.addEventListener('click', playPreviousVideo);
    
    // Progress bar seeking
    const progressContainer = document.getElementById('videoProgressContainer');
    if (progressContainer) {
        progressContainer.addEventListener('click', function(e) {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const duration = videoPlayer.duration;
            if (duration && !isNaN(duration)) {
                videoPlayer.currentTime = (clickX / width) * duration;
            }
        });
    }
    
    // Volume
    const volumeSlider = document.getElementById('videoVolumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function(e) {
            const vol = parseFloat(e.target.value);
            videoPlayer.volume = vol;
            videoPlayer.muted = false;
        });
    }
    
    const volBtn = document.getElementById('volumeVideoBtn');
    if (volBtn) {
        volBtn.addEventListener('click', function() {
            if (videoPlayer.muted) {
                videoPlayer.muted = false;
                videoPlayer.volume = videoVolume;
            } else {
                videoVolume = videoPlayer.volume;
                videoPlayer.muted = true;
            }
        });
    }
    
    // Fullscreen
    const fsBtn = document.getElementById('fullscreenVideoBtn');
    if (fsBtn) {
        fsBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Click on video
    videoPlayer.addEventListener('click', toggleVideoPlayPause);
    
    // Overlay click
    const overlay = document.getElementById('videoOverlay');
    if (overlay) overlay.addEventListener('click', toggleVideoPlayPause);
}

function toggleVideoPlayPause() {
    if (!videoPlayer) return;
    
    if (videoPlayer.paused) {
        videoPlayer.play()
            .then(() => {
                isVideoPlaying = true;
                const playBtn = document.getElementById('playPauseVideoBtn');
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playBtn.classList.add('playing');
                }
            })
            .catch(err => console.error('Playback failed:', err));
    } else {
        videoPlayer.pause();
        isVideoPlaying = false;
        const playBtn = document.getElementById('playPauseVideoBtn');
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.classList.remove('playing');
        }
    }
}

function playNextVideo() {
    if (!videoPlayer) return;
    const nextIndex = (currentVideoIndex + 1) % videoPlaylist.length;
    playVideoByIndex(nextIndex);
}

function playPreviousVideo() {
    if (!videoPlayer) return;
    let prevIndex = currentVideoIndex - 1;
    if (prevIndex < 0) prevIndex = videoPlaylist.length - 1;
    playVideoByIndex(prevIndex);
}

function playVideoByIndex(index) {
    if (!videoPlayer) return;
    loadVideo(index);
    
    setTimeout(() => {
        videoPlayer.play()
            .then(() => {
                isVideoPlaying = true;
                const playBtn = document.getElementById('playPauseVideoBtn');
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playBtn.classList.add('playing');
                }
            })
            .catch(() => {
                const playBtn = document.getElementById('playPauseVideoBtn');
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playBtn.classList.remove('playing');
                }
            });
    }, 200);
}

function updateVideoProgressBar(percent) {
    const bar = document.getElementById('videoProgressBar');
    if (bar) bar.style.width = percent + '%';
}

function toggleFullscreen() {
    if (!videoPlayer) return;
    
    const wrapper = document.querySelector('.video-wrapper');
    const fsBtn = document.getElementById('fullscreenVideoBtn');
    const icon = fsBtn?.querySelector('i');
    
    if (!document.fullscreenElement) {
        if (wrapper?.requestFullscreen) wrapper.requestFullscreen();
        else if (wrapper?.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
        else if (wrapper?.msRequestFullscreen) wrapper.msRequestFullscreen();
        if (icon) icon.className = 'fas fa-compress';
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        if (icon) icon.className = 'fas fa-expand';
    }
}

// Fullscreen change listeners
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
document.addEventListener('MSFullscreenChange', updateFullscreenIcon);

function updateFullscreenIcon() {
    const fsBtn = document.getElementById('fullscreenVideoBtn');
    if (!fsBtn) return;
    const icon = fsBtn.querySelector('i');
    if (document.fullscreenElement) icon.className = 'fas fa-compress';
    else icon.className = 'fas fa-expand';
}

// ========== 🌳 MEMORY TREE TIMELINE FUNCTIONALITY ==========
// Sweet Hinglish messages for each photo (using aap/apki/apka)
const memoryMessages = [
    "Jab bhi main apki yeh photo dekhta hoon, dil automatically smile karne lagta hai 😊💖 Apki muskurahat sach mein duniya ko roshan kar deti hai ✨",
    "Is pal mein apki aankhon mein jo chamak hai na… woh mere liye sabse special memory hai 🌸💫 Apka har expression mere dil mein basa hua hai.",
    "Apke saath guzara hua har moment mere liye ek blessing hai 🙏💗 Apki simplicity hi apki sabse khoobsurat baat hai.",
    "Jab bhi life thodi mushkil lagti hai, main apki yeh tasveer dekh leta hoon… aur sab theek sa lagne lagta hai 🌷💞 Apka hona hi sukoon hai.",
    "Apki hasi mein jo masoomiyat hai na… woh directly dil tak pahunchti hai 😌💓 Apki har ek baat mujhe yaad rehti hai.",
    "Is photo mein apka confidence aur grace dono shine kar rahe hain ✨👑 Apka andaaz hi sabse alag hai.",
    "Apki aankhon mein jo pyaar aur warmth hai, woh mere din ko special bana deta hai ☀️💖 Apki presence hi happiness hai.",
    "Apka har ek gesture, choti si baat bhi mere liye bohot meaningful hai 🌹💫 Apka saath ek khoobsurat ehsaas hai.",
    "Jab bhi main apki tasveer dekhta hoon, mujhe apki woh pyari si smile yaad aati hai 🥰🌸 Apka khush rehna hi meri dua hai.",
    "Apka har pal, har yaad mere liye treasure jaisa hai 💎💕 Apki respect aur apki value mere dil mein hamesha sabse upar rahegi."
];

// Initialize Memory Tree (works with timeline layout)
window.initializeMemoryTree = function() {
    console.log("Initializing Memory Tree Timeline...");
    
    // Select all timeline photo frames
    const photoFrames = document.querySelectorAll('.timeline-photo-frame');
    const modal = document.getElementById('memoryModal');
    const modalImg = document.getElementById('modalImage');
    const modalMessage = document.getElementById('modalMessage');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!photoFrames.length || !modal || !modalImg || !modalMessage) {
        console.log("Memory Tree elements not found on this page");
        return;
    }
    
    // Add click event to each photo frame
    photoFrames.forEach((frame, index) => {
        frame.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Find the image inside this frame
            const img = this.querySelector('img');
            const imgSrc = img ? img.src : '';
            
            // Get index from data-index or from iteration
            const photoIndex = this.getAttribute('data-index') ? 
                parseInt(this.getAttribute('data-index')) : index;
            
            // Set modal content
            modalImg.src = imgSrc;
            modalMessage.textContent = memoryMessages[photoIndex] || "Apki yaadein hamesha special hain 💕";
            
            // Show modal with animation
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Add zoom effect to image
            modalImg.style.animation = 'none';
            modalImg.offsetHeight; // Trigger reflow
            modalImg.style.animation = 'zoomIn 0.5s ease';
            
            console.log(`Photo ${photoIndex + 1} clicked`);
        });
    });
    
    // Close modal when clicking on X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
    
    // Initialize music toggle on memory tree page
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    
    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', function() {
            if (bgMusic.paused) {
                bgMusic.volume = 0.5;
                bgMusic.play()
                    .then(() => {
                        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                        isMusicPlaying = true;
                    })
                    .catch(err => console.log("Music play failed:", err));
            } else {
                bgMusic.pause();
                musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                isMusicPlaying = false;
            }
        });
    }
    
    // Add tree knots to center line
    addTreeKnots();
    
    // Add hover effects
    addHoverEffects();
};

// Add decorative knots to the tree trunk
function addTreeKnots() {
    const centerLine = document.querySelector('.timeline-center-line');
    if (!centerLine) return;
    
    // Remove existing knots if any
    const existingKnots = centerLine.querySelectorAll('.knot');
    existingKnots.forEach(knot => knot.remove());
    
    // Add new knots at different positions
    const positions = [15, 30, 45, 60, 75, 90];
    positions.forEach((pos, i) => {
        const knot = document.createElement('div');
        knot.className = `knot knot-${i+1}`;
        knot.style.position = 'absolute';
        knot.style.left = '50%';
        knot.style.top = pos + '%';
        knot.style.transform = 'translateX(-50%)';
        knot.style.width = (15 + (i % 3) * 3) + 'px';
        knot.style.height = (15 + (i % 3) * 3) + 'px';
        knot.style.background = '#8b4513';
        knot.style.borderRadius = '50%';
        knot.style.boxShadow = '0 0 15px #cd853f';
        knot.style.zIndex = '5';
        centerLine.appendChild(knot);
    });
}

// Add hover effects to timeline items
function addHoverEffects() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const connector = this.querySelector('.timeline-connector');
            if (connector) {
                connector.style.width = '60px';
                connector.style.background = 'linear-gradient(90deg, #ff9ec0, #9d7bff)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const connector = this.querySelector('.timeline-connector');
            if (connector) {
                connector.style.width = '50px';
                connector.style.background = 'linear-gradient(90deg, #8b4513, #cd853f)';
            }
        });
    });
}

// ========== SONGS PAGE FUNCTIONALITY ==========
// This would be added if you have a songs.html page
window.initializeSongsPlayer = function() {
    console.log("Initializing Songs Player...");
    // Add songs player functionality here
};

// ========== BREATHE PAGE FUNCTIONALITY ==========
// This would be added if you have a breathe.html page
window.initializeBreatheExercise = function() {
    console.log("Initializing Breathe Exercise...");
    // Add breathing exercise functionality here
};

// ========== EXPORTED FUNCTIONS ==========
window.websiteFunctions = {
    goToSection,
    toggleMusic,
    startTypewriterEffect,
    playVoiceNote: (part) => playVoiceNote(part || 1),
    initializeVideoPlayer,
    playNextVideo,
    playPreviousVideo,
    toggleVideoPlayPause,
    initializeMemoryTree,
    initializeSongsPlayer,
    initializeBreatheExercise
};

// ========== AUTO-RUN ==========
window.addEventListener('DOMContentLoaded', init);

// Enable audio context on first click (for all pages except memory tree - handled separately)
document.body.addEventListener('click', function() {
    if (bgMusic && bgMusic.paused && !window.location.pathname.includes('memory-tree.html')) {
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            bgMusic.pause();
            bgMusic.volume = 0.5;
        }).catch(() => {});
    }
}, { once: true });

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.1);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.7;
        }
    }
    
    .timeline-connector {
        transition: width 0.3s ease, background 0.3s ease;
    }
    
    .timeline-photo-frame {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    
    .timeline-photo-frame:hover {
        transform: scale(1.05) rotate(2deg);
        box-shadow: 0 15px 35px rgba(157, 123, 255, 0.3);
        border-color: #ff9ec0;
    }
`;
document.head.appendChild(style);