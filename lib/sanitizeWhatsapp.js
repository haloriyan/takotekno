const sanitizeWhatsapp = (number, returnPrefix = null) => {
    // Remove spaces, dashes, and other non-numeric except +
    number = number.replace(/[^\d+]/g, "");

    // If starts with +62, remove it
    if (number.startsWith("+62")) {
        number = number.slice(3);
    }
    // If starts with 62 (without +), remove it
    else if (number.startsWith("62")) {
        number = number.slice(2);
    }
    // If starts with 0, remove it
    else if (number.startsWith("0")) {
        number = number.slice(1);
    }

    if (number !== "" && returnPrefix !== null) {
        number = returnPrefix+number;
    }

    return number;
}

export default sanitizeWhatsapp