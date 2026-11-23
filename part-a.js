console.log("Forms lab ready");

const form = document.getElementById("reg-form");
const summary = document.getElementById("summary");
const statusMsg = document.getElementById("status");

// Task A1: submit event
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stay on this page
  console.log("Form submitted");

  // Task A3: registration summary
  const name = document.getElementById("full-name").value.trim();
  const workshopSelect = document.getElementById("workshop");
  const workshopText = workshopSelect.options[workshopSelect.selectedIndex].text;
  const session = document.querySelector('input[name="session"]:checked').value;
  const guests = Number(document.getElementById("guests").value);
  const laptop = document.getElementById("laptop").checked;

  // Compare this with the summary below (before the reset)
  console.log(Object.fromEntries(new FormData(form)));

  summary.textContent = "";
  const heading = document.createElement("h2");
  heading.textContent = "Registration received";
  const list = document.createElement("ul");
  const lines = [
    `Name: ${name}`,
    `Workshop: ${workshopText}`,
    `Session: ${session}`,
    `Guests: ${guests}`,
    `Own laptop: ${laptop ? "Yes" : "No"}`
  ];
  lines.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    list.append(li);
  });
  summary.append(heading, list);

  statusMsg.textContent = `Thank you, ${name}!`;
  form.reset();
});
