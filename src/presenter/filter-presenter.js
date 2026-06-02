// Презентер блока фильтров
import FilterView from '../view/filter-view.js';
import {render, replace, remove} from '../framework/render.js';
import {FilterType, UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class FilterPresenter {
  #container = null;      // контейнер для фильтров
  #filterStore = null;    // модель фильтра
  #pointsStore = null;    // модель точек

  #filterWidget = null;   // компонент фильтра

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#container = filterContainer;
    this.#filterStore = filterModel;
    this.#pointsStore = pointsModel;

    this.#pointsStore.addObserver(this.#onDataChange);
    this.#filterStore.addObserver(this.#onDataChange);
  }

  // Получение списка фильтров с количеством подходящих точек
  get filters() {
    const allPoints = this.#pointsStore.points;

    return Object.values(FilterType).map((filterType) => ({
      type: filterType,
      count: filter[filterType](allPoints).length,
    }));
  }

  // Инициализация или обновление фильтров
  init() {
    const availableFilters = this.filters;
    const previousComponent = this.#filterWidget;

    this.#filterWidget = new FilterView({
      filters: availableFilters,
      currentFilterType: this.#filterStore.filter,
      onFilterTypeChange: this.#onFilterChange
    });

    if (previousComponent === null) {
      render(this.#filterWidget, this.#container);
      return;
    }

    replace(this.#filterWidget, previousComponent);
    remove(previousComponent);
  }

  // Реакция на изменения в моделях
  #onDataChange = () => {
    this.init();
  };

  // Переключение типа фильтра
  #onFilterChange = (selectedType) => {
    if (this.#filterStore.filter === selectedType) {
      return;
    }
    this.#filterStore.setFilter(UpdateType.MAJOR, selectedType);
  };
}
