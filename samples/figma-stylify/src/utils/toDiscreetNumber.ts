/**
 * Find the number in an array that is closest to a given goal number.
 *
 * @param {number} goal - The goal number
 * @param {Array<number>} array - The array of numbers to search through
 * @return {number} - The index in the array that its number is closest to the goal number
 */
export const toDiscreetNumber = (goal: number, array: Array<number>): number => {
  const length = array.length;
  let index = 1;
  let curr = Math.abs(array[0] - goal);
  let next = Math.abs(array[index] - goal);
  while (curr > next && index < length) {
    index++;
    curr = next;
    next = Math.abs(array[index] - goal);
  }
  return array[index - 1];
};
