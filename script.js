// 1. Goal Tracking Section
const goalCardsContainer = document.getElementById("goal-cards-container");
const addCardButton = document.getElementById("add-card-btn");

function createGoalCard() {
  const card = document.createElement("div");
  card.classList.add("goal-card");

  card.innerHTML = `
    <input type="text" class="task-input" placeholder="Enter task/goal">
    <div class="word-goal">
      <label>Word Goal:</label>
      <input type="number" class="word-input" placeholder="e.g., 1000">
    </div>
    <div class="words-written">
      <label>Words Written:</label>
      <input type="number" class="word-input" placeholder="e.g., 200">
    </div>
    <button class="update-progress-btn">Update Progress</button>
    <div class="progress-chart">
      <canvas width="100" height="100"></canvas>
      <span class="progress-percentage">0%</span>
    </div>
  `;

  const updateButton = card.querySelector(".update-progress-btn");
  updateButton.addEventListener("click", () => updateProgress(card));

  goalCardsContainer.appendChild(card);
}


function updateProgress(card) {
  const wordGoal = parseInt(card.querySelector(".word-goal .word-input").value) || 0;
  const wordsWritten = parseInt(card.querySelector(".words-written .word-input").value) || 0;

  if (wordGoal === 0) {
    alert("Please enter a valid word goal.");
    return;
  }

  const progress = Math.min((wordsWritten / wordGoal) * 100, 100);
  const canvas = card.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;

  // Clear and redraw pie chart
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background circle
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#e0e0e0";
  ctx.fill();

  // Progress arc
  ctx.beginPath();
  ctx.moveTo(radius, radius);
  ctx.arc(radius, radius, radius - 10, -Math.PI / 2, (2 * Math.PI * progress) / 100 - Math.PI / 2);
  ctx.lineTo(radius, radius);
  ctx.fillStyle = "#ffa31a";
  ctx.fill();

  // Update percentage text
  const percentageElement = card.querySelector(".progress-percentage");
  percentageElement.textContent = `${Math.round(progress)}%`;
}


// Initialize with 3 default cards
for (let i = 0; i < 4; i++) {
  createGoalCard();
}

// Add new card on button click
addCardButton.addEventListener("click", createGoalCard);

// 2. Calendar Planner Section
const calendar = document.getElementById("calendar");

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function renderMonthCalendar(year, month) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  calendar.innerHTML = ""; // Clear previous calendar content

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Month Header
  const monthHeader = document.createElement("h3");
  monthHeader.textContent = `${months[month]} ${year}`;
  calendar.appendChild(monthHeader);

  // Days of the Week Header
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysRow = document.createElement("div");
  daysRow.classList.add("days-row");
  daysOfWeek.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    dayHeader.textContent = day;
    daysRow.appendChild(dayHeader);
  });
  calendar.appendChild(daysRow);

  // Days in Month
  const daysGrid = document.createElement("div");
  daysGrid.classList.add("days-grid");
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptySlot = document.createElement("div");
    emptySlot.classList.add("empty-slot");
    daysGrid.appendChild(emptySlot);
  }

  // Add day numbers
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.textContent = day;

    // Check if the day is today
    if (year === currentYear && month === currentMonth && day === currentDate) {
      dayElement.classList.add("current-day");
    } else if (year < currentYear || (year === currentYear && (month < currentMonth || (month === currentMonth && day < currentDate)))) {
      // Strike diagonally for past days
      dayElement.classList.add("past-day");
    }

    // Create popup for options
    const popup = document.createElement("div");
    popup.classList.add("day-popup");

    // Add text to display plan or "No plans for today"
    const planText = document.createElement("div");
    planText.textContent = "!! OOPS No plans for today !!";
    popup.appendChild(planText);

    // Add options
    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    const completeButton = document.createElement("button");
    completeButton.textContent = "Completed";

    // Append buttons to popup
    popup.append(addButton, deleteButton, editButton, completeButton);
    dayElement.appendChild(popup);

    // Event Listeners
    addButton.addEventListener("click", () => {
      const event = prompt(`Add a plan for ${months[month]} ${day}, ${year}:`);
      if (event) {
        dayElement.dataset.plan = event;
        dayElement.classList.add("has-plan"); // Add "has-plan" class
        planText.textContent = `Plan: ${event}`;
      }
    });

    deleteButton.addEventListener("click", () => {
      if(dayElement.dataset.plan){
      delete dayElement.dataset.plan;
      dayElement.classList.remove("has-plan"); // Remove "has-plan" class
      planText.textContent = "No plans for today";
      }
      else{
        alert("Please Enter a Plan First!")
      }
    });

    editButton.addEventListener("click", () => {
      if (dayElement.dataset.plan) {
        const newEvent = prompt(`Edit your plan for ${months[month]} ${day}, ${year}:`, dayElement.dataset.plan);
        if (newEvent) {
          dayElement.dataset.plan = newEvent;
          dayElement.classList.add("has-plan"); // Ensure "has-plan" class is added
          planText.textContent = `Plan: ${newEvent}`;
        }
      } else {
        alert("No plan exists for this day to edit!");
      }
    });
    

    
    completeButton.addEventListener("click", () => {
      if (dayElement.classList.contains("completed-day")) {
        // If the day is marked as completed, revert it to a normal state with a plan
        dayElement.classList.remove("completed-day");
        dayElement.classList.add("has-plan");
      } else if (dayElement.classList.contains("has-plan")) {
        // If the day has a plan but is not completed, mark it as completed
        dayElement.classList.remove("has-plan");
        dayElement.classList.add("completed-day");
      } else {
        alert("No plans to mark as completed!");
      }
    });
    
    

    daysGrid.appendChild(dayElement);
  }

  calendar.appendChild(daysGrid);
}




const monthSelector = document.getElementById("month-selector");
monthSelector.addEventListener("change", () => {
  const selectedMonth = parseInt(monthSelector.value);
  renderMonthCalendar(2025, selectedMonth);
});

renderMonthCalendar(2025, 0);
