export function isEmpty(obj: Object) {
  for (let prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
}

export function findObjectsByProperty<T>(
  array: T[],
  propertyName: keyof T,
  value: any
): T | undefined {
  return array.find((obj) => obj[propertyName] === value);
}
