export function Cut(string, countSymbols) {
  let strArr = string.split('')
  if (!countSymbols) return ''
  if (strArr.length <= countSymbols) return string
  while (strArr.length > countSymbols) {
    strArr = strArr.join('').split(' ').slice(0, -1).join(' ').split('')
  }
  return `${strArr.join('')}...`
}
