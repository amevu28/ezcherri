
/**
 * ==========================================================================
 * ez.cherri - TUTORIAL MEDIA PLAYER APPLICATION ENGINE
 * Organized & Optimized Module Structure (No features modified)
 * ==========================================================================
 */

// --- CONFIGURATIONS ---
const NOTE_CONFIG = {
    width: 120,
    height: 120,
    offset: 60 // Center coordinate cursor offset
};

// --- DOM ELEMENTS SELECTION ---
const mainStack = document.getElementById('main-stack');
const workspace = document.getElementById('workspace');
const btn = document.getElementById('show-script-btn');
const content = document.getElementById('script-content');

const videoContainer = document.querySelector('.video-container');
const video = document.getElementById('myVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const bigPlay = document.getElementById('bigPlay');
const progressContainer = document.getElementById('progressContainer');
const progressFilled = document.getElementById('progressFilled');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const speedControl = document.getElementById('speedControl');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const timeBox = document.getElementById('timeBox');
const previewBox = document.getElementById('previewBox');
const previewVideo = document.getElementById('previewVideo');

// --- MODULE 1: STICKY NOTE INTERACTION ---

function createStickyNote(x, y) {
    const note = document.createElement('div');
    note.className = 'sticky-note-dropped';
    note.style.left = `${x - NOTE_CONFIG.offset}px`;
    note.style.top = `${y - NOTE_CONFIG.offset}px`;

    const textArea = document.createElement('div');
    textArea.className = 'note-text';
    textArea.contentEditable = "true";
    textArea.spellcheck = false;

    const closeBtn = document.createElement('div');
    closeBtn.className = 'note-close';
    closeBtn.innerHTML = '×';
    closeBtn.contentEditable = "false";

    // Textarea interaction block
    textArea.addEventListener('mousedown', (e) => e.stopPropagation());

    // Close and remove instance
    closeBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        note.remove();
    });

    note.appendChild(textArea);
    note.appendChild(closeBtn);
    workspace.appendChild(note);

    setTimeout(() => textArea.focus(), 0);
    return note;
}

// Drag-to-create node from core stack
mainStack.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const newNote = createStickyNote(e.pageX, e.pageY);

    const onMouseMove = (event) => {
        newNote.style.left = `${event.pageX - NOTE_CONFIG.offset}px`;
        newNote.style.top = `${event.pageY - NOTE_CONFIG.offset}px`;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// Drag-to-move existing notes inside workspace
document.addEventListener('mousedown', (e) => {
    const note = e.target.closest('.sticky-note-dropped');
    if (!note || e.target.contentEditable === "true") return;

    const rect = note.getBoundingClientRect();
    const shiftX = e.clientX - rect.left;
    const shiftY = e.clientY - rect.top;

    const moveNote = (event) => {
        note.style.left = `${event.pageX - shiftX}px`;
        note.style.top = `${event.pageY - shiftY}px`;
    };

    const stopMoving = () => {
        document.removeEventListener('mousemove', moveNote);
        document.removeEventListener('mouseup', stopMoving);
    };

    document.addEventListener('mousemove', moveNote);
    document.addEventListener('mouseup', stopMoving);
});

// --- MODULE 2: COLLAPSIBLE SIDEBAR ---

if (btn && content) {
    btn.addEventListener('click', () => {
        btn.classList.add('hidden');
        content.classList.remove('hidden');
    });
}

// --- MODULE 3: NATIVE CORE PLAYER CONTROLS ---

function togglePlay() {
    if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '❚❚';
        bigPlay.style.display = 'none';
    } else {
        video.pause();
        playPauseBtn.innerHTML = '▶';
        bigPlay.style.display = 'flex';
    }
}

playPauseBtn.addEventListener('click', togglePlay);
bigPlay.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

video.addEventListener('play', () => {
    bigPlay.classList.remove('show');
    playPauseBtn.innerHTML = '❚❚';
});

video.addEventListener('pause', () => {
    bigPlay.classList.add('show');
    playPauseBtn.innerHTML = '▶';
});

/* Time Formatting Engine */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTime() {
    timeBox.innerHTML = `
        ${formatTime(video.currentTime)}
        /
        ${formatTime(video.duration || 0)}
    `;
}

video.addEventListener('timeupdate', () => {
    const progressPercent = (video.currentTime / video.duration) * 100;
    progressFilled.style.width = `${progressPercent}%`;
    updateTime();
});

