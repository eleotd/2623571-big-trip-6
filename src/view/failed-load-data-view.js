// Представление сообщения об ошибке загрузки данных
import AbstractView from '../framework/view/abstract-view.js';

// Генерация сообщения об ошибке
function buildErrorMarkup() {
  return '<p class="trip-events__msg">Failed to load latest route information</p>';
}

export default class FailedLoadDataView extends AbstractView {
  get template() {
    return buildErrorMarkup();
  }
}
