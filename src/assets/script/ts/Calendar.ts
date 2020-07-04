import { createEl, getDaysInMonth, getRightDay, removeChild } from './helpers';

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

    this.setMood();
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

      /**
       * Тут Я создаю ячейки <td> с датами и помещаю их в массив
       */
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
            td.classList.add('day');
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

  private setMood(): void {
    const dayCells: NodeListOf<HTMLElement> = document.querySelectorAll('.day');

    dayCells.forEach(day => {
      day.addEventListener('click', (e) => {

        /**
         * Проверка на то, чтобы при клике на mood у меня не вызывалась снова функция
         * и работал другой функционал
         */
        if (e.target instanceof HTMLElement) {
          if (e.target.classList.contains('day__moods') || e.target.classList.contains('material-icons')) {
            const className = e.target.dataset.mood;

            replaceMood(e.target, className);
            return;
          }
        }

        /**
         * Для удаления всех mood перед открытием нового
         */
        removeChild('.day__moods');

        createMoodSelector(day);
      });
    });

    function createMoodSelector(parent: HTMLElement) {
      const moodEmotions: string[] = [
        'mood_bad',
        'sentiment_very_dissatisfied',
        'sentiment_dissatisfied',
        'sentiment_satisfied',
        'sentiment_very_satisfied',
        'cancel',
      ];
      const div = createEl('div');

      div.classList.add('day__moods');

      moodEmotions.forEach(mood => {
        const span = createEl('span');
        span.innerHTML = mood;
        span.classList.add('material-icons', 'material-icons__mood', mood);
        span.dataset.mood = mood;
        div.appendChild(span);
      });

      parent.appendChild(div);
    }

    /**
     * Установить Mood в ячейку-родитель
     */
    function replaceMood(target: HTMLElement, className: string) {
      const parent = target.closest('.day');
      const child = parent.querySelector('.day__moods');

      if (className === 'cancel') {
        parent.removeChild(child);
        return
      }

      parent.className = '';
      parent.classList.add('day', className);
    }
  }
}
