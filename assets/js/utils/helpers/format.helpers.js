export const capitalizeFirstLetter = (val) => {
  return val.charAt(0).toUpperCase() + val.slice(1)
}

export const sortAlphabetically = (arr) => {
  return arr.sort()
}

export const tronque = (val) => {
  return val.slice(0, 180) + "..."
}
