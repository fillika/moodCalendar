//new Date.getDay(); - получить день (0 - 6. День 6 - это суббота)
//new Date().getMonth(); - получить месяц (0 - 11. День 11 - это Декабрь)

import { createEl, getDaysInMonth } from './helpers';

const days: string[] = ['Mo', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // массив дней недели
const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]; // массив дней недели

/**
 * Функция для получения текущего года
 */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

function createMonth(days: string[]) {
  const div: HTMLElement = createEl('div');
  const table: HTMLElement = createEl('table');
  const thead: HTMLElement = createEl('thead');
  const tbody: HTMLElement = createEl('tbody');
  const tr: HTMLElement = createEl('tr');
  const td: HTMLElement = createEl('td');
  const h3: HTMLElement = createEl('h3');

  div.classList.add('month');
  h3.classList.add('month-name');

  const currentYear = new Date().getFullYear();
  const startMonth = 0; // Номер месяца (по умолчанию 0 - Январь)

  /**
   * Создаю шапку с днями недели
   */
  function createWeekString(days: string[], tr: HTMLElement): void {

    days.forEach(day => {
      const th: HTMLElement = createEl('th');
      th.innerHTML = day;

      tr.appendChild(th);
    });
  }

  /**
   * Создаю дни в месяце
   */
  function createDays(year: number, month: number): void {
    const dayOfWeek = new Date(year, month, 1).getDay(); // День недели первого дня месяца
    const totalDays: number = getDaysInMonth(month); // кол-во дней в месяце
    const tr: HTMLElement = createEl('tr');

    for (let i = 1; i <= totalDays; i++) {
      const td: HTMLElement = createEl('td');

      td.innerHTML = i.toString();
      tr.appendChild(td);
    }

    console.log(tr);
  }

  createDays(currentYear, startMonth);
  createWeekString(days, tr);
}

createMonth(days);
