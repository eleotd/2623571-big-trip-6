// Представление индикатора загрузки
import AbstractView from '../framework/view/abstract-view.js';

// Генерация HTML сообщения о загрузке
function buildSpinnerMarkup() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class LoadingView extends AbstractView {
  get template() {
    return buildSpinnerMarkup();
  }
}
