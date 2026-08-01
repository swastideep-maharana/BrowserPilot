export function getByPath(obj: any, path: string): any {
    const parts = path.replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean);
    let current = obj;
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = current[part];
    }
    return current;
}

export function interpolate(text: string, outputs: Record<string, any>): string {
    if (!text) return text;

    return text.replace(/\{\{\s*([\w.\[\]]+)\s*\}\}/g, (match, path) => {
        const val = getByPath(outputs, path);

        if (val === null || val === undefined) {
            return "";
        }

        if (typeof val === "object") {
            try {
                return JSON.stringify(val);
            } catch (e) {
                return "";
            }
        }

        return String(val);
    });
}
