let medications;
const medication_table = document.getElementById("medication_table");
const headerRow = document.getElementById("headerRow");
const data_rows = document.getElementById("data_rows");
const main_form = document.getElementById("main_form");
const radio_inputs = document.getElementById("radio_inputs");

const logout = async () => {
    const response = await axios.post("/logout");
    if (response.statusText !== "OK") return;
    location.href = "/";
    return;
}

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
    let finalData = [];
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
    return;
}

const insertData = (data) => {
    data.map(medication => {
        let row = medication_table.insertRow(-1);
        for (const key in medication) {
            if (key === 'isDone') {
                continue;
            }
            else {
                let cell = row.insertCell(-1);
                if (medication[key] == null || medication[key] == undefined) {
                    cell.textContent = '-';
                }
                else {
                    cell.textContent = medication[key];
                }
                row.appendChild(cell);
            }
        }
        data_rows.appendChild(row);
    })
    return;
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
        console.log(e.target.value);
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
                <input class="form-input" type="time" placeholder="Time" id="time" name="time"
                required>
            </div>
        `;
        let fields = document.createElement("div");
        fields.setAttribute("class", "fields");
        fields.id = "main_fields";
        fields.innerHTML = input_snippet;
        main_form.append(fields);
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
                <input class="form-input" type="text" placeholder="Day" id="day" name="day" disabled >
            </div>
            <div class="field">
                <label class="form-label" for="name">
                    Time
                </label>
                <input class="form-input" type="time" placeholder="Time" id="time" name="time"
                required>
            </div>
        `;
        document.getElementById("main_fields")?.remove();
        let fields = document.createElement("div");
        fields.setAttribute("class", "fields");
        fields.id = "main_fields";
        fields.innerHTML = input_snippet;
        main_form.appendChild(fields);
        Array.from(document.getElementsByName("recurrance")).forEach(input => {
            input.addEventListener("change", handleRecurranceType)
        })
    }
}

const handleRecurranceType = (e) => {
    if (e.target.value === 'Daily') {
        document.getElementById("day").disabled = true;
    } else {
        document.getElementById("day").disabled = false;
    }
}

const handleAddMedication = async () => {
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
                inputs.map(input => {
                    if (input.name == 'medicine_name') {
                        body.medicine_name = input.value;
                    } else if (input.name == 'description') {
                        body.description = input.value;
                    } else if (input.name == 'date') {
                        body.start_date = input.value;
                    } else {
                        body.time = input.value;
                    }
                });
                const { data } = await axios.post("/medications/addMedication", body);
                if (!data.success) return alert("Something went wrong!");
                return location.reload();
            } else if (type.value === 'Recurring') {
                let inputs = Array.from(document.querySelectorAll(".form-input"));
                let body = {
                    type: type.value
                };
                let new_sample = inputs.filter(input => input.name !== 'day');
                const isEmpty = new_sample.every(input => input.value !== '');
                if (!isEmpty) return alert("Please Provide All Fields");
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
                    } else {
                        body.time = input.value;
                    }
                });
                const { data } = await axios.post("/medications/addMedication", body);
                if (!data.success) return alert("Something went wrong!");
                return location.reload();
            }
        }
    })
}