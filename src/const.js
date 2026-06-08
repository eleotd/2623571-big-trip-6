// Файл констант приложения

// Доступные типы точек маршрута
const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

// Типы сортировки
const SortOptions = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

// Действия пользователя
const UserActivity = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

// Типы обновлений модели
const RefreshType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

// Типы фильтров
const FilterOptions = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

// Единый экспорт
export {
  EVENT_TYPES as POINT_TYPES,
  SortOptions as SortType,
  UserActivity as UserAction,
  RefreshType as UpdateType,
  FilterOptions as FilterType,
};
