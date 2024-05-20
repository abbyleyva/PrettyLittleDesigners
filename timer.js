const { ipcRenderer } = require('electron');

document.querySelector('.start-button').addEventListener('click', startSessionTimer);

let sessionTime = 30 * 60; // 30 minutes in seconds for work period
let breakTime = 5 * 60; // 5 minutes in seconds for break period
let isPaused = false;
let endTime = null;
let countdown = null;
let currentState = 'work'; // Possible states: 'work', 'break'

const FULL_DASH_ARRAY = 691; // Full length of the dash array for the circle
const progressRing = document.querySelector('.progress-ring__circle.progress');

function startSessionTimer() {
    if (countdown !== null) {
        cancelAnimationFrame(countdown);
    }

    if (currentState === 'work') {
        sessionTime = 30 * 60; // Reset to 30 minutes
    } else if (currentState === 'break') {
        sessionTime = breakTime; // Reset to 5 minutes
    }

    endTime = Date.now() + sessionTime * 1000;
    updateTimerDisplay(sessionTime);
    runTimer();
    isPaused = false;
}

function runTimer() {
    const now = Date.now();
    const remainingTime = Math.max(0, Math.round((endTime - now) / 1000));
    updateTimerDisplay(remainingTime);

    if (remainingTime > 0) {
        countdown = requestAnimationFrame(runTimer);
    } else {
        cancelAnimationFrame(countdown);
        if (currentState === 'work') {
            console.log('Work period ended, starting break period');
            currentState = 'break';
            startSessionTimer();
        } else if (currentState === 'break') {
            console.log('Break period ended, starting work period');
            currentState = 'work';
            startSessionTimer();
        }
    }
}

function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById(currentState === 'work' ? 'workTime' : 'breakTime').textContent = formattedTime;

    // Update the progress ring
    updateProgressRing(time);

    // Debugging log
    console.log(`Updating timer display: ${formattedTime}`);

    // Send the formatted time to the main process
    ipcRenderer.send('update-timer', formattedTime);
}

function updateProgressRing(time) {
    const totalTime = currentState === 'work' ? sessionTime : breakTime; // Total time in seconds
    const progress = time / totalTime;
    const dashOffset = FULL_DASH_ARRAY * progress;

    progressRing.style.strokeDashoffset = dashOffset;

    // Debugging log
    console.log(`Updating progress ring: ${dashOffset}`);
}

function togglePauseResume() {
    if (!isPaused) {
        cancelAnimationFrame(countdown);
        document.querySelector('.start-button').textContent = 'Resume';
        isPaused = true;
    } else {
        endTime = Date.now() + sessionTime * 1000;
        runTimer();
        document.querySelector('.start-button').textContent = 'Pause';
        isPaused = false;
    }
}

function finishApp() {
    cancelAnimationFrame(countdown);
    document.body.innerHTML = '<h1>Session Finished!</h1>';
    setTimeout(() => {
        window.close(); // Close the window or redirect as needed
    }, 3000);
}
