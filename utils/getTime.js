module.exports = (utcTime) => {
    let [utcHours, utcMinutes, utcSeconds] = utcTime.split(':').map(Number);
    let date = new Date();
    date.setUTCHours(utcHours, utcMinutes, utcSeconds, 0);
    let istOffset = 5.5 * 60 * 60 * 1000;
    let istDate = new Date(date.getTime() + istOffset);
    let istHours = istDate.getUTCHours();
    let istMinutes = istDate.getUTCMinutes();
    let istSeconds = "00";
    istHours = istHours.toString().padStart(2, '0');
    istMinutes = istMinutes.toString().padStart(2, '0');
    return `${istHours}:${istMinutes}:${istSeconds}`;
}