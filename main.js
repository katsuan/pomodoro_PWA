// main.js
const SECONDS_PER_MINUTE = 1;
let workTime = 25;
let breakTime = 5;
let longBreakTime = 15;
let repeatCount = 4;
let currentTime;
let timerInterval;
let isWorking = true;
let currentRepeat = 0;
let isTimerRunning = false;
let pausedTime = 0;

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
        }
        document.getElementById('startStopButton').innerText = 'Stop';
        isTimerRunning = true;
    }
}

function startTimer() {
    if (isWorking) {
        currentTime = workTime * SECONDS_PER_MINUTE;
        setStatus('working');
    } else {
        if (currentRepeat === repeatCount - 1) {
            // 最後の繰り返しの場合
            currentTime = longBreakTime * SECONDS_PER_MINUTE;
            setStatus('long-break');
            currentRepeat = 0;
        } else {
            currentTime = breakTime * SECONDS_PER_MINUTE;
            setStatus('break');
            currentRepeat++;
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
    let minutes = Math.floor(workTime);
    let seconds = Math.floor((workTime - minutes) * 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    document.getElementById("time").innerText = minutes + ":" + seconds;
    document.getElementById('startStopButton').innerText = 'Start';
    isTimerRunning = false;
    pausedTime = 0;
    document.getElementById('resetButton').style.display = 'none';
}

function setStatus(status) {
    const statusElement = document.querySelector('.status');
    statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.className = 'status ' + status;
}

function updateStatusText() {
    const statusText = document.querySelector('.status-text');
    statusText.textContent = "(" + (currentRepeat + 1) + "/" + repeatCount + ")";
}

document.getElementById('workTime').addEventListener('change', function () {
    workTime = parseInt(this.value);
});

document.getElementById('breakTime').addEventListener('change', function () {
    breakTime = parseInt(this.value);
});

document.getElementById('longBreakTime').addEventListener('change', function () {
    longBreakTime = parseInt(this.value);
});

document.getElementById('repeatCount').addEventListener('change', function () {
    repeatCount = parseInt(this.value);
});
