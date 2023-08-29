function padTo2Digits(num) {
  return num.toString().padStart(2, '0')
}

export function formatDate(date) {
  return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(
    '-'
  )
}

export function getDates(startDate: Date, stopDate: Date) {
  var dateArray: string[] = []
  var currentDate = startDate
  while (currentDate <= stopDate) {
    dateArray.push(formatDate(currentDate))
    const tempDate = new Date(currentDate)
    tempDate.setDate(tempDate.getDate() + 1)
    currentDate = tempDate
  }
  return dateArray
}

export function removeDays(date: Date, nb: number): Date {
  const tempDate = new Date(date)
  tempDate.setDate(tempDate.getDate() - nb)
  return tempDate
}
