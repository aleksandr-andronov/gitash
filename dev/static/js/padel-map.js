



document.addEventListener("DOMContentLoaded", async () => {

  function validateForm() {
  const form = document.querySelector('.padelRequest-form');
  const successBlock = document.querySelector('.padelRequest-status-success'); // окно для успешной отправки
  const errorBlock = document.querySelector('.padelRequest-status-error'); // оно при ошибке
  const closeBtnsStatus = document.querySelectorAll('.padelRequest-status__close');


  if (closeBtnsStatus.length) {
    closeBtnsStatus.forEach(btn => {
      btn.addEventListener('click', () => {
          const parent = btn.closest('.padelRequest-status');

          parent.classList.remove('animate');
          setTimeout(() => {
            parent.classList.remove('visible');
          }, 200)
      })
    })
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // отменяем отправку

    let isValid = true;
    const validateElements = form.querySelectorAll('[data-validate]');

    validateElements.forEach((el) => {
      const type = el.getAttribute('type');
      const dataType = el.dataset.type;

      // text или tel поля
      if ((type === 'text' || type === 'tel') && el.value.trim() === '') {
        el.classList.add('error');
        isValid = false;
      }

      // day радиокнопки
      if (dataType === 'day') {
        const group = form.querySelector('.padelRequest-form__field--select');
        const checked = form.querySelector('[data-type="day"]:checked');
        if (!checked) {
          group.classList.add('error');
          isValid = false;
        }
      }

      // label радиокнопки
      if (dataType === 'label') {
        const group = el.closest('.padelRequest-form__group');
        const name = el.getAttribute('name');
        const checked = form.querySelector(`[name="${name}"]:checked`);
        if (!checked) {
          group.classList.add('error');
          isValid = false;
        }
      }
    });

    // если всё ок — выполнится это
    if (isValid) {
      console.log('форма валидна, отправляем...');
      

      successBlock.classList.add('visible');
      setTimeout(() => {
        successBlock.classList.add('animate');
      })
    }
  });

  // снимаем error при фокусе на input
  form.addEventListener('focusin', (e) => {
    const el = e.target;
    if (el.hasAttribute('data-validate') && (el.type === 'text' || el.type === 'tel')) {
      el.classList.remove('error');
    }
  });

  // снимаем error c day при выборе
  form.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.type === 'day') {
      const group = form.querySelector('.padelRequest-form__field--select');
      group.classList.remove('error');
    }

    // снимаем error c label группы при выборе
    if (el.dataset.type === 'label') {
      const group = el.closest('.padelRequest-form__group');
      group.classList.remove('error');
    }
  });
}

validateForm();




  function dateSelection() {
    const main = document.querySelector('.padelRequest-form__field--select');
    const parent = main.closest('.padelRequest-form__field-wrap');
    const inputs = parent.querySelectorAll('.padelRequest-form-label input');
    const output = main.querySelector('.padelRequest-form__field-output');
    const closeBtn = parent.querySelector('.padelRequest-form__dropdown-close');
    const backdrop = parent.querySelector('.padelRequest-form__dropdown-backdrop');
    const body = document.body;

    function open() {
        parent.classList.add('active');
        body.classList.add('o-hidden');
        setTimeout(() => parent.classList.add('animate'), 0);
        main.classList.remove('error');
    }

    function close() {
        parent.classList.remove('animate');
        setTimeout(() => {
            parent.classList.remove('active');
            body.classList.remove('o-hidden');
        }, 250);
    }


    main.addEventListener('click', (e) => {
        e.stopPropagation();
        if (parent.classList.contains('active')) {
            close();
        } else {
            open();
        }
    });


    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });

    backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });


    inputs.forEach(input => {
        input.addEventListener('change', () => {
            output.textContent = input.dataset.value;
            output.classList.add('white')
            close();
        });
    });


    document.addEventListener('click', (e) => {
        if (!parent.contains(e.target)) {
            close();
        }
    });
}

dateSelection();

