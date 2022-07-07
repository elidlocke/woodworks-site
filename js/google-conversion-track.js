function reportConversion() {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-990419731/x0wKCMSQ1ssDEJO2otgD',
      'event_callback': callback
  });
  return false;
}
