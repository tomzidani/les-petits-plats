export const isInArray = (arr, val) => {
  return arr.filter((el) => isBetween(val.length - 2, val.length + 2, el) && el.toLowerCase().indexOf(val.toLowerCase()) !== -1).length
}

export const isBetween = (min, max, val) => {
  return val.length <= max && val.length >= min
}

export const isInArrayObject = (arr, val, property) => {
  return arr.filter((el) => isBetween(val.length - 2, val.length + 2, el[property]) && el[property].toLowerCase().indexOf(val.toLowerCase()) !== -1)
    .length
}
