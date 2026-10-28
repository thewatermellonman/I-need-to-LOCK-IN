const button = document.getElementById("closeinspo");
const screen = document.querySelector(".screen");
const target = document.querySelector(".inspocont");

button.addEventListener("click", () => {
    screen.style.display = "none";
    target.style.display = "none";
});


const addActivityButton = document.getElementById("addActivity");
const activityList = document.getElementById("activityList");

const currentActivityDisplay = document.getElementById("currentActivity");
const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

let activities = [];
let currentActivityIndex = 0;
let timeLeft = 0;
let timerInterval = null;
let isPaused = false;

function getActivities() {
    const activityCards = activityList.querySelectorAll(".activity-card");
    const taskList = [];

    activityCards.forEach(function(card) {
        const nameInput = card.querySelector(".activity-name");
        const timeInput = card.querySelector(".activity-time");

        const name = nameInput.value.trim();
        const minutes = Number(timeInput.value);

        if (name !== "" && minutes > 0) {
            taskList.push({
                name: name,
                duration: minutes * 60
            });
        }
    });

    return taskList;
}

addActivityButton.addEventListener("click", function() {
    const activityDiv = document.createElement("div");
    activityDiv.classList.add("activity-card");

    const activityInput = document.createElement("input");
    activityInput.type = "text";
    activityInput.placeholder = "What are you working on?";
    activityInput.classList.add("activity-name");

    activityDiv.appendChild(activityInput);

    const timeInput = document.createElement("input");
    timeInput.type = "number";
    timeInput.placeholder = "Minutes";
    timeInput.min = 1;
    timeInput.classList.add("activity-time");

    activityDiv.appendChild(timeInput);

    activityList.appendChild(activityDiv);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.type = "button";
    deleteButton.classList.add("delete-activity");

    deleteButton.addEventListener("click", function() {
        activityDiv.remove();
    });

    activityDiv.appendChild(deleteButton);
})

function startSession() {
    if (isPaused) {
        isPaused = false;
        startActivityTimer();
        return;
    }

    activities = getActivities();

    if (activities.length === 0) {
        currentActivityDisplay.textContent = "ADD AN ACTIVITY FIRST!"
        return;
    }

    currentActivityIndex = 0
    timeLeft = activities[0].duration;
    currentActivityDisplay.textContent = activities[0].name;

    updateTimerDisplay();
    startActivityTimer();
}

function startActivity() {
    clearInterval(timerInterval);

    const activity = activities[currentActivityIndex];

    timeLeft = activity.duration;
    currentActivityDisplay.textContent = activity.name;

    updateTimerDisplay();
    startActivityTimer();
}

function startActivityTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();

        if(timeLeft <= 0) {
            clearInterval(timerInterval);

            currentActivityIndex++;

            if (currentActivityIndex >= activities.length) {
                currentActivityIndex = 0;
            }

            startActivity();
        }
    }, 1000);
}

function updateTimerDisplay() {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;

                timerDisplay.textContent =
                    String(minutes).padStart(2, "0") + ":" +
                    String(seconds).padStart(2, "0");
            }

startButton.addEventListener("click", startSession);
pauseButton.addEventListener("click", function() {
    clearInterval(timerInterval);
    isPaused = true;
});

stopButton.addEventListener("click", function() {
    clearInterval(timerInterval);

    timeLeft = 0;
    currentActivityIndex = 0;
    isPaused = false;

    timerDisplay.textContent = "00:00";
    currentActivityDisplay.textContent = "READY TO LOCK IN?";
});