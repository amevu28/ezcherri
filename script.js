
//To be transparent, I used online documentation and AI tools like Gemini and Copilot to help me understand and write javascript since i cant find resources for the tool i want to make, then i alter them and write to my own understanding since ai make mistakes. 

// Simple settings for our sticky notes so the mouse cursor stays right in the middle when dragging them
const NOTE_CONFIG = {
    width: 120,
    height: 120,
    offset: 60 // Keeps the mouse cursor centered on the note
};

// ==========================================
// --- ELEMENTS SELECTION ---
// WHAT THIS PART DOES: 
// This section grabs all the HTML elements we need and saves them into variables. 
// I put them all together at the top of the file so it is easy to find, clean to look at, 
// and easy to update if we ever change an ID or class name in the HTML file.
// ==========================================

// HTML elements for making and moving sticky notes
const mainStack = document.getElementById('main-stack');
const workspace = document.getElementById('workspace');

// HTML elements for the show/hide script button
const btn = document.getElementById('show-script-btn');
const content = document.getElementById('script-content');

// HTML elements for our custom video player controls
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


// ==========================================
// STICKY NOTE INTERACTION ---
// WHAT THIS PART DOES: 
// This module lets users create new sticky notes by clicking and dragging from a stack,
// and lets them move existing notes around the workspace or type text into them.
// ==========================================

/**
 * Creates a new sticky note on the screen at a specific (x, y) location
 */
function createStickyNote(x, y) {
    // 1. Create the main note box and set its starting position based on the mouse click
    const note = document.createElement('div');
    note.className = 'sticky-note-dropped';
    note.style.left = `${x - NOTE_CONFIG.offset}px`;
    note.style.top = `${y - NOTE_CONFIG.offset}px`;

    // 2. Create the text area inside the note where users can type things
    const textArea = document.createElement('div');
    textArea.className = 'note-text';
    textArea.contentEditable = "true";
    textArea.spellcheck = false;

    // 3. Create the 'X' button so users can delete the note
    const closeBtn = document.createElement('div');
    closeBtn.className = 'note-close';
    closeBtn.innerHTML = '×';
    closeBtn.contentEditable = "false";

    // Stop the note from moving around while the user is clicking inside the text box to type
    textArea.addEventListener('mousedown', (e) => e.stopPropagation());

    // When the 'X' button is clicked, stop other actions and delete the note from the page
    closeBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        note.remove();
    });

    // 4. Put the text area and close button inside the note, then add the note to the workspace
    note.appendChild(textArea);
    note.appendChild(closeBtn);
    workspace.appendChild(note);

    // Automatically click inside the text box so the user can start typing immediately
    setTimeout(() => textArea.focus(), 0);
    return note;
}

/**
 * Drag-to-create: Creates a brand new note when clicking and pulling from the main stack
 */
mainStack.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Stops the browser from highlighting text by accident
    const newNote = createStickyNote(e.pageX, e.pageY); // Make a note where the mouse is clicked

    // Moves the new note along with the mouse cursor
    const onMouseMove = (event) => {
        newNote.style.left = `${event.pageX - NOTE_CONFIG.offset}px`;
        newNote.style.top = `${event.pageY - NOTE_CONFIG.offset}px`;
    };

    // Stops tracking the movement when the user lets go of the mouse button
    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

/**
 * Drag existing notes: Lets users pick up and move notes that are already in the workspace
 */
document.addEventListener('mousedown', (e) => {
    // Check if the user clicked on a sticky note
    const note = e.target.closest('.sticky-note-dropped');
    // If they didn't click a note, or if they are trying to type text, don't drag anything
    if (!note || e.target.contentEditable === "true") return;

    // Calculate exactly where the mouse is pointing inside the note so it doesn't "jump" when grabbed
    const rect = note.getBoundingClientRect();
    const shiftX = e.clientX - rect.left;
    const shiftY = e.clientY - rect.top;

    // Update the note's position as the mouse moves
    const moveNote = (event) => {
        note.style.left = `${event.pageX - shiftX}px`;
        note.style.top = `${event.pageY - shiftY}px`;
    };

    // Stop moving the note when the mouse button is released
    const stopMoving = () => {
        document.removeEventListener('mousemove', moveNote);
        document.removeEventListener('mouseup', stopMoving);
    };

    document.addEventListener('mousemove', moveNote);
    document.addEventListener('mouseup', stopMoving);
});


