export function classes<T>(...arr: T[]) {
  return arr
    .filter(Boolean)
    .filter((s) => s !== " " && s !== "0")
    .join(" ");
}
