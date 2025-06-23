const availabilityMapContent = document.getElementById('availabilityMapWrap');
const modalAvailabilityElement = document.getElementById('availabilityListOffcanvas');
const closeMapBtns = document.querySelectorAll('.closeAvailabilityMap');
const bottomContent = document.querySelector('.availabilityShopBottom');
const bottomContentClose = bottomContent.querySelector('.availabilityShopBottom-close');
const availabilityForm = document.querySelector('.availabilityForm');





bottomContentClose.addEventListener('click', () => {
    bottomContent.classList.remove('visible')
})


if (closeMapBtns.length) {
    closeMapBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            availabilityMapContent.classList.remove('visible');
        })
    })
}


const offcanvasIds = [
    'availabilityListOffcanvas',
    'availabilityProductOffcanvas',
    'availabilitySuccessOffcanvas',
    'availabilityErrorOffcanvas',
];

const modals = {};

offcanvasIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        modals[id] = bootstrap.Offcanvas.getOrCreateInstance(element);
    }
});


modalAvailabilityElement.addEventListener('shown.bs.offcanvas', () => {
    availabilityMapContent.classList.add('visible');
});


// Показ окна успеха
availabilityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const errorItems = availabilityForm.querySelectorAll('.error');

    if (!errorItems.length) {
        modals.availabilityProductOffcanvas.hide();
        modals.availabilitySuccessOffcanvas.show();
    }
})


function init() {
    // Определяем, мобилка или нет
    const isMobile = window.innerWidth < 933;
    const isLargeScreen = window.innerWidth > 1440;
    const mapContainerId = isMobile ? 'availabilityMapMobile' : 'availabilityMap';

    // Создаем карту
    const map = new ymaps.Map(mapContainerId, {
        center: [55.751574, 37.573856], // Москва
        zoom: 10,
        controls: []
    });

    // Пример иконки — одна для всех типов
    const iconUrl = './static/images/general/pin.svg';

    // Размеры иконки
    const iconSize = isLargeScreen ? [52, 64] : [42, 52];
    const iconOffset = [-iconSize[0] / 2, -iconSize[1]];

    // Примерные точки в Москве
    const points = [
        [55.751574, 37.573856],
        [55.760000, 37.580000],
        [55.770000, 37.560000]
    ];

    // Создаем метки
    const placemarks = points.map(coords => {
        const placemark = new ymaps.Placemark(
            coords,
            {},
            {
                iconLayout: 'default#image',
                iconImageHref: iconUrl,
                iconImageSize: iconSize,
                iconImageOffset: iconOffset
            }
        );

        // Обработка клика по метке
        placemark.events.add('click', () => {
            if (isMobile) {
                bottomContent.classList.add('visible');
            } else {
                modals.availabilityListOffcanvas.hide();
                modals.availabilityProductOffcanvas.show();
            }
        });

        return placemark;
    });

    // Добавляем метки на карту
    placemarks.forEach(pm => map.geoObjects.add(pm));
}

ymaps.ready(init);