// ==========================================
// --- MODULE 2: SCRIPT TOGGLE ---
// WHAT THIS PART DOES: 
// Simple click feature. When you click the button, it hides the button and reveals the text content.
// ==========================================
if (btn && content) {
    btn.addEventListener('click', () => {
        btn.classList.add('hidden');       // Hide the button
        content.classList.remove('hidden'); // Show the kịch bản/script text
    });
}


// ==========================================
// --- MODULE 3: VIDEO PLAYER CONTROLS ---
// WHAT THIS PART DOES: 
// This runs our custom video player features like play/pause buttons, the timeline progress bar, 
// volume adjustments, speed options, and hover thumbnails.
// ==========================================

/**
 * Plays or pauses the video and swaps the button symbols automatically
 */
function togglePlay() {
   
    const playImg = playPauseBtn.querySelector('.play-icon');
    const resumeImg = playPauseBtn.querySelector('.stop-icon');

    if (video.paused) {
        video.play();
        
   
        if (playImg) playImg.style.display = 'none';
        if (resumeImg) resumeImg.style.display = 'block';
        
        bigPlay.style.display = 'none';
    } else {
        video.pause();
        
        
        if (playImg) playImg.style.display = 'block';
        if (resumeImg) resumeImg.style.display = 'none';
        
        bigPlay.style.display = 'flex';
    }
}


playPauseBtn.addEventListener('click', togglePlay);
bigPlay.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);


video.addEventListener('play', () => {
    bigPlay.classList.remove('show');
    const playImg = playPauseBtn.querySelector('.play-icon');
    const resumeImg = playPauseBtn.querySelector('.stop-icon');
    if (playImg) playImg.style.display = 'none';
    if (resumeImg) resumeImg.style.display = 'block';
});

video.addEventListener('pause', () => {
    bigPlay.classList.add('show');
    const playImg = playPauseBtn.querySelector('.play-icon');
    const resumeImg = playPauseBtn.querySelector('.stop-icon');
    if (playImg) playImg.style.display = 'block';
    if (resumeImg) resumeImg.style.display = 'none';
});

/**
 * Turns total seconds into a clean "Minutes:Seconds" layout (like changing 65 seconds into "1:05")
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Updates the current play time counter on the screen
 */
function updateTime() {
    timeBox.innerHTML = `
        ${formatTime(video.currentTime)}
        /
        ${formatTime(video.duration || 0)}
    `;
}

// Make the colored progress bar grow wider as the video plays forward
video.addEventListener('timeupdate', () => {
    const progressPercent = (video.currentTime / video.duration) * 100;
    progressFilled.style.width = `${progressPercent}%`;
    updateTime();
});

/* --- Timeline Progress Bar Logic (Scrubbing & Fast Forwarding) --- */
let isDragging = false; // Checks if the user is holding down and dragging the progress bar

/**
 * Changes the video time based on where the user clicks or drags on the timeline
 */
function updateProgress(e) {
    const rect = progressContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;

    // Keep the calculation inside the actual boundaries of the progress bar
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percent = x / rect.width;
    video.currentTime = percent * video.duration; // Jump video to the clicked time
    progressFilled.style.width = `${percent * 100}%`; // Update the bar color layout instantly
}

// Start tracking movement when the user clicks down on the timeline bar
progressContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateProgress(e);
});

// Continue tracking if the user drags their mouse across the bar
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateProgress(e);
});

// Stop tracking when the user lifts their finger off the mouse button
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Let users click anywhere on the bar once to instantly jump to that timestamp
progressContainer.addEventListener('click', (e) => {
    if (isDragging) return;
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    video.currentTime = (clickX / width) * video.duration;
});

/* --- Volume and Mute Buttons --- */
// Change the video volume when sliding the input range bar
volumeSlider.addEventListener('input', () => {
    video.volume = volumeSlider.value;
});

// Mute or unmute the video sound and swap the sound icon picture
muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
        muteBtn.innerHTML = '<img src="icon/mute-volume-button.svg" alt="Volume off" class="volume-icon" />';
    } else {
        muteBtn.innerHTML = '<img src="icon/volume-button.svg" alt="Volume" class="volume-icon" />';
    }
});

/* --- Playback Speed Control --- */
// Speed up or slow down the video playback when selecting a option from the dropdown menu
speedControl.addEventListener('change', () => {
    video.playbackRate = speedControl.value;
});

/* --- Fullscreen Feature --- */
// Check if the player is already full screen; if not, open it up completely, or exit back to normal
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.querySelector('.video-container').requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

