(() => {
  const viewport = document.querySelector('meta[name="viewport"]');
  const switchViewport = () => {
    const value = window.outerWidth > 360 ? 'width=device-width,initial-scale=1' : 'width=360';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  };
  window.addEventListener('resize', switchViewport);
  switchViewport();
})();

document.addEventListener('DOMContentLoaded', () => {
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
      }
    });
  };
  const defaultObserverOptions = {
    threshold: 0.1,
  };
  const defaultObserver = new IntersectionObserver(observerCallback, defaultObserverOptions);
  const targetElements = document.querySelectorAll('.js-fade, .js-fadeup, .js-fadein, .js-scroll');
  targetElements.forEach((target) => {
    defaultObserver.observe(target);
  });
});
