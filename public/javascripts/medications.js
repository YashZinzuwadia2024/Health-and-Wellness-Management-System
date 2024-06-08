let finalData = [];
const medication_table = document.getElementById("medication_table");
const headerRow = document.getElementById("header_row");
const main_form = document.getElementById("main_form");
const radio_inputs = document.getElementById("radio_inputs");
let pageNoBox = document.getElementById("pageNo");
let pageNo = Number(document.getElementById("pageNo").innerText);
const addBtn = document.getElementById("addBtn");
const socket = io();

// For Pagination

let recordsPerTab = 10,
    offset,
    totalPages;

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

const getdata = async () => {
    const { data } = await axios.get("/getMedications");
    return data;
}

(async () => {
    medications = await getdata();
    let updatedMedications = [];
    medications.map(medication => {
        let newObj = {
            medicine_name: medication.medicine_name,
            description: medication.description,
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
                medicine_name: medication.medicine_name,
                description: medication.description,
                start_date: medication.start_date,
                end_date: medication.end_date,
                time: medication.time,
                day: medication.day,
                ...medication.medication_type
            };
            finalData.push(newObj);
        }
    });
    insertHeadings(finalData[0]);
    insertData(finalData);
})();

const insertHeadings = (obj) => {
    for (const key in obj) {
        if (key === 'isDone') {
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
                if (key === 'isDone') {
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
            medication_table.appendChild(row);
        });
        return;
    }
}

let main_choosing_snippet = `
        <p>Choose Type of Medication</p>
        <div class="radio_inputs">
            <label for="one_time">One Time</label>
            <input type="radio" name="type" value="One Time" id="one_time">
            <label for="recurring">Recurring</label>
            <input type="radio" name="type" value="Recurring" id="recurring">
        </div>
`;

