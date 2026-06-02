// Представление блока фильтров
import AbstractView from '../framework/view/abstract-view.js';

// Генерация одного элемента фильтра
function buildFilterItemMarkup(filterItem, activeFilterType) {
  const {type, count} = filterItem;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === activeFilterType ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

// Генерация всей формы фильтров
function buildFiltersFormMarkup(filtersList, currentFilter) {
  const itemsHtml = filtersList
    .map((filter) => buildFilterItemMarkup(filter, currentFilter))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${itemsHtml}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filtersData = null;
  #activeFilter = null;
  #onFilterChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filtersData = filters;
    this.#activeFilter = currentFilterType;
    this.#onFilterChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#onFilterSelect);
  }

  get template() {
    return buildFiltersFormMarkup(this.#filtersData, this.#activeFilter);
  }

  // Обработчик выбора фильтра
  #onFilterSelect = (evt) => {
    evt.preventDefault();
    this.#onFilterChange(evt.target.value);
  };
}
