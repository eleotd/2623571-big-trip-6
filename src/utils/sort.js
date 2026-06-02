// Утилиты для сортировки точек маршрута
import dayjs from 'dayjs';

// Вспомогательная функция для обработки null-значений в датах
function getNullDateWeight(dateLeft, dateRight) {
  if (dateLeft === null && dateRight === null) {
    return 0;
  }

  if (dateLeft === null) {
    return 1;
  }

  if (dateRight === null) {
    return -1;
  }

  return null;
}

// Сортировка по дате начала (от ранней к поздней)
function sortPointDay(itemA, itemB) {
  const weight = getNullDateWeight(itemA.dateFrom, itemB.dateFrom);

  return weight ?? dayjs(itemA.dateFrom).diff(dayjs(itemB.dateFrom));
}

// Сортировка по длительности (от большей к меньшей)
function sortPointTime(itemA, itemB) {
  const durationOfA = dayjs(itemA.dateTo).diff(dayjs(itemA.dateFrom));
  const durationOfB = dayjs(itemB.dateTo).diff(dayjs(itemB.dateFrom));

  return durationOfB - durationOfA;
}

// Сортировка по цене (от большей к меньшей)
function sortPointPrice(itemA, itemB) {
  return itemB.basePrice - itemA.basePrice;
}

export {sortPointDay, sortPointTime, sortPointPrice};
