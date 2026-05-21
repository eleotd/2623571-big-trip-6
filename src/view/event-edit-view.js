import { createElement } from '../render.js';

const createOffersEditTemplate = (offers, selectedOffers) => {
  if (!offers || offers.length === 0) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.replace(/\s/g, '-')}-1" type="checkbox" name="event-offer-${offer.title.replace(/\s/g, '-')}" ${selectedOffers.includes(offer.title) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${offer.title.replace(/\s/g, '-')}-1">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};

const createDestinationTemplate = (destination) => {
  if (!destination || !destination.description) {
    return '';
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
    </section>
  `;
};

const createEventEditTemplate = (point, destinations, offersByType) => {
  const { type, destination, startTime, endTime, price, selectedOffers, isNew } = point;
  const availableOffers = offersByType[type] || [];

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'].map((t) => `
                <div class="event__type-item">
                  <input id="event-type-${t}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${t}" ${type === t ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--${t}" for="event-type-${t}-1">${t.charAt(0).toUpperCase() + t.slice(1)}</label>
                </div>
              `).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinations.map((d) => `<option value="${d.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${isNew ? 'Save' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createOffersEditTemplate(availableOffers, selectedOffers)}
        ${createDestinationTemplate(destinations.find((d) => d.name === destination))}
      </section>
    </form>
  `;
};

export default class EventEditView {
  constructor(point, destinations, offersByType) {
    this.point = point;
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(createEventEditTemplate(this.point, this.destinations, this.offersByType));
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
