export function rgbaToHex(r: number, g: number, b: number, _a?: number): string {
    const toHex = (x: number): string => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const redHex = toHex(r);
    const greenHex = toHex(g);
    const blueHex = toHex(b);

    return `#${redHex}${greenHex}${blueHex}`;
}
