function getCurrentDateAndTime(timeZone) {
    const dateWithTimeZone = new Date().toLocaleString("en-US", { timeZone });
    const newDate = new Date(dateWithTimeZone);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}`;

    return {
        date,
        time,
    };
}

function formatDateToDayMonthDate(dateStr) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const date = new Date(dateStr);
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();

    return `${dayOfWeek}, ${month} ${dayOfMonth}`;
}

function convertTo12HourFormat(time24) {
    // Split the time into hours and minutes
    const [hours, minutes] = time24.split(":");

    // Parse hours and minutes into integers
    const hoursInt = parseInt(hours, 10);
    const minutesInt = parseInt(minutes, 10);

    // Determine AM or PM suffix
    const period = hoursInt >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    let hours12 = hoursInt % 12;
    hours12 = hours12 === 0 ? 12 : hours12; // Handle midnight (0 hours)

    // Format minutes with leading zero if necessary
    const minutesFormatted = minutesInt < 10 ? `0${minutesInt}` : minutesInt;

    // Combine hours, minutes, and period into 12-hour time format
    const time12 = `${hours12}:${minutesFormatted} ${period}`;

    return time12;
}

module.exports = {
    getCurrentDateAndTime,
    formatDateToDayMonthDate,
    convertTo12HourFormat,
};
