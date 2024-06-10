// Update medication into DB

const updateMedication = async (medication_id) => {
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
                        body.time += (input.value === '0') ? ':00' : ':30';
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
                        const { data } = await axios.post(`/medications/updateMedication/${medication_id}`, body);
                        if (!data.success) return alert("Something went wrong!");
                        Swal.fire({
                            text: "Medication Updated!",
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
                        body.time += (input.value === '0') ? ':00' : ':30';
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
                        const { data } = await axios.post(`/medications/updatedMedication/${medication_id}`, body);
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
                            text: "Medication Updated!",
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
}