export function uuidv4(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => {
    const randomValue = crypto.getRandomValues(new Uint8Array(1))[0];
    const maskedValue = randomValue & (15 >> (parseInt(c, 10) / 4));
    return maskedValue.toString(16);
  });
}
