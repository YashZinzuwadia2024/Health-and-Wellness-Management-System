const form = document.getElementById("user-login");
const inputs = Array.from(document.querySelectorAll(".inputs"));
const email_field = document.getElementById("email");
const password_field = document.getElementById("password");
const validation_spans = Array.from(document.querySelectorAll(".validation_spans"));
const empty_validation_spans = Array.from(document.querySelectorAll(".empty_validation_spans"));
const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  

// login 

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isEmpty = inputs.every(input => input.value !== '');
    if (!isEmpty) {
        empty_validation_spans.map(span => {
            span.style.display = "block";
        });
        return;
    };
    if (!email_regex.test(email_field.value.trim())) {
        document.getElementById("email_span").style.display = "block";
    } else {
        document.getElementById("email_span").style.display = "none";
    }
    const { data } = await axios.post("/login", {
        email: email_field.value.trim(),
        password: password_field.value.trim()
    });
    if (data.success) {
        await Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Login Successfull",
            showConfirmButton: false,
            timer: 1500
        });
        sessionStorage.setItem("loggedIn", true);
        history.pushState(null, null, '/home');
        location.href = "/home";
        return;
    }
    await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Incorrect email or password"
    });
    return;
})