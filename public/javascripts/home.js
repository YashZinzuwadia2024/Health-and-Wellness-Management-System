const logout = async () => {
    const response = await axios.get("/logout");
    if(response.statusText !== "OK") return;
    location.href = "/";
    return;
}