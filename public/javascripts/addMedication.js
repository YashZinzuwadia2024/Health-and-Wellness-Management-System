const addMedication = async (e) => {
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
                if (!isEmpty) {
                    await Swal.fire({
                        icon: "error",
                        text: "Provide all fields"
                    });
                    return;
                }
                const current_date = new Date().toLocaleDateString();
                if (new Date(document.getElementById("date").value).toLocaleDateString() < current_date) {
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
                        title: "Please provide valid date"
                    });
                    return;
                }
                const hours = new Date().getHours();
                const mins = new Date().getMinutes();
                const input_time = new Date(current_date+" "+`${document.getElementById("hours").value}:${document.getElementById("mins").value}`);
                const test_time = new Date(current_date+" "+`${hours}:${mins}`);
                if (input_time <= test_time) {
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
                        title: "Please provide time greater than now"
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
                        const { data } = await axios.post("/medications/addMedication", body);
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
                            title: "Medication added!"
                        });
                        const status = data.success;
                        socket.emit("medication added", status);
                        return location.reload();
                    }
                });
            } else if (type.value === 'Recurring') {
                let inputs = Array.from(document.querySelectorAll(".form-input"));
                let body = {
                    type: type.value
                };
                let new_sample = inputs.filter(input => input.name !== 'day');
                const isEmpty = new_sample.every(input => input.value !== '');
                if (!isEmpty) {
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
                        title: "Please provide all fields!"
                    });
                    return;
                }
                const current_date = new Date().toLocaleDateString();
                if (new Date(document.getElementById("start_date").value).toLocaleDateString() < current_date) {
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
                        title: "Please provide valid start_date"
                    });
                    return;
                }
                if (document.getElementById("start_date").value >= document.getElementById("end_date").value) {
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
                        title: "Start Date & End Date Can't Be Equal Or Greater"
                    });
                    return;
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
                        const { data } = await axios.post("/medications/addMedication", body);
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
                            title: "Medication added!"
                        });
                        const status = data.success;
                        socket.emit("medication added", status);
                        return location.reload();
                    }
                });
            }
        }
    })
}