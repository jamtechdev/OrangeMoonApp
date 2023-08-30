/* eslint-disable prettier/prettier */
export const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const socialSecurity =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const _IsValidateEmail = async (data) => {
    const notExceptedEmail = ["@gmail", "@yahoo", "@hotmail"];
    for (let i = 0; i < notExceptedEmail.length; i++) {
        if (data?.search(`${notExceptedEmail[i]}`) > -1) {
            return true;
        }
    }
    return false;
};

export const urlRegExp =
    /^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g;

export const transformedStateData = (originalData) => {
    return originalData.reduce((result, { id, state_name }) => {
        result.push({ label: state_name, value: id });
        return result;
    }, []);
};
export const transformedCityData = (originalData) => {
    return originalData.reduce((result, { id, city_name }) => {
        result.push({ label: city_name, value: id });
        return result;
    }, []);
};

export const stringArray = (numberArray) => {
    if (numberArray && typeof numberArray[0] === 'string') {
        return numberArray;
    }
    return numberArray.map(number => number.toString());
};

export const numberArray = (stringArrayValue) => {
    if (stringArrayValue && typeof stringArrayValue[0] === 'string') {
        return stringArrayValue.map(string => parseInt(string));
    }
    return stringArrayValue;
};

export function getStateNamesByIds(ids, stateList) {
    let selectedStates = [];
    // console.log(ids)
    if (ids && typeof ids[0] === 'string') {
        const numericIds = ids?.map(id => parseInt(id));
        selectedStates = stateList.filter(item => numericIds.includes(item.id));
    } else {
        selectedStates = stateList.filter(item => ids.includes(item.id));
    }
    let stateNames = selectedStates.map(item => item.state_name);
    return stateNames.join(', ');
}

export function formatPhoneNumber(phoneNumber) {
    if (phoneNumber) {
        const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
        let formattedPhoneNumber = '';
        if (numericPhoneNumber.length > 3 && numericPhoneNumber.length <= 6) {
            formattedPhoneNumber = numericPhoneNumber.replace(/^(\d{3})(\d+)$/, '$1-$2');
        } else if (numericPhoneNumber.length > 6) {
            formattedPhoneNumber = numericPhoneNumber.replace(/^(\d{3})(\d{3})(\d+)$/, '$1-$2-$3');
        } else {
            formattedPhoneNumber = numericPhoneNumber;
        }
        return formattedPhoneNumber;
    }
    return phoneNumber;
}



export function formatSocialSecurity(phoneNumber) {
    if (phoneNumber) {
        const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
        let formattedPhoneNumber = '';
        if (numericPhoneNumber.length > 3 && numericPhoneNumber.length <= 5) {
            formattedPhoneNumber = numericPhoneNumber.replace(/^(\d{3})(\d+)$/, '$1-$2');
        } else if (numericPhoneNumber.length > 5) {
            formattedPhoneNumber = numericPhoneNumber.replace(/^(\d{3})(\d{2})(\d+)$/, '$1-$2-$3');
        } else {
            formattedPhoneNumber = numericPhoneNumber;
        }
        return formattedPhoneNumber;
    }
    return phoneNumber;
}