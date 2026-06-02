// Презентер для создания новой точки маршрута
import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #container = null;           // контейнер для вставки формы
  #onDataUpdate = null;        // колбэк при отправке формы
  #editForm = null;            // компонент формы редактирования
  #onClose = null;             // колбэк при закрытии
  #citiesList = null;          // список направлений
  #servicesList = null;        // список предложений

  constructor(pointListContainer, onUserAction) {
    this.#container = pointListContainer;
    this.#onDataUpdate = onUserAction;
  }

  // Инициализация формы создания
  init(closeCallback, destinations, offers) {
    this.#onClose = closeCallback;
    this.#citiesList = destinations;
    this.#servicesList = offers;

    // Если форма уже открыта — не создаём дубликат
    if (this.#editForm !== null) {
      return;
    }

    this.#editForm = new EditPointView({
      pointDestinations: this.#citiesList,
      pointOffers: this.#servicesList,
      onFormSubmit: this.#onSubmit,
      onDeleteClick: this.#onCancel
    });

    render(this.#editForm, this.#container, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onKeyPress);
  }

  // Закрытие формы
  destroy() {
    if (this.#editForm === null) {
      return;
    }

    this.#onClose?.();

    remove(this.#editForm);
    this.#editForm = null;

    document.removeEventListener('keydown', this.#onKeyPress);
  }

  // Блокировка формы во время сохранения
  setSaving() {
    this.#editForm.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  // Сброс состояния формы при ошибке (с "тряской")
  setAborting() {
    const resetState = () => {
      this.#editForm.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editForm.shake(resetState);
  }

  // Отправка формы
  #onSubmit = (formData) => {
    this.#onDataUpdate(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      formData,
    );
  };

  // Отмена (закрытие формы)
  #onCancel = () => {
    this.destroy();
  };

  // Обработчик нажатия Escape
  #onKeyPress = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.destroy();
    }
  };
}
