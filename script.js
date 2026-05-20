/**
 * STICKY NOTE INTERACTION MODULE
 * Feature: Drag-to-create, Drag-to-move, and Delete notes.
 */

const mainStack = document.getElementById('main-stack');
const workspace = document.getElementById('workspace');

// Configuration - Giúp dễ dàng điều chỉnh thông số mà không cần tìm trong code
const NOTE_CONFIG = {
    width: 120,
    height: 120,
    offset: 60 // Căn giữa con trỏ chuột (width/2)
};

// --- CORE FUNCTIONS ---

/**
 * Tạo một thẻ Sticky Note mới với đầy đủ cấu trúc và sự kiện
 */
function createStickyNote(x, y) {
    const note = document.createElement('div');
    note.className = 'sticky-note-dropped';
    note.style.left = `${x - NOTE_CONFIG.offset}px`;
    note.style.top = `${y - NOTE_CONFIG.offset}px`;

    // 1. Vùng nhập liệu (TextArea)
    const textArea = document.createElement('div');
    textArea.className = 'note-text';
    textArea.contentEditable = "true";
    textArea.spellcheck = false;

    // 2. Nút xóa (Close Button)
    const closeBtn = document.createElement('div');
    closeBtn.className = 'note-close';
    closeBtn.innerHTML = '×';
    closeBtn.contentEditable = "false";

    // --- Events bên trong Note ---
    
    // Ngăn chặn việc kéo note khi đang click vào vùng gõ chữ
    textArea.addEventListener('mousedown', (e) => e.stopPropagation());

    // Xử lý xóa note
    closeBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        note.remove();
    });

    // --- Assembly ---
    note.appendChild(textArea);
    note.appendChild(closeBtn);
    workspace.appendChild(note);

    // Tự động focus vào vùng text
    setTimeout(() => textArea.focus(), 0);

    return note;
}

// --- EVENT LISTENERS ---

/**
 * 1. Xử lý "Bóc" note từ Stack (Drag-to-create)
 */
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

/**
 * 2. Xử lý Kéo/Thả các note đã tồn tại
 */
document.addEventListener('mousedown', (e) => {
    // Kiểm tra nếu click vào note hoặc con của note (nhưng không phải vùng text)
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
const btn = document.getElementById('show-script-btn');
const content = document.getElementById('script-content');

btn.addEventListener('click', () => {
  // Ẩn nút bấm
  btn.classList.add('hidden');
  
  // Hiện nội dung script
  content.classList.remove('hidden');
});

const videoContainer =
    document.querySelector('.video-container');

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


/* PLAY / PAUSE */

function togglePlay(){

    if(video.paused){

        video.play();

        playPauseBtn.innerHTML = '❚❚';

        bigPlay.style.display = 'none';

    }else{

        video.pause();

        playPauseBtn.innerHTML = '▶';

        bigPlay.style.display = 'flex';
    }
}

playPauseBtn.addEventListener('click', togglePlay);

bigPlay.addEventListener('click', togglePlay);


/* UPDATE PROGRESS */

video.addEventListener('timeupdate', () => {

    const progressPercent =
        (video.currentTime / video.duration) * 100;

    progressFilled.style.width =
        `${progressPercent}%`;

    updateTime();
});


/* SEEK */

progressContainer.addEventListener('click', (e) => {

    const width = progressContainer.clientWidth;

    const clickX = e.offsetX;

    video.currentTime =
        (clickX / width) * video.duration;
        /* DRAG SEEK */

let isDragging = false;

function updateProgress(e){

    const rect =
        progressContainer.getBoundingClientRect();

    let x = e.clientX - rect.left;

    /* LIMIT */

    if(x < 0) x = 0;

    if(x > rect.width) x = rect.width;

    const percent = x / rect.width;

    /* UPDATE VIDEO */

    video.currentTime =
        percent * video.duration;

    /* UPDATE BAR */

    progressFilled.style.width =
        `${percent * 100}%`;
}


/* MOUSE DOWN */

progressContainer.addEventListener('mousedown', (e) => {

    isDragging = true;

    updateProgress(e);
});


/* MOUSE MOVE */

document.addEventListener('mousemove', (e) => {

    if(!isDragging) return;

    updateProgress(e);
});


/* MOUSE UP */

document.addEventListener('mouseup', () => {

    isDragging = false;
});
        
});


/* VOLUME */

volumeSlider.addEventListener('input', () => {

    video.volume = volumeSlider.value;
});


/* MUTE */

muteBtn.addEventListener('click', () => {

    video.muted = !video.muted;

    if(video.muted){

        muteBtn.innerHTML = '🔇';

    }else{

        muteBtn.innerHTML = '🔊';
    }
});


/* SPEED */

speedControl.addEventListener('change', () => {

    video.playbackRate = speedControl.value;
});


/* FULLSCREEN */

fullscreenBtn.addEventListener('click', () => {

    if(!document.fullscreenElement){

        document.querySelector('.video-container')
            .requestFullscreen();

    }else{

        document.exitFullscreen();
    }
});


/* TIME */

function formatTime(seconds){

    const mins = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTime(){

    timeBox.innerHTML = `
        ${formatTime(video.currentTime)}
        /
        ${formatTime(video.duration || 0)}
    `;
}


/* HOVER PREVIEW */

progressContainer.addEventListener('mousemove', (e) => {

    const rect =
        progressContainer.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const percent = x / rect.width;

    const previewTime =
        percent * video.duration;

    previewBox.style.display = 'block';

    previewBox.style.left = `${x - 90}px`;

    previewVideo.currentTime = previewTime;
});


progressContainer.addEventListener('mouseleave', () => {

    previewBox.style.display = 'none';
});


/* HIDE BIG PLAY */

video.addEventListener('play', () => {

    bigPlay.classList.remove('show');

    playPauseBtn.innerHTML = '❚❚';
});

video.addEventListener('pause', () => {

    bigPlay.classList.add('show');

    playPauseBtn.innerHTML = '▶';
});
/* CLICK VIDEO TO PLAY / PAUSE */

video.addEventListener('click', togglePlay);



 



