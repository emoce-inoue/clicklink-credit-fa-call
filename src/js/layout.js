const initializeModal = () => {
  const typeItems = document.querySelectorAll('.l-type__list-item');
  const modals = document.querySelectorAll('.l-modal');
  const qaSection = document.querySelector('.l-qa');
  let previousFocusElement = null;
  let currentType = null;

  const clearSelection = (selector, className) => {
    document.querySelectorAll(selector).forEach((targetElement) => {
      targetElement.classList.remove(className);
    });
  };

  const scrollToElement = (targetElement) => {
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleButtonGroup = (selectedButton, groupSelector, activeClass) => {
    document.querySelectorAll(groupSelector).forEach((groupButton) => {
      groupButton.classList.remove(activeClass);
    });
    selectedButton.classList.add(activeClass);
  };

  const deselectAllTypeItems = () => {
    clearSelection('.l-type__list-item', 'l-type__list-item--selected');
  };

  const deselectModalItems = (modalElement) => {
    modalElement.querySelectorAll('.l-modal__list-item').forEach((modalItem) => {
      modalItem.classList.remove('l-modal__list-item--selected');
    });
  };

  const closeModal = (modalElement, options = {}) => {
    if (!modalElement || !modalElement.classList.contains('l-modal--opened')) {
      return;
    }

    modalElement.classList.remove('l-modal--opened');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('l-body--noscroll');

    if (options.restoreFocus && previousFocusElement) {
      previousFocusElement.focus();
    }

    if (options.shouldDeselectType) {
      deselectAllTypeItems();
    }
  };

  const openModal = (modalElement) => {
    if (modalElement.classList.contains('l-modal--opened')) {
      return;
    }

    previousFocusElement = document.activeElement;
    modalElement.classList.add('l-modal--opened');
    modalElement.setAttribute('aria-hidden', 'false');
    document.body.classList.add('l-body--noscroll');
    (modalElement.querySelector('.js-modal-focus') || modalElement).focus();
  };

  typeItems.forEach((typeItem) => {
    typeItem.addEventListener('click', () => {
      const typeValue = typeItem.dataset.type;

      if (currentType && currentType !== typeValue) {
        const previousModal = Array.from(modals).find((modalElement) => modalElement.dataset.target === currentType);
        if (previousModal) {
          deselectModalItems(previousModal);
        }
      }

      deselectAllTypeItems();
      typeItem.classList.add('l-type__list-item--selected');
      clearSelection('.l-category', 'l-category--selected');

      if (qaSection) {
        if (typeItem.classList.contains('l-type__list-item--except')) {
          clearSelection('.l-no-answer', 'l-no-answer--selected');
          clearSelection('.l-qa__button', 'l-qa__button--selected');
          clearSelection('.l-no-answer__reason-button', 'l-no-answer__reason-button--selected');
          clearSelection('.l-card', 'l-card--selected');

          qaSection.classList.add('l-qa--selected');
          scrollToElement(qaSection);
        } else {
          qaSection.classList.remove('l-qa--selected');
          clearSelection('.l-no-answer', 'l-no-answer--selected');
          clearSelection('.l-qa__button', 'l-qa__button--selected');
          clearSelection('.l-no-answer__reason-button', 'l-no-answer__reason-button--selected');
          clearSelection('.l-card', 'l-card--selected');
        }
      }

      modals.forEach((modalElement) => {
        closeModal(modalElement);
      });

      const modalToOpen = Array.from(modals).find((modalElement) => modalElement.dataset.target === typeValue);
      if (modalToOpen) {
        openModal(modalToOpen);
      }

      currentType = typeValue;
    });
  });

  modals.forEach((modalElement) => {
    const modalItems = modalElement.querySelectorAll('.l-modal__list-item');
    modalItems.forEach((modalItem) => {
      modalItem.addEventListener('click', () => {
        deselectModalItems(modalElement);
        modalItem.classList.add('l-modal__list-item--selected');

        if (modalElement.dataset.target === '5') {
          clearSelection('.l-card', 'l-card--selected');
          const targetCard = document.querySelector(`.l-card[data-card="${modalItem.dataset.cardModal}"]`);
          if (targetCard) {
            targetCard.classList.add('l-card--selected');
            scrollToElement(targetCard);
          }
        } else {
          clearSelection('.l-category', 'l-category--selected');
          const targetCategory = document.querySelector(`.l-category[data-category="${modalItem.dataset.modal}"]`);
          if (targetCategory) {
            targetCategory.classList.add('l-category--selected');
            scrollToElement(targetCategory);
          }
        }

        closeModal(modalElement, { shouldDeselectType: false, restoreFocus: false });
      });
    });
  });

  document.querySelectorAll('.l-qa__button').forEach((qaButton) => {
    qaButton.addEventListener('click', () => {
      toggleButtonGroup(qaButton, '.l-qa__button', 'l-qa__button--selected');
      clearSelection('.l-card', 'l-card--selected');
      clearSelection('.l-no-answer', 'l-no-answer--selected');
      clearSelection('.l-no-answer__reason-button', 'l-no-answer__reason-button--selected'); // 🔹 追加！

      if (qaButton.dataset.answer === 'yes') {
        const modalExcept = document.querySelector('.l-modal[data-target="5"]');
        if (modalExcept) {
          openModal(modalExcept);
        }
      } else if (qaButton.dataset.answer === 'no') {
        const noAnswerSection = document.querySelector('.l-no-answer[data-target="no-answer"]');
        if (noAnswerSection) {
          noAnswerSection.classList.add('l-no-answer--selected');
          scrollToElement(noAnswerSection);
        }
        clearSelection('.l-modal[data-target="5"] .l-modal__list-item', 'l-modal__list-item--selected');
      }
    });
  });

  document.querySelectorAll('.l-no-answer__reason-button').forEach((reasonButton) => {
    reasonButton.addEventListener('click', () => {
      toggleButtonGroup(reasonButton, '.l-no-answer__reason-button', 'l-no-answer__reason-button--selected');
      clearSelection('.l-card.l-card--no', 'l-card--selected');

      const targetCard = document.querySelector(`.l-card.l-card--no[data-no-card="${reasonButton.dataset.noAnswer}"]`);
      if (targetCard) {
        targetCard.classList.add('l-card--selected');
        scrollToElement(targetCard);
      }
    });
  });

  modals.forEach((modalElement) => {
    modalElement.addEventListener('click', (event) => {
      if (!event.target.closest('.l-modal__content-inner')) {
        closeModal(modalElement, { shouldDeselectType: true, restoreFocus: true });
      }
    });

    const closeButton = modalElement.querySelector('.js-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        closeModal(modalElement, { shouldDeselectType: true, restoreFocus: true });
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initializeModal();
});

window.addEventListener('load', () => {
  document.querySelectorAll('.js-load').forEach((loadElement) => {
    loadElement.classList.add('js-load--loaded');
  });
});
