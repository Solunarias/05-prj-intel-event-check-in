const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

let count = 0;
const maxCount = 50;
const storageKey = "intelSustainabilityAttendance";
const teamAttendees = {
  water: [],
  zero: [],
  power: [],
};

function displayTeamAttendees(team) {
  const teamCounter = document.getElementById(team + "Count");
  const attendeeList = document.getElementById(team + "Attendees");

  teamCounter.textContent = teamAttendees[team].length;
  attendeeList.innerHTML = "";

  for (let index = 0; index < teamAttendees[team].length; index++) {
    const attendeeItem = document.createElement("li");
    attendeeItem.textContent = teamAttendees[team][index];
    attendeeList.appendChild(attendeeItem);
  }
}

function saveAttendance() {
  const attendance = {
    count: count,
    teams: teamAttendees,
  };

  localStorage.setItem(storageKey, JSON.stringify(attendance));
}

function restoreAttendance() {
  const savedAttendance = localStorage.getItem(storageKey);

  if (!savedAttendance) {
    return;
  }

  try {
    const attendance = JSON.parse(savedAttendance);
    count = attendance.count;
    teamAttendees.water = attendance.teams.water || [];
    teamAttendees.zero = attendance.teams.zero || [];
    teamAttendees.power = attendance.teams.power || [];

    attendeeCount.textContent = count;
    progressBar.style.width = Math.min((count / maxCount) * 100, 100) + "%";
    displayTeamAttendees("water");
    displayTeamAttendees("zero");
    displayTeamAttendees("power");
  } catch (error) {
    localStorage.removeItem(storageKey);
  }
}

restoreAttendance();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;
  console.log(name, teamName);

  count++;
  console.log("Total check-ins: " + count);
  attendeeCount.textContent = count;

  const percentage = Math.round((count / maxCount) * 100) + "%";
  progressBar.style.width = percentage;
  console.log(`Progress: ${percentage}`);

  teamAttendees[team].push(name);
  displayTeamAttendees(team);
  saveAttendance();

  const message = `Welcome, ${name} from ${teamName}`;
  console.log(message);
  greeting.textContent = message;
  greeting.className = "success-message";
  greeting.style.display = "block";

  if (count === maxCount) {
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent,
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent,
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent,
    );
    const highestCount = Math.max(waterCount, zeroCount, powerCount);
    const winningTeams = [];

    if (waterCount === highestCount) {
      winningTeams.push("Team Water Wise");
    }
    if (zeroCount === highestCount) {
      winningTeams.push("Team Net Zero");
    }
    if (powerCount === highestCount) {
      winningTeams.push("Team Renewables");
    }

    greeting.textContent = `${message}!\n\nCongratulations! ${winningTeams.join(" and ")} had the highest attendance with ${highestCount} attendee${highestCount === 1 ? "" : "s"}.`;
  }

  form.reset();
});
