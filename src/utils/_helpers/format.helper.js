/* eslint-disable prettier/prettier */
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    if (isNaN(date)) {
        return '-';
    }
    return date.toLocaleDateString([], options);
};


export const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const date = new Date(`1970-01-01T${timeString}`);
    if (isNaN(date)) {
        return '-';
    }
    return date.toLocaleTimeString([], options);
};

export const formatDateToString = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

