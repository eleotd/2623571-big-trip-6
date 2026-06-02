// Сервис для работы с API (точки, направления, предложения)
import ApiService from './framework/api-service.js';

// HTTP-методы
const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  // Загрузка всех точек маршрута
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  // Загрузка направлений
  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  // Загрузка предложений
  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  // Обновление существующей точки
  async updatePoint(pointData) {
    const serverResponse = await this._load({
      url: `points/${pointData.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(this.#convertToServer(pointData)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedData = await ApiService.parseResponse(serverResponse);
    return parsedData;
  }

  // Добавление новой точки
  async addPoint(pointData) {
    const serverResponse = await this._load({
      url: 'points',
      method: HttpMethod.POST,
      body: JSON.stringify(this.#convertToServer(pointData)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedData = await ApiService.parseResponse(serverResponse);
    return parsedData;
  }

  // Удаление точки
  async deletePoint(pointData) {
    const serverResponse = await this._load({
      url: `points/${pointData.id}`,
      method: HttpMethod.DELETE,
    });

    return serverResponse;
  }

  // Адаптация данных клиента к формату сервера
  #convertToServer(clientPoint) {
    const serverPoint = {...clientPoint,
      'base_price': clientPoint.basePrice,
      'date_from': clientPoint.dateFrom instanceof Date ? clientPoint.dateFrom.toISOString() : clientPoint.dateFrom,
      'date_to': clientPoint.dateTo instanceof Date ? clientPoint.dateTo.toISOString() : clientPoint.dateTo,
      'is_favorite': clientPoint.isFavorite,
    };

    delete serverPoint.basePrice;
    delete serverPoint.dateFrom;
    delete serverPoint.dateTo;
    delete serverPoint.isFavorite;

    return serverPoint;
  }
}
