let medication_count, reports_count;
const noOfMedications = document.getElementById("noOfMedications");
const noOfReports = document.getElementById("noOfReports");

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
    const response = await axios.get("/logout");
    if (response.statusText !== "OK") return;
    location.href = "/";
    return;
}

const medicationsPage = () => {
    location.href = "/medicationsPage";
}