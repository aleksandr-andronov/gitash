let map, clusterer, lastActivePlacemark = null;
const icons = {
    hanger: 'static/images/general/pin-hanger.svg',
    unhanger: 'static/images/general/pin-unhanger.svg',
    hangerActive: 'static/images/general/pin-hanger-active.svg',
    unhangerActive: 'static/images/general/pin-unhanger-active.svg',
};


const mapContent = document.querySelector('.orderMap')
const closeDetailedBtn = document.querySelector('.pickupPoint-detail__btn')


if (closeDetailedBtn) {
    closeDetailedBtn.addEventListener('click', () => {
        mapContent.classList.remove('visible')
    })
}

const offcanvasIds = [
    'pickupPoints',
    'pickupPointsMobile',
    'pickupPoint',
    'addAddressMobile'
];

const modals = {};

offcanvasIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        modals[id] = bootstrap.Offcanvas.getOrCreateInstance(element);
    }
});






const modalPickupPointsElement = document.querySelector('#pickupPoints')

modalPickupPointsElement.addEventListener('shown.bs.offcanvas', () => {
    mapContent.classList.add('visible')
})


const hideMapBtn = document.querySelector('.hideMap')
if (hideMapBtn) {
    hideMapBtn.addEventListener('click', () => {
        mapContent.classList.remove('visible')
    })
}


const closeBtn = document.querySelector('.offcanvas-close[data-pickup="close"]')
const backBtn = document.querySelector('.offcanvas-close[data-pickup="back"]')
const closeBtnBottom = document.querySelector('.pickupPoint-detail__foot')


function pickupPointTabs() {
    const links = document.querySelectorAll('.pickupPoint-tabs__link')
    const actions = document.querySelector('.pickupPoint-mobile-actions')
    if (!links.length) return

    links.forEach(link => {
        link.addEventListener('click', () => {
            const tab = link.dataset.tabs

            if (tab == 'list') {
                actions.classList.remove('pickupPoint-mobile-actions--absolute')
            } else if (tab == 'map') {
                actions.classList.add('pickupPoint-mobile-actions--absolute')
            }
        })
    })
}

pickupPointTabs()

function openDetailedPoint() {
    const btn = document.querySelector('.order-infoBlock__title-icon')
    

    if (btn) {
        btn.addEventListener('click', (e) => {
            mapContent.classList.add('visible')
            closeBtn.classList.remove('offcanvas-close--hidden')
            backBtn.classList.add('offcanvas-close--hidden')
            closeBtnBottom.classList.add('hidden')
            
        })
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeFunc)
    }

    function closeFunc() {
        mapContent.classList.remove('visible')
        closeBtn.classList.add('offcanvas-close--hidden')
        backBtn.classList.remove('offcanvas-close--hidden')
        closeBtnBottom.classList.remove('hidden')
    }   
}

openDetailedPoint()


// выбор типа доставки и отображение соответсвующих элементов
function typeDelivery() {
    const inputs = document.querySelectorAll('.shipment-item input')
    const courierBlocks = document.querySelectorAll('.courierInfo')
    const noCurierBlocks = document.querySelectorAll('.noCourierInfo')
    const hiddenContent = document.querySelectorAll('.order-form__hidden-block')
    const courierItems = document.querySelectorAll('.order-form__col--courier')

    const isMobile = window.innerWidth < 933;

    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const type = input.dataset.type

            if (type == 'courier') {
                noCurierBlocks.forEach(i => i.classList.add('hidden'))
                courierBlocks.forEach(i => i.classList.remove('hidden'))
                courierItems.forEach(i => i.classList.remove('hidden'))
                hiddenContent.forEach(i => i.classList.add('visible'))
            } else if (type == 'delivery') {
                noCurierBlocks.forEach(i => i.classList.remove('hidden'))
                courierBlocks.forEach(i => i.classList.add('hidden'))
                courierItems.forEach(i => i.classList.add('hidden'))
                hiddenContent.forEach(i => i.classList.remove('visible'))
                
                if (isMobile) {
                    modals.pickupPointsMobile.show();
                    modals.addAddressMobile.hide()
                    backBtn.setAttribute('href', '#pickupPointsMobile');
                } else {
                    modals.pickupPoints.show()
                }


            }
           
        })
    })
}

