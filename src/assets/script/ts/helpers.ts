export function createEl(tag: string): HTMLElement {
  return document.createElement(tag);
}

export function getDaysInMonth(month: number): number {
  return 33 - new Date(2020, month, 33).getDate();
}
