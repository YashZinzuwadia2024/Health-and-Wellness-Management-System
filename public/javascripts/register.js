const form = document.getElementById("user-registration");
const inputs = Array.from(document.querySelectorAll(".inputs"));
const validation_spans = Array.from(document.querySelectorAll(".validation_spans"));
const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const first_name_regex = /\s/;
const email_field = document.getElementById("email");
const first_name_field = document.getElementById("fname");
const last_name_field = document.getElementById("lname");
const password_field = document.getElementById("password");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isEmpty = inputs.every(input => input.value !== '');
    if (!isEmpty) return alert("Please provide all fields!");
    if (!email_regex.test(email_field.value)) {
        document.getElementById("email_span").style.display = "block";
    } else {
        document.getElementById("email_span").style.display = "none";
    }
    if (first_name_regex.test(first_name_field.value)) {
        document.getElementById("fname_span").style.display = "block";
    } else {
        document.getElementById("fname_span").style.display = "none";
    }
    const isValid = validation_spans.every(span => span.style.display == "none");
    if (!isValid) return;
    const { data } = await axios.post("/register", {
        first_name: first_name_field.value,
        last_name: last_name_field.value,
        email: email_field.value,
        password: password_field.value
    });
    if (!data.success) return;
    location.href = "/";
    return;
});