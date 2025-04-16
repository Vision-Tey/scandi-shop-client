export const toKebabCase = (str: string | null): string => {
    if (str !== null) {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') 
            .replace(/^-+|-+$/g, '');
    }
    return ''; // Return empty string if input is null
};
