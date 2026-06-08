// Представление карточки события (точки маршрута)
import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDate, humanizePointTime, getPointDuration} from '../utils/date.js';

// Генерация HTML карточки события
function buildEventCardTemplate(eventData, destinationsList, offersList) {
  const {basePrice, dateFrom, dateTo, isFavorite, type} = eventData;

  const matchedDestination = destinationsList.find((destination) => destination.id === eventData.destination);
  const offersByType = offersList.find((offer) => offer.type === type);
  const availableOffers = offersByType ? offersByType.offers : [];
  const selectedOffers = availableOffers.filter((offer) => eventData.offers.includes(offer.id));

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${humanizePointDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${matchedDestination ? matchedDestination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${humanizePointTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${humanizePointTime(dateTo)}</time>
          </p>
          <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffers.map((offer) => `
            <li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>
          `).join('')}
        </ul>
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
}

export default class PointView extends AbstractView {
  #eventData = null;
  #storedDestinations = null;
  #storedOffers = null;
  #onEditTrigger = null;
  #onFavoriteTrigger = null;

  constructor({point, pointDestinations, pointOffers, onEditClick, onFavoriteClick}) {
    super();
    this.#eventData = point;
    this.#storedDestinations = pointDestinations;
    this.#storedOffers = pointOffers;
    this.#onEditTrigger = onEditClick;
    this.#onFavoriteTrigger = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEdit);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavorite);
  }

  get template() {
    return buildEventCardTemplate(this.#eventData, this.#storedDestinations, this.#storedOffers);
  }

  // Открытие формы редактирования
  #onEdit = (evt) => {
    evt.preventDefault();
    this.#onEditTrigger();
  };

  // Переключение избранного
  #onFavorite = (evt) => {
    evt.preventDefault();
    this.#onFavoriteTrigger();
  };
}
