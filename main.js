// Constants
const SECONDS_PER_MINUTE = 1;
let WORK_TIME = 25 * SECONDS_PER_MINUTE; // Default: 25 minutes in seconds
let BREAK_TIME = 5 * SECONDS_PER_MINUTE; // Default: 5 minutes in seconds
let workVideoURL = '';
let breakVideoURL = '';

// Variables
let timer;
let isWorking = true; // Indicates whether it's work time or break time

// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const timerContainer = document.querySelector('.timer-container');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const workTimeInput = document.getElementById('work-time-input');
const breakTimeInput = document.getElementById('break-time-input');
const workVideoInput = document.getElementById('work-video-input');
const breakVideoInput = document.getElementById('break-video-input');
const youtubeVideo = document.getElementById('youtube-video');
const bgm = document.getElementById('bgm');

// Functions
function getFormValues() {
    const workTime = workTimeInput.value * SECONDS_PER_MINUTE;
    const breakTime = breakTimeInput.value * SECONDS_PER_MINUTE;
    const workVideo = workVideoInput.value;
    const breakVideo = breakVideoInput.value;

    return {
        workTime: workTime,
        breakTime: breakTime,
        workVideo: workVideo,
        breakVideo: breakVideo
    };
}

function startTimer() {
    const formValues = getFormValues();
    WORK_TIME = formValues.workTime;
    BREAK_TIME = formValues.breakTime;
    workVideoURL = formValues.workVideo;
    breakVideoURL = formValues.breakVideo;
    timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    isWorking = true;
    const formValues = getFormValues();
    WORK_TIME = formValues.workTime;
    BREAK_TIME = formValues.breakTime;
    workVideoURL = formValues.workVideo;
    breakVideoURL = formValues.breakVideo;
    updateTimerDisplay(WORK_TIME);
}

function updateTimer() {
    if (isWorking) {
        WORK_TIME--;
        updateTimerDisplay(WORK_TIME);

        if (WORK_TIME <= 0) {
            isWorking = false;
            playBGM('break');
            youtubeVideo.src = breakVideoURL;
            updateTimerDisplay(BREAK_TIME);
            timerContainer.classList.remove('work');
            timerContainer.classList.add('break');
        }
    } else {
        BREAK_TIME--;
        updateTimerDisplay(BREAK_TIME);

        if (BREAK_TIME <= 0) {
            isWorking = true;
            playBGM('work');
            youtubeVideo.src = workVideoURL;
            updateTimerDisplay(WORK_TIME);
            timerContainer.classList.remove('break');
            timerContainer.classList.add('work');
        }
    }
}

function updateTimerDisplay(time) {
    const minutes = Math.floor(time / SECONDS_PER_MINUTE);
    const seconds = time % SECONDS_PER_MINUTE;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // タイマーの状態に応じて背景色を変更
    if (isWorking) {
        timerContainer.classList.remove('break');
        timerContainer.classList.add('work');
    } else {
        timerContainer.classList.remove('work');
        timerContainer.classList.add('break');
    }
}

function playBGM(type) {
    if (type === 'work') {
        bgm.src = 'work_bgm.mp3'; // Assuming file name for work BGM
    } else {
        bgm.src = 'break_bgm.mp3'; // Assuming file name for break BGM
    }
    bgm.loop = true;
    bgm.play();
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Initial Setup
updateTimerDisplay(WORK_TIME);

// Fetch initial video URLs from inputs
workVideoURL = workVideoInput.value;
breakVideoURL = breakVideoInput.value;
