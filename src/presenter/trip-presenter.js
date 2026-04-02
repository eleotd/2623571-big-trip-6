import { render } from '../render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventPointView from '../view/event-point-view.js';
import EventEditView from '../view/event-edit-view.js';

// Мок-данные для демонстрации
const mockDestinations = [
  { name: 'Amsterdam', description: 'Amsterdam is the capital of the Netherlands.' },
  { name: 'Geneva', description: 'Geneva is a city in Switzerland.' },
  { name: 'Chamonix', description: 'Chamonix is a resort area near the junction of France, Switzerland and Italy.' },
];

const mockOffersByType = {
  taxi: [{ title: 'Order Uber', price: 20 }, { title: 'Rent a car', price: 200 }],
  flight: [{ title: 'Add luggage', price: 50 }, { title: 'Switch to comfort', price: 80 }, { title: 'Add meal', price: 15 }],
  drive: [{ title: 'Rent a car', price: 200 }],
  'check-in': [{ title: 'Add breakfast', price: 50 }],
  sightseeing: [{ title: 'Book tickets', price: 40 }, { title: 'Lunch in city', price: 30 }],
  bus: [],
  train: [],
  ship: [],
  restaurant: [],
};

const mockPoints = [
  {
    date: 'MAR 18',
    type: 'taxi',
    destination: 'Amsterdam',
    startTime: '2019-03-18T10:30',
    endTime: '2019-03-18T11:00',
    duration: '30M',
    price: 20,
    offers: [{ title: 'Order Uber', price: 20 }],
    isFavorite: true,
  },
  {
    date: 'MAR 18',
    type: 'flight',
    destination: 'Chamonix',
    startTime: '2019-03-18T12:25',
    endTime: '2019-03-18T13:35',
    duration: '01H 10M',
    price: 160,
    offers: [{ title: 'Add luggage', price: 50 }, { title: 'Switch to comfort', price: 80 }],
    isFavorite: false,
  },
  {
    date: 'MAR 18',
    type: 'drive',
    destination: 'Chamonix',
    startTime: '2019-03-18T14:30',
    endTime: '2019-03-18T16:05',
    duration: '01H 35M',
    price: 160,
    offers: [{ title: 'Rent a car', price: 200 }],
    isFavorite: true,
  },
];

const mockEditPoint = {
  type: 'flight',
  destination: 'Chamonix',
  startTime: '18/03/19 12:25',
  endTime: '18/03/19 13:35',
  price: 160,
  selectedOffers: ['Add luggage', 'Switch to comfort'],
  isNew: false,
};

export default class TripPresenter {
  constructor(container) {
    this.container = container;
    this.filtersView = new FiltersView();
    this.sortView = new SortView();
    this.eventEditView = new EventEditView(mockEditPoint, mockDestinations, mockOffersByType);
    this.eventPointViews = mockPoints.map((point) => new EventPointView(point));
  }

  init() {
    // Рендерим фильтры
    const filtersContainer = document.querySelector('.trip-controls__filters');
    if (filtersContainer) {
      render(this.filtersView, filtersContainer);
    }

    // Рендерим сортировку
    const tripEventsSection = document.querySelector('.trip-events');
    if (tripEventsSection) {
      render(this.sortView, tripEventsSection);
    }

    // Рендерим форму редактирования (первой в списке)
    const eventsList = document.querySelector('.trip-events__list');
    if (eventsList) {
      render(this.eventEditView, eventsList);
    }

    // Рендерим точки маршрута (3 штуки)
    if (eventsList) {
      this.eventPointViews.forEach((pointView) => {
        render(pointView, eventsList);
      });
    }
  }
}
