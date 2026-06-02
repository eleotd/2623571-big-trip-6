// Представление списка событий (контейнер для карточек)
import AbstractView from '../framework/view/abstract-view.js';

// Генерация пустого списка
function buildEventListMarkup() {
  return '<ul class="trip-events__list"></ul>';
}

export default class EventListView extends AbstractView {
  get template() {
    return buildEventListMarkup();
  }
}
