/**
 * @class KeypressBinder
 * @param {elem} el HTMLElement being passed.
 * @return { object } KeypressBinder Object
 *
 * Simple class that binds an object with a `handleEvent` property
 * to the `keypress` event for the given element
 */
class KeypressBinder {
  constructor(el) {
    this.data = { el: el, presses: 0 };
    this.data.el.addEventListener('keypress', this);
  }

  handleEvent(event) {
    // Update UI to indicate a `keypress` event was received
    this.data.presses += 1;
    this.data.el.classList.remove('alert-secondary');
    this.data.el.classList.add('alert-success');
    this.data.el.querySelector('.badge').innerText = this.data.presses;
  }
}

// Initialize Sentry
function initSentry(dsn) {
  Sentry.init({
    dsn: dsn,
  });
}

function initKeypressBinder(id) {
  // Grab the element by ID and instantiate a `KeypressBinder`
  new KeypressBinder(document.getElementById(id));
}

function startDemo(dsn) {
  document.getElementById('demo').style = '';
  initKeypressBinder('testEl');
  initSentry(dsn);
  initKeypressBinder('testEl2');
}

(function() {
  document.getElementById('dsn').addEventListener(
    'submit',
    function(e) {
      e.preventDefault();
      var dsn = this.querySelector('#sentryDsn').value;
      if (dsn) {
        startDemo(dsn);
      }
    },
    false
  );
})();
