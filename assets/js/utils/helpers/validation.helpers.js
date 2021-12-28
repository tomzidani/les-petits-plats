export const isEmpty = (val) => {
  return val == null || val.length === 0
}

export const isBetween = (min, max, val) => {
  return val.length <= max && val.length >= min
}

export const isPartiallyInArray = (arr, val) => {
  val = val.toLowerCase()
  const min = val.length - 2
  const max = val.length + 2

  const result = arr.filter((el) => {
    el = el.toLowerCase()

    if (!isBetween(min, max, el)) return

    return el.indexOf(val) !== -1 || `${el}s`.indexOf(val) !== -1 || val.includes(el) || `${val}s`.includes(el)
  })

  return result.length
}

export const isPartiallyInArrayObject = (arr, val, property) => {
  val = val.toLowerCase()
  const min = val.length - 2
  const max = val.length + 2

  const result = arr.filter((el) => {
    el = typeof el === "object" ? el[property].toLowerCase() : el

    if (!isBetween(min, max, el)) return

    return el.indexOf(val) !== -1 || `${el}s`.indexOf(val) !== -1 || val.includes(el) || `${val}s`.includes(el)
  })

  return result.length
}
