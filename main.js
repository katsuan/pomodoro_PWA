// main.js
const SECONDS_PER_MINUTE = 1;
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
    sendPushNotification(status)
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


// Service Workerの登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function (err) {
            console.error('Service Worker registration failed:', err);
        });
}

// プッシュ通知の許可
Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});

// ステータスが変わるタイミングでプッシュ通知を送信
function sendPushNotification(status) {
    console.log(status);
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification('ポモドーロタイマー', {
                body: 'ステータスが ' + status + ' に変わりました！',
                icon: 'icon.png'
            });
        });
    }
}

