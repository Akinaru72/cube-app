// Permutation.js

export function factorial(n) {
  let f = 1;
  while (n > 1) {
    f *= n--;
  }
  return f;
}

export function permToIndex(perm) {
  let index = 0;
  for (let i = 0; i < perm.length - 1; i++) {
    let smaller = 0;
    for (let j = i + 1; j < perm.length; j++) {
      if (perm[j] < perm[i]) smaller++;
    }
    index += smaller * factorial(perm.length - i - 1);
  }
  return index;
}

export function indexToPerm(index, size) {
  const numbers = [];
  for (let i = 0; i < size; i++) {
    numbers.push(i);
  }

  const perm = [];
  for (let i = size - 1; i >= 0; i--) {
    const f = factorial(i);
    const k = Math.floor(index / f);
    index %= f;
    perm.push(numbers.splice(k, 1)[0]);
  }
  return perm;
}
