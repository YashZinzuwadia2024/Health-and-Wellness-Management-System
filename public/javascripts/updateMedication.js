// Update medication into DB

const updateMedication = async (medication_id, type_id) => {
    if (!type_id) {
        let inputs = Array.from(document.querySelectorAll(".form-input"));
        let body = {
            type_id: type_id
        };
        const isEmpty = inputs.every(input => input.value !== '');
        if (!isEmpty) {
            await Swal.fire({
                icon: "error",
                text: "Provide all fields"
            });
            return;
        }
        const current_date = new Date().toLocaleDateString();
        if (new Date(document.getElementById("date").value).toLocaleDateString() < current_date) {
            await Swal.fire({
                icon: "error",
                text: "Provide valid date"
            });
            return;
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
                console.log(body);
                const { data } = await axios.post(`/medications/updateMedication/${medication_id}`, body);
                if (!data.success) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!"
                    }).then(() => {
                        return;
                    }).catch(error => {
                        throw error;
                    });
                }
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Medication Updated!",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    return location.reload();
                }).catch(error => {
                    throw error;
                });
                const status = data.success;
                socket.emit("medication added", status);
            }
        });
    }
}