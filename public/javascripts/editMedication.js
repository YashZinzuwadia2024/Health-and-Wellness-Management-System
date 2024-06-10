const editMedication = async (medication_id) => {
    const { data } = await axios.get(`/getMedication/${medication_id}`);
    const medication = {
        medicine_name: data.medicine_name,
        description: data.description,
        ...data.details
    };
    document.querySelector("#modal_head h5").textContent = "Update Medication";
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
    document.getElementById("radio_inputs")?.remove();
    const btn_sec = document.getElementById("btn_sec");
    btn_sec.innerHTML = null;
    const new_snippet = `
        <span id="updateBtn" onclick="updateMedication(${medication_id}, ${medication.type_id})" class="btn-submit">Update</span>
        <span class="btn-close-popup" onclick="togglePopup()">Close</span>
    `;
    btn_sec.innerHTML = new_snippet;
    if (medication.type_id === null) {
        main_form.innerHTML = null;
        let input_snippet = `
            <div class="field">
                <label class="form-label" for="name">Medicine Name</label>
                <input class="form-input" value=${medication.medicine_name} type="text" placeholder="Medicine Name" id="medicine_name" name="medicine_name"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="name">Description</label>
                <input class="form-input" value=${medication.description} type="text" placeholder="Enter Description" id="description" name="description"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="name">Date</label>
                <input class="form-input" value=${medication.start_date} type="date" placeholder="Date" id="date" name="date"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="name">Time</label>
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
        main_form.appendChild(fields);
        function createOption(value, text) {
            const option = document.createElement("option");
            option.text = text;
            option.value = value;
            return option;
        }
        for (let i = 1; i < 25; i++) {
            const option = createOption(i, i);
            if (i == medication.time.split(":")[0]) {
                option.selected = true;
            }
            document.getElementById("hours").add(option);
        }
        for (let i = 0; i < 60; i += 30) {
            const option = createOption(i, i);
            if (i == medication.time.split(":")[1]) {
                option.selected = true;
            }
            document.getElementById("mins").add(option);
        }
    } else {
        let radio_snippet = `
            <div class="type_select" id="radio_inputs">
                <p>Choose Type of Medication</p>
                <div class="radio_inputs">
                    <label for="daily">Daily</label>
                    <input type="radio" name="recurrance" value="Daily" id="daily">
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
        if (medication.type_id == 1) {
            document.getElementById("daily").checked = true;
        } else {
            document.getElementById("weekly").checked = true;
        }
        let input_snippet = `
            <div class="field">
                <label class="form-label" for="name">
                    Medicine Name
                </label>
                <input class="form-input" value=${medication.medicine_name} type="text" placeholder="Medicine Name" id="medicine_name" name="medicine_name"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="description">
                    Description
                </label>
                <input class="form-input" value=${medication.description} type="text" placeholder="Enter Description" id="description" name="description"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="start_date">
                    Start Date
                </label>
                <input class="form-input" value=${medication.start_date} type="date" placeholder="Start Date" id="start_date" name="start_date"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="end_date">
                    End Date
                </label>
                <input class="form-input" value=${medication.end_date} type="date" placeholder="End Date" id="end_date" name="end_date"
                required>
            </div>
            <div class="field">
                <label class="form-label" for="day">
                    Day
                </label>
                <select class="form-input" name="day" id="day">
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
        if (medication.type_id == 1) {
            document.getElementById("day").disabled = true;
        } else {
            document.getElementById("day").disabled = false;
            const all_options = Array.from(document.querySelectorAll("#day option"));
            all_options.map(opt => {
                if (opt.value == medication.day) {
                    opt.selected = true;
                }
            })
        }
        function createOption(value, text) {
            const option = document.createElement("option");
            option.text = text;
            option.value = value;
            return option;
        }
        for (let i = 1; i < 25; i++) {
            const option = createOption(i, i);
            if (i == medication.time.split(":")[0]) {
                option.selected = true;
            }
            document.getElementById("hours").add(option);
        }
        for (let i = 0; i < 60; i += 30) {
            const option = createOption(i, i);
            if (i == medication.time.split(":")[1]) {
                option.selected = true;
            }
            document.getElementById("mins").add(option);
        }
        Array.from(document.getElementsByName("recurrance")).forEach(input => {
            input.addEventListener("change", handleRecurranceType)
        });
    }
}