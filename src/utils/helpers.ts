export function isEmpty(obj: Object) {
  for (var prop in obj) {
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
): T[] {
  return array.filter((obj) => obj[propertyName] === value);
}
