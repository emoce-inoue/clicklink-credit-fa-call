const initializeModal = () => {
  const typeItems = document.querySelectorAll('.l-type__list-item');
  const modals = document.querySelectorAll('.l-modal');
  const qa = document.querySelector('.l-qa');
  let previousFocus = null;

  const deselectAllTypeItems = () => {
    typeItems.forEach((item) => {
      item.classList.remove('l-type__list-item--selected');
    });
  };

  const closeModal = (modal, options = {}) => {
    if (!modal || !modal.classList.contains('l-modal--opened')) {
      return;
    }
    modal.classList.remove('l-modal--opened');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('l-body--noscroll');

    if (options.restoreFocus && previousFocus) {
      previousFocus.focus();
    }

    if (options.shouldDeselectType) {
      deselectAllTypeItems();
    }
  };

  const openModal = (modal) => {
    if (modal.classList.contains('l-modal--opened')) {
      return;
    }
    previousFocus = document.activeElement;
    modal.classList.add('l-modal--opened');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('l-body--noscroll');
    (modal.querySelector('.js-modal-focus') || modal).focus();
  };

  let currentType = null;

  typeItems.forEach((item) => {
    item.addEventListener('click', () => {
      const typeValue = item.dataset.type;

      if (currentType && currentType !== typeValue) {
        const previousModal = Array.from(modals).find((modal) => modal.dataset.target === currentType);
        if (previousModal) {
          const prevModalItems = previousModal.querySelectorAll('.l-modal__list-item');
          prevModalItems.forEach((modalItem) => {
            modalItem.classList.remove('l-modal__list-item--selected');
          });
        }
      }

      deselectAllTypeItems();
      item.classList.add('l-type__list-item--selected');

      document.querySelectorAll('.l-category').forEach((c) => {
        c.classList.remove('l-category--selected');
      });

      if (qa) {
        if (item.classList.contains('l-type__list-item--except')) {
          qa.classList.add('l-qa--selected');
          qa.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          qa.classList.remove('l-qa--selected');
        }
      }

      modals.forEach((modal) => {
        closeModal(modal);
      });

      const modalToOpen = Array.from(modals).find((modal) => modal.dataset.target === typeValue);
      if (modalToOpen) {
        openModal(modalToOpen);
      }

      currentType = typeValue;
    });
  });

  modals.forEach((modal) => {
    const modalItems = modal.querySelectorAll('.l-modal__list-item');
    modalItems.forEach((item) => {
      item.addEventListener('click', () => {
        modalItems.forEach((item) => {
          item.classList.remove('l-modal__list-item--selected');
        });
        item.classList.add('l-modal__list-item--selected');

        if (modal.dataset.target === '5') {
          document.querySelectorAll('.l-card').forEach((card) => {
            card.classList.remove('l-card--selected');
          });
          const targetCard = document.querySelector(`.l-card[data-card="${item.dataset.cardModal}"]`);
          if (targetCard) {
            targetCard.classList.add('l-card--selected');
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          document.querySelectorAll('.l-category').forEach((category) => {
            category.classList.remove('l-category--selected');
          });
          const targetCategory = document.querySelector(`.l-category[data-category="${item.dataset.modal}"]`);
          if (targetCategory) {
            targetCategory.classList.add('l-category--selected');
            targetCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }

        closeModal(modal, { shouldDeselectType: false, restoreFocus: false });
      });
    });
  });

  document.querySelectorAll('.l-qa__button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.l-qa__button').forEach((btn) => {
        btn.classList.remove('l-qa__button--selected');
      });
      button.classList.add('l-qa__button--selected');

      document.querySelectorAll('.l-card').forEach((card) => {
        card.classList.remove('l-card--selected');
      });
      document.querySelectorAll('.l-no-answer').forEach((el) => {
        el.classList.remove('l-no-answer--selected');
      });

      if (button.dataset.answer === 'yes') {
        const modal5 = document.querySelector('.l-modal[data-target="5"]');
        if (modal5) {
          openModal(modal5);
        }
      } else if (button.dataset.answer === 'no') {
        const noAnswer = document.querySelector('.l-no-answer[data-target="no-answer"]');
        if (noAnswer) {
          noAnswer.classList.add('l-no-answer--selected');
          noAnswer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.querySelectorAll('.l-modal[data-target="5"] .l-modal__list-item').forEach((item) => {
          item.classList.remove('l-modal__list-item--selected');
        });
      }
    });
  });

  document.querySelectorAll('.l-no-answer__reason-button').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.noAnswer;
      document.querySelectorAll('.l-no-answer__reason-button').forEach((btn) => {
        btn.classList.remove('l-no-answer__reason-button--selected');
      });
      button.classList.add('l-no-answer__reason-button--selected');

      document.querySelectorAll('.l-card.l-card--no').forEach((card) => {
        card.classList.remove('l-card--selected');
      });
      const targetCard = document.querySelector(`.l-card.l-card--no[data-no-card="${value}"]`);
      if (targetCard) {
        targetCard.classList.add('l-card--selected');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (!event.target.closest('.l-modal__content-inner')) {
        closeModal(modal, { shouldDeselectType: true, restoreFocus: true });
      }
    });

    const closeBtn = modal.querySelector('.js-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeModal(modal, { shouldDeselectType: true, restoreFocus: true });
      });
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modals.forEach((modal) => {
        closeModal(modal, { shouldDeselectType: true, restoreFocus: true });
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initializeModal();
});

window.addEventListener('load', () => {
  document.querySelectorAll('.js-load').forEach((loadElm) => {
    loadElm.classList.add('js-load--loaded');
  });
});