typeDelivery()



function pickupPointMobileSearch() {
    const main = document.querySelector('#pickupPointsMobile')
    const btnOpen = document.querySelector('.pickupPoint-openSearch')
    const btnBack = document.querySelector('.pickupPoint-closeSearch')
    const btnClose = document.querySelector('.pickupPoint-closePoints')
    const inputSearch = document.querySelector('#searchPoints')
    const list = document.querySelector('.pickupPoint-mSearch__list')
    const btnCloseMap = document.querySelectorAll('.hideMap')

   

    if (!main) return


    btnOpen.addEventListener('click', () => {
        main.classList.add('search-opened')
        inputSearch.focus()
        btnBack.classList.remove('offcanvas-close--hidden')
        btnClose.classList.add('offcanvas-close--hidden')
        btnCloseMap.forEach(i => i.classList.add('offcanvas-close--hidden'))
    })

    btnBack.addEventListener('click', (e) => {
        e.preventDefault()

        list.classList.remove('visible')
        inputSearch.value = ''
        main.classList.remove('search-opened')
        btnBack.classList.add('offcanvas-close--hidden')
        btnClose.classList.remove('offcanvas-close--hidden')
        btnCloseMap.forEach(i => i.classList.remove('offcanvas-close--hidden'))
    })


    inputSearch.addEventListener('input', () => {
        if (inputSearch.value) {
            list.classList.add('visible')
        } else {
            list.classList.remove('visible')
        }
    })

}

pickupPointMobileSearch() 



ymaps.ready(init);

function init() {
    // Определяем контейнер карты в зависимости от ширины экрана
    const isMobile = window.innerWidth < 933;
    const mapContainerId = isMobile ? 'pickupPointsMapMobile' : 'pickupPointsMap';

    // Создаем карту
    const map = new ymaps.Map(mapContainerId, {
        center: [55.751574, 37.573856],
        zoom: 10,
        controls: []
    });

    // Создаем кластер
    const clusterer = new ymaps.Clusterer({
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        clusterIcons: [
            {
                href: '', 
                size: [40, 40], 
                offset: [-20, -20] 
            }
        ],
        clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(`
            <div style="
                width: 40px;
                height: 40px;
                border: 1px solid black;
                border-radius: 50%;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                color: black;
                font-weight: normal;
                font-size: 15px;">
                {{ properties.geoObjects.length }}
            </div>
        `),
        zIndex: 20000
    });
    
    // Данные для меток
    const pointsData = [
        { coords: [55.751574, 37.573856], type: 'hanger', name: 'CDEK' },
        { coords: [55.761574, 37.583856], type: 'unhanger', name: 'Яндекс Доставка' },
        { coords: [55.771574, 37.593856], type: 'hanger', name: 'BoxBery' },
    ];

    // Создаем метки
    const placemarks = pointsData.map((point) => createPlacemark(point, isMobile));

    // Добавляем метки в кластер
    clusterer.add(placemarks);
    map.geoObjects.add(clusterer);

    const controls = document.querySelectorAll('.orderMap-controls');
    controls.forEach(control => {
        addMapControlsListeners(map, control);
    });
}

function addMapControlsListeners(map, control) {
    control.addEventListener('click', (event) => {
        if (event.target.closest('.orderMap-locationBtn')) {
            // Кнопка "определить местоположение"
            locateUser(map);
        } else if (event.target.closest('.orderMap-controls__zoom-item')) {
            // Кнопки увеличения/уменьшения масштаба
            const zoomItem = event.target.closest('.orderMap-controls__zoom-item');
            const zoomIn = zoomItem.previousElementSibling === null; // Проверяем, есть ли предыдущий элемент

            zoomMap(map, zoomIn);
        }
    });
}

function zoomMap(map, zoomIn) {
    const currentZoom = map.getZoom();
    const newZoom = zoomIn ? currentZoom + 1 : currentZoom - 1;
    map.setZoom(newZoom, { duration: 200 });
}


let userPlacemark; // Добавляем переменную для хранения метки пользователя

