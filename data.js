// Firebase URL
const firebaseURL = "https://lastgoal-a90d1-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json";

// Get DOM elements
const dataContainer = document.getElementById("dataContainer");
const filterForm = document.getElementById("filterForm");

// Fetch data from Firebase
async function fetchData() {
  try {
    const response = await fetch(firebaseURL);
    const data = await response.json();

    // Render all data
    renderData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Render data into the DOM
function renderData(data, startTime = null, endTime = null) {
  // Clear previous data
  dataContainer.innerHTML = "";

  // Check for specific time filtering
  const entries = Object.entries(data)
    .filter(([timestamp, values]) => {
      const date = new Date(parseInt(timestamp, 10));
      if (startTime && endTime) {
        return date >= new Date(startTime) && date <= new Date(endTime);
      }
      return true;
    })
    .map(([timestamp, values]) => {
      const date = new Date(parseInt(timestamp, 10));
      return { date, temp: values.temp, humid: values.humid };
    });

  // Create a display for each entry
  if (entries.length > 0) {
    entries.forEach(({ date, temp, humid }) => {
      const entry = document.createElement("div");
      entry.className = "data-entry";
      entry.innerHTML = `
        <p><strong>Date/Time:</strong> ${date.toLocaleString()}</p>
        <p><strong>Temperature:</strong> ${temp} °C</p>
        <p><strong>Humidity:</strong> ${humid} %</p>
        <hr>
      `;
      dataContainer.appendChild(entry);
    });
  } else {
    dataContainer.innerHTML = "<p>No data available for the selected range.</p>";
  }
}

// Filter data based on the form inputs
filterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  if (startTime && endTime) {
    fetchData().then((data) => renderData(data, startTime, endTime));
  }
});

// Fetch initial data on load
fetchData();
