// Утилиты для форматирования дат и расчёта длительности
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// Константы форматов
const SHORT_DATE_PATTERN = 'MMM D';
const SHORT_TIME_PATTERN = 'HH:mm';
const LONG_DATE_PATTERN = 'DD/MM/YY HH:mm';

// Форматирование даты (день + месяц)
function humanizePointDate(rawDate) {
  return rawDate ? dayjs(rawDate).format(SHORT_DATE_PATTERN) : '';
}

// Форматирование времени (часы + минуты)
function humanizePointTime(rawDate) {
  return rawDate ? dayjs(rawDate).format(SHORT_TIME_PATTERN) : '';
}

// Полное форматирование даты
function humanizeFullDate(rawDate) {
  return rawDate ? dayjs(rawDate).format(LONG_DATE_PATTERN) : '';
}

// Расчёт длительности между двумя датами (формат: 01D 02H 30M)
function getPointDuration(startDate, endDate) {
  const startMoment = dayjs(startDate);
  const endMoment = dayjs(endDate);
  const diffMs = endMoment.diff(startMoment);
  const durationObj = dayjs.duration(diffMs);

  const totalDays = Math.floor(durationObj.asDays());
  const totalHours = durationObj.hours();
  const totalMinutes = durationObj.minutes();

  let result = '';

  if (totalDays > 0) {
    result += `${String(totalDays).padStart(2, '0')}D `;
    result += `${String(totalHours).padStart(2, '0')}H `;
    result += `${String(totalMinutes).padStart(2, '0')}M`;
  } else if (totalHours > 0) {
    result += `${String(totalHours).padStart(2, '0')}H `;
    result += `${String(totalMinutes).padStart(2, '0')}M`;
  } else {
    result += `${String(totalMinutes).padStart(2, '0')}M`;
  }

  return result;
}

// Форматирование диапазона дат для шапки маршрута
function formatTripDates(fromDate, toDate) {
  const from = dayjs(fromDate);
  const to = dayjs(toDate);

  // Если в пределах одного месяца
  if (from.isSame(to, 'month')) {
    return `${from.format('D')}&nbsp;&mdash;&nbsp;${to.format('D MMM')}`;
  }

  // Разные месяцы
  return `${from.format('D MMM')}&nbsp;&mdash;&nbsp;${to.format('D MMM')}`;
}

// Экспорт всех функций
export {
  humanizePointDate,
  humanizePointTime,
  humanizeFullDate,
  getPointDuration,
  formatTripDates
};
