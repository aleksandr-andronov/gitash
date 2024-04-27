function initMap() {
    const myMap = new ymaps.Map("map", {
      center: [55.7558, 37.6176], 
      zoom: 13,
      controls: []
    });
    const mobileMapBlock = document.querySelector('.shops-mobile')
    const mobileMapBlockClose = document.querySelector('.shopInfo__close')
  
    fetch('./static/js/shops.json')
      .then(response => response.json())
      .then(points => {
        points.forEach(function(point) {
          var placemark = new ymaps.Placemark(point.coordinates, null, {
            iconLayout: 'default#image',
            iconImageHref: './static/images/general/pin.svg',
            iconImageSize: [42, 52],
            iconImageOffset: [-21, -26],
            draggable: false
          });
  
          myMap.geoObjects.add(placemark);
  
          // Обработчик события клика по метке
          placemark.events.add('click', function() {
            console.log('ID метки: ' + point.id);

            mobileMapBlock.classList.add('visible')
          });
        });
      })
      .catch(error => console.error('Ошибка при загрузке данных: ', error));

      mobileMapBlockClose.addEventListener('click', (e) => {
        e.preventDefault()
        mobileMapBlock.classList.remove('visible')
      })

      function toggleMapInfo() {
        const links = document.querySelectorAll('.shops-links__item')
        const map = document.querySelector('.shops-map')
        const list = document.querySelector('.shops-list')
        if (!links.length) return
    
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                links.forEach(i => i.classList.remove('selected'))
                link.classList.add('selected')
    
                if (link.dataset.type == 'map') {
                    map.classList.add('visible')
                    list.classList.add('hidden')
                    myMap.container.fitToViewport()
                } else {
                    map.classList.remove('visible')
                    list.classList.remove('hidden')
                }
            })
        })
    }
    
    toggleMapInfo()
}
  
ymaps.ready(initMap);
  
  