function maskPhone() {
    const input = document.querySelector('#phoneInput');
    const placeholder = document.querySelector('#customPhonePlaceholder');
    if (!input || !placeholder) return;

    const mask = IMask(input, {
        mask: '(000)000-00-00',
        lazy: true,
        placeholderChar: '_',
    });

    function updatePhonePlaceholder(value) {
        const template = '(xxx)xxx-xx-xx';
        const digits = value.replace(/\D/g, '');
        let digitIndex = 0;
        let result = '';

        // Определяем позицию последней введённой цифры в шаблоне
        // Нужно считать сколько "x" обработано
        let lastFilledPosition = 0;
        for (let i = 0; i < template.length; i++) {
            if (template[i] === 'x') {
                if (digitIndex < digits.length) {
                    digitIndex++;
                    lastFilledPosition = i; // запоминаем индекс последней цифры
                } else {
                    break;
                }
            }
        }

        digitIndex = 0; // сброс для основного цикла

        for (let i = 0; i < template.length; i++) {
            const templateChar = template[i];

            if (templateChar === 'x') {
                if (digits[digitIndex]) {
                    result += `<span class="filled">${digits[digitIndex]}</span>`;
                    digitIndex++;
                } else {
                    result += '_';
                }
            } else {
                // Подсвечиваем разделитель, если он стоит на пути до последней цифры включительно
                if (i <= lastFilledPosition) {
                    result += `<span class="filled">${templateChar}</span>`;
                } else {
                    result += templateChar;
                }
            }
        }

        placeholder.innerHTML = result;
    }




    input.addEventListener('focus', () => {
        input.placeholder = '';
        placeholder.style.visibility = 'visible';
        if (!mask.unmaskedValue) {
            placeholder.innerHTML = '(___)___-__-__';
        }
    });

    input.addEventListener('blur', () => {
        if (!mask.unmaskedValue) {
            placeholder.style.visibility = 'hidden';
            input.placeholder = 'Телефон';
        }
    });

    input.addEventListener('input', () => {
        const digits = input.value.replace(/\D/g, '');
        if (!digits) {
            mask.value = '';
            placeholder.innerHTML = '(___)___-__-__';
            placeholder.style.visibility = 'hidden';
            input.placeholder = 'Телефон';
        }
    });

    mask.on('accept', () => {
        if (mask.unmaskedValue) {
            updatePhonePlaceholder(mask.value);
            placeholder.style.visibility = 'visible';
        } else {
            placeholder.style.visibility = 'hidden';
        }
    });

    // При инициализации
    if (!mask.unmaskedValue) {
        placeholder.innerHTML = '(___)___-__-__';
        placeholder.style.visibility = 'hidden';
    } else {
        updatePhonePlaceholder(mask.value);
        placeholder.style.visibility = 'visible';
    }
}

maskPhone();


