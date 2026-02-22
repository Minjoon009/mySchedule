function getData() {
  data = JSON.parse(localStorage.getItem("schedule_data"));
  return data ? data : "";
}
// <div class="date_now">
//   Tue <span class="day_month">Feb 17</span> 11:00 PM
// </div>

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const now = new Date();
document.addEventListener("DOMContentLoaded", () => {
  function getNowDate() {
    const header = document.querySelector(".header");
    let dateBox = document.querySelector(".date_now");

    const now = new Date();

    const now_day = now.toLocaleDateString("en-US", { weekday: "short" });
    const now_date_month = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    const now_hour = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!dateBox) {
      const div = document.createElement("div"); // 👈 create real element
      div.classList.add("date_now");

      div.innerHTML = `
        ${now_day} <span class="date_month">${now_date_month}</span> ${now_hour}
      `;

      header.after(div); // 👈 BEST WAY
    } else {
      dateBox.innerHTML = `
        ${now_day} <span class="date_month">${now_date_month}</span> ${now_hour}
      `;
    }
  }

  getNowDate();
  setInterval(getNowDate, 1000);
});
var data = [];
processTable();
function processTable() {
  data = getData();
  now_activity_span = document.getElementById("now_activity_span");
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  data.forEach((element) => {
    let is_current_activity = false;
    const startTime = new Date(
      `${now.toDateString()} ${element["start_time"] + " " + element["period"]}`,
    );
    const endTime = new Date(
      `${now.toDateString()} ${element["end_time"] + " " + element["period"]}`,
    );
    if (now >= startTime && now <= endTime) {
      now_activity_span.innerHTML = `${element["activity"]}`;
      is_current_activity = true;
    }
    tableBody.innerHTML += `
      <tr class="${is_current_activity ? "current_activity_row" : ""}">
        <td class="time-col">${element["start_time"]} ~ ${element["end_time"]} ${element["period"]}</td>
        <td class="activity-col">${element["activity"]}</td>
        <td class="details-col">
          ${element["detail"]}
          <div class="motivate">${element["motivation"]}</div>
        </td>
      </tr>
      `;
  });
}

const coverForm = document.getElementById("coverForm");

document.getElementById("btnAddActivity").addEventListener("click", () => {
  htmlTag = `
      <div class="activityForm">
        <h1>Add New Activity</h1>
        <div class="inputAndLabel">
          <label for="txtStartTime">Start Time</label>
          <input
            type="time"
            name="txtStartTime"
            id="txtStartTime"
          />
        </div>
        <div class="inputAndLabel">
          <label for="txtEndTime">End Time</label>
          <input
            type="time"
            name="txtEndTime"
            id="txtEndTime"
          />
        </div>
        <div class="inputAndLabel">
          <label for="txtActivity">Activity Title</label>
          <input
            type="text"
            name="txtActivity"
            id="txtActivity"
            placeholder="Enter Activity..."
          />
        </div>
        <div class="inputAndLabel">
          <label for="txtDetail">Details</label>
          <input
            type="text"
            name="txtDetail"
            id="txtDetail"
            placeholder="Enter Details..."
          />
        </div>
        <div class="inputAndLabel">
          <label for="txtMotivate">Motivate Sentence</label>
          <input
            type="text"
            name="txtMotivate"
            id="txtMotivate"
            placeholder="Enter Motivate..."
          />
        </div>
        <button id="btnAdd">Add</button>
        <div id="customAlertBox" class="custom-alert">
  <div class="alert-content">
    <p id="alertMessage">Message here</p>
    <button id="alertOkBtn">OK</button>
  </div>
</div>

      </div>`;
  coverForm.style.display = "flex";
  coverForm.innerHTML = htmlTag;
  const start_time_input = document.getElementById("txtStartTime");
  const end_time_input = document.getElementById("txtEndTime");
  const activity_input = document.getElementById("txtActivity");
  const detail_input = document.getElementById("txtDetail");
  const motivate_input = document.getElementById("txtMotivate");
  start_time_input.addEventListener("input", () => {
    end_time_input.min = start_time_input.value;
    if (end_time_input.value < start_time_input.value) {
      end_time_input.value = start_time_input.value;
    }
  });
  end_time_input.addEventListener("input", () => {
    if (end_time_input.value < start_time_input.value) {
      end_time_input.value = start_time_input.value;
    }
  });
  document.getElementById("btnAdd").addEventListener("click", () => {
    if (!start_time_input.value) {
      showAlert("Start Time is required!");
      start_time_input.style.border = "2px solid red";
      return;
    }

    if (!end_time_input.value) {
      showAlert("End Time is required!");
      end_time_input.style.border = "2px solid red";
      return;
    }

    if (!activity_input.value) {
      showAlert("Activity Title is required!");
      activity_input.style.border = "2px solid red";
      return;
    }

    if (!detail_input.value) {
      showAlert("Detail is required!");
      detail_input.style.border = "2px solid red";
      return;
    }

    if (!motivate_input.value) {
      showAlert("Motivation is required!");
      motivate_input.style.border = "2px solid red";
      return;
    }

    setData(
      start_time_input.value,
      end_time_input.value,
      activity_input.value,
      detail_input.value,
      motivate_input.value,
    );
  });
  document.getElementById("alertOkBtn").addEventListener("click", () => {
    document.getElementById("customAlertBox").style.display = "none";
  });
});
function showAlert(message) {
  const alertBox = document.getElementById("customAlertBox");
  const alertMsg = document.getElementById("alertMessage");

  alertMsg.textContent = message;
  alertBox.style.display = "flex";
}

coverForm.addEventListener("click", (e) => {
  if (e.target == coverForm) {
    coverForm.style.display = "none";
  }
});

function setData(
  start_time_input,
  end_time_input,
  activity_input,
  detail_input,
  motivate_input,
) {
  var activity_data = {
    start_time: convertTo12HourFormat(start_time_input).split(" ")[0],
    end_time: convertTo12HourFormat(end_time_input).split(" ")[0],
    period: convertTo12HourFormat(end_time_input).split(" ")[1],
    activity: activity_input,
    detail: detail_input,
    motivation: motivate_input,
  };
  data.push(activity_data);
  localStorage.setItem("schedule_data", JSON.stringify(data));
  coverForm.style.display = "none";
  processTable();
}
function convertTo12HourFormat(time24h, format) {
  const dateObj = new Date(`2000-01-01T${time24h}`);
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  if (format == 12) {
    return dateObj.toLocaleTimeString("en-US", options);
  } else {
    return dateObj.toLocaleTimeString("en-US", options);
  }
}
//Sample Data
// [
//       {
//         start_time: "8:30",
//         end_time: "8:45",
//         period: "AM",
//         activity: "🌅 Wake Up",
//         detail: "💧 Water • Make bed • Stretch",
//         motivation: "💭 Begin with gratitude",
//       },
//     ]
