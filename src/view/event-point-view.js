import { createElement } from '../render.js';

const createOffersTemplate = (offers) => {
  if (!offers || offers.length === 0) {
    return '';
  }
  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.map((offer) => `
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
      `).join('')}
    </ul>
  `;
};

const createEventPointTemplate = (point) => {
  const { date, type, destination, startTime, endTime, duration, price, offers, isFavorite } = point;

  return `
    <div class="event">
      <time class="event__date" datetime="${date}">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTime}">${startTime.split('T')[1]}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTime}">${endTime.split('T')[1]}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${createOffersTemplate(offers)}
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  `;
};

export default class EventPointView {
  constructor(point) {
    this.point = point;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(createEventPointTemplate(this.point));
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
