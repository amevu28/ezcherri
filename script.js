document.addEventListener('DOMContentLoaded', () => {
    const stack = document.getElementById('main-stack');
    const noteDisplay = document.getElementById('top-note-content');
    
    // Giả sử ta có một danh sách các ghi chú
    let notes = ["Prepare paper", "Fold edges", "Add pin"];
    let currentStep = 0;

    stack.addEventListener('click', () => {
        // Chuyển sang note tiếp theo khi click
        currentStep = (currentStep + 1) % notes.length;
        
        // Hiệu ứng "bay" nhẹ khi đổi note
        noteDisplay.style.transform = "scale(0.95)";
        
        setTimeout(() => {
            noteDisplay.textContent = notes[currentStep];
            noteDisplay.style.transform = "scale(1)";
        }, 100);
    });
});