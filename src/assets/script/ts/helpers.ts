export function createEl(tag: string): HTMLElement {
  return document.createElement(tag);
}

export function getDaysInMonth(month: number): number {
  return 33 - new Date(2020, month, 33).getDate();
}

export function getRightDay(year: number, month: number): number {
  let numberOfWeekDay = new Date(year, month, 1).getDay() - 1;

  if (numberOfWeekDay === -1) {
    numberOfWeekDay = 6;
  }

  return numberOfWeekDay;
}
