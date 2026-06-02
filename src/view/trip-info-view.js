// Представление блока с информацией о путешествии (маршрут, даты, стоимость)
import AbstractView from '../framework/view/abstract-view.js';

// Генерация HTML шапки маршрута
function buildTripHeaderMarkup(tripData) {
  const {title, dates, cost} = tripData;

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`;
}

export default class TripInfoView extends AbstractView {
  #tripSummary = null;

  constructor({tripInfo}) {
    super();
    this.#tripSummary = tripInfo;
  }

  get template() {
    return buildTripHeaderMarkup(this.#tripSummary);
  }
}
