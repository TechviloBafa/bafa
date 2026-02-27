/**
 * Converts Bengali digits to English digits
 */
export const bnToEn = (str: string | number): string => {
    if (str === null || str === undefined) return "";
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let result = str.toString();
    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(bengaliDigits[i], "g");
        result = result.replace(regex, englishDigits[i]);
    }
    return result;
};

/**
 * Converts English digits to Bengali digits
 */
export const enToBn = (str: string | number): string => {
    if (str === null || str === undefined) return "";
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let result = str.toString();
    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(englishDigits[i], "g");
        result = result.replace(regex, bengaliDigits[i]);
    }
    return result;
};
