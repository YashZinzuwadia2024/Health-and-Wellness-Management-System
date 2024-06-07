const reports_table = document.getElementById("reports_table");
const headerRow = document.getElementById("headerRow");
const data_rows = document.getElementById("data_rows");
let all_reports;
const socket = io();

const logout = async () => {
    const response = await axios.post("/logout");
    if (response.statusText !== "OK") return;
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

const getReports = async () => {
    const { data } = await axios.get("/myReports");
    return data;
}

(async () => {
    all_reports = await getReports();
    insertData(all_reports);
})();

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
                cell.classList.add("data")
                if (key == 'report_path') {
                    report[key] = report[key].slice(report[key].lastIndexOf('/') + 1);
                    cell.textContent = report[key].toUpperCase();
                    cell.style.color = "blue"
                    row.appendChild(cell);
                } else {
                    cell.textContent = report[key];
                    row.appendChild(cell);
                }
            }
            let download_icon = document.createElement("i");
            download_icon.setAttribute("class", "bi bi-download");
            download_icon.classList.add("download_btns");
            download_icon.style.color = "rgb(100, 100, 223)";
            row.appendChild(download_icon);
            data_rows.appendChild(row);
        })
        return;
    }
}