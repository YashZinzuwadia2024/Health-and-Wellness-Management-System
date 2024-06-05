const reports_table = document.getElementById("reports_table");
const headerRow = document.getElementById("headerRow");
const data_rows = document.getElementById("data_rows");
let all_reports;

const getReports = async () => {
    const { data } = await axios.get("/myReports");
    return data;
}

(async () => {
    all_reports = await getReports();
    insertHeadings(all_reports[0]);
    insertData(all_reports);
})();

const insertHeadings = (obj) => {
    for (const key in obj) {
        let heading_cell = document.createElement("th");
        heading_cell.classList.add("table_headings");
        heading_cell.textContent = key.toUpperCase();
        headerRow.appendChild(heading_cell);
    }
    return;
}

const insertData = (data) => {
    if (data.length === 0) {
        let row = reports_table.insertRow(-1);
        let cell = row.insertCell(-1);
        cell.setAttribute("colspan", "2");
        cell.textContent = "No Reports";
        cell.style.textAlign = "center";
        cell.style.padding = "8px";
        row.appendChild(cell);
        return reports_table.appendChild(row);
    } else {
        data.map(report => {
            let row = reports_table.insertRow(-1);
            for (const key in report) {
                let cell = row.insertCell(-1);
                cell.textContent = report[key];
                row.appendChild(cell);
            }
            let download_icon = document.createElement("i");
            download_icon.classList.add("bi bi-download");
            download_icon.style.color = "rgb(100, 100, 223)";
            row.appendChild(download_icon);
            data_rows.appendChild(row);
        })
        return;
    }
}