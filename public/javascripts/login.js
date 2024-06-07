const form = document.getElementById("user-login");
const inputs = Array.from(document.querySelectorAll(".inputs"));
const email_field = document.getElementById("email");
const password_field = document.getElementById("password");
const validation_spans = Array.from(document.querySelectorAll(".validation_spans"));
const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isEmpty = inputs.every(input => input.value !== '');
    if (!isEmpty) return alert("Please provide all fields!");
    if (!email_regex.test(email_field.value)) {
        document.getElementById("email_span").style.display = "block";
    } else {
        document.getElementById("email_span").style.display = "none";
    }
    const { data } = await axios.post("/login", {
        email: email_field.value,
        password: password_field.value
    });
    if (!data.success) return;
    Swal.fire({
        title: "Congratulations!",
        text: "You have logged in successfully!",
        icon: "success"
    }).then(() => {
        location.href = "/home";
        return;
    }).catch(error => {
        throw error;
    });
})