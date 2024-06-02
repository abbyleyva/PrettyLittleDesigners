const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector(".start-button");
  const pauseButton = document.querySelector(".pause-button");
  const finishBreakButton = document.querySelector(".finish-break-button");
  const endSessionButton = document.querySelector(".end-session-button");
  const finishButton = document.querySelector(".finish-button");
  const addTimeButton = document.querySelector(".add-time-button"); // Select the +5 button ADDED TODAYS
  const flowButton = document.querySelector(".flow-button");
  const stopFlowButton = document.querySelector(".stop-flow-button");

  startButton.addEventListener("click", () => startSessionTimer(false)); // Starting work session
  finishButton.addEventListener("click", () => startSessionTimer(true)); // acts as if break NO
  finishBreakButton.addEventListener("click", () => startSessionTimer(false)); // Starting work session
  pauseButton.addEventListener("click", togglePauseResume);
  endSessionButton.addEventListener("click", finishApp);
  addTimeButton.addEventListener("click", addFiveMinutes); // Add event listener for +5 button ADDED TODAYS
  flowButton.addEventListener("click", showFlowView);
  stopFlowButton.addEventListener("click", finishApp);

  initializeProgressRing();
  updateProgressRing();
});

let countdown = null;
let isPaused = false;
let endTime = null;
let currentState = "work"; // 'work' or 'break'
let receivedData = null; // Store received data
const FULL_DASH_ARRAY = 691;
const progressRing = document.querySelector(".progress-ring__circle.progress");

function startSessionTimer(isBreak) {
  resetTimer();
  currentState = isBreak ? "break" : "work";
  console.log(`Starting session: ${currentState}`);
  updateViewForState(currentState);
  updateImageForState(currentState);

  const timeInput = document.getElementById(currentState + "TimeInput").value;
  endTime = Date.now() + parseInt(timeInput) * 60 * 1000;
  console.log(`End time set to: ${new Date(endTime).toISOString()}`); // Debugging log

  document.querySelector(".initial-view").style.display = "none";
  document.querySelector(".running-view").style.display = "flex";
  document.querySelector(".congratulatory-view").style.display = "none";
  document.querySelector(".finish-break-view").style.display = "none";

  runTimer();
}

function updateViewForState(state) {
  const flowButton = document.querySelector(".flow-button");
  const addButton = document.querySelector(".add-time-button");
  const pauseButton = document.querySelector(".pause-button");
  const finishBreakButton = document.querySelector(".finish-break-button");
  const endSessionButton = document.querySelector(".end-session-button");

  if (state === "work") {
    flowButton.style.display = "inline-block";
    addButton.style.display = "inline-block";
    pauseButton.style.display = "inline-block";
    pauseButton.textContent = "PAUSE";
    finishBreakButton.style.display = "none";
    endSessionButton.style.display = "inline-block";
  } else if (state === "break") {
    flowButton.style.display = "none";
    addButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    pauseButton.textContent = "SKIP BREAK";
    finishBreakButton.style.display = "inline-block";
    endSessionButton.style.display = "none";
  }
}

function updateImageForState(state, customImage = null) {
  const imageElement = document.getElementById("centralImage");
  if (customImage) {
    imageElement.src = customImage; // Use custom image if provided
  } else if (state === "break") {
    imageElement.src = "bloomie-rest.png"; // Specify the image for break sessions
  } else {
    imageElement.src = "bloomie.png"; // Specify the image for work sessions
  }
}

function runTimer() {
  const secondsLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
  console.log(`Seconds left: ${secondsLeft}, Current state: ${currentState}`); // Debugging log

  if (secondsLeft > 0) {
    updateTimerDisplay(secondsLeft);
    countdown = requestAnimationFrame(runTimer);
  } else if (secondsLeft === 0) {
    console.log(`Timer reached 0: currentState = ${currentState}`); // Debugging log
    updateTimerDisplay(secondsLeft);
    if (currentState === "work") {
      showCongratulatoryScreen();
      ipcRenderer.send("work-break-trans");
    }
    if (currentState === "break") {
      showFinishBreakScreen();
      ipcRenderer.send("break-work-trans");
      // if (receivedData == 48) { // Check the stored received data
      //   console.log("Break time is up and data is 48, changing image and sending phone-lift.");
      //   updateImageForState("work", "bloomie-mad.png");
      //   ipcRenderer.send("phone-lift");
      // } 
      // if (receivedData == 49) {
      //   showFinishBreakScreen();
      //   ipcRenderer.send("break-work-trans");
      // } else {
      //   showFinishBreakScreen();
      //   ipcRenderer.send("break-work-trans");
      // }
    }
  }
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  document.getElementById("timeRemaining").textContent = formattedTime;
  updateProgressRing(seconds);
  ipcRenderer.send("update-timer", formattedTime); // Send formatted time to main process
}

function togglePauseResume() {
  const pauseButton = document.querySelector(".pause-button");

  if (currentState === "break") {
    showFinishBreakScreen();
  } else {
    if (isPaused) {
      // Resume timer
      endTime = Date.now() + remainingTime;
      runTimer();
      pauseButton.textContent = "PAUSE";
      isPaused = false;
    } else {
      // Pause timer
      remainingTime = endTime - Date.now();
      cancelAnimationFrame(countdown);
      pauseButton.textContent = "RESUME";
      isPaused = true;
    }
  }
}

function showCongratulatoryScreen() {
  cancelAnimationFrame(countdown);
  const imageElement = document.getElementById("centralImage");
  imageElement.src = "bloomie-celebrate.png"; // Adjust the image path as needed
  document.querySelector(".running-view").style.display = "none";
  document.querySelector(".congratulatory-view").style.display = "flex"; // Ensure you have this view setup in HTML
}

function showFinishBreakScreen() {
  cancelAnimationFrame(countdown);
  const imageElement = document.getElementById("centralImage");
  imageElement.src = "bloomie-rest.png"; // Adjust the image path as needed
  document.querySelector(".running-view").style.display = "none";
  document.querySelector(".finish-break-view").style.display = "flex"; // Ensure you have this view setup in HTML

  // Reset the progress ring to fully close it
  const progressRing = document.querySelector(".progress-ring__circle.progress");
  const circumference = progressRing.r.baseVal.value * 2 * Math.PI;
  progressRing.style.strokeDashoffset = 0; // Fully closes the ring
}

function showFlowView() {
  cancelAnimationFrame(countdown);
  const imageElement = document.getElementById("centralImage");
  imageElement.src = "bloomie-flow.png"; // Adjust the image path as needed
  document.querySelector(".running-view").style.display = "none";
  document.querySelector(".flow-view").style.display = "flex";
  document.querySelector(".progress-ring").style.display = "none";
}

function finishApp() {
  currentState = "work"; // IS THIS NEEDED?
  cancelAnimationFrame(countdown); // Stop the countdown
  // Update UI to show the initial view and hide others
  document.querySelector(".initial-view").style.display = "flex"; // Show the initial view
  document.querySelector(".running-view").style.display = "none"; // Hide the running view
  document.querySelector(".congratulatory-view").style.display = "none"; // Hide the congratulatory view
  document.querySelector(".flow-view").style.display = "none"; // Hide the flow view
  document.querySelector(".progress-ring").style.display = "flex";
  // Optionally reset inputs or other UI elements to their default states
  document.getElementById("workTimeInput").value = 30; // Default work time
  document.getElementById("breakTimeInput").value = 5; // Default break time
  initializeProgressRing();
  // resetTimer() MAYBE IF WE IMPROVE THIS FUNCTION
  // If using images, reset image to initial state if needed
  const imageElement = document.getElementById("centralImage");
  if (imageElement) {
    imageElement.src = "bloomie.png"; // Assuming 'bloomie-work.png' is the initial image
  }

  // Reset the menubar timer to the initial state
  ipcRenderer.send("reset-menubar"); // Send reset message to the main process
}

function resetTimer() {
  if (countdown) {
    cancelAnimationFrame(countdown);
  }
  const imageElement = document.getElementById("centralImage");
  imageElement.src = "bloomie.png";
}

/// NEW FUNCTIONS BELOW

function initializeProgressRing() {
  const progressRing = document.querySelector(".progress-ring__circle.progress");
  const circumference = progressRing.r.baseVal.value * 2 * Math.PI;
  progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
  progressRing.style.strokeDashoffset = circumference; // Full grey
}

function updateProgressRing(remainingTime) {
  const totalTime = parseInt(document.getElementById(currentState + "TimeInput").value) * 60;
  const progressRing = document.querySelector(".progress-ring__circle.progress");
  const circumference = progressRing.r.baseVal.value * 2 * Math.PI;
  const progress = (totalTime - remainingTime) / totalTime;
  const offset = circumference - progress * circumference;
  progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
  progressRing.style.strokeDashoffset = offset;
}

// need to work on: 

//  NOTES: before you run the command, your phone needs to be on the button! Don't use pause button when demonstrating phone
ipcRenderer.on('Received data', (event, data) => {
  console.log(data); // 123
  console.log(isPaused); // 123
  console.log(currentState);
  receivedData = data; // Store received data
  const secondsLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
  if (currentState === "work") {
    if (data == 48 && !isPaused) {
      updateImageForState(currentState, "bloomie-sad.png");
      togglePauseResume();
      ipcRenderer.send("phone-lift");
    }
    if (data == 49 && isPaused) {
      updateImageForState(currentState);
      togglePauseResume();
    }
  } 
  // if (currentState === "break" && secondsLeft === 0) {
  //   if (data == 48) {
  //     // This condition will be triggered in runTimer when the break time is up
  //     console.log("Break is over and data is 48, changing image and sending phone-lift.");
  //     updateImageForState("work", "bloomie-mad.png");
  //     ipcRenderer.send("phone-lift");
  //   }
  // }
});




//maybe say not fully functional yet! proof of concept :) 
// function addFiveMinutes() {
//   endTime += 5 * 60 * 1000; // Add 5 minutes to the endTime
//   const secondsLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
//   initializeProgressRing(); // Reinitialize the progress ring
//   updateProgressRing(secondsLeft); // Update the progress ring with the new time
//   updateTimerDisplay(secondsLeft); // Update the timer display with the new time
// }
