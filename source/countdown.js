// Load saved countdowns from localStorage on page load
const savedCountdowns = JSON.parse(localStorage.getItem("countdowns")) || [];
let countdowns = savedCountdowns;

function updateLocalStorage() {
  localStorage.setItem("countdowns", JSON.stringify(countdowns));
}

function startCountdown(endTime, title) {
  const countdownContainer = document.getElementById("countdown-container");
  const countdownCard = document.createElement("div");
  countdownCard.classList.add("countdown-card");
  countdownContainer.appendChild(countdownCard);

  const titleElement = document.createElement("div");
  titleElement.id = "event-title";
  titleElement.textContent = `Event Title: ${title}`;
  countdownCard.appendChild(titleElement);

  const countdownElement = document.createElement("div");
  countdownElement.classList.add("countdown");
  countdownCard.appendChild(countdownElement);

  function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      countdownElement.textContent = "Event Ended!";
    } else {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      countdownElement.textContent = `${days}D ${hours}h ${minutes}min ${seconds}s`;
    }
  }

  // Update the countdown every second
  const timerInterval = setInterval(updateCountdown, 1000);

  // Update it immediately to avoid a one-second delay
  updateCountdown();

  countdowns.push({
    card: countdownCard,
    interval: timerInterval,
    endTime,
    title,
  });

  // Save countdowns to localStorage
  updateLocalStorage();
}

function loadCountdowns() {
  // Load countdowns from localStorage
  const savedCountdowns = JSON.parse(localStorage.getItem("countdowns")) || [];
  countdowns = savedCountdowns;

  // Clear existing countdowns from the page
  const countdownContainer = document.getElementById("countdown-container");
  countdownContainer.innerHTML = "";

  // Start or resume saved countdowns
  countdowns.forEach((countdown) => {
    startCountdown(countdown.endTime, countdown.title);
  });
}

function loadCountdowns() {
  // Clear existing countdowns
  countdowns = [];

  // Load countdowns from localStorage
  const savedCountdowns = JSON.parse(localStorage.getItem("countdowns")) || [];

  // Start or resume saved countdowns
  savedCountdowns.forEach((countdown) => {
    startCountdown(countdown.endTime, countdown.title);
  });
}

function addCountdown() {
  const title = document.getElementById("event-title-input").value;
  const dateTimeInput = document.getElementById("event-time-input").value;
  const endTime = new Date(dateTimeInput).getTime();

  if (!isNaN(endTime)) {
    startCountdown(endTime, title);
    hideAddContainer();
  } else {
    alert("Invalid date & time format. Please use the datetime picker.");
  }
}

function hideAddContainer() {
  const addContainer = document.getElementById("add-container");
  addContainer.style.display = "none";
}

function updateCountdowns() {
  // Update countdowns and check for completed ones
  countdowns.forEach((countdown, index) => {
    const now = new Date().getTime();
    const timeRemaining = countdown.endTime - now;

    if (timeRemaining <= 0) {
      clearInterval(countdown.interval);
      countdown.card.querySelector(".countdown").textContent = "Event Ended!";
      // Remove completed countdowns
      countdowns.splice(index, 1);
      updateLocalStorage();
    } else {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      countdown.card.querySelector(
        ".countdown"
      ).textContent = `${days}D ${hours}h ${minutes}min ${seconds}s`;
    }
  });
  localStorage.setItem("countdowns", JSON.stringify(countdowns));
}

function clearCountdowns() {
  // Clear countdowns from memory and the HTML container
  countdowns.forEach((countdown) => {
    countdown.card.remove();
    clearInterval(countdown.interval);
  });
  countdowns = [];
}

window.addEventListener("load", () => {
  loadCountdowns();
  updateCountdowns();

  // Start a timer to continuously update countdowns
  setInterval(updateCountdowns, 1000);
});

document.getElementById("toggle-add").addEventListener("click", () => {
  const addContainer = document.getElementById("add-container");
  addContainer.style.display = "block";
});
