let currentReceiptBox = null;
let stream = null;

// 📌 각 영수증의 카메라 버튼 클릭 시 카메라 열기
document.querySelectorAll('.capture-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        currentReceiptBox = this.closest('.receipt-box');
        openCamera();
    });
});

// 📌 카메라 열기 함수
async function openCamera() {
    const modal = document.querySelector('.camera-modal');
    const video = document.getElementById('camera-view');

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }, // 후면 카메라 사용
            audio: false
        });
        video.srcObject = stream;
        modal.style.display = 'flex';
    } catch (err) {
        console.error('카메라 접근 오류:', err);
        alert('카메라를 시작할 수 없습니다.');
    }
}

// 📌 촬영 버튼 클릭 시 이미지 캡처
document.getElementById('capture-btn').addEventListener('click', () => {
    const video = document.getElementById('camera-view');
    const canvas = document.getElementById('preview-canvas');
    const context = canvas.getContext('2d');

    // 비디오 원본 비율 계산
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const aspectRatio = videoWidth / videoHeight;

    // 캔버스 크기 조정 (비율 유지)
    const maxWidth = 380;
    const maxHeight = 510;

    if (maxWidth / aspectRatio <= maxHeight) {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
    } else {
        canvas.width = maxHeight * aspectRatio;
        canvas.height = maxHeight;
    }

    // 캔버스에 비디오 화면 캡처
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // UI 변경 (미리보기 활성화)
    document.querySelector('.camera-container').style.display = 'none';
    document.querySelector('.preview-container').style.display = 'block';
});

// 📌 저장 버튼 클릭 시 이미지 저장
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

    // 이미지 요소 생성
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/jpeg');
    img.style.borderRadius = '8px';

    // 타임스탬프 표시
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

    // 기존 내용 제거 후 새로운 이미지 추가
    currentReceiptBox.innerHTML = '';
    currentReceiptBox.appendChild(img);
    currentReceiptBox.appendChild(time);

    // 촬영 버튼 다시 추가
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

// 📌 다시 촬영 버튼 클릭 시
document.getElementById('retake-btn').addEventListener('click', () => {
    document.querySelector('.camera-container').style.display = 'block';
    document.querySelector('.preview-container').style.display = 'none';
});

// 📌 카메라 닫기
document.getElementById('close-camera').addEventListener('click', closeCamera);

// 📌 노트 저장 버튼 이벤트 (버튼 클릭 시 "저장완료" 표시)
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

// 📌 영수증 추가 기능 (동적 추가)
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

    // 새로 추가된 요소에 이벤트 리스너 추가
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

// 📌 카메라 닫기 함수
function closeCamera() {
    const modal = document.querySelector('.camera-modal');
    modal.style.display = 'none';
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    document.querySelector('.camera-container').style.display = 'block';
    document.querySelector('.preview-container').style.display = 'none';
}
