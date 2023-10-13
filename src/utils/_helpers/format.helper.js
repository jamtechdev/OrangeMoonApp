/* eslint-disable prettier/prettier */
export const formatDate = (dateString) => {
    if (dateString == null){
        const date = new Date()
        return date.toLocaleDateString([], options);
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    if (isNaN(date) ) {
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



export function createdDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const formatDateNew = (dateStr) => {
    const dateString = dateStr.split(" ,")[0];
    let date = '';
    if (dateString == null){
         date = new Date();
    } else {
        date = new Date(dateString);
        if (isNaN(date) ) {
            return '-';
        }
    }
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export const isWithin48Hours = (targetDate) => {
    const targetDateTime = new Date(targetDate);
    const currentDate = new Date();
    const timeDifference = targetDateTime - currentDate;
    const hoursIn48Hours = 48 * 60 * 60 * 1000;
    return timeDifference <= hoursIn48Hours;
  };