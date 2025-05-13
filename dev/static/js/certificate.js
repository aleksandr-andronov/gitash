function makeUniqueSvg(svgElement) {
    if (!svgElement) return;
  
    const defs = svgElement.querySelector('defs');
    if (!defs) return; // если defs нет — ничего не делаем
  
    const idElements = defs.querySelectorAll('[id]');
    if (!idElements.length) return; // если внутри defs нет id — тоже выходим
  
    const idMap = {};
    const uniqueId = () => 'id_' + Math.random().toString(36).substr(2, 9);
  
    // Собираем все id и создаём новые уникальные
    idElements.forEach(el => {
      const oldId = el.id;
      const newId = uniqueId();
      idMap[oldId] = newId;
      el.id = newId;
    });
  
    // Меняем все ссылки на старые id внутри SVG
    let svgHtml = svgElement.innerHTML;
    Object.keys(idMap).forEach(oldId => {
      const newId = idMap[oldId];
      const regex = new RegExp(`url\\(#${oldId}\\)`, 'g');
      svgHtml = svgHtml.replace(regex, `url(#${newId})`);
    });
  
    svgElement.innerHTML = svgHtml;
  }
  

function certImages() {
    const main = document.querySelector('.certificate');
    if (!main) return;
    const btnPrev = main.querySelector('.certificate-slider__prev');
    const btnNext = main.querySelector('.certificate-slider__next');
    const list = main.querySelector('.certificate-images__list');

    

    function changeDesignImg() {
        const activeColorBtn = main.querySelector('.certificate-colors__btn.selected')
        const bgColor = activeColorBtn.dataset.bg
        const color = activeColorBtn.dataset.color
        const theme = activeColorBtn.dataset.theme

        const outputPictures = document.querySelectorAll('.outputPicture');
        const promocodeBlock = document.querySelector('.certificate-img__promocode');
        const mobileImages = document.querySelector('.certificate__mobile-img')

        const items = main.querySelectorAll('.certificate-images__list-item')
        const activeItem = main.querySelector('.certificate-images__list-item--active')


        const contentToClone = activeItem.innerHTML;

        main.style.setProperty('--cert-bg', bgColor);
        main.style.setProperty('--cert-color', color);

        main.classList.add(`certificate-theme-${theme}`)
        


        mobileImages.style.setProperty('--cert-bg', bgColor);
        mobileImages.style.setProperty('--cert-color', color);


        outputPictures.forEach(picture => {
            picture.style.setProperty('--cert-bg', bgColor);
            picture.style.setProperty('--cert-color', color);
            picture.innerHTML = contentToClone;
          
            const svg = picture.querySelector('svg');
            makeUniqueSvg(svg); // если svg или defs нет — функция сама пропустит
          });

        promocodeBlock.style.setProperty('--cert-bg', bgColor);
    }

    changeDesignImg()

    btnNext.addEventListener('click', (e) => {
        e.preventDefault()

        const activeItem = main.querySelector('.certificate-images__list-item--active')
        const nextItem = activeItem.nextElementSibling;

        const listItems = document.querySelectorAll('.certificate-images__list-item')
        const firstItem = listItems[0]
        const cloneItem = firstItem.cloneNode(true);

        activeItem.classList.remove('certificate-images__list-item--active')
        nextItem.classList.add('certificate-images__list-item--active')

        firstItem.remove()
        list.appendChild(cloneItem)

        changeDesignImg()
    })

    btnPrev.addEventListener('click', (e) => {
        e.preventDefault()

        const activeItem = main.querySelector('.certificate-images__list-item--active')
        const prevItem = activeItem.previousElementSibling;

        const listItems = document.querySelectorAll('.certificate-images__list-item')
        const lastItem = listItems[listItems.length - 1]
        const cloneItem = lastItem.cloneNode(true);

        activeItem.classList.remove('certificate-images__list-item--active')
        prevItem.classList.add('certificate-images__list-item--active')
        
        lastItem.remove()
        list.prepend(cloneItem)

        changeDesignImg()
    })
}

certImages()

  

function changeColorCertificate() {
    const main = document.querySelector('.certificate')
    if (!main) return

    const buttons = main.querySelectorAll('.certificate-colors__btn')
    const outputPictures = main.querySelectorAll('.outputPicture')
    const promocodeBlock = main.querySelector('.certificate-img__promocode')
    const mobileImages = main.querySelector('.certificate__mobile-img')
    if (!buttons.length) return

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            const activeSlideImg = document.querySelector('.certificate-images__list-item--active')
            const contentToClone = activeSlideImg.innerHTML;

            const bgColor = btn.dataset.bg
            const color = btn.dataset.color

            const theme = btn.dataset.theme

            if (theme == 'dark') {
                main.classList.add(`certificate-theme-dark`)
                main.classList.remove(`certificate-theme-image`)
            } else {
                main.classList.remove(`certificate-theme-dark`)
                main.classList.add(`certificate-theme-image`)
            }

            buttons.forEach(i => i.classList.remove('selected'))
            btn.classList.add('selected')

            main.style.setProperty('--cert-bg', bgColor);
            main.style.setProperty('--cert-color', color);

            outputPictures.forEach(picture => {
                picture.style.setProperty('--cert-bg', bgColor);
                picture.style.setProperty('--cert-color', color);
                picture.innerHTML = contentToClone;
            });
            promocodeBlock.style.setProperty('--cert-bg', bgColor);
            mobileImages.style.setProperty('--cert-bg', bgColor);
            mobileImages.style.setProperty('--cert-color', color);
        })
    })
}

changeColorCertificate()


function certificateMobileImages() {
    const thumbs = document.querySelectorAll('.certificate-mobileSlider__item');
    const images = document.querySelectorAll('.certificate__mobile-img__item');

    if (!thumbs.length) return;

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const currentNumber = this.dataset.item; 

            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            images.forEach(img => img.classList.add('hidden'));
            const targetImage = document.querySelector(`.certificate__mobile-img__item[data-item="${currentNumber}"]`);
            if (targetImage) {
                targetImage.classList.remove('hidden');
            }
        });
    });
}

certificateMobileImages()



