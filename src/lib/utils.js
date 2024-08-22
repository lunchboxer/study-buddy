export const camelCase = str =>
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return ''
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })

export const toSnakeCase = str => str.toLowerCase().replace(/\s/g, '_')

// sqlite stores dates as '2022-01-01 12:00:00'. Javescript thinks this is local time.
export const dateToLocal = date => {
  if (!date) {
    return ''
  }
  const [datePart, timePart] = date.split(' ')
  const fixedDate = new Date(`${datePart}T${timePart}.000Z`)
  return new Date(fixedDate).toLocaleString()
}
