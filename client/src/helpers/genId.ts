export function genId(length = 25) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRS-TUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let counter = 0; counter < length; counter++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}