function maskDate() {
    const input = document.getElementById('dateInput');
    const placeholder = document.getElementById('customPlaceholder');

    const maskOptions = {
        mask: Date,
        pattern: 'd.`m.`Y',
        lazy: true,
        autofix: true,
        blocks: {
            d: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 31,
                maxLength: 2
            },
            m: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12,
                maxLength: 2
            },
            Y: {
                mask: IMask.MaskedRange,
                from: 1900,
                to: 2099
            },
        },
        format: date => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        },
        parse: str => {
            const [day, month, year] = str.split('.');
            return new Date(year, month - 1, day);
        }
    };


    const mask = IMask(input, maskOptions);

    // Обновление кастомного placeholder'а
    function updateCustomPlaceholder(value) {
        const template = 'xx.xx.xxxx';
        const digits = value.replace(/\D/g, '');
        let digitIndex = 0;
        let result = '';

        // Найдём индекс последней введённой цифры в шаблоне
        let lastFilledPosition = 0;
        for (let i = 0; i < template.length; i++) {
            if (template[i] === 'x') {
                if (digitIndex < digits.length) {
                    digitIndex++;
                    lastFilledPosition = i;
                } else {
                    break;
                }
            }
        }

        digitIndex = 0; // сброс для основного цикла

        for (let i = 0; i < template.length; i++) {
            const templateChar = template[i];

            if (templateChar === 'x') {
                if (digits[digitIndex]) {
                    result += `<span class="filled">${digits[digitIndex]}</span>`;
                    digitIndex++;
                } else {
                    result += '_';
                }
            } else {
                // Подсвечиваем точку, если она до или на позиции последней цифры
                if (i <= lastFilledPosition) {
                    result += `<span class="filled">${templateChar}</span>`;
                } else {
                    result += templateChar;
                }
            }
        }

        placeholder.innerHTML = result;
    }




    // События
    input.addEventListener('focus', () => {
        if (!mask.unmaskedValue) {
            placeholder.innerHTML = 'дд.мм.гггг';
        }
        placeholder.style.visibility = 'visible';
        input.placeholder = '';
    });

    input.addEventListener('blur', () => {
        if (!mask.unmaskedValue) {
            placeholder.style.visibility = 'hidden';
            input.placeholder = 'Дата рождения';
        }
    });

    input.addEventListener('input', () => {
        if (!input.value.replace(/\D/g, '')) {
            mask.value = '';
            placeholder.innerHTML = 'дд.мм.гггг';
            placeholder.style.visibility = 'hidden';
            input.placeholder = 'Дата рождения';
        }
    });

    mask.on('accept', () => {
        if (mask.unmaskedValue) {
            updateCustomPlaceholder(mask.value);
            placeholder.style.visibility = 'visible';
        } else {
            placeholder.innerHTML = 'дд.мм.гггг';
            placeholder.style.visibility = 'hidden';
        }
    });
}

maskDate()

  const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

gsap.utils.toArray(".padelIntro__picture-img img").forEach(img => {
  gsap.fromTo(img,
    { scale: 1 },
    {
      scale: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "center center",
        end: "bottom top",
        scrub: true,
      }
    }
  );
});

gsap.utils.toArray(".padelReady__picture-img img").forEach(img => {
  gsap.fromTo(img,
    { scale: 1 },
    {
      scale: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    }
  );
});

gsap.utils.toArray(".padelLocation__picture-img img").forEach(img => {
  gsap.fromTo(img,
    { scale: 1 },
    {
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    }
  );
});




// Анимация контента
gsap.fromTo(".padelLocation__picture-txt__content",
  { y: 120 },
  {
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".padelLocation",
      start: "top bottom",
      end: "center center",
      scrub: true,
    }
  }
);

// Анимация декора
gsap.fromTo([".padelLocation__picture-txt__decor-1", ".padelLocation__picture-txt__decor-2"],
  { y: 260 },
  {
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".padelLocation",
      start: "top bottom",
      end: "center center",
      scrub: true,
    }
  }
);


gsap.fromTo(".padelLocation__map-content",
  { y: 96 },
  {
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".padelLocation__map",
      start: "top bottom",
        end: "bottom top",
      scrub: true,
    }
  }
);

gsap.fromTo(".padelLocation__map-decor",
  { y: 158 },
  {
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".padelLocation__map",
      start: "top bottom",
        end: "bottom top",
      scrub: true,
    }
  }
);



  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;


  const styleResponse = await fetch('./static/js/json/customization.json');
  const customStyle = await styleResponse.json();


  const map = new YMap(document.getElementById('map'), {
    location: {
      center: [37.152308, 55.724799],
      zoom: 14
    }
  });


  map.addChild(new YMapDefaultSchemeLayer({
    customization: customStyle
  }));


  map.addChild(new YMapDefaultFeaturesLayer());


  const markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';
  markerElement.style.width = '60px';
  markerElement.style.height = '60px';
  markerElement.style.background = 'url(./static/images/general/padel/pin.svg) no-repeat center center';
  markerElement.style.backgroundSize = 'contain';


  const marker = new YMapMarker({
    coordinates: [37.152308, 55.724799],
    draggable: false
  }, markerElement);

  map.addChild(marker);
});
