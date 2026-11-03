// contact form validation
// checks: nothing empty, email format is right, phone is only numbers

const contactForm = document.getElementById("contact-form");
const successBox = document.getElementById("form-success");

function setError(id, message) {
  const input = document.getElementById(id);
  document.getElementById(id + "-error").textContent = message;
  if (message) {
    input.parentElement.classList.add("has-error");
  } else {
    input.parentElement.classList.remove("has-error");
  }
}

function validateName() {
  const name = document.getElementById("name").value.trim();
  if (name === "") {
    setError("name", "Enter your name.");
    return false;
  }
  setError("name", "");
  return true;
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (email === "") {
    setError("email", "Enter your email address.");
    return false;
  }
  if (!pattern.test(email)) {
    setError("email", "Enter an email address like name@example.com.");
    return false;
  }
  setError("email", "");
  return true;
}

function validatePhone() {
  const phone = document.getElementById("phone").value.trim();
  if (phone === "") {
    setError("phone", "Enter your phone number.");
    return false;
  }
  if (!/^[0-9]+$/.test(phone)) {
    setError("phone", "Use digits only, with no spaces, dashes or +.");
    return false;
  }
  if (phone.length < 7 || phone.length > 15) {
    setError("phone", "Phone numbers are 7 to 15 digits long.");
    return false;
  }
  setError("phone", "");
  return true;
}

function validateMessage() {
  const message = document.getElementById("message").value.trim();
  if (message === "") {
    setError("message", "Enter a message.");
    return false;
  }
  setError("message", "");
  return true;
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  successBox.classList.remove("show");

  // run all of them so every error shows at once
  const nameOk = validateName();
  const phoneOk = validatePhone();
  const emailOk = validateEmail();
  const messageOk = validateMessage();

  if (!nameOk || !phoneOk || !emailOk || !messageOk) {
    contactForm.querySelector(".has-error input, .has-error textarea").focus();
    return;
  }

  const firstName = document.getElementById("name").value.trim().split(" ")[0];
  document.getElementById("success-text").textContent =
    "Thanks, " + firstName + ". Your message passed every check. This form is a class demo and doesn't send emails yet, so please also email me at p.effiom4517@miva.edu.ng.";
  successBox.classList.add("show");
  contactForm.reset();
});

// re-check a field while they're fixing it
document.getElementById("name").addEventListener("input", () => {
  if (document.getElementById("name-error").textContent) validateName();
});
document.getElementById("email").addEventListener("input", () => {
  if (document.getElementById("email-error").textContent) validateEmail();
});
document.getElementById("phone").addEventListener("input", () => {
  if (document.getElementById("phone-error").textContent) validatePhone();
});
document.getElementById("message").addEventListener("input", () => {
  if (document.getElementById("message-error").textContent) validateMessage();
});
