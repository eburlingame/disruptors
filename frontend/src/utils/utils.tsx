export const range = (to: number, step: number = 1) => {
  if ((to < 0 && step > 0) || (to > 0 && step < 0))
    throw Error("to must be positive");

  let arr = [];
  for (let i = 0; i < to; i++) {
    arr.push(i);
  }

  return arr;
};