function locateUser(map) {
    if (!navigator.geolocation) {
        console.error('Геолокация не поддерживается браузером');
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        console.log('Координаты пользователя:', userCoords);
        map.setCenter(userCoords, 15);

        if (userPlacemark) {
            map.geoObjects.remove(userPlacemark);
        }

        userPlacemark = new ymaps.Placemark(userCoords, {}, {
            iconLayout: 'default#image',
            iconImageHref: './static/images/general/locateicon.svg',
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -16],
        });

        map.geoObjects.add(userPlacemark);
    }, (error) => {
        console.error('Ошибка геолокации:', error.message);
    });
}



function createPlacemark(point, isMobile) {
    const isLargeScreen = window.innerWidth > 1440; // Проверка ширины экрана

    // Настройки для большого экрана
    const largeScreenSettings = {
        default: {
            iconImageSize: [44, 58],
            iconImageOffset: [-22, -29],
            iconContentOffset: [0, 58 + 6], // Высота иконки + 6
        },
        active: {
            iconImageSize: [50, 67],
            iconImageOffset: [-25, -34],
            iconContentOffset: [0, 67 + 6], // Высота иконки + 6
        },
        fontSize: 15,
    };

    // Настройки для экрана 1440px и меньше
    const smallScreenSettings = {
        default: {
            iconImageSize: [40, 52],
            iconImageOffset: [-20, -26],
            iconContentOffset: [0, 52 + 4], // Высота иконки + 4
        },
        active: {
            iconImageSize: [44, 58],
            iconImageOffset: [-22, -29],
            iconContentOffset: [0, 58 + 4], // Высота иконки + 4
        },
        fontSize: 13,
    };

    // Выбираем настройки в зависимости от ширины экрана
    const settings = isLargeScreen ? largeScreenSettings : smallScreenSettings;

    const placemark = new ymaps.Placemark(
        point.coords,
        {
            iconContent: point.name, // Добавляем текст из name
        },
        {
            iconLayout: 'default#imageWithContent',
            iconImageHref: icons[point.type],
            iconImageSize: settings.default.iconImageSize,
            iconImageOffset: settings.default.iconImageOffset,
            iconContentOffset: settings.default.iconContentOffset,
            iconContentLayout: ymaps.templateLayoutFactory.createClass(`
                <div style="
                    font-size: ${settings.fontSize}px;
                    font-weight: 600;
                    font-family: 'Arimo';
                    color: black;
                    text-shadow: 1px 1px 0px white, -1px 1px 0px white, 1px -1px 0px white, -1px -1px 0px white;
                    text-align: center;">
                    {{ properties.iconContent }}
                </div>
            `),
        }
    );

    // Обработчик клика на метку
    placemark.events.add('click', () => {
        if (isMobile) {
            backBtn.setAttribute('href', '#pickupPointsMobile');
            modals.pickupPointsMobile.hide();
            modals.addAddressMobile.hide();
        } else {
            backBtn.setAttribute('href', '#pickupPoints');
            modals.pickupPoints.hide();
        }

        // Сбрасываем предыдущую активную метку
        if (lastActivePlacemark) {
            const lastType = lastActivePlacemark.properties.get('type');
            const lastIcon = icons[lastType];

            // Возвращаем метке стандартные размеры, смещения и смещение текста
            lastActivePlacemark.options.set('iconImageSize', settings.default.iconImageSize);
            lastActivePlacemark.options.set('iconImageOffset', settings.default.iconImageOffset);
            lastActivePlacemark.options.set('iconContentOffset', settings.default.iconContentOffset);
            lastActivePlacemark.options.set('iconImageHref', lastIcon);
        }

        // Активируем текущую метку
        const activeIcon = point.type === 'hanger' ? icons.hangerActive : icons.unhangerActive;

        placemark.options.set('iconImageHref', activeIcon);

        // Устанавливаем размеры, смещение и смещение текста для активной метки
        placemark.options.set('iconImageSize', settings.active.iconImageSize);
        placemark.options.set('iconImageOffset', settings.active.iconImageOffset);
        placemark.options.set('iconContentOffset', settings.active.iconContentOffset);

        // Сохраняем текущую активную метку
        lastActivePlacemark = placemark;
        lastActivePlacemark.properties.set('type', point.type);

        modals.pickupPoint.show();
    });

    // Устанавливаем пользовательское свойство type
    placemark.properties.set('type', point.type);

    return placemark;
}