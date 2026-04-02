import TripPresenter from './presenter/trip-presenter.js';

const tripEventsSection = document.querySelector('.trip-events');

if (tripEventsSection) {
  // Создаём список, если его нет
  let eventsList = document.querySelector('.trip-events__list');
  if (!eventsList) {
    eventsList = document.createElement('ul');
    eventsList.className = 'trip-events__list';
    tripEventsSection.appendChild(eventsList);
  }

  const tripPresenter = new TripPresenter(tripEventsSection);
  tripPresenter.init();
}
