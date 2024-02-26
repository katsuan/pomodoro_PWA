// main.js
const SECONDS_PER_MINUTE = 60;
let workTime = 25 * SECONDS_PER_MINUTE;
let breakTime = 5 * SECONDS_PER_MINUTE;
let restTime = 15 * SECONDS_PER_MINUTE;
let repeatCount = 4;
let currentTime;
let timerInterval;
let isWorking = true;
let currentRepeat = 0;
let isTimerRunning = false;
let pausedTime = 0;
let notification = true;

document.getElementById('resetButton').style.display = 'none';

function startStopTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        document.getElementById('startStopButton').innerText = 'Start';
        isTimerRunning = false;
        pausedTime = currentTime;
    } else {
        if (pausedTime > 0) {
            currentTime = pausedTime;
            pausedTime = 0;
        } else {
            startTimer();
            if (isWorking && currentRepeat === 0) {
                updateStatusText();
            }
        }
        document.getElementById('startStopButton').style.display = 'none';
        isTimerRunning = true;
    }
}

function startTimer() {
    if (isWorking) {
        currentTime = workTime;
        setStatus('working');
        if (currentRepeat === 0) {
            updateStatusText();
        }
        currentRepeat++;
    } else {
        if (currentRepeat % repeatCount === 0) {
            currentTime = restTime;
            setStatus('rest');
        } else {
            currentTime = breakTime;
            setStatus('break');
        }
    }

    updateStatusText();
    timerInterval = setInterval(updateTime, 1000);
    document.getElementById('resetButton').style.display = 'inline';
}

function updateTime() {
    let minutes = Math.floor(currentTime / SECONDS_PER_MINUTE);
    let seconds = currentTime % SECONDS_PER_MINUTE;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.getElementById("time").innerText = minutes + ":" + seconds;

    if (currentTime <= 0) {
        clearInterval(timerInterval);
        isWorking = !isWorking;
        startTimer();
    } else {
        currentTime--;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    let minutes = Math.floor(workTime / SECONDS_PER_MINUTE);
    let seconds = workTime % SECONDS_PER_MINUTE;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.getElementById("time").innerText = minutes + ":" + seconds;
    document.getElementById('startStopButton').innerText = 'Start';
    document.getElementById('startStopButton').style.display = '';
    isTimerRunning = false;
    pausedTime = 0;
    document.getElementById('resetButton').style.display = 'none';
    currentRepeat = 0;
    updateStatusText();
}

function setStatus(status) {
    const statusElement = document.querySelector('.status');
    statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.className = 'status ' + status;

    let statusMessage;
    let notificationMessage;

    // ステータスに応じたメッセージの準備
    switch (status) {
        case 'working':
            statusMessage = 'Work';
            notificationMessage = '開始時間です！';
            break;
        case 'break':
            statusMessage = 'Break';
            notificationMessage = '少し休憩しましょう';
            break;
        case 'rest':
            statusMessage = 'Rest';
            notificationMessage = 'おつかれさまでした！';
            break;
        default:
            statusMessage = status;
            notificationMessage = '';
    }

    statusElement.textContent = statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1);
    statusElement.className = 'status ' + status;

    // 通知の送信
    sendNotification(notificationMessage);
}

function updateStatusText() {
    const statusText = document.querySelector('.status-text');
    if (isWorking) {
        statusText.textContent = "(" + currentRepeat + "/" + repeatCount + ")";
    } else {
        if (currentRepeat === repeatCount) {
            statusText.textContent = "(" + repeatCount + "/" + repeatCount + ")";
        } else {
            statusText.textContent = "(" + currentRepeat + "/" + repeatCount + ")";
        }
    }
}

document.getElementById('workTime').addEventListener('change', function () {
    workTime = parseInt(this.value) * SECONDS_PER_MINUTE;
});

document.getElementById('breakTime').addEventListener('change', function () {
    breakTime = parseInt(this.value) * SECONDS_PER_MINUTE;
});

document.getElementById('restTime').addEventListener('change', function () {
    restTime = parseInt(this.value) * SECONDS_PER_MINUTE;
});

document.getElementById('repeatCount').addEventListener('change', function () {
    repeatCount = parseInt(this.value);
    updateStatusText();
});

// 通知を送信する関数
function sendNotification(message) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('ポモドーロタイマー', {
                body: message,
                icon: 'path/to/icon.png'
            });
        });
    } else {
        console.warn('Notification permission is not granted.');
    }
}