function certificateCreate() {
    const main = document.querySelector('.certificate')
    if (!main) return
    const firstBtn = document.getElementById('firstBtnStep')
    const firstStep = document.querySelector('.certificate__first-step')
    const secondStep = document.querySelector('.certificate__second-step')
    const prevBtn = document.querySelector('.certificate__prev')
    const priceInput = document.querySelector('.certificate-form__price-input')
    const fastPriceInputs = document.querySelectorAll('.certificate-form__fast-label input')
    const firstBtnForm = document.getElementById('firstBtnForm')
    const secondBtnForm = document.getElementById('secondBtnForm')
    const formStepFirst = document.querySelector('.certificate-form__step-first')
    const formStepSecond = document.querySelector('.certificate-form__step-second')
    const imgFoots = document.querySelectorAll('.certificate-img__content-foot')
    const outputPriceWrapper = document.querySelectorAll('.certificate-img__info-price')
    const outputPrice = document.querySelectorAll('.outputPrice')
    const outputWhomWrapper = document.querySelectorAll('.certificate-img__info-whom')
    const outputWhom = document.querySelectorAll('.outputWhom')
    const inputName = document.querySelector('.inputName')
    const outputTextWrap = document.querySelectorAll('.certificate-img__content-text')
    const outputText = document.querySelectorAll('.outputTxt')
    const inputText = document.querySelector('.inputText')
    const inputWhom = document.querySelector('.inputWhom')
    const inputWhomParent = inputWhom.closest('.form-item')
    const inputWhomLabel = inputWhomParent.querySelector('.form-item__label')
    const outputFrom = document.querySelectorAll('.outputFrom')
    const inputGiver = document.querySelector('.inputGiver')
    const thirdStepForm = document.querySelector('.certificate-form__filling')
    const lastStepForm = document.querySelector('.certificate-form__payment')
    const mobileImages = document.querySelectorAll('.certificate__mobile-img__item')
    const mobileImgWrapper = document.querySelector('.certificate__step-mobile-img')


    // перезод ко второму шагу
    firstBtn.addEventListener('click', (e) => {
        e.preventDefault()
        firstStep.classList.remove('active')
        secondStep.classList.add('active')

        prevBtn.setAttribute('data-step', '2')

        mobileImages.forEach(img => img.classList.add('fh'))
    })

    // обработка кнопки назад
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const step = prevBtn.dataset.step

        prevBtn.setAttribute('data-step', +prevBtn.dataset.step - 1)

        if (step == '2') {
            firstStep.classList.add('active')
            secondStep.classList.remove('active')
            mobileImages.forEach(img => img.classList.remove('fh'))

        } else if (step == '3') {
            formStepFirst.classList.add('active')
            formStepSecond.classList.remove('active')
        } else if (step == '4') {
            lastStepForm.classList.add('hidden')
            thirdStepForm.classList.remove('hidden')
            mobileImgWrapper.classList.remove('hidden')
        }
    })



    // Выбор себе или в подарок
    const inputSelf = document.querySelector('.inputSelf')
    const colName = document.querySelector('.certificate-form__col-name')
    const colEmail = document.querySelector('.certificate-form__col-email')
    const whomLabel = document.querySelector('.changeLabel')

    inputSelf.addEventListener('change', (e) => {
        if (inputSelf.checked) {
            colName.classList.add('order-form__col--fw')
            colEmail.classList.remove('visible')
            inputGiver.removeAttribute('data-validate')
            whomLabel.textContent = whomLabel.dataset.change
        } else {
            colName.classList.remove('order-form__col--fw')
            colEmail.classList.add('visible')
            inputGiver.setAttribute('data-validate', '')
            whomLabel.textContent = whomLabel.dataset.default
        }
    })


    // выбор когда отправить
    const inputDateRadio = document.querySelectorAll('.inputDateRadio')
    const hiddenDate = document.querySelector('.certificate-form__hidden-date')
    inputDateRadio.forEach(input => {
        input.addEventListener('change', (e) => {
            if (input.dataset.value == 'now') {
                hiddenDate.classList.remove('visible')
            } else {
                hiddenDate.classList.add('visible')
            }
        })
    })

    // выбор времени и даты
    
    const openCalendar = document.querySelector('.openCalendar');
    const openCalendarParent = openCalendar.closest('.form-item__group');

    const inputsPlaceholderChange = document.querySelectorAll('.inputPlaceholderChange')


    inputsPlaceholderChange.forEach(input => {
        input.addEventListener('focusin', () => {
            input.setAttribute('placeholder', input.dataset.placeholderchange)
        })
        input.addEventListener('blur', () => {
            input.setAttribute('placeholder', input.dataset.placeholder)
        })
    })


    const inputDate = document.querySelector('.inputDate')
    IMask(inputDate,{
        mask: Date,
        lazy: true,
    })

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const commonOptions = {
        inline: true,
        dateFormat: 'dd.MM.yyyy',
        minDate: today
    };

    new AirDatepicker('#certCalendar', {
        ...commonOptions,
        onSelect({date, formattedDate, datepicker}) {
            const parent = openCalendar.closest('.form-item__group');
            inputDate.value = formattedDate;
            parent.classList.remove('show-date', 'focused');
            openCalendar.classList.remove('active');
        }
    });

    new AirDatepicker('#certCalendarM', {
        ...commonOptions,
        onSelect({date, formattedDate, datepicker}) {
            document.getElementById('outputmDate').textContent = formattedDate;
            inputDate.value = formattedDate;
            openCalendar.classList.remove('active');
        }
    });


    function handleOutsideClick(event) {
        if (!openCalendarParent.contains(event.target) && event.target !== openCalendar && openCalendar.classList.contains('active')) {
            openCalendar.classList.remove('active');
            openCalendarParent.classList.remove('show-date');
            document.removeEventListener('click', handleOutsideClick);
        }
    }
    
    openCalendar.addEventListener('click', (e) => {
        e.preventDefault();
        openCalendar.classList.toggle('active');
    
        if (openCalendar.classList.contains('active')) {
            openCalendarParent.classList.add('show-date');
            document.addEventListener('click', handleOutsideClick);
        } else {
            openCalendarParent.classList.remove('show-date');
            document.removeEventListener('click', handleOutsideClick);
        }
    });

    
    const inputTime = document.querySelector('.inputTime');
    inputTime.addEventListener('input', function() {
        let value = inputTime.value;
        
        value = value.replace(/:00$/, '');
        
        if (value.length === 1 && /^[3-9]$/.test(value)) {
            inputTime.value = ''; 
            return;
        }
    
        if (value.length === 2 && !isNaN(value)) {
            const hour = parseInt(value, 10);

            if (hour >= 0 && hour <= 23) {
                inputTime.value = `${value}:00`;
            } else {
                inputTime.value = ''; 
            }
        }
    });

    


    fastPriceInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            priceInput.value = input.dataset.value
            outputPrice.forEach(i => i.textContent = input.dataset.value)
            outputPriceWrapper.forEach(i => i.classList.add('visible'))
            input.closest('.certificate-form__price').classList.remove('error')
        })
    })

    firstBtnForm.addEventListener('click', (e) => {
        if (!priceInput.value) {
            priceInput.closest('.certificate-form__price').classList.add('error')
        } else {
            formStepFirst.classList.remove('active')
            formStepSecond.classList.add('active')
            imgFoots.forEach(imgFoot => {
                imgFoot.classList.add('full')
            })
            outputWhomWrapper.forEach(i => i.classList.add('visible'))
            prevBtn.setAttribute('data-step', '3')
        }
    })

    
    function formatPrice(value) {
        const numericValue = value.replace(/\D/g, '');
        const formattedValue = new Intl.NumberFormat('ru-RU').format(numericValue);
        return numericValue ? `${formattedValue} ₽` : '';
    }
    
    function handlePriceInput(event) {
        const input = event.target;
        let { selectionStart, selectionEnd, value } = input;
        
        if (selectionStart === value.length && value.endsWith(' ₽')) {
            value = value.slice(0, -2);
            selectionStart = selectionEnd = value.length;
        }
        
        const digits = value.replace(/\D/g, '');
        
        const formatted = formatPrice(digits);
        
        const diff = formatted.length - value.length;
    
        input.value = formatted;
        input.setSelectionRange(selectionStart + diff, selectionEnd + diff);

        if (formatted) {
            outputPriceWrapper.forEach(i => i.classList.add('visible'))
            outputPrice.forEach(i => i.textContent = formatted)
        } else {
            outputPriceWrapper.forEach(i => i.classList.remove('visible'))
        }
    }


    priceInput.addEventListener('input', (e) => {
        handlePriceInput(e)

        fastPriceInputs.forEach(i => i.checked = false)
    });





    priceInput.addEventListener('focusin', () => {
        priceInput.closest('.certificate-form__price').classList.remove('error')
    })
    

    inputName.addEventListener('input', () => {
        outputWhom.forEach(i => {
            i.classList.remove('hidden')
            i.textContent = inputName.value
        })
    })

    inputText.addEventListener('input', () => {
        outputText.forEach(i => {
            i.classList.remove('hidden');
            i.innerHTML = inputText.value; 
        });
    
        if (inputText.value) {
            outputTextWrap.forEach(i => {
                i.classList.add('active');
            });
        } else {
            outputTextWrap.forEach(i => {
                i.classList.remove('active');
            });
        }
    });

    inputWhom.addEventListener('input', () => {
        outputFrom.forEach(i => {
            i.textContent = inputWhom.value
        })
    })

    inputWhom.addEventListener('focusin', () => {
        inputWhomLabel.textContent = inputWhomLabel.dataset.default
    })

    inputWhom.addEventListener('blur', () => {
        if (!inputWhom.value) {
            inputWhomLabel.textContent = inputWhomLabel.dataset.change
        }
    })



    secondBtnForm.addEventListener('click', (e) => {
        const parent = secondBtnForm.closest('.certificate-form__step')
        const validateInputs = parent.querySelectorAll('.form-input[data-validate]')


        validateInputs.forEach(input => {
            const inputParent = input.closest('.form-item__group')
            const inputLabel = inputParent.querySelector('.form-item__label')
            if (!input.value) {
                inputParent.classList.add('error')
                inputLabel.textContent = inputLabel.dataset.error
            }
        })

        const errorItems = parent.querySelectorAll('.error')

        if (!errorItems.length) {
            thirdStepForm.classList.add('hidden')
            lastStepForm.classList.remove('hidden')
            prevBtn.setAttribute('data-step', '4')
            mobileImgWrapper.classList.add('hidden')
        }
    })

    const timeCertSlider = new Swiper('.time-slider', {
        slidesPerView: 3,
        centeredSlides: true, 
        spaceBetween: 25, 
        loop: true, 
        initialSlide: 12,
        on: {
            slideChange: function () {
                const activeSlide = this.slides[this.realIndex];
                if (activeSlide) {
                    const timeItem = activeSlide.querySelector('.time-slider__item');
                    if (timeItem) {
                        document.getElementById('outputmTime').textContent = timeItem.getAttribute('data-time')
                        inputTime.value = timeItem.getAttribute('data-time')
                    }
                }
            }
        }
    })
}

certificateCreate()

// const certSlider = new Swiper('.certificate-mobileSlider', {
//     slidesPerView: 'auto',
//     spaceBetween: 6,
//     freeMode: true,
//     loop: true,
//     slideToClickedSlide: true,
//     on: {
//       slideChange: function () {
//         const activeIndex = this.realIndex;
//         const items = document.querySelectorAll('.certificate__mobile-img__item');
  
//         items.forEach((item, index) => {
//           if (index === activeIndex) {
//             item.classList.remove('hidden');
//           } else {
//             item.classList.add('hidden');
//           }
//         });
//       }
//     }
// });