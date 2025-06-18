


document.addEventListener("DOMContentLoaded", async () => {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;

  // Загружаем JSON-стили
  const styleResponse = await fetch('./static/js/json/customization.json');
  const customStyle = await styleResponse.json();

  // Создаём карту
  const map = new YMap(document.getElementById('map'), {
    location: {
      center: [37.152308, 55.724799],
      zoom: 14
    }
  });

  // Добавляем слой с картой и кастомным стилем
  map.addChild(new YMapDefaultSchemeLayer({
    customization: customStyle
  }));

  // Добавляем слой фич — ОБЯЗАТЕЛЬНО для отображения маркеров и других объектов
  map.addChild(new YMapDefaultFeaturesLayer());

  // Создаём кастомную метку
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';
  markerElement.style.width = '60px';
  markerElement.style.height = '60px';
  markerElement.style.background = 'url(./static/images/general/padel/pin.svg) no-repeat center center';
  markerElement.style.backgroundSize = 'contain';

  // Добавляем метку на карту
  const marker = new YMapMarker({
    coordinates: [37.152308, 55.724799],
    draggable: false
  }, markerElement);

  map.addChild(marker);
});
