// document.getElementById('startButton').addEventListener('click', startSessionTimer);
// document.getElementById('pauseResumeButton').addEventListener('click', togglePauseResume);
// document.getElementById('finishButton').addEventListener('click', finishApp);


// const setupPage = document.getElementById('setupPage');
// const timerPage = document.getElementById('timerPage');
// const breakPage = document.getElementById('breakPage');
// const sessionTimerDisplay = document.getElementById('timer');
// const breakTimerDisplay = document.getElementById('breakTimer');
// let sessionTime = 1500; // Default to 25 minutes in seconds
// let breakTime = 300; // 5 minutes for break
// let countdown = null;
// let isPaused = false; // Track whether the timer is paused


// function initializePages() {
//     setupPage.style.display = 'block'; // Only setupPage should be visible initially
//     timerPage.style.display = 'none';
//     breakPage.style.display = 'none';
// }

// document.addEventListener('DOMContentLoaded', initializePages);



// function startSessionTimer() {
//     sessionTime = parseInt(document.getElementById('timeInput').value) * 60;
//     if (isNaN(sessionTime)) { // Validate input
//         alert('Please enter a valid number of minutes.');
//         return;
//     }
//     updateTimerDisplay(sessionTimerDisplay, sessionTime);
//     switchToPage(timerPage);

//     countdown = setInterval(() => {
//         sessionTime--;
//         updateTimerDisplay(sessionTimerDisplay, sessionTime);
//         if (sessionTime <= 0) {
//             clearInterval(countdown);
//             startBreakTimer();
//         }
//     }, 1000);
//     document.getElementById('pauseResumeButton').textContent = 'Pause';
//     isPaused = false;
// }

// function startBreakTimer() {
//     updateTimerDisplay(breakTimerDisplay, breakTime);
//     switchToPage(breakPage);

//     countdown = setInterval(() => {
//         breakTime--;
//         updateTimerDisplay(breakTimerDisplay, breakTime);
//         if (breakTime <= 0) {
//             clearInterval(countdown);
//             breakTime = 300; // Reset break time for next loop
//             switchToPage(setupPage);
//         }
//     }, 1000);
// }

// function updateTimerDisplay(displayElement, time) {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     displayElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
// }

// function switchToPage(page) {
//     console.log("Switching to page:", page.id);
//     setupPage.style.display = 'none';
//     timerPage.style.display = 'none';
//     breakPage.style.display = 'none';
//     page.style.display = 'block';
// }

// // Implement togglePauseResume and finishApp as previously described
// function togglePauseResume() {
//     if (!isPaused) {
//         clearInterval(countdown);
//         countdown = null;
//         document.getElementById('pauseResumeButton').textContent = 'Resume';
//         isPaused = true;
//     } else {
//         countdown = setInterval(() => {
//             if (timerPage.style.display === 'block') {
//                 sessionTime--;
//                 updateTimerDisplay(sessionTimerDisplay, sessionTime);
//                 if (sessionTime <= 0) {
//                     clearInterval(countdown);
//                     startBreakTimer();
//                 }
//             } else if (breakPage.style.display === 'block') {
//                 breakTime--;
//                 updateTimerDisplay(breakTimerDisplay, breakTime);
//                 if (breakTime <= 0) {
//                     clearInterval(countdown);
//                     breakTime = 300; // Reset break time for next loop
//                     switchToPage(setupPage);
//                 }
//             }
//         }, 1000);
//         document.getElementById('pauseResumeButton').textContent = 'Pause';
//         isPaused = false;
//     }
// }
// function finishApp() {
//     clearInterval(countdown);
//     timerPage.style.display = 'none';
//     breakPage.style.display = 'none';
//     setupPage.style.display = 'block';
//     document.body.innerHTML = '<h1>Session Finished!</h1>';
//     setTimeout(() => {
//         window.close(); // Close the window or redirect as needed
//     }, 3000);
// }


////// ABOVE IS PRE SYNC W MENUBAR ////////

const { ipcRenderer } = require('electron');

document.getElementById('startButton').addEventListener('click', startSessionTimer);
document.getElementById('pauseResumeButton').addEventListener('click', togglePauseResume);
document.getElementById('finishButton').addEventListener('click', finishApp);

const setupPage = document.getElementById('setupPage');
const timerPage = document.getElementById('timerPage');
const breakPage = document.getElementById('breakPage');
const sessionTimerDisplay = document.getElementById('timer');
const breakTimerDisplay = document.getElementById('breakTimer');
let sessionTime = 1500; // Default to 25 minutes in seconds
let breakTime = 300; // 5 minutes for break
let countdown = null;
let isPaused = false; // Track whether the timer is paused

function initializePages() {
    setupPage.style.display = 'block'; // Only setupPage should be visible initially
    timerPage.style.display = 'none';
    breakPage.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initializePages);

function startSessionTimer() {
    sessionTime = parseInt(document.getElementById('timeInput').value) * 60;
    if (isNaN(sessionTime)) { // Validate input
        alert('Please enter a valid number of minutes.');
        return;
    }
    updateTimerDisplay(sessionTimerDisplay, sessionTime);
    switchToPage(timerPage);

    countdown = setInterval(() => {
        sessionTime--;
        updateTimerDisplay(sessionTimerDisplay, sessionTime);
        if (sessionTime <= 0) {
            clearInterval(countdown);
            startBreakTimer();
        }
    }, 1000);
    document.getElementById('pauseResumeButton').textContent = 'Pause';
    isPaused = false;
}

function startBreakTimer() {
    updateTimerDisplay(breakTimerDisplay, breakTime);
    switchToPage(breakPage);

    countdown = setInterval(() => {
        breakTime--;
        updateTimerDisplay(breakTimerDisplay, breakTime);
        if (breakTime <= 0) {
            clearInterval(countdown);
            breakTime = 300; // Reset break time for next loop
            switchToPage(setupPage);
        }
    }, 1000);
}

function updateTimerDisplay(displayElement, time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayElement.textContent = formattedTime;

    // Send the formatted time to the main process
    ipcRenderer.send('update-timer', formattedTime);
}

function switchToPage(page) {
    console.log("Switching to page:", page.id);
    setupPage.style.display = 'none';
    timerPage.style.display = 'none';
    breakPage.style.display = 'none';
    page.style.display = 'block';
}

function togglePauseResume() {
    if (!isPaused) {
        clearInterval(countdown);
        countdown = null;
        document.getElementById('pauseResumeButton').textContent = 'Resume';
        isPaused = true;
    } else {
        countdown = setInterval(() => {
            if (timerPage.style.display === 'block') {
                sessionTime--;
                updateTimerDisplay(sessionTimerDisplay, sessionTime);
                if (sessionTime <= 0) {
                    clearInterval(countdown);
                    startBreakTimer();
                }
            } else if (breakPage.style.display === 'block') {
                breakTime--;
                updateTimerDisplay(breakTimerDisplay, breakTime);
                if (breakTime <= 0) {
                    clearInterval(countdown);
                    breakTime = 300; // Reset break time for next loop
                    switchToPage(setupPage);
                }
            }
        }, 1000);
        document.getElementById('pauseResumeButton').textContent = 'Pause';
        isPaused = false;
    }
}

function finishApp() {
    clearInterval(countdown);
    timerPage.style.display = 'none';
    breakPage.style.display = 'none';
    setupPage.style.display = 'block';
    document.body.innerHTML = '<h1>Session Finished!</h1>';
    setTimeout(() => {
        window.close(); // Close the window or redirect as needed
    }, 3000);
}