function togglePopup() {
    document.getElementById("radio_inputs")?.remove();
    document.getElementById("main_fields")?.remove();
    document.getElementById("main_radio_inputs")?.remove();
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

const handleTypeInput = (e) => {
    const types = Array.from(document.getElementsByName("type"));
    types.forEach(type => type.addEventListener("change", handleTypeInput));
    document.getElementById("main_fields")?.remove();
    document.getElementById("main_radio_inputs")?.remove();
    if (e.target.value === 'One Time') {
        let input_snippet = `
            <div class="field">
                <label class="form-label" for="name">
                    Medicine Name
                </label>
                <input class="form-input" type="text" placeholder="Medicine Name" id="medicine_name" name="medicine_name"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="name">
                    Description
                </label>
                <input class="form-input" type="text" placeholder="Enter Description" id="description" name="description"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="name">
                    Date
                </label>
                <input class="form-input" type="date" placeholder="Date" id="date" name="date"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="name">
                    Time
                </label>
                <div class="hours_mins">
                    <select class="form-input" id="hours" name="hours" >
                        <option value="">---Select Hours---</option>
                    </select>
                    <select class="form-input" id="mins" name="mins" >
                        <option value="">---Select Minutes---</option>
                    </select>
                </div>
            </div>
        `;
        let fields = document.createElement("div");
        fields.setAttribute("class", "fields");
        fields.id = "main_fields";
        fields.innerHTML = input_snippet;
        main_form.append(fields);
        function createOption(value, text) {
            const option = document.createElement("option");
            option.text = text;
            option.value = value;
            return option;
        }
        for (let i = 1; i < 25; i++) {
            document.getElementById("hours").add(createOption(i, i));
        }
        for (let i = 0; i < 60; i += 30) {
            document.getElementById("mins").add(createOption(i, i));
        }
    } else {
        let radio_snippet = `
            <div class="type_select" id="radio_inputs">
                <p>Choose Type of Medication</p>
                <div class="radio_inputs">
                    <label for="daily">Daily</label>
                    <input type="radio" checked name="recurrance" value="Daily" id="daily">
                    <label for="weekly">Weekly</label>
                    <input type="radio" name="recurrance" value="Weekly" id="weekly">
                </div>
            </div>
        `;
        let radio_inputs = document.createElement("div");
        radio_inputs.setAttribute("class", "type_select");
        radio_inputs.id = "main_radio_inputs";
        radio_inputs.innerHTML = radio_snippet;
        main_form.appendChild(radio_inputs);
        let input_snippet = `
            <div class="field">
                <label class="form-label" for="name">
                    Medicine Name
                </label>
                <input class="form-input" type="text" placeholder="Medicine Name" id="medicine_name" name="medicine_name"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="description">
                    Description
                </label>
                <input class="form-input" type="text" placeholder="Enter Description" id="description" name="description"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="start_date">
                    Start Date
                </label>
                <input class="form-input" type="date" placeholder="Start Date" id="start_date" name="start_date"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="end_date">
                    End Date
                </label>
                <input class="form-input" type="date" placeholder="End Date" id="end_date" name="end_date"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="day">
                    Day
                </label>
                <select class="form-input" name="day" id="day" disabled>
                    <option value="">---Please Select Day---</option>
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                </select>
            </div>
            <div class="field">
                <label class="form-label" for="name">
                    Time
                </label>
                <div class="hours_mins">
                    <select class="form-input" id="hours" name="hours" >
                        <option value="">---Select Hours---</option>
                    </select>
                    <select class="form-input" id="mins" name="mins" >
                        <option value="">---Select Minutes---</option>
                    </select>
                </div>
            </div>
        `;
        document.getElementById("main_fields")?.remove();
        let fields = document.createElement("div");
        fields.setAttribute("class", "fields");
        fields.id = "main_fields";
        fields.innerHTML = input_snippet;
        main_form.appendChild(fields);
        function createOption(value, text) {
            const option = document.createElement("option");
            option.text = text;
            option.value = value;
            return option;
        }
        for (let i = 1; i < 25; i++) {
            document.getElementById("hours").add(createOption(i, i));
        }
        for (let i = 0; i < 60; i += 30) {
            document.getElementById("mins").add(createOption(i, i));
        }
        Array.from(document.getElementsByName("recurrance")).forEach(input => {
            input.addEventListener("change", handleRecurranceType)
        });
    }
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

addBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const types = Array.from(document.getElementsByName("type"));
    types.map(async (type) => {
        if (type.checked) {
            if (type.value === "One Time") {
                let inputs = Array.from(document.querySelectorAll(".form-input"));
                let body = {
                    type: type.value
                };
                const isEmpty = inputs.every(input => input.value !== '');
                if (!isEmpty) return alert("Please Provide All Fields");
                const current_date = new Date().toLocaleDateString();
                if (new Date(document.getElementById("date").value).toLocaleDateString() < current_date) {
                    return alert("Provide Valid Date!");
                }
                inputs.map(input => {
                    if (input.name == 'medicine_name') {
                        body.medicine_name = input.value;
                    } else if (input.name == 'description') {
                        body.description = input.value;
                    } else if (input.name == 'date') {
                        body.start_date = input.value;
                    } else if (input.name == 'hours') {
                        body.time = input.value;
                    } else {
                        body.time += (input.value === '0')? ':00' : ':30';
                    }
                });
                Swal.fire({
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const { data } = await axios.post("/medications/addMedication", body);
                        if (!data.success) return alert("Something went wrong!");
                        Swal.fire({
                            text: "Medication Added!",
                            imageUrl: "/assets/logo.svg",
                            imageWidth: 400,
                            imageHeight: 200,
                            imageAlt: "Custom image"
                        }).then(() => {
                            return location.reload();
                        }).catch(error => {
                            throw error;
                        });
                    }
                });
            } else if (type.value === 'Recurring') {
                let inputs = Array.from(document.querySelectorAll(".form-input"));
                let body = {
                    type: type.value
                };
                let new_sample = inputs.filter(input => input.name !== 'day');
                const isEmpty = new_sample.every(input => input.value !== '');
                if (!isEmpty) return alert("Please Provide All Fields");
                const current_date = new Date().toLocaleDateString();
                if (new Date(document.getElementById("start_date").value).toLocaleDateString() < current_date) {
                    return alert("Provide a valid start date");
                }
                if (document.getElementById("start_date").value >= document.getElementById("end_date").value) {
                    return alert("Start Date & End Date Can't Be Equal Or Greater");
                }
                inputs.map(input => {
                    if (input.name == 'medicine_name') {
                        body.medicine_name = input.value;
                    } else if (input.name == 'description') {
                        body.description = input.value;
                    } else if (input.name == 'start_date') {
                        body.start_date = input.value;
                    } else if (input.name == 'end_date') {
                        body.end_date = input.value;
                    } else if (input.name == 'day') {
                        body.day = input.value;
                    } else if (input.name == "hours") {
                        body.time = input.value;
                    } else {
                        body.time += (input.value === '0')? ':00' : ':30';
                    }
                });
                Swal.fire({
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const { data } = await axios.post("/medications/addMedication", body);
                        if (!data.success) {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Something went wrong!"
                            }).then(() => {
                                return;
                            }).catch(error => {
                                throw error;
                            })
                        }
                        Swal.fire({
                            text: "Medication Added!",
                            imageUrl: "/assets/logo.svg",
                            imageWidth: 400,
                            imageHeight: 200,
                            imageAlt: "Custom image"
                        }).then(() => {
                            return location.reload();
                        }).catch(error => {
                            throw error;
                        });
                    }
                });
            }
        }
    })
})

// Pagination

function leftMost() {
    if (pageNo == 1) {
        return;
    } else {
        pageNo = 1;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    }
}

function left() {
    if (pageNo == 1) return;
    pageNo--;
    pageNoBox.innerText = pageNo;
    medication_table.innerHTML = "";
    headerRow.innerHTML = "";
    insertHeadings(finalData[0]);
    insertData(finalData);
    return;
}

function right() {
    if (pageNo == totalPages) {
        pageNo = 1;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    } else {
        pageNo++;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    }
}

function rightMost() {
    if (pageNo == totalPages) {
        return;
    } else {
        pageNo = totalPages;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    }
}