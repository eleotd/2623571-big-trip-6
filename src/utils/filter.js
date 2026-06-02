// Утилиты для фильтрации точек маршрута
import dayjs from 'dayjs';
import {FilterType} from '../const.js';

// Вспомогательные проверки для типов фильтров
const checkFuture = (startDate) => dayjs(startDate).isAfter(dayjs());
const checkPresent = (startDate, endDate) =>
  dayjs(startDate).isSame(dayjs()) ||
  (dayjs(startDate).isBefore(dayjs()) && dayjs(endDate).isAfter(dayjs()));
const checkPast = (endDate) => dayjs(endDate).isBefore(dayjs());

// Объект с фильтрами
const filter = {
  [FilterType.EVERYTHING]: (items) => items,
  [FilterType.FUTURE]: (items) => items.filter((item) => checkFuture(item.dateFrom)),
  [FilterType.PRESENT]: (items) => items.filter((item) => checkPresent(item.dateFrom, item.dateTo)),
  [FilterType.PAST]: (items) => items.filter((item) => checkPast(item.dateTo)),
};

export {filter};
