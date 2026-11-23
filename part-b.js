const form = document.getElementById("reg-form");
const statusMsg = document.getElementById("status");

// Task B2: JavaScript validation
function validateName(value) {
  if (value.trim() === "") return "Please enter your full name.";
  if (value.trim().length < 3) return "Your name must be at least 3 characters.";
  return ""; // no error
}

function validateStudentId(value) {
  if (!/^HD\d-\d{3}$/.test(value.trim())) return "Use the format HD3-017.";
  return "";
}

function validateEmail(value) {
  if (value.trim() === "") return "Please enter your email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Enter an email like name@example.com.";
  }
  return "";
}

function validatePhone(value) {
  if (!/^07\d{8}$/.test(value.trim())) {
    return "Enter 10 digits starting with 07, e.g. 0771234567.";
  }
  return "";
}

function validateWorkshop(value) {
  if (value === "") return "Please choose a workshop.";
  return "";
}

function validateGuests(value) {
  const message = "Guests must be a whole number from 0 to 3.";
  if (value.trim() === "") return message;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > 3) return message;
  return "";
}

function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  errorEl.textContent = message; // "" clears it
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
  // Task B3.2 (challenge): show what is right, only on touched fields
  input.classList.toggle("valid", message === "" && Boolean(input.dataset.touched));
}

const rules = {
  "full-name": validateName,
  "student-id": validateStudentId,
  "email": validateEmail,
  "phone": validatePhone,
  "workshop": validateWorkshop,
  "guests": validateGuests
};

function checkField(input) {
  const message = rules[input.id](input.value);
  showError(input, message);
  return message === "";
}

function resetFeedback() {
  for (const id in rules) {
    const input = document.getElementById(id);
    delete input.dataset.touched;
    showError(input, "");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstBad = null;
  for (const id in rules) {
    const input = document.getElementById(id);
    input.dataset.touched = "yes";
    if (!checkField(input) && firstBad === null) firstBad = input;
  }
  if (firstBad) {
    firstBad.focus(); // take the user to the first problem
    statusMsg.textContent = "Please fix the errors shown in red.";
    return;
  }
  statusMsg.textContent = "Registration complete!";
  form.reset();
  resetFeedback();
});

// Task B3 + B4: live feedback and accessible errors
for (const id in rules) {
  const input = document.getElementById(id);

  // Task B4: link each message to its field for screen readers
  input.setAttribute("aria-describedby", `${id}-error`);

  // Task B3: check on blur first, then re-check while typing
  input.addEventListener("blur", () => {
    input.dataset.touched = "yes";
    checkField(input);
  });

  input.addEventListener("input", () => {
    if (input.dataset.touched) checkField(input);
  });
}
