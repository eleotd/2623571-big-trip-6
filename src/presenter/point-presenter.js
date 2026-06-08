// Презентер одной точки маршрута (карточка + форма редактирования)
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render, replace, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import dayjs from 'dayjs';

const ViewMode = {
  COMPACT: 'COMPACT',
  EXPANDED: 'EXPANDED',
};

function areDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export default class PointPresenter {
  #parentContainer = null;
  #onDataChange = null;
  #onModeSwitch = null;

  #cardComponent = null;
  #editComponent = null;

  #currentPoint = null;
  #destinationsList = null;
  #offersList = null;
  #activeMode = ViewMode.COMPACT;

  constructor(container, onDataUpdate, onModeChange) {
    this.#parentContainer = container;
    this.#onDataChange = onDataUpdate;
    this.#onModeSwitch = onModeChange;
  }

  // Инициализация презентера
  init(pointData, destinations, offers) {
    this.#currentPoint = pointData;
    this.#destinationsList = destinations;
    this.#offersList = offers;

    const previousCard = this.#cardComponent;
    const previousForm = this.#editComponent;

    // Создаём карточку
    this.#cardComponent = new PointView({
      point: this.#currentPoint,
      pointDestinations: this.#destinationsList,
      pointOffers: this.#offersList,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteToggle,
    });

    // Создаём форму редактирования
    this.#editComponent = new EditPointView({
      point: this.#currentPoint,
      pointDestinations: this.#destinationsList,
      pointOffers: this.#offersList,
      onFormSubmit: this.#onFormSend,
      onFormClick: this.#onFormCancel,
      onDeleteClick: this.#onDeleteConfirm,
    });

    // Первичная отрисовка
    if (previousCard === null || previousForm === null) {
      render(this.#cardComponent, this.#parentContainer);
      return;
    }

    // Замена существующих компонентов
    if (this.#activeMode === ViewMode.COMPACT) {
      replace(this.#cardComponent, previousCard);
    }

    if (this.#activeMode === ViewMode.EXPANDED) {
      replace(this.#editComponent, previousForm);
    }

    remove(previousCard);
    remove(previousForm);
  }

  // Полное удаление презентера
  destroy() {
    remove(this.#cardComponent);
    remove(this.#editComponent);
  }

  // Сброс в режим карточки (закрыть форму)
  resetView() {
    if (this.#activeMode !== ViewMode.COMPACT) {
      this.#editComponent.reset(this.#currentPoint);
      this.#switchToCard();
    }
  }

  // Блокировка формы во время сохранения
  setSaving() {
    if (this.#activeMode === ViewMode.EXPANDED) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  // Блокировка формы во время удаления
  setDeleting() {
    if (this.#activeMode === ViewMode.EXPANDED) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  // Отображение ошибки (встряхивание компонента)
  setAborting() {
    if (this.#activeMode === ViewMode.COMPACT) {
      this.#cardComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editComponent.shake(resetFormState);
  }

  // Переключение с карточки на форму
  #switchToForm = () => {
    replace(this.#editComponent, this.#cardComponent);
    document.addEventListener('keydown', this.#onDocumentKeyPress);
    this.#onModeSwitch();
    this.#activeMode = ViewMode.EXPANDED;
  };

  // Переключение с формы на карточку
  #switchToCard = () => {
    replace(this.#cardComponent, this.#editComponent);
    document.removeEventListener('keydown', this.#onDocumentKeyPress);
    this.#activeMode = ViewMode.COMPACT;
  };

  // Обработчик Escape для закрытия формы
  #onDocumentKeyPress = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.#editComponent.reset(this.#currentPoint);
      this.#switchToCard();
    }
  };

  // Клик по кнопке Edit
  #onEditClick = () => {
    this.#switchToForm();
  };

  // Клик по кнопке избранного
  #onFavoriteToggle = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#currentPoint, isFavorite: !this.#currentPoint.isFavorite},
    );
  };

  // Отправка формы
  #onFormSend = (updatedData) => {
    const hasDateChanges = !areDatesEqual(this.#currentPoint.dateFrom, updatedData.dateFrom) ||
                           !areDatesEqual(this.#currentPoint.dateTo, updatedData.dateTo);
    const hasPriceChange = this.#currentPoint.basePrice !== updatedData.basePrice;
    const isMinorUpdate = hasDateChanges || hasPriceChange;

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedData,
    );
  };

  // Удаление точки
  #onDeleteConfirm = (pointToDelete) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      pointToDelete,
    );
  };

  // Отмена редактирования
  #onFormCancel = () => {
    this.#editComponent.reset(this.#currentPoint);
    this.#switchToCard();
  };
}
