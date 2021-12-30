export function getDateTodayInYMD() {
  const targetDate = new Date();
  return getDateInYMD(targetDate);
}

export function getDateInYMD(targetDate: Date) {
  const date = addPreZero(targetDate.getDate().toString());
  const month = addPreZero((targetDate.getMonth() + 1).toString());
  const year = targetDate.getFullYear();
  return `${year}-${month}-${date}`
}

export function addPreZero(str: string) {
  if (str.length === 1) {
    return `0${str}`
  }
  return str;
}