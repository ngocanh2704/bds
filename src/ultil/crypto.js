import CryptoJS from "crypto-js";
const SECRET_KEY = "djdsfajhfjdsa";

export const decryptData = (data) => {
    try {
        const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
        const decryptedData  = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.log('Decrypt data error',error);
        return null;
    }
};

