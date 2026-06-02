// Представление формы редактирования точки маршрута
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import {POINT_TYPES} from '../const.js';
import {humanizeFullDate} from '../utils/date.js';

import 'flatpickr/dist/flatpickr.min.css';

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

// Генерация HTML-разметки формы
function buildEditFormTemplate(formState, destinationsList, offersList) {
  const {basePrice, dateFrom, dateTo, type, isDisabled, isSaving, isDeleting, id} = formState;
  const uniqueSuffix = id || 'new';

  const matchedDestination = destinationsList.find((dest) => dest.id === formState.destination);
  const offersByType = offersList.find((offer) => offer.type === type);
  const currentOffers = offersByType ? offersByType.offers : [];

  const destName = matchedDestination ? matchedDestination.name : '';
  const destDescription = matchedDestination ? matchedDestination.description : '';
  const destPictures = matchedDestination ? matchedDestination.pictures : [];

  // Список типов событий (радиокнопки)
  const typeRadios = POINT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-${uniqueSuffix}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${uniqueSuffix}">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
    </div>
  `).join('');

  // Список предложений (чекбоксы)
  const offersMarkup = currentOffers.map((offer) => {
    const isChecked = formState.offers.includes(offer.id) ? 'checked' : '';
    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${uniqueSuffix}" type="checkbox" name="event-offer-${offer.id}" ${isChecked} data-offer-id="${offer.id}" ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}-${uniqueSuffix}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }).join('');

  // Выпадающий список направлений
  const destinationOptions = destinationsList.map((dest) => `<option value="${dest.name}"></option>`).join('');

  // Галерея фотографий направления
  const photosMarkup = destPictures.map((pic) => `
    <img class="event__photo" src="${pic.src}" alt="${pic.description}">
  `).join('');

  // Текст на кнопке удаления/отмены
  let resetBtnText;
  if (formState.id) {
    resetBtnText = isDeleting ? 'Deleting...' : 'Delete';
  } else {
    resetBtnText = 'Cancel';
  }

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${uniqueSuffix}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${uniqueSuffix}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typeRadios}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${uniqueSuffix}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${uniqueSuffix}" type="text" name="event-destination" value="${destName}" list="destination-list-${uniqueSuffix}" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-${uniqueSuffix}">
              ${destinationOptions}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${uniqueSuffix}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${uniqueSuffix}" type="text" name="event-start-time" value="${humanizeFullDate(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${uniqueSuffix}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${uniqueSuffix}" type="text" name="event-end-time" value="${humanizeFullDate(dateTo)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${uniqueSuffix}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${uniqueSuffix}" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${resetBtnText}
          </button>
          ${formState.id ? `
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          ` : ''}
        </header>
        <section class="event__details">
          ${currentOffers.length ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${offersMarkup}
              </div>
            </section>
          ` : ''}

          ${matchedDestination ? `
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destDescription}</p>
              ${destPictures.length ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${photosMarkup}
                  </div>
                </div>
              ` : ''}
            </section>
          ` : ''}
        </section>
      </form>
    </li>`;
}

export default class EditPointView extends AbstractStatefulView {
  #cachedDestinations = null;
  #cachedOffers = null;
  #onFormSend = null;
  #onFormClose = null;
  #onDeleteTrigger = null;
  #calendarFrom = null;
  #calendarTo = null;

  constructor({point = EMPTY_POINT, pointDestinations, pointOffers, onFormSubmit, onFormClick, onDeleteClick}) {
    super();
    this._setState(EditPointView.convertPointToState(point));
    this.#cachedDestinations = pointDestinations;
    this.#cachedOffers = pointOffers;
    this.#onFormSend = onFormSubmit;
    this.#onFormClose = onFormClick;
    this.#onDeleteTrigger = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return buildEditFormTemplate(this._state, this.#cachedDestinations, this.#cachedOffers);
  }

  removeElement() {
    super.removeElement();

    if (this.#calendarFrom) {
      this.#calendarFrom.destroy();
      this.#calendarFrom = null;
    }

    if (this.#calendarTo) {
      this.#calendarTo.destroy();
      this.#calendarTo = null;
    }
  }

  reset(pointData) {
    this.updateElement(
      EditPointView.convertPointToState(pointData),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#onFormSendHandler);

    const collapseBtn = this.element.querySelector('.event__rollup-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', this.#onFormCloseHandler);
    }

    this.element.querySelector('.event__type-group').addEventListener('change', this.#onTypeSelect);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationSelect);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onResetClick);

    const offersContainer = this.element.querySelector('.event__available-offers');
    if (offersContainer) {
      offersContainer.addEventListener('change', this.#onOfferToggle);
    }

    this.#initDatepickers();
  }

  #onTypeSelect = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #onDestinationSelect = (evt) => {
    evt.preventDefault();
    const selected = this.#cachedDestinations.find((dest) => dest.name === evt.target.value);

    if (!selected) {
      evt.target.value = '';
      return;
    }

    this.updateElement({
      destination: selected.id,
    });
  };

  #onOfferToggle = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedBoxes.map((box) => box.dataset.offerId)
    });
  };

  #onPriceInput = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #onFormSendHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSend(EditPointView.convertStateToPoint(this._state));
  };

  #onFormCloseHandler = (evt) => {
    evt.preventDefault();
    this.#onFormClose();
  };

  #onResetClick = (evt) => {
    evt.preventDefault();
    this.#onDeleteTrigger(EditPointView.convertStateToPoint(this._state));
  };

  #onDateFromChange = ([selectedDate]) => {
    this.updateElement({
      dateFrom: selectedDate,
    });
  };

  #onDateToChange = ([selectedDate]) => {
    this.updateElement({
      dateTo: selectedDate,
    });
  };

  #initDatepickers() {
    const elementId = this._state.id || 'new';

    this.#calendarFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${elementId}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#onDateFromChange,
      },
    );

    this.#calendarTo = flatpickr(
      this.element.querySelector(`#event-end-time-${elementId}`),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#onDateToChange,
      },
    );
  }

  static convertPointToState(pointData) {
    return {...pointData,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static convertStateToPoint(stateData) {
    const result = {...stateData};
    delete result.isDisabled;
    delete result.isSaving;
    delete result.isDeleting;
    return result;
  }
}
