
let currentReceiptBox = null;
let stream = null;

document.querySelectorAll('.capture-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        currentReceiptBox = this.closest('.receipt-box');
        openCamera();
    });
});

async function openCamera() {
    const modal = document.querySelector('.camera-modal');
    const video = document.getElementById('camera-view');

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
        });
        video.srcObject = stream;
        modal.style.display = 'flex';
    } catch (err) {
        console.error('카메라 접근 오류:', err);
        alert('카메라를 시작할 수 없습니다.');
    }
}

document.getElementById('capture-btn').addEventListener('click', () => {
    const video = document.getElementById('camera-view');
    const canvas = document.getElementById('preview-canvas');
    const context = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 230;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    document.querySelector('.camera-container').style.display = 'none';
    document.querySelector('.preview-container').style.display = 'block';
});

document.getElementById('save-btn').addEventListener('click', () => {
    const canvas = document.getElementById('preview-canvas');
    const timestamp = new Date().toLocaleString('ko-KR', {
          year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(' ', ''); 

    // Create image and timestamp elements
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/jpeg');
    img.style.borderRadius = '8px';

    const time = document.createElement('div');
    time.textContent = timestamp;
    time.style.position = 'absolute';
    time.style.bottom = '10px';
    time.style.left = '15px';
    time.style.color = 'white';
    time.style.fontSize = '10px';
    time.style.background = 'rgba(0,0,0,0.5)';
    time.style.padding = '9px 10px';
    time.style.borderRadius = '4px';
    time.style.display = 'flex';
    time.style.alignItems = 'center';

    // Clear and update receipt box
    currentReceiptBox.innerHTML = '';
    currentReceiptBox.appendChild(img);
    currentReceiptBox.appendChild(time);

    // Add capture button back
    const captureBtn = document.createElement('button');
    captureBtn.className = 'capture-btn';
    captureBtn.innerHTML = '<i class="bi bi-camera"></i>';
    captureBtn.addEventListener('click', function() {
        currentReceiptBox = this.closest('.receipt-box');
        openCamera();
    });
    currentReceiptBox.appendChild(captureBtn);

    closeCamera();
});

document.getElementById('retake-btn').addEventListener('click', () => {
    document.querySelector('.camera-container').style.display = 'block';
    document.querySelector('.preview-container').style.display = 'none';
});

document.getElementById('close-camera').addEventListener('click', closeCamera);

document.querySelectorAll('.save-note-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const noteArea = this.previousElementSibling;
        if (noteArea.value.trim()) {
            this.textContent = '저장완료';
            setTimeout(() => {
                this.textContent = '저장';
            }, 2000);
        }
    });
});

// Add receipt container function
function createReceiptContainer() {
    const container = document.createElement('div');
    container.className = 'receipt-container';
    container.innerHTML = `
        <div class="receipt-box" data-index="${document.querySelectorAll('.receipt-container').length + 1}">
            <button class="capture-btn"><i class="bi bi-camera"></i></button>
        </div>
        <div class="note-wrapper">
            <textarea class="note-area" placeholder="노트를 입력하세요"></textarea>
            <button class="save-note-btn btn btn-primary btn-contract">저장</button>
        </div>
    `;

    // Add event listeners to new elements
    container.querySelector('.capture-btn').addEventListener('click', function() {
        currentReceiptBox = this.closest('.receipt-box');
        openCamera();
    });

    container.querySelector('.save-note-btn').addEventListener('click', function() {
        const noteArea = this.previousElementSibling;
        if (noteArea.value.trim()) {
            this.textContent = '저장완료';
            setTimeout(() => {
                this.textContent = '저장';
            }, 2000);
        }
    });

    document.querySelector('.receipts-grid').appendChild(container);
}

function closeCamera() {
    const modal = document.querySelector('.camera-modal');
    modal.style.display = 'none';
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    document.querySelector('.camera-container').style.display = 'block';
    document.querySelector('.preview-container').style.display = 'none';
}