/* Timeline Seek and Progress Scrubbing System */
let isDragging = false;

function updateProgress(e) {
    const rect = progressContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percent = x / rect.width;
    video.currentTime = percent * video.duration;
    progressFilled.style.width = `${percent * 100}%`;
}

progressContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateProgress(e);
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateProgress(e);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Thêm sự kiện click nhanh vào thanh timeline để nhảy thời gian
progressContainer.addEventListener('click', (e) => {
    if (isDragging) return;
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    video.currentTime = (clickX / width) * video.duration;
});

/* Volume and Mute node modifiers */
volumeSlider.addEventListener('input', () => {
    video.volume = volumeSlider.value;
});

muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
        muteBtn.innerHTML = '<img src="icon/mute-volume-button.svg" alt="Volume off" class="volume-icon" />';
    } else {
        muteBtn.innerHTML = '<img src="icon/volume-button.svg" alt="Volume" class="volume-icon" />';
    }
});

/* Speed Multiplier Engine */
speedControl.addEventListener('change', () => {
    video.playbackRate = speedControl.value;
});

/* Screen Bounds Custom Scaler */
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.querySelector('.video-container').requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

/* Dynamic Frame Hover Scrubbing Previews */
progressContainer.addEventListener('mousemove', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const previewTime = percent * video.duration;

    previewBox.style.display = 'block';
    previewBox.style.left = `${x - 90}px`;
    previewVideo.currentTime = previewTime;
});

progressContainer.addEventListener('mouseleave', () => {
    previewBox.style.display = 'none';
});

// --- MODULE 4: SOCIAL ENGAGEMENT CLUSTER ---

const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');

if (likeBtn && likeCount) {
    let likes = parseInt(likeCount.textContent.trim()) || 0;

    likeBtn.addEventListener('click', () => {
        likes++;
        let img = likeBtn.querySelector('.cherry-icon');
        if (!img) {
            img = document.createElement('img');
            img.className = 'cherry-icon';
            img.alt = 'Like';
            img.src = 'icon/cherri-unfilled.svg';
            likeBtn.insertBefore(img, likeBtn.firstChild);
        }
        img.src = 'icon/cherri-filled.svg';
        likeCount.innerText = likes;
    });
}

// --- MODULE 5: AMBIENT FOCUS ENGINE ---

document.addEventListener('DOMContentLoaded', () => {
    const focusBtn = document.getElementById('focusModeBtn');
    const overlay = document.getElementById('focusOverlay') || document.querySelector('.focus-overlay');

    let focused = false;
    if (!focusBtn || !videoContainer || !overlay) return;

    focusBtn.addEventListener('click', () => {
        focused ? exitFocus() : enterFocus();
    });

    overlay.addEventListener('click', () => {
        if (focused) exitFocus();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && focused) exitFocus();
    });

    window.addEventListener('resize', () => {
        if (focused) exitFocus();
    });

    function enterFocus() {
        const rect = videoContainer.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const scale = Math.min((vw * 0.82) / rect.width, (vh * 0.82) / rect.height, 1.6);
        const dx = vw / 2 - (rect.left + rect.width / 2);
        const dy = vh / 2 - (rect.top + rect.height / 2);

        Object.assign(videoContainer.style, {
            position: 'fixed',
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: '0',
            transform: 'translate(0px, 0px) scale(1)',
            transition: 'transform 420ms cubic-bezier(.2,.8,.2,1), box-shadow 420ms ease',
            zIndex: '1000',
            willChange: 'transform'
        });

        document.body.classList.add('focus-active');
        focusBtn.setAttribute('aria-pressed', 'true');

        void videoContainer.offsetWidth; // Force Reflow
        videoContainer.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        focused = true;
    }

    function exitFocus() {
        videoContainer.style.transform = 'translate(0px, 0px) scale(1)';

        const onEnd = (e) => {
            if (e.propertyName !== 'transform') return;
            videoContainer.removeEventListener('transitionend', onEnd);

            [
                'position', 'left', 'top', 'width', 'height',
                'margin', 'transform', 'transition', 'zIndex', 'willChange'
            ].forEach((k) => videoContainer.style.removeProperty(k));

            document.body.classList.remove('focus-active');
            focusBtn.setAttribute('aria-pressed', 'false');
            focused = false;
        };

        videoContainer.addEventListener('transitionend', onEnd);
    }
});