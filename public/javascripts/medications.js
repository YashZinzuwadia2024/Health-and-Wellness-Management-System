let medications;
const medication_table = document.getElementById("medication_table");
const headerRow = document.getElementById("headerRow");
const data_rows = document.getElementById("data_rows");

const getdata = async () => {
    const { data } = await axios.get("/getMedications");
    return data;
}

(async () => {
    medications = await getdata();
    insertHeadings(medications[0]);
    insertData(medications);
})();

const insertHeadings = (obj) => {
    for (const key in obj) {
        let heading_cell = document.createElement("th");
        heading_cell.classList.add("table_headings");
        heading_cell.textContent = key;
        headerRow.appendChild(heading_cell);
    }
    return;
}

const insertData = (data) => {
    data.map(medication => {
        let row = medication_table.insertRow(-1);
        for (const key in medication) {
            let cell = row.insertCell(-1);
            cell.textContent = medication[key];
            row.appendChild(cell);
        }
        data_rows.appendChild(row);
    })
    return;
}