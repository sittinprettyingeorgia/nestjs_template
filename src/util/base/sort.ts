/**
 * The function `sortBy` sorts an array of objects based on a specified field, with an optional
 * tiebreaker field and sorting order.
 * @param {any[]} input - The `input` parameter is an array of elements that you want to sort based on
 * certain criteria.
 * @param {string} field - The `field` parameter in the `sortBy` function is used to specify the
 * property of the objects in the input array by which the sorting should be performed. It indicates
 * the field based on which the elements of the array will be sorted.
 * @param {'asc' | 'desc'} order - The `order` parameter in the `sortBy` function specifies the sorting
 * order for the field being sorted. It can have two possible values:
 * @param {string} tieBreaker - The `tieBreaker` parameter in the `sortBy` function is used to specify
 * a secondary field to use as a tiebreaker when the values of the primary field being sorted on are
 * equal. This helps in determining the order of elements that have the same value in the primary
 * field.
 * @returns The `sortBy` function is returning the input array sorted based on the specified field in
 * either ascending or descending order. If there are ties in the sorting based on the main field, it
 * uses the tieBreaker field to break the tie. The sorting order (asc or desc) is determined by the
 * `order` parameter.
 */
const sortBy = (
  input: any[],
  field: string,
  order: 'asc' | 'desc',
  tieBreaker: string,
) => {
  return input.sort((a, b) => {
    let comparison = 0;

    if (typeof a[field] === 'number' && typeof b[field] === 'number') {
      comparison = a[field] - b[field];
    } else {
      comparison = a[field].localeCompare(b[field]);
    }

    if (comparison === 0) {
      if (
        typeof a[tieBreaker] === 'number' &&
        typeof b[tieBreaker] === 'number'
      ) {
        return order === 'asc'
          ? a[tieBreaker] - b[tieBreaker]
          : b[tieBreaker] - a[tieBreaker];
      } else {
        return order === 'asc'
          ? a[tieBreaker].localeCompare(b[tieBreaker])
          : b[tieBreaker].localeCompare(a[tieBreaker]);
      }
    }

    return order === 'asc' ? comparison : -comparison;
  });
};

const testInput = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 33 },
  { id: 4, name: 'Emma', age: 28 },
  { id: 5, name: 'David', age: 40 },
  { id: 6, name: 'Sarah', age: 22 },
  { id: 7, name: 'Michael', age: 32 },
  { id: 8, name: 'Olivia', age: 27 },
  { id: 9, name: 'Ethan', age: 33 },
  { id: 10, name: 'Sophia', age: 33 },
];

console.log(sortBy(testInput, 'age', 'asc', 'name'));
