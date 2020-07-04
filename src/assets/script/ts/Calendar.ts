import { createEl, getDaysInMonth, getRightDay } from './helpers';

export interface iCalendar {
  currentYear: number;
  readonly days: string[];
  readonly months: string[];
}

/**
 * В этом классе по умолчанию используется текущий год. Либо можно передать свой, тот
 * с которого начнется календарь при загрузке страницы
 */
export default class Calendar {
  currentYear: number;
  readonly days: string[];
  readonly months: string[];

  constructor(startYear: number = new Date().getFullYear()) {
    this.currentYear = startYear;
    this.days = ['Mo', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // массив дней недели
    this.months = [
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

    this.init();
  }

  init(): void {
    this.months.forEach((month, i) => {
      this.createMonth(this.days, this.currentYear, month, i);
    });
  }

  private createMonth(days: string[], currentYear: number, monthName: string, monthIndex: number): void {
    const yearContainer = document.getElementById('year');
    const div: HTMLElement = createEl('div');
    const table: HTMLElement = createEl('table');
    const thead: HTMLElement = createEl('thead');
    const tbody: HTMLElement = createEl('tbody');
    const tr: HTMLElement = createEl('tr');
    const h3: HTMLElement = createEl('h3');

    div.classList.add('month');
    h3.classList.add('month-name');
    h3.innerHTML = monthName;
    div.appendChild(h3);

    /**
     * Создаю шапку с днями недели
     */
    function createWeekString(days: string[], tr: HTMLElement): void {
      days.forEach(day => {
        const th: HTMLElement = createEl('th');
        th.innerHTML = day;

        tr.appendChild(th);
      });

      thead.appendChild(tr);
    }

    /**
     * Создаю дни в месяце
     */
    function createDays(year: number, month: number): void {
      const dayOfWeek = getRightDay(year, month); // День недели первого дня месяца
      const totalDays: number = getDaysInMonth(month); // кол-во дней в месяце
      const tdArray = createTdArray(dayOfWeek, totalDays);

      function createTdArray(dayOfWeek: number, totalDays: number): HTMLElement[] {
        const arr: HTMLElement[] = [];
        let day = 0;
        // 35 ячеек создаются (5 рядов по 7 дней в ряду, пустые скрываются стилями
        for (let i = 0; i < 35; i++) {
          const td: HTMLElement = createEl('td');
          /**
           * Проверка на кол-во дней. Заполняются только дни в месяце. А так же только начиная со дня недели
           * Тут Я складываю totalDays + dayOfWeek - потому что начинаю не сначала, а с индекса номера недели
           */
          if (i >= dayOfWeek && i < totalDays + dayOfWeek) {
            day = day + 1;
            td.innerHTML = day.toString();
          }

          arr.push(td);
        }

        return arr;
      }

      function createTbody(tbody: HTMLElement): void {
        let trArray: HTMLElement[] = [];

        tdArray.forEach(td => {

          trArray.push(td);

          if (trArray.length >= 7) {
            const tr: HTMLElement = createEl('tr');
            trArray.forEach(td => tr.appendChild(td));
            tbody.appendChild(tr);
            trArray = [];
          }
        });
      }

      createTbody(tbody);
    }

    /**
     * Вставляю месяц в календарь
     */
    function appendMonth(): void {
      table.appendChild(thead);
      table.appendChild(tbody);
      div.appendChild(table);
      yearContainer.appendChild(div);
    }

    createWeekString(days, tr);
    createDays(currentYear, monthIndex);
    appendMonth();
  }
}
