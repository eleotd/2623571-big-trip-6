// Презентер блока с информацией о путешествии (маршрут, даты, стоимость)
import TripInfoView from '../view/trip-info-view.js';
import {render, remove, RenderPosition, replace} from '../framework/render.js';
import {sortPointDay} from '../utils/sort.js';
import {formatTripDates} from '../utils/date.js';

export default class TripInfoPresenter {
  #container = null;        // контейнер для шапки маршрута
  #pointsStore = null;      // модель точек
  #infoWidget = null;       // компонент информации

  constructor({tripInfoContainer, pointsModel}) {
    this.#container = tripInfoContainer;
    this.#pointsStore = pointsModel;

    this.#pointsStore.addObserver(this.#onStoreUpdate);
  }

  // Инициализация / обновление информации
  init() {
    const allPoints = this.#pointsStore.points;

    // Если точек нет — удаляем компонент
    if (allPoints.length === 0) {
      if (this.#infoWidget) {
        remove(this.#infoWidget);
        this.#infoWidget = null;
      }
      return;
    }

    const sortedByDay = [...allPoints].sort(sortPointDay);
    const tripData = this.#buildTripSummary(sortedByDay);

    const previousWidget = this.#infoWidget;

    this.#infoWidget = new TripInfoView({tripInfo: tripData});

    if (previousWidget === null) {
      render(this.#infoWidget, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#infoWidget, previousWidget);
    remove(previousWidget);
  }

  // Реакция на изменение модели
  #onStoreUpdate = () => {
    this.init();
  };

  // Формирование данных для шапки: маршрут, даты, стоимость
  #buildTripSummary(points) {
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    // --- Маршрут (список городов) ---
    const cityNamesList = points.map((point) => {
      const matchedDestination = this.#pointsStore.destinations.find((dest) => dest.id === point.destination);
      return matchedDestination ? matchedDestination.name : '';
    });

    let routeText = '';
    if (cityNamesList.length > 3) {
      routeText = `${cityNamesList[0]} &mdash; ... &mdash; ${cityNamesList[cityNamesList.length - 1]}`;
    } else {
      routeText = cityNamesList.join(' &mdash; ');
    }

    // --- Даты ---
    const dateRange = formatTripDates(firstPoint.dateFrom, lastPoint.dateTo);

    // --- Общая стоимость (базовая цена + выбранные предложения) ---
    let totalSum = 0;

    points.forEach((point) => {
      totalSum += point.basePrice;

      const offerGroup = this.#pointsStore.offers.find((item) => item.type === point.type);
      const availableOffers = offerGroup?.offers || [];
      const chosenOffers = availableOffers.filter((offer) => point.offers.includes(offer.id));

      chosenOffers.forEach((offer) => {
        totalSum += offer.price;
      });
    });

    return {
      title: routeText,
      dates: dateRange,
      cost: totalSum
    };
  }
}
