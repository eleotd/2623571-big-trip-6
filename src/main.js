// Главный файл приложения — инициализация презентеров и моделей
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

// Настройки подключения к API
const AUTH_KEY = `Basic ${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
const API_BASE_URL = 'https://24.objects.htmlacademy.pro/big-trip';

// DOM-элементы
const mainContainer = document.querySelector('.page-main');
const headerContainer = document.querySelector('.page-header');
const tripHeaderSection = headerContainer.querySelector('.trip-main');
const filtersContainer = headerContainer.querySelector('.trip-controls__filters');
const eventsContainer = mainContainer.querySelector('.trip-events');

// Инициализация моделей
const pointsStore = new PointsModel({
  pointsApiService: new PointsApiService(API_BASE_URL, AUTH_KEY)
});
const filtersStore = new FilterModel();

// Презентер шапки с информацией о маршруте
const headerInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: tripHeaderSection,
  pointsModel: pointsStore,
});

// Презентер доски с точками
const boardViewPresenter = new BoardPresenter({
  boardContainer: eventsContainer,
  pointsModel: pointsStore,
  filterModel: filtersStore,
});

// Презентер фильтров
const filterBarPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel: filtersStore,
  pointsModel: pointsStore,
});

// Колбэк при закрытии формы создания новой точки
const onNewPointFormClosed = () => {
  document.querySelector('.trip-main__event-add-btn').disabled = false;
};

// Обработчик клика по кнопке "New Event"
const onAddButtonClick = () => {
  boardViewPresenter.createPoint(onNewPointFormClosed);
  document.querySelector('.trip-main__event-add-btn').disabled = true;
};

// Блокируем кнопку создания до загрузки данных
const addEventButton = document.querySelector('.trip-main__event-add-btn');
addEventButton.disabled = true;
addEventButton.addEventListener('click', onAddButtonClick);

// Запуск презентеров и загрузка данных
headerInfoPresenter.init();
filterBarPresenter.init();
boardViewPresenter.init();

// Загрузка данных с сервера
pointsStore.init()
  .finally(() => {
    addEventButton.disabled = false;
  });
