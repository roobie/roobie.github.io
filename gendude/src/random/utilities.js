
export function randomIndex (arr) {
  return (Math.random() * arr.length) | 0
}

export function pickOne (arr) {
  return arr[randomIndex(arr)]
}