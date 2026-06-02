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

// Экспорт для обратной совместимости (сохраняем старые имена для импортов)
export const POINT_TYPES = EVENT_TYPES;
export const SortType = SortOptions;
export const UserAction = UserActivity;
export const UpdateType = RefreshType;
export const FilterType = FilterOptions;