/* --- Video Hover Previews --- */
// Shows a tiny pop-up preview box with a second video track showing what scene happens where the mouse is pointing
progressContainer.addEventListener('mousemove', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const previewTime = percent * video.duration;

    previewBox.style.display = 'block';
    previewBox.style.left = `${x - 90}px`; // Center the small preview box over the cursor position
    previewVideo.currentTime = previewTime; // Match the preview video time to the mouse position
});

// Hide the preview box when the mouse leaves the timeline area
progressContainer.addEventListener('mouseleave', () => {
    previewBox.style.display = 'none';
});


// ==========================================
//  LIKE SYSTEM ---
// WHAT THIS PART DOES: 
// A simple like counter. Clicking the button adds +1 to the total count
// ==========================================
const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');

if (likeBtn && likeCount) {
    let likes = parseInt(likeCount.textContent.trim()) || 0; // Read the baseline starting number

    likeBtn.addEventListener('click', () => {
        likes++; // Add 1 to likes
        let img = likeBtn.querySelector('.cherry-icon');
        
        // If the cherry image element is missing, make one automatically
        if (!img) {
            img = document.createElement('img');
            img.className = 'cherry-icon';
            img.alt = 'Like';
            img.src = 'icon/cherri-unfilled.svg';
            likeBtn.insertBefore(img, likeBtn.firstChild);
        }
        img.src = 'icon/cherri-filled.svg'; // Change icon to the filled cherry asset
        likeCount.innerText = likes; // Show the new total number on screen
    });
}


// ==========================================
// --- MODULE 5: FOCUS MODE ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const focusBtn = document.getElementById('focusModeBtn');
    const overlay = document.getElementById('focusOverlay') || document.querySelector('.focus-overlay');

    let focused = false; // Tracks if the theater focus mode is active or not
    if (!focusBtn || !videoContainer || !overlay) return; // Exit if elements are missing to prevent console errors

    // Click button to toggle Focus Mode on or off
    focusBtn.addEventListener('click', () => {
        focused ? exitFocus() : enterFocus();
    });

    // Let users click anywhere on the dark background mask to exit focus mode easily
    overlay.addEventListener('click', () => {
        if (focused) exitFocus();
    });

    // Let users press the 'Escape' key on the keyboard to exit focus mode
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && focused) exitFocus();
    });

    // Close focus mode if the window undergoes resizing to prevent display or alignment bugs
    window.addEventListener('resize', () => {
        if (focused) exitFocus();
    });

    /**
     * Zooms the video container up and moves it to the exact center of the screen
     */
    function enterFocus() {
        const rect = videoContainer.getBoundingClientRect(); // Find out exactly where the video box is right now
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Figure out how much to grow the video so it fits nicely on screen without breaking (max sizing limit of 1.6x)
        const scale = Math.min((vw * 0.82) / rect.width, (vh * 0.82) / rect.height, 1.6);
        
        // Calculate the exact travel distance needed to center the player perfectly on screen
        const dx = vw / 2 - (rect.left + rect.width / 2);
        const dy = vh / 2 - (rect.top + rect.height / 2);

        // Apply temporary layout overrides to lift the player above everything else on the screen
        Object.assign(videoContainer.style, {
            position: 'fixed',
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: '0',
            transform: 'translate(0px, 0px) scale(1)',
            transition: 'transform 420ms cubic-bezier(.2,.8,.2,1), box-shadow 420ms ease', // smooth zoom easing animation
            zIndex: '1000',
            willChange: 'transform' // preps browser for a hardware performance boost
        });

        document.body.classList.add('focus-active'); // Add class to body so CSS dims the background elements
        focusBtn.setAttribute('aria-pressed', 'true'); 

        void videoContainer.offsetWidth; // Simple trick that tells the browser to reload layout status so animations don't glitch
        
        // Run the translation move and zoom animation scales
        videoContainer.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        focused = true;
    }

    /**
     * Shrinks the player down and slides it back into its original position on the webpage
     */
    function exitFocus() {
        // Animate the player back to zero displacement and normal size
        videoContainer.style.transform = 'translate(0px, 0px) scale(1)';

        // Wait until the closing movement animation finishes completely before removing styles
        const onEnd = (e) => {
            if (e.propertyName !== 'transform') return; // Make sure we only trigger when the scale movement ends
            videoContainer.removeEventListener('transitionend', onEnd); // Turn off this listener loop

            // Wipe out all the temporary inline styles so it falls back to the original CSS stylesheet properties cleanly
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