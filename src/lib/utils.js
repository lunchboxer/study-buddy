export const camelCase = str =>
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ''
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })

export const toSnakeCase = str => str.toLowerCase().replace(/\s/g, '_')
