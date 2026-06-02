// Модель для работы с точками маршрута, направлениями и предложениями
import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #apiService = null;
  #routePoints = [];
  #cityDestinations = [];
  #availableOffers = [];

  /**
   * @param {Object} config - настройки модели
   * @param {PointsApiService} config.pointsApiService - APi сервис
   */
  constructor({pointsApiService}) {
    super();
    this.#apiService = pointsApiService;
  }

  // Геттеры для доступа к данным извне
  get points() {
    return this.#routePoints;
  }

  get destinations() {
    return this.#cityDestinations;
  }

  get offers() {
    return this.#availableOffers;
  }

  /**
   * Загрузка всех данных с сервера
   */
  async init() {
    try {
      const fetchedPoints = await this.#apiService.points;
      this.#cityDestinations = await this.#apiService.destinations;
      this.#availableOffers = await this.#apiService.offers;
      this.#routePoints = fetchedPoints.map(this.#normalizeToClient);
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#routePoints = [];
      this.#cityDestinations = [];
      this.#availableOffers = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  /**
   * Обновление существующей точки
   */
  async updatePoint(updateType, updatedData) {
    const targetIndex = this.#routePoints.findIndex((item) => item.id === updatedData.id);

    if (targetIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const serverResponse = await this.#apiService.updatePoint(updatedData);
      const normalizedPoint = this.#normalizeToClient(serverResponse);
      this.#routePoints = [
        ...this.#routePoints.slice(0, targetIndex),
        normalizedPoint,
        ...this.#routePoints.slice(targetIndex + 1),
      ];
      this._notify(updateType, normalizedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  /**
   * Добавление новой точки
   */
  async addPoint(updateType, newPointData) {
    try {
      const serverResponse = await this.#apiService.addPoint(newPointData);
      const normalizedPoint = this.#normalizeToClient(serverResponse);
      this.#routePoints = [
        normalizedPoint,
        ...this.#routePoints,
      ];
      this._notify(updateType, normalizedPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  /**
   * Удаление точки
   */
  async deletePoint(updateType, pointToDelete) {
    const targetIndex = this.#routePoints.findIndex((item) => item.id === pointToDelete.id);

    if (targetIndex === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(pointToDelete);
      this.#routePoints = [
        ...this.#routePoints.slice(0, targetIndex),
        ...this.#routePoints.slice(targetIndex + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  /**
   * Приведение данных от сервера к формату клиента
   */
  #normalizeToClient = (serverPoint) => {
    const clientPoint = {...serverPoint,
      basePrice: serverPoint['base_price'],
      dateFrom: serverPoint['date_from'] !== null ? new Date(serverPoint['date_from']) : serverPoint['date_from'],
      dateTo: serverPoint['date_to'] !== null ? new Date(serverPoint['date_to']) : serverPoint['date_to'],
      isFavorite: serverPoint['is_favorite'],
    };

    delete clientPoint['base_price'];
    delete clientPoint['date_from'];
    delete clientPoint['date_to'];
    delete clientPoint['is_favorite'];

    return clientPoint;
  };
}
