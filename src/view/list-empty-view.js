// Представление сообщения "нет точек" для разных типов фильтров
import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

// Текст сообщений в зависимости от фильтра
const EmptyMessageByFilter = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

// Генерация HTML пустого списка
function buildEmptyListMarkup(activeFilter) {
  const message = EmptyMessageByFilter[activeFilter];
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class ListEmptyView extends AbstractView {
  #currentFilter = null;

  constructor(filterType) {
    super();
    this.#currentFilter = filterType;
  }

  get template() {
    return buildEmptyListMarkup(this.#currentFilter);
  }
}
