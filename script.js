
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

        muteBtn.innerHTML = '<img src="icon/mute-volume-button.svg" alt="Volume off" class="volume-icon" />';

    }else{

        muteBtn.innerHTML = '<img src="icon/volume-button.svg" alt="Volume" class="volume-icon" />';
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

document.addEventListener('DOMContentLoaded', () => {
  const focusBtn = document.getElementById('focusModeBtn');
  const videoContainer = document.querySelector('.video-container');
  const overlay = document.getElementById('focusOverlay') || document.querySelector('.focus-overlay');

  let focused = false;

  if (!focusBtn || !videoContainer || !overlay) return;

  focusBtn.addEventListener('click', () => {
    focused ? exitFocus() : enterFocus();
  });

  // click overlay to close focus
  overlay.addEventListener('click', () => {
    if (focused) exitFocus();
  });

  /* LIKE SYSTEM */

const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');

// khởi tạo từ nội dung hiện tại nếu có
let likes = parseInt(likeCount?.textContent?.trim()) || 0;

likeBtn.addEventListener('click', () => {
  // tăng like mỗi lần nhấn
  likes++;

  // đảm bảo tồn tại thẻ ảnh (không ghi đè innerHTML)
  let img = likeBtn.querySelector('.cherry-icon');
  if (!img) {
    img = document.createElement('img');
    img.className = 'cherry-icon';
    img.alt = 'Like';
    img.src = 'icon/cherri-unfilled.svg';
    likeBtn.insertBefore(img, likeBtn.firstChild);
  }

  // hiển thị icon filled khi đã like (tuỳ chọn)
  img.src = 'icon/cherri-filled.svg';

  // cập nhật số hiển thị
  if (likeCount) likeCount.innerText = likes;
});

  // exit on escape or resize
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

    // scale to fit ~82% of viewport, but not larger than 1.6x
    const scale = Math.min((vw * 0.82) / rect.width, (vh * 0.82) / rect.height, 1.6);

    // distance to center of viewport
    const dx = vw / 2 - (rect.left + rect.width / 2);
    const dy = vh / 2 - (rect.top + rect.height / 2);

    // pin element to current position using fixed layout so transform animates visually from current spot
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

    // show overlay + dim/blur
    document.body.classList.add('focus-active');
    focusBtn.setAttribute('aria-pressed', 'true');

    // force reflow then apply transform to center + scale
    void videoContainer.offsetWidth;
    videoContainer.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

    focused = true;
  }

  function exitFocus() {
    // animate back to original pinned position (transform -> identity)
    videoContainer.style.transform = 'translate(0px, 0px) scale(1)';

    // after animation ends, remove all inline pinned styles so layout returns to normal flow
    const onEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      videoContainer.removeEventListener('transitionend', onEnd);

      // remove inline styles applied during focus
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




 



