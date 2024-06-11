let finalData = [];
const medication_table = document.getElementById("medication_table");
const headerRow = document.getElementById("header_row");
const main_form = document.getElementById("main_form");
const radio_inputs = document.getElementById("radio_inputs");
const addBtn = document.getElementById("addBtn");
const socket = io();

// Logout Handler and socket events

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

// Fetching Medications from server 

const getdata = async () => {
    const { data } = await axios.get("/getMedications");
    return data;
}

(async () => {
    medications = await getdata();

    // Structurnig the fetched data into Desired Format

    let updatedMedications = [];
    medications.map(medication => {
        let newObj = {
            id: medication.id,
            medicine_name: medication.medicine_name,
            description: medication.description,
            medication_details_id: medication.medication_details_id,
            ...medication.details
        };
        updatedMedications.push(newObj);
    });
    updatedMedications.map(medication => {
        if (medication.medication_type === null) {
            finalData.push(medication);
        }
        else {
            let newObj = {
                id: medication.id,
                medicine_name: medication.medicine_name,
                description: medication.description,
                medication_details_id: medication.medication_details_id,
                start_date: medication.start_date,
                end_date: medication.end_date,
                time: medication.time,
                day: medication.day,
                ...medication.medication_type
            };
            finalData.push(newObj);
        }
    });
    if (finalData.length < 11) {
        document.getElementById("med_pagination").style.display = "none";
    } else {
        document.getElementById("med_pagination").style.display = "block";
    }
    insertHeadings(finalData[0]);
    insertData(finalData);
})();

// Insertion of Medications into Table

const insertHeadings = (obj) => {
    for (const key in obj) {
        if (key === 'isDone' || key === 'id' || key === 'medication_details_id') {
            continue;
        }
        else {
            let heading_cell = document.createElement("th");
            heading_cell.classList.add("headings");
            heading_cell.classList.add("table_headings");
            if (key == 'name') {
                heading_cell.textContent = 'DOSAGE';
            }
            else {
                heading_cell.textContent = key.toUpperCase();
            }
            headerRow.appendChild(heading_cell);
        }
    }
    let heading_cell = document.createElement("th");
    heading_cell.classList.add("headings");
    heading_cell.classList.add("table_headings");
    heading_cell.textContent = "Action";
    headerRow.appendChild(heading_cell);
    if (medication_table.innerHTML == "") {
        medication_table.appendChild(headerRow);
        return;
    }
    return;
}

const insertData = (data) => {
    if (data.length === 0) {
        medication_table.innerHTML = "";
        let row = medication_table.insertRow(-1);
        row.setAttribute("class", "data-row");
        let dataCell = row.insertCell(-1);
        dataCell.setAttribute("class", "data");
        dataCell.setAttribute("colspan", "7");
        dataCell.setAttribute("align", "center");
        dataCell.innerText = "Not added any medciations yet!";
        row.appendChild(dataCell);
        return medication_table.appendChild(row);
    } else {
        totalPages = Math.ceil(data.length / recordsPerTab);
        if (!pageNo) {
            pageNo = 1;
            offset = 0;
        }
        offset = (pageNo - 1) * recordsPerTab;
        data = data.slice(offset, pageNo * recordsPerTab);
        data.map(medication => {
            let row = medication_table.insertRow(-1);
            row.classList.add("data-row");
            for (const key in medication) {
                if (key === 'isDone' || key === 'id' || key === 'medication_details_id') {
                    continue;
                }
                else {
                    let cell = row.insertCell(-1);
                    cell.classList.add("data");
                    if (medication[key] == null || medication[key] == undefined) {
                        cell.textContent = '-';
                    }
                    else {
                        cell.textContent = medication[key];
                    }
                    row.appendChild(cell);
                }
            }
            let cell = row.insertCell(-1);
            cell.classList.add("med_action");
            let action_snippet = `
                <i class="bi bi-pencil-square" onclick="editMedication(${medication.id})"></i>
                <i class="bi bi-trash-fill" onclick="deleteMedication(${medication.id},${medication.medication_details_id})"></i>
            `;
            cell.innerHTML = action_snippet;
            row.appendChild(cell);
            medication_table.appendChild(row);
        });
        return;
    }
}

// Deletion of Medication

const deleteMedication = async (medication_id, medication_details_id) => {
    const body = {
        medication_id: medication_id,
        medication_details_id: medication_details_id
    };
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { data } = await axios.post("/medications/deleteMedication", body);
            if (!data.success) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 800,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                await Toast.fire({
                    icon: "error",
                    title: "Something went wrong!"
                });
                return;
            }
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 800,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            await Toast.fire({
                icon: "success",
                title: "Medication deleted!"
            });
            const status = data.success;
            socket.emit("medication deleted", status);
            return location.reload();
        }
    });
}

// snippet for choosing kind of medication

let main_choosing_snippet = `
        <p>Choose Type of Medication</p>
        <div class="radio_inputs">
            <label for="one_time">One Time</label>
            <input type="radio" name="type" value="One Time" id="one_time">
            <label for="recurring">Recurring</label>
            <input type="radio" name="type" value="Recurring" id="recurring">
        </div>
`;

// Modal Form Popup Handler

function closeForm() {
    let inputs = Array.from(document.querySelectorAll(".form-input"));
    let isFilled = inputs.some(input => input.value !== '');
    if (isFilled) {
        Swal.fire({
            text: "Are you sure because all changes will be discarded?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed) return togglePopup();
            return;
        });
    } else {
        return togglePopup();
    }
}

// pop up form handler for medication insertion

function togglePopup() {
    document.getElementById("radio_inputs")?.remove();
    document.getElementById("main_fields")?.remove();
    document.getElementById("main_radio_inputs")?.remove();
    document.getElementById("btn_sec").innerHTML = null;
    document.getElementById("btn_sec").innerHTML = `
        <span id="addBtn" class="btn-submit">Add</span>
        <span class="btn-close-popup" onclick="closeForm()">Close</span>
    `;
    document.getElementById("addBtn").addEventListener("click", addMedication);
    document.querySelector("#modal_head h5").textContent = "Add Medication";
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
    let main = document.createElement("div");
    main.classList.add("type_select");
    main.id = "radio_inputs";
    main.innerHTML = main_choosing_snippet;
    main_form.appendChild(main);
    const types = Array.from(document.getElementsByName("type"));
    types.forEach(type => type.addEventListener("change", handleTypeInput));
}

const handleRecurranceType = (e) => {
    if (e.target.value === 'Daily') {
        document.getElementById("day").disabled = true;
    } else {
        document.getElementById("day").disabled = false;
    }
}

main_form.addEventListener("submit", (e) => {
    e.preventDefault();
});

// Add Medication

addBtn.addEventListener("click", addMedication);