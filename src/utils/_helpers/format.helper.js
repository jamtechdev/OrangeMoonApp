/* eslint-disable prettier/prettier */
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString([], options)
};

export const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], options);
};