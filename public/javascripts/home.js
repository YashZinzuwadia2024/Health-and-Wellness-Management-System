let medication_count, reports_count;
const noOfMedications = document.getElementById("noOfMedications");
const noOfReports = document.getElementById("noOfReports");
const socket = io();

window.onpopstate = () => {
    if (sessionStorage.getItem("loggedIn")) {
        history.forward();
    }
}

const getCounts = async () => {
    const results1 = await axios.get("/getCountOfMed");
    const results2 = await axios.get("/getCountOfReports");
    let countOfMeds = results1.data;
    let countOfReports = results2.data;
    return { countOfMeds, countOfReports };
}

(async () => {
    const { countOfMeds, countOfReports } = await getCounts();
    noOfMedications.textContent = countOfMeds.count;
    noOfReports.textContent = countOfReports.count;
    return;
})();

const logout = async () => {
    const response = await axios.post("/logout");
    if (response.statusText !== "OK") return;
    sessionStorage.setItem("loggedIn", false);
    location.href = "/";
    return;
}

const logout_others = async () => {
    const response = await axios.post("/logout-others");
    if (response.statusText !== "OK") return;
    let status = response.statusText
    socket.emit("logout others", status);
    location.href = "/home";
    return;
}

const logout_all = async () => {
    const response = await axios.post("/logout-all");
    if (response.statusText !== "OK") return;
    let status = response.statusText
    socket.emit("logout all", status);
    location.href = "/";
    return;
}

socket.on("logout others", status => {
    if (status) {
        return location.reload();
    }
    return;
})

socket.on("logout all", status => {
    if (status) {
        return location.reload();
    }
    return; 
})

const medicationsPage = () => {
    location.href = "/medicationsPage";
}