// Модель для управления текущим типом фильтра
import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class FilterModel extends Observable {
  // Текущий выбранный фильтр (по умолчанию — всё)
  #currentFilter = FilterType.EVERYTHING;

  // Геттер возвращает активный фильтр
  get filter() {
    return this.#currentFilter;
  }

  // Обновляет фильтр и уведомляет подписчиков
  setFilter(updateType, newFilter) {
    this.#currentFilter = newFilter;
    this._notify(updateType, newFilter);
  }
}
