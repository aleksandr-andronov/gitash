function initMap() {
    const myMap = new ymaps.Map("postOfficeMap", {
      center: [55.7558, 37.6176], 
      zoom: 13,
      controls: []
    });
    const officeInfoBlock = document.querySelector('.postOffice-info')
    const officeInfoBlockBtn = officeInfoBlock.querySelector('.postOffice-info__btn')
    const getLocationBtn = document.querySelector('.get-location')
    const officeInfoBlockClose = document.querySelector('.postOffice-info__close')
  
    fetch('./static/js/shops.json')
      .then(response => response.json())
      .then(points => {
        points.forEach(function(point) {
          var placemark = new ymaps.Placemark(point.coordinates, null, {
            iconLayout: 'default#image',
            iconImageHref: './static/images/general/pinOffice.svg',
            iconImageSize: [48, 64],
            iconImageOffset: [-24, -32],
            draggable: false
          });
  
          myMap.geoObjects.add(placemark);
  
          // Обработчик события клика по метке
          placemark.events.add('click', function() {
            console.log('ID метки: ' + point.id);
            officeInfoBlock.classList.add('visible')

            if (getLocationBtn) {
              getLocationBtn.classList.add('bottom')
            }
          });
        });
      })
      .catch(error => console.error('Ошибка при загрузке данных: ', error));

      officeInfoBlockBtn.addEventListener('click', (e) => {
        e.preventDefault()

        officeInfoBlock.classList.remove('visible')
        if (getLocationBtn) {
          getLocationBtn.classList.remove('bottom')
        }
      })

      officeInfoBlockClose.addEventListener('click', (e) => {
        e.preventDefault()
        officeInfoBlock.classList.remove('visible')
        if (getLocationBtn) {
          getLocationBtn.classList.remove('bottom')
        }
      })

}
  
ymaps.ready(initMap);
  
  