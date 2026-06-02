// Презентер доски с точками маршрута, сортировкой и фильтрацией
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import LoadingView from '../view/loading-view.js';
import FailedLoadDataView from '../view/failed-load-data-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {render, remove} from '../framework/render.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const DelayLimits = {
  MIN: 350,
  MAX: 1000,
};

export default class BoardPresenter {
  #container = null;
  #pointsStore = null;
  #filterStore = null;

  #sortWidget = null;
  #listContainer = new EventListView();
  #emptyMessage = null;
  #spinner = new LoadingView();
  #errorMessage = new FailedLoadDataView();

  #presentersMap = new Map();
  #newPointHandler = null;
  #activeSort = SortType.DAY;
  #activeFilter = FilterType.EVERYTHING;
  #dataLoading = true;
  #hasError = false;
  #blocker = new UiBlocker({
    lowerLimit: DelayLimits.MIN,
    upperLimit: DelayLimits.MAX
  });

  constructor({boardContainer, pointsModel, filterModel}) {
    this.#container = boardContainer;
    this.#pointsStore = pointsModel;
    this.#filterStore = filterModel;

    this.#newPointHandler = new NewPointPresenter(this.#listContainer.element, this.#onUserAction);

    this.#pointsStore.addObserver(this.#onModelChange);
    this.#filterStore.addObserver(this.#onModelChange);
  }

  // Геттеры для внешнего доступа
  get points() {
    this.#activeFilter = this.#filterStore.filter;
    const rawPoints = this.#pointsStore.points;
    const filtered = filter[this.#activeFilter](rawPoints);

    switch (this.#activeSort) {
      case SortType.TIME:
        return filtered.sort(sortPointTime);
      case SortType.PRICE:
        return filtered.sort(sortPointPrice);
      default:
        return filtered.sort(sortPointDay);
    }
  }

  get destinations() {
    return this.#pointsStore.destinations;
  }

  get offers() {
    return this.#pointsStore.offers;
  }

  init() {
    this.#renderUI();
  }

  createPoint(callback) {
    this.#activeSort = SortType.DAY;
    this.#filterStore.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointHandler.init(callback, this.destinations, this.offers);
  }

  // Закрываем все открытые формы
  #closeAllEditors = () => {
    this.#newPointHandler.destroy();
    this.#presentersMap.forEach((presenter) => presenter.resetView());
  };

  // Обработка действий пользователя (добавление/изменение/удаление)
  #onUserAction = async (action, changeType, data) => {
    this.#blocker.block();

    switch (action) {
      case UserAction.UPDATE_POINT:
        this.#presentersMap.get(data.id).setSaving();
        try {
          await this.#pointsStore.updatePoint(changeType, data);
        } catch(err) {
          this.#presentersMap.get(data.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointHandler.setSaving();
        try {
          await this.#pointsStore.addPoint(changeType, data);
        } catch(err) {
          this.#newPointHandler.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#presentersMap.get(data.id).setDeleting();
        try {
          await this.#pointsStore.deletePoint(changeType, data);
        } catch(err) {
          this.#presentersMap.get(data.id).setAborting();
        }
        break;
    }

    this.#blocker.unblock();
  };

  // Реакция на изменения в моделях
  #onModelChange = (updateType, payload) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#presentersMap.get(payload.id).init(payload, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderUI();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortFlag: true});
        this.#renderUI();
        break;
      case UpdateType.INIT:
        this.#dataLoading = false;
        if (payload && payload.isError) {
          this.#hasError = true;
        }
        remove(this.#spinner);
        this.#renderUI();
        break;
    }
  };

  // Переключение сортировки
  #onSortChange = (newSort) => {
    if (this.#activeSort === newSort) {
      return;
    }
    this.#activeSort = newSort;
    this.#clearBoard();
    this.#renderUI();
  };

  // Отрисовка одной точки
  #renderSinglePoint(item) {
    const presenter = new PointPresenter(this.#listContainer.element, this.#onUserAction, this.#closeAllEditors);
    presenter.init(item, this.destinations, this.offers);
    this.#presentersMap.set(item.id, presenter);
  }

  // Отрисовка всех точек
  #renderAllPoints(items) {
    items.forEach((item) => this.#renderSinglePoint(item));
  }

  #renderEmptyList() {
    this.#emptyMessage = new ListEmptyView(this.#activeFilter);
    render(this.#emptyMessage, this.#container);
  }

  #renderSpinner() {
    render(this.#spinner, this.#container);
  }

  #renderError() {
    render(this.#errorMessage, this.#container);
  }

  #renderSortBar() {
    this.#sortWidget = new SortView({
      currentSortType: this.#activeSort,
      onSortTypeChange: this.#onSortChange
    });
    render(this.#sortWidget, this.#container);
  }

  #renderListArea() {
    render(this.#listContainer, this.#container);
  }

  // Очистка доски
  #clearBoard({resetSortFlag = false} = {}) {
    this.#newPointHandler.destroy();
    this.#presentersMap.forEach((presenter) => presenter.destroy());
    this.#presentersMap.clear();

    remove(this.#sortWidget);
    remove(this.#spinner);
    remove(this.#errorMessage);
    if (this.#emptyMessage) {
      remove(this.#emptyMessage);
    }

    if (resetSortFlag) {
      this.#activeSort = SortType.DAY;
    }
  }

  // Главный метод отрисовки
  #renderUI() {
    if (this.#dataLoading) {
      this.#renderSpinner();
      return;
    }

    if (this.#hasError) {
      this.#renderError();
      return;
    }

    const items = this.points;
    const total = items.length;

    if (total === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSortBar();
    this.#renderListArea();
    this.#renderAllPoints(items);
  }
}
