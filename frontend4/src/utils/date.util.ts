export function getDateTodayInYMD() {
  const today = new Date();
  const date = addPreZero(today.getDate().toString());
  const month = addPreZero((today.getMonth() + 1).toString());
  const year = today.getFullYear();
  return `${year}-${month}-${date}`
}

export function addPreZero(str: string) {
  if (str.length === 1) {
    return `0${str}`
  }
  return str;
}