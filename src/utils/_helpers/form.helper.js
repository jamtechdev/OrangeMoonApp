/* eslint-disable prettier/prettier */
export const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

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
