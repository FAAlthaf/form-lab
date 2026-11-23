// ===== Data =====
const takenUsernames = ["admin", "nimali", "kavin"];   // pretend the server sent these

// ===== Page elements =====
const form = document.getElementById("signup-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmBox = document.getElementById("confirm");
const terms = document.getElementById("terms");
const showBtn = document.getElementById("show-btn");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("result");
const strength = document.getElementById("strength");       // challenge
const capsWarning = document.getElementById("caps-warning"); // challenge
const ruleItems = {
  length: document.getElementById("rule-length"),
  number: document.getElementById("rule-number"),
  upper: document.getElementById("rule-upper"),
  symbol: document.getElementById("rule-symbol")
};

function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

// TODO 1: username
function checkUsername(value) {
  const name = value.trim();
  if (!/^\w{3,15}$/.test(name)) return "Use 3 to 15 letters, numbers or _.";
  if (takenUsernames.includes(name.toLowerCase())) {
    return "That username is taken. Try another.";
  }
  return "";
}

// TODO 2: email
function checkEmail(value) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Enter an email like name@example.com.";
  }
  return "";
}

// TODO 3: password rules (adds or removes "met" on each li)
function checkPasswordRules(value) {
  const results = {
    length: value.length >= 8,
    number: /\d/.test(value),
    upper: /[A-Z]/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value)
  };
  for (const rule in results) {
    ruleItems[rule].classList.toggle("met", results[rule]);
  }

  // Challenge: strength word
  const metCount = Object.values(results).filter(Boolean).length;
  if (value === "") {
    strength.textContent = "";
  } else if (metCount <= 2) {
    strength.textContent = "Strength: Weak";
  } else if (metCount === 3) {
    strength.textContent = "Strength: Fair";
  } else {
    strength.textContent = "Strength: Strong";
  }

  return metCount === 4;
}

// TODO 4: confirm password
function checkConfirm() {
  if (confirmBox.value === "") return "Please type your password again.";
  if (confirmBox.value !== password.value) return "Passwords do not match.";
  return "";
}

function updateForm() {
  if (username.value !== "") showError(username, checkUsername(username.value));
  if (email.value !== "") showError(email, checkEmail(email.value));
  if (confirmBox.value !== "") showError(confirmBox, checkConfirm());
  const pwOk = checkPasswordRules(password.value);
  const allOk = checkUsername(username.value) === "" &&
                checkEmail(email.value) === "" &&
                pwOk && checkConfirm() === "" && terms.checked;
  submitBtn.disabled = !allOk;
}

[username, email, password, confirmBox, terms].forEach((el) => {
  el.addEventListener("input", updateForm);
});

// TODO 5: Show / Hide password
showBtn.addEventListener("click", () => {
  const hidden = password.type === "password";
  password.type = hidden ? "text" : "password";
  showBtn.textContent = hidden ? "Hide" : "Show";
});

// Challenge: Caps Lock warning
password.addEventListener("keydown", (e) => {
  capsWarning.textContent = e.getModifierState("CapsLock") ? "Caps Lock is on" : "";
});
password.addEventListener("blur", () => {
  capsWarning.textContent = "";
});

// Challenge: remember the username ONLY (never the password) in localStorage
try {
  const saved = localStorage.getItem("username");
  if (saved) {
    username.value = saved;
    updateForm();
  }
} catch (err) {
  // localStorage may be blocked; the form still works without it
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateForm();
  if (submitBtn.disabled) return;
  result.textContent = `Welcome, ${username.value.trim()}! Your account is ready.`;
  try {
    localStorage.setItem("username", username.value.trim());
  } catch (err) {
    // ignore
  }
  form.hidden = true;
  form.reset();
});
