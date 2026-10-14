function isPlainObject(obj: any) {
    if (obj === null || typeof obj !== "object") return false;
    return Object.getPrototypeOf(obj) === Object.prototype;
}

export function debugCheck(obj: any, name = "obj") {
    try {
        console.log(`${name} typeof`, typeof obj);
        console.log(`${name} proto`, Object.getPrototypeOf(obj));
        console.log(`${name} toString`, Object.prototype.toString.call(obj));
        console.log(`${name} isPlainObject`, isPlainObject(obj));
        // try JSON stringify
        JSON.stringify(obj);
        console.log(`[DEBUG] ${name} JSON.stringify: OK`);
    } catch (err) {
        console.error(`[DEBUG] ${name} JSON.stringify failed:`, err);
    }
}
