// Dynamic Modal Form Generation

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
            document.getElementById("hours")?.add(createOption(i, i));
        }
        for (let i = 0; i < 60; i += 30) {
            document.getElementById("mins")?.add(createOption(i, i));
        }
    } else {
        let radio_snippet = `
            <div class="type_select" id="radio_inputs">
                <p>Choose Dosage</p>
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