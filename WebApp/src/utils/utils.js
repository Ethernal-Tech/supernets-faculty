
export const sleep = function(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

export const isStringValueAnInt = strValue => {
    if (typeof strValue !== "string") return false 
    return !isNaN(strValue) && !isNaN(parseInt(strValue))
}