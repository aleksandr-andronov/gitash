function statusPosition() {
  const statusContainer = document.querySelector('.account-status');
  const transformLine = document.querySelector('.account-status__lines--transform');

  if (statusContainer && transformLine) {
    if (statusContainer.scrollWidth > statusContainer.clientWidth) {
      statusContainer.scrollTo({
        left: statusContainer.scrollWidth,
        behavior: 'smooth'
      });
    }
  }
}

statusPosition();

function treckForm() {
  const form = document.querySelector('.accountReturn-method__form');
  if (form) {
    const input = form.querySelector('.accountReturn-method__form-input');
    const button = form.querySelector('.accountReturn-method__form-btn');

    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        button.removeAttribute('disabled');
      } else {
        button.setAttribute('disabled', 'disabled');
      }
    });
  }
}

treckForm();

function formRequiredCheck() {
  document.querySelectorAll('.form-validate-check').forEach(form => {
    const thanks = document.querySelector(`#${form.dataset.thanks}`);
    const btn = form.querySelector('.btn[type="submit"]');

    const check = item => {
      const parent = item.closest('.offcanvas-return__info-group');
      if (parent) {
        if (item.type === 'radio') {
            const group = form.querySelectorAll(`input[name="${item.name}"]`);
            parent.classList.toggle('error', ![...group].some(i => i.checked));
        } else {
            parent.classList.toggle('error', item.type === 'checkbox' ? !item.checked : !item.value.trim());
        }
      }
      btn.removeAttribute('disabled')
      
    };

    form.querySelectorAll('[data-validate]').forEach(item => {
      ['input', 'change'].forEach(evt => {
        item.addEventListener(evt, () => check(item));
        
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const active = form.querySelector('.tabsRadio-content.active');
      active.querySelectorAll('[data-validate]').forEach(check);
      if (!form.querySelector('.error') && thanks) thanks.classList.remove('d-none');
    });
  });
}

formRequiredCheck();


function initDatePickers() {
  document.querySelectorAll('.form-item-date').forEach(item => {
    const button = item.querySelector('.openCalendar');
    const input = item.querySelector('.inputDate');
    const calendarId = item.dataset.calendarId;
    const parent = button.closest('.form-item__group') || item;
    const closeBtn = item.querySelector('.form-item__close');

    if (!button || !input || !calendarId) return;

    IMask(input, { mask: Date, lazy: true });

    const minDate = item.dataset.minDate === 'true' ? new Date() :
      item.dataset.minDate && item.dataset.minDate !== 'false' ? new Date(item.dataset.minDate) : null;

    const disableWeekends = item.dataset.disableWeekends === 'true';
    const disable = disableWeekends ? [d => [0, 6].includes(d.getDay())] : [];





    const datepicker = new AirDatepicker(`#${calendarId}`, {
      navTitles: {
        days: 'MMMM yyyy',
      },
      prevHtml: '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1.58398L3 7.58398L9 13.584" stroke="#1B1B1D" stroke-width="1.1" stroke-linecap="square" stroke-linejoin="round"/></svg>',
      nextHtml: '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13.584L11 7.58398L5 1.58398" stroke="#1B1B1D" stroke-width="1.1" stroke-linecap="square" stroke-linejoin="round"/></svg>',
      inline: true,
      dateFormat: 'dd.MM.yyyy',
      minDate,
      disable,
      onRenderCell({ date, cellType }) {
        return disableWeekends && cellType === 'day' && [0, 6].includes(date.getDay()) ? { disabled: true } : {};
      },
      onSelect({ formattedDate }) {
        input.value = formattedDate;
        input.closest('.offcanvas-return__info-group')?.classList.remove('error');
        close();
      }
    });

    const outside = e => !item.contains(e.target) && e.target !== button && close();
    const open = () => {
      button.classList.add('active');
      parent.classList.add('show-date');
      setTimeout(() => {
        parent.classList.add('show-date-animate');
      })
      document.addEventListener('click', outside);
    };
    const close = () => {
      button.classList.remove('active');
      parent.classList.remove('show-date-animate');
      setTimeout(() => {
        parent.classList.remove('show-date');
      }, 200)
      document.removeEventListener('click', outside);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
             close();
        })
    }

    button.addEventListener('click', e => {
      e.preventDefault();
      button.classList.contains('active') ? close() : open();
    });
  });
}

initDatePickers();


function changeInputPlaceholder() {
    const inputsPlaceholderChange = document.querySelectorAll('.inputPlaceholderChange');

    if (!inputsPlaceholderChange.length) return;

    inputsPlaceholderChange.forEach(input => {
        input.addEventListener('focusin', () => {
            input.setAttribute('placeholder', input.dataset.placeholderchange);
        })
        input.addEventListener('blur', () => {
            input.setAttribute('placeholder', input.dataset.placeholder);
        })
    })
}

changeInputPlaceholder();


// function formRequiredCheck() {
//   const forms = document.querySelectorAll('.form-validate-check');
//   if (!forms.length) return;

//   forms.forEach(form => {
//     const requiredItems = form.querySelectorAll('[data-validate]');
//     const successBlockName = form.dataset.thanks;
//     const successBlock = document.querySelector(`#${successBlockName}`);

//     // === Проверка одиночного поля ===
//     const checkField = (item) => {
//       const parent = item.closest('.offcanvas-return__info-group');
//       if (
//         (item.type === 'checkbox' && !item.checked) ||
//         (item.type !== 'checkbox' && item.type !== 'radio' && item.value.trim() === '')
//       ) {
//         parent.classList.add('error');
//       } else {
//         parent.classList.remove('error');
//       }
//     };

//     // === Проверка группы radio по name ===
//     const checkRadioGroup = (radio) => {
//       const name = radio.name;
//       const group = form.querySelectorAll(`input[type="radio"][name="${name}"]`);
//       const isChecked = Array.from(group).some(r => r.checked);
//       const parent = radio.closest('.offcanvas-return__info-group');

//       if (!isChecked) {
//         parent.classList.add('error');
//       } else {
//         parent.classList.remove('error');
//       }
//     };

//     // === Навешиваем обработчики на все поля ===
//     requiredItems.forEach(item => {
//       const type = item.type;

//       const handler = () => {
//         if (type === 'radio') {
//           checkRadioGroup(item);
//         } else {
//           checkField(item);
//         }
//       };

//       item.addEventListener('input', handler);
//       item.addEventListener('change', handler);
//     });

//     // === Обработка отправки формы ===
//     form.addEventListener('submit', e => {
//       e.preventDefault();

//       const activeTab = form.querySelector('.tabsRadio-content.active');
//       const requiredInputs = activeTab.querySelectorAll('[data-validate]');

//       requiredInputs.forEach(item => {
//         if (item.type === 'radio') {
//           checkRadioGroup(item);
//         } else {
//           checkField(item);
//         }
//       });

//       const errorItems = form.querySelectorAll('.error');
//       if (!errorItems.length && successBlock) {
//         successBlock.classList.remove('d-none');
//       }
//     });
//   });
// }

// formRequiredCheck();


const returnOffcanvas = document.getElementById('returnMethodOffcanvas')
if (returnOffcanvas) {
    returnOffcanvas.addEventListener('hidden.bs.offcanvas', event => {
        document.getElementById('statusSuccess').classList.add('d-none')
    })
}





function supportChat() {
    const main = document.querySelector('.supportChat');
    if (!main) return;

    const btn = main.querySelector('.supportChat-btn');
    const dropdown = main.querySelector('.supportChat-dropdown');

    if (!btn || !dropdown) return;

    const toggleDropdown = (show) => {
        btn.classList.toggle('opened', show);
        dropdown.classList.toggle('d-none', !show);
    };

    let isOpen = false;

    btn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        isOpen = !isOpen;
        toggleDropdown(isOpen);
    });

    document.addEventListener('click', (e) => {
        if (!main.contains(e.target) && isOpen) {
            isOpen = false;
            toggleDropdown(false);
        }
    });
}

supportChat();


const podeliSlider = new Swiper('.offcanvas-podeli__slider', {
    effect: 'fade',
    autoplay: {
        delay: 8000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.offcanvas-podeli__pagination',
        clickable: true
    }
})


document.querySelectorAll('.copy_code').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault()

        this.classList.add('active')
        setTimeout(() => {
            this.classList.remove('active')
        }, 5000)
    })
})


function sCollectionActions() {
    const main = document.querySelector('.sCollection')
    if (!main) return
    const btn = main.querySelector('.sCollection-favorite')
    const dot = main.querySelector('.sCollection-dot')
    const card = main.querySelector('.sCollection-card')
    const close = card.querySelector('.sCollection-card__close')
    if (btn) {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active')
        })
    }

    if (dot) {
        dot.addEventListener('click', (e) => {
            e.preventDefault()
            main.classList.add('card-visible')
        })
    }

    if (close) {
        close.addEventListener('click', (e) => {
            e.preventDefault()
            main.classList.remove('card-visible')
        })
    }
}

sCollectionActions()


// повторное открытие окна в заказе
function secondOpenOffcanvas() {
    const links = document.querySelectorAll('[data-bs-second]')
    if (!links.length) return

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault()
            const href = link.href

            const url = new URL(href)
            const id = url.hash.slice(1)

            if (id) {
                const targetEl = document.getElementById(id)
                if (targetEl) {
                    document.querySelectorAll('.second-open').forEach(el => el.classList.remove('second-open'))
                    targetEl.classList.add('second-open')
                } else {
                    console.warn(`Элемент с id="${id}" не найден на странице`)
                }
            }
        })
    })
}

secondOpenOffcanvas()




// предупреждение
function manageClass(element, className, action, delay) {
    setTimeout(() => {
        element.classList[action](className)
    }, delay)
}

function ashWarning() {
    const main = document.querySelector('.ashWarning')
    if (main) {
        main.classList.add('visible')
        setTimeout(() => {
            main.classList.add('animate')

            manageClass(main, 'animate', 'remove', 5000)
            manageClass(main, 'visible', 'remove', 5200)
        }, 1)
    }
}


// отображение предупреждения для демонстрации 
setTimeout(() => {
    ashWarning()
}, 2000)



const slider = new Swiper('._catalog-types__slider', {
    slidesPerView: 'auto',
    spaceBetween: 6,
    breakpoints: {
        1441: {
            spaceBetween: 8,
        }
    }
});


function catalogSizes() {
    const slider = new Swiper('.catalog-sizes__list', {
        slidesPerView: 'auto',
        spaceBetween: 6,
        breakpoints: {
            1441: {
                spaceBetween: 8,
            }
        }
    });

    const stickyElement = document.querySelector('.catalog__actions--sticky');
    const header = document.querySelector('.header');

    if (!stickyElement || !header) {
        console.warn('Не удалось найти .catalog__actions--sticky или .header');
        return;
    }

    const headerHeight = header.offsetHeight;
    let lastScrollY = window.scrollY;
    let isTopAdded = false;
    let lastDirection = null;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const stickyOffsetTop = stickyElement.getBoundingClientRect().top + currentScrollY;

        // Проверяем, достиг ли элемент высоты header
        if (currentScrollY + headerHeight >= stickyOffsetTop) {
            if (!isTopAdded) {
                stickyElement.classList.add('catalog__actions--top');
                isTopAdded = true;
            }

            // Определяем направление прокрутки
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';

            if (direction !== lastDirection) {
                if (direction === 'down') {
                    stickyElement.classList.add('catalog__actions--down');
                    stickyElement.classList.remove('catalog__actions--up');
                } else {
                    stickyElement.classList.add('catalog__actions--up');
                    stickyElement.classList.remove('catalog__actions--down');
                }

                lastDirection = direction;
            }
        } else {
            if (isTopAdded) {
                stickyElement.classList.remove('catalog__actions--top', 'catalog__actions--down', 'catalog__actions--up');
                isTopAdded = false;
            }
            lastDirection = null;
        }

        lastScrollY = currentScrollY;
    };

    // Привязываем обработчик к событию прокрутки
    window.addEventListener('scroll', handleScroll);

    // Выполняем обработчик сразу после загрузки страницы
    window.addEventListener('load', handleScroll);
}

catalogSizes();







function capitalizeCardNames() {
    const cardNameElements = document.querySelectorAll('.card-info__name')

    if (!cardNameElements.length) return
  
    cardNameElements.forEach(element => {
      if (element.textContent.trim() !== '') { 
        const currentText = element.textContent.trim()
        const capitalizedText = currentText.charAt(0).toUpperCase() + currentText.slice(1).toLowerCase()
        element.textContent = capitalizedText
      }
    })
}

capitalizeCardNames()



function discountPosition() {
    const catalogHead = document.querySelector('.catalog__head--has-tab')
    const catalogContent = document.querySelector('.catalog__content')
    const header = document.querySelector('.header')
    const bottomItems = document.querySelector('.catalog-discounts--bottom')
    
    if (!catalogHead || !catalogContent || !header) {
        console.warn('Не удалось найти один из необходимых элементов.')
        return
    }
    
    const headerHeight = header.offsetHeight

    function updateFixedClass() {
        const contentTop = catalogContent.getBoundingClientRect().top

        if (contentTop <= headerHeight) {
            catalogHead.classList.add('catalog__head--fixed')
            bottomItems.classList.add('visible')
            setTimeout(() => {
                bottomItems.classList.add('animate')
            })
        } else {
            catalogHead.classList.remove('catalog__head--fixed')
            bottomItems.classList.remove('visible', 'animate')
        }
    }

    window.addEventListener('scroll', updateFixedClass)

    updateFixedClass()
}
discountPosition();








const myOffcanvas = document.getElementById('cert')
if (myOffcanvas) {
    myOffcanvas.addEventListener('shown.bs.offcanvas', event => {
        document.querySelector('.offcanvas-cert__decor').classList.add('visible')
        setTimeout(() => {
          document.querySelector('.offcanvas-cert__decor').classList.remove('visible')
        }, 2000)
    })
}




// поп ап “скачать приложение”
function downloadPopup(id) {
    const main = document.querySelector(id)
    if (!main) return
    const close = main.querySelector('.downloadPopup__close')

    setTimeout(() => {
        main.classList.add('visible')
        setTimeout(() => {
            main.classList.add('animate')
        }, 300)
    }, 2000)

    close.addEventListener('click', (e) => {
        e.preventDefault()

        main.classList.remove('animate')
        setTimeout(() => {
            main.classList.remove('visible')
        }, 300)
    })
}

downloadPopup('#quizPopup')


function hideNotification() {
    const notificationTop = document.querySelector('.notification-top');
    if (!notificationTop) return;

    const header = document.querySelector('.header');
    if (!header) return;

    const notificationHeight = notificationTop.offsetHeight;

    // Функция для обновления положения элементов
    const updatePositions = () => {
        const scrollY = window.scrollY;

        // Вычисляем новое значение `top` для notificationTop
        const newTop = Math.min(0, -scrollY);

        // Обновляем положение notificationTop
        notificationTop.style.top = `${newTop}px`;

        // Устанавливаем положение header в зависимости от прокрутки
        if (scrollY < notificationHeight) {
            header.style.top = `${notificationHeight + newTop}px`;
        } else {
            header.style.top = '0';
        }
    };

    // Привязываем обработчик к событию прокрутки
    window.addEventListener('scroll', updatePositions);

    // Выполняем обновление сразу после загрузки страницы
    window.addEventListener('load', updatePositions);
}

hideNotification();

  
  





// слайдер выбора типа доставки во всплывабщем окне
const deliveryTypeSlider = new Swiper('.address-form__shipment-slider', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    observer: true,
    observeParents: true,
    breakpoints: {
        933: {
            spaceBetween: 12,
        },
        1441: {
            spaceBetween: 16,
        }
    }
})





// проверка полей на заполненность
function checkInputsValue() {
    const forms = document.querySelectorAll('.form')
    if (!forms.length) return
    forms.forEach(form => {
        const validateInputs = form.querySelectorAll('[data-validate]')
        form.addEventListener('submit', (e) => {
            validateInputs.forEach(input => {
                if (!input.value) {
                    e.preventDefault()
                    const parent = input.closest('.form-item__group')
                    const label = parent.querySelector('.form-item__label')
                    parent.classList.add('error')


                    if (label && label.hasAttribute('data-error')) {
                        label.textContent = label.dataset.error
                    }
                }
                
            })
        })
    })
}

checkInputsValue()

function setInitialErrors() {
    const forms = document.querySelectorAll('.form')
    if (!forms.length) return

    forms.forEach(form => {
        const errorGroups = form.querySelectorAll('.form-item__group.error')
        errorGroups.forEach(group => {
            const label = group.querySelector('.form-item__label')
            if (label && label.hasAttribute('data-error')) {
                label.textContent = label.dataset.error
            }
        })
    })
}

setInitialErrors()



const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


// добавление в корзину со страницы товара
function addProductInCart() {
    const btn = document.querySelector('.product-cartBtn')
    if (!btn) return
    const btnTxt = btn.querySelector('.product-cartBtn__output')
    const btnAnimate = btn.querySelector('.product-cartBtn__animate')
    const sizeButtons = document.querySelectorAll('.product-size__btn')
    const sizeSelectButtons = document.querySelectorAll('.product-size__radio')
    const title = document.querySelector('.product-size__title')
    const sizeSelect = document.querySelector('.size-select')

    btn.addEventListener('click', (e) => {
        e.preventDefault()

        if (btn.classList.contains('added')) {
            return
        }

        if (sizeButtons.length) {
            const selectedItem = document.querySelector('.product-size__btn.selected')
            if (!selectedItem) {
                errorTitle()
                    
            } else {
                animateBtn()
            }
        }

        if (sizeSelectButtons.length) {
            const selectedItem = document.querySelector('.product-size__radio:checked')
            if (!selectedItem) {
                sizeSelect.classList.add('opened')
                sizeSelect.querySelector('.form-select__btn').classList.add('opened')
                sizeSelect.querySelector('.form-select__dropdown').classList.add('visible')
            } else {
                animateBtn()
            }
        }
    })

    function errorTitle() {
        title.textContent = title.dataset.error
        title.classList.add('error')

        btnTxt.textContent = btn.dataset.change

        
    }

    function animateBtn() {
        btn.classList.add('animate');
        const animateSpans = btn.querySelectorAll('.product-cartBtn__animate span');
        let opacity = 0.5;
        let interval = 500;

        animateSpans.forEach((span, i) => {
            setTimeout(() => {
            span.style.opacity = opacity;
            }, interval * i);
    
            setTimeout(() => {
            span.style.opacity = 1;
            }, interval * (i + 1));
        });

        setTimeout(() => {
            btn.classList.remove('animate');
            btn.classList.add('added')
            btnTxt.textContent = btn.dataset.finish;
            setTimeout(() => {
                btnTxt.textContent = btn.dataset.last;
                btn.href = "#cart"
                btn.setAttribute('data-bs-toggle', 'offcanvas')
            }, 500)
        }, interval * (animateSpans.length + 1));
    }
}

addProductInCart()



function choosingSize() {
    const btns = document.querySelectorAll('.product-size__btn')
    if (!btns.length) return
    const title = document.querySelector('.product-size__title')
    const btnWrapperDefault = document.querySelector('.product-size__btn-default')
    const btnWrapperChange = document.querySelector('.product-size__btn-change')
    const cartBtn = document.querySelector('.product-cartBtn')
    const btnTxt = cartBtn.querySelector('.product-cartBtn__output')
    const sizeWarning = new bootstrap.Collapse('#sizeWarning', {
        toggle: false
      })
    const sizeWarningTxt = document.querySelector('.product-size__warning-txt')
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            
            btns.forEach(i => i.classList.remove('selected'))
            btn.classList.add('selected')
            if (title.classList.contains('error')) {
                title.textContent = title.dataset.default
                title.classList.remove('error')
                btnTxt.textContent = cartBtn.dataset.default
            }

            if (btn.classList.contains('disabled')) {
                btnWrapperDefault.classList.add('hidden')
                btnWrapperChange.classList.remove('hidden')
            } else {
                btnWrapperDefault.classList.remove('hidden')
                btnWrapperChange.classList.add('hidden')
            }


            if (btn.dataset.sizewarning == 'true') {
                sizeWarning.show()
                sizeWarningTxt.textContent = btn.dataset.sizeqtytext
            } else {
                sizeWarning.hide()
            }

        })
    })
}

choosingSize()


// галлерея на странице товара


const galleryThumbs = new Swiper('.gallery-thumbs', {
    direction: "vertical",
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    spaceBetween: 2,
    watchSlidesProgress: true,
})

const gallerySlider = new Swiper('.gallery-list', {
    direction: "vertical",
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    spaceBetween: 0,
    freeMode: true,
    mousewheel: {
        enabled: true,
        eventsTarget: '.gallery', 
        releaseOnEdges: true,
    },
    thumbs: {
        swiper: galleryThumbs,
    },
})

const gallerySliderMobile = new Swiper('.gallery-mobile', {
    observer: true,
    observeParents: true,
    pagination: {
        el: '.gallery-mobile__pagination',
        clickable: true
    },
    zoom: {
        maxRatio: 3,
        minRatio: 1
    },
})


function productGallery() {
    const gallery = document.querySelector('.gallery')


    if (!gallery) return

    const galleryImg = gallery.querySelectorAll('.gallery-list__img')
    const openGallery = document.querySelector('.product-gallery__link')
    const openImg = document.querySelectorAll('.js-gallery-open')
    const closeBtn = gallery.querySelector('.gallery-close')
    const body = document.querySelector('body')

    function galleryClose() {
        body.classList.remove('o-hidden')
        gallery.classList.remove('animate')
        setTimeout(() => {
            gallery.classList.remove('visible')
        }, 300)
    }

    if (openGallery) {
        openGallery.addEventListener('click', (e) => {
            e.preventDefault()
            body.classList.remove('o-hidden')
            gallery.classList.add('visible')
            setTimeout(() => {
                gallery.classList.add('animate')
            })
        })
    }

    openImg.forEach(item => {
        item.addEventListener('click', () => {
            
            const currentSlide = item.dataset.img

            gallerySlider.slideTo(+currentSlide-1)

            gallery.classList.add('visible')
            body.classList.add('o-hidden')
            setTimeout(() => {
                gallery.classList.add('animate')
            })
        })
    })


    closeBtn.addEventListener('click', (e) => {
        e.preventDefault()
        galleryClose()
    })

    galleryImg.forEach(item => {
        item.addEventListener('click', () => {
            galleryClose()
        })
    })
}

// const mediaQuery = window.matchMedia('(min-width: 933px)')
// if (mediaQuery.matches) {
//     productGallery()
// }

productGallery()


// смена значения в поле с выпадающем списком
function changeSelectInputValue() {
    const items = document.querySelectorAll('.form-item__dropdown-label input')
    if (!items.length) return

    items.forEach(item => {
        const parent = item.closest('.form-item')
        
        const output = parent.querySelector('.form-input')
        const dropdown = parent.querySelector('.form-item__dropdown')
        item.addEventListener('change', (e) => {
            output.value = item.dataset.value
            dropdown.classList.remove('show')
        })
    })
}

changeSelectInputValue()

// отображение выпадающего списка при вводе в поле
function showDropdownInput() {
    const items = document.querySelectorAll('.form-item-dropdown')
    if (!items.length) return
    
    items.forEach(item => {
        const input = item.querySelector('.form-input')
        const dropdown = item.querySelector('.form-item__dropdown')

        input.addEventListener('input', () => {
            if (dropdown) {
                dropdown.classList.add('show')
            }
        })

        // Удаление класса show при клике вне элемента
        document.addEventListener('click', (event) => {
            // Проверяем, является ли клик внутри элемента или его потомка
            if (!item.contains(event.target) && dropdown) {
                dropdown.classList.remove('show')
            }
        })
    })
}

showDropdownInput()


function choosingCountry() {
    const items = document.querySelectorAll('.form-phone');
    if (!items.length) return;
  
    items.forEach(item => {
      const btn = item.querySelector('.form-phone__btn');
      const dropdown = item.querySelector('.form-phone__dropdown');
      const input = item.querySelector('.form-input');
      const inputWrapper = item.querySelector('.form-item__group');
      const countries = item.querySelectorAll('.form-item__country input');
      const outputFlag = item.querySelector('.form-phone__btn-flag img');
      const outputNum = item.querySelector('.form-phone__btn-txt');
  
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Останавливаем всплытие события
        item.classList.toggle('active');
        btn.classList.toggle('active');
        dropdown.classList.toggle('show');
  
        if (!inputWrapper.classList.contains('focused')) {
          inputWrapper.classList.add('focused');
          input.setAttribute('placeholder', input.dataset.placeholder);
        } else {
          inputWrapper.classList.remove('focused');
          input.removeAttribute('placeholder');
        }
      });
  
      input.addEventListener('focusin', () => {
        item.classList.add('active'); // Тело фокусировки: только добавляем active
        input.setAttribute('placeholder', input.dataset.placeholder);
      });
  
      input.addEventListener('focusout', () => {
        input.removeAttribute('placeholder');
        setTimeout(() => { // Убираем active с небольшой задержкой
          if (!item.contains(document.activeElement)) {
            item.classList.remove('active');
          }
        }, 100);
      });
  
      countries.forEach(country => {
        country.addEventListener('change', () => {
          dropdown.classList.remove('show');
          outputFlag.setAttribute('src', country.dataset.flag);
          outputNum.textContent = country.dataset.txt;
          item.classList.remove('active');
          btn.classList.remove('active');
          input.focus();
        });
      });
  
      document.addEventListener('click', (e) => {
        if (!item.contains(e.target)) {
          item.classList.remove('active');
          btn.classList.remove('active');
          dropdown.classList.remove('show');
          inputWrapper.classList.remove('focused');
          input.removeAttribute('placeholder');
        }
      });
    });
  }
  
  choosingCountry();
  



  
  


// Слайдер на главной
const introSlider = new Swiper('.intro-slider', {
    speed: 800,
    pagination: {
        el: '.intro-pagination',
        clickable: true
    }
})




// сортировка

function catalogSorting() {
    const items = document.querySelectorAll('.sorting')
    if (!items.length) return

    // Функция для закрытия всех dropdowns
    const closeAllDropdowns = () => {
        document.querySelectorAll('.sorting-dropdown.visible').forEach(content => {
            content.classList.remove('animate')
            document.documentElement.classList.remove('mobile-overflow-hidden')
            setTimeout(() => {
                content.classList.remove('visible')
            }, 200)
        })
    }

    // Обработчик для закрытия при клике вне элемента
    const handleDocumentClick = (e) => {
        items.forEach(item => {
            if (!item.contains(e.target)) {
                const content = item.querySelector('.sorting-dropdown')
                if (content.classList.contains('visible')) {
                    closeAllDropdowns()
                }
            }
        })
    }

    // Основная логика для каждого элемента
    items.forEach(item => {
        const content = item.querySelector('.sorting-dropdown')
        const btn = item.querySelector('.sorting-btn')
        const output = item.querySelector('.sorting-btn__txt')
        const inputs = item.querySelectorAll('.sorting-dropdown input')

        // Обработчик для кнопки
        const handleButtonClick = (e) => {
            e.preventDefault()
            const isVisible = content.classList.contains('visible')
            closeAllDropdowns()
            if (!isVisible) {
                document.documentElement.classList.add('mobile-overflow-hidden')
                content.classList.add('visible')
                setTimeout(() => {
                    content.classList.add('animate')
                })
            }
        }

        // Обработчик для выбора элемента
        const handleInputChange = (input) => {
            output.textContent = input.dataset.value
            closeAllDropdowns()
        }

        btn.addEventListener('click', handleButtonClick)

        inputs.forEach(input => {
            input.addEventListener('change', () => handleInputChange(input))
        })
    })

    // Общий обработчик для кликов вне элементов
    document.addEventListener('click', handleDocumentClick)
}

catalogSorting()






// отображение выпадающего списка в поле

// function toggleDropdownSelect() {
//     const items = document.querySelectorAll('.form-item-select')
//     if (!items.length) return

//     items.forEach(item => {
//         const input = item.querySelector('.form-input')
//         const dropdown = item.querySelector('.form-item__dropdown')
//         input.addEventListener('focusin', () => {
//             item.classList.add('opened')
//             dropdown.classList.add('visible')
//         })
//     })
// }

// toggleDropdownSelect()




function toggleBottomMobilePanel() {
    const items = document.querySelectorAll('.mobileBottom')
    if (!items.length) return

    items.forEach(item => {
        const btns = item.querySelectorAll('[data-close]')

        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                document.documentElement.classList.remove('mobile-overflow-hidden')
                item.classList.remove('animate')
                setTimeout(() => {
                    item.classList.remove('visible')
                }, 200)
            })
        })
    })
}

toggleBottomMobilePanel()


// фильтр
function catalogFilter() {
    const main = document.querySelector('.filter');
    if (!main) return;

    const checkboxes = main.querySelectorAll('input[type="checkbox"]');
    const filterBtn = main.querySelector('.filter__btn');
    const filterActions = main.querySelector('.filter__bottom-actions');
    const filterGroups = main.querySelectorAll('.filter__group');
    const filterGroupQty = document.querySelector('#FilterGroupQty');
    const filterOpen = document.querySelector('.filter-btn')

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            updateFilter();
        });
    });

    function updateFilter() {
        let checkedCount = 0;
        let activeGroups = 0;

        filterGroups.forEach(function(group) {
            const checkboxesInGroup = group.querySelectorAll('input[type="checkbox"]:checked');
            const clearButton = group.querySelector('.filter__group-clear');

            if (checkboxesInGroup.length > 0) {
                activeGroups++;
                clearButton.classList.add('active');
                group.querySelector('.filter__title-qty').textContent = checkboxesInGroup.length;
                group.querySelector('.filter__title').classList.add('active');
            } else {
                clearButton.classList.remove('active');
                group.querySelector('.filter__title').classList.remove('active');
            }
            checkedCount += checkboxesInGroup.length;
        });

        if (checkedCount > 0) {
            filterBtn.removeAttribute('disabled');
            filterActions.classList.add('visible');
            filterOpen.classList.add('active');
        } else {
            filterBtn.setAttribute('disabled', '');
            filterActions.classList.remove('visible');
            filterOpen.classList.remove('active');
        }

        filterGroupQty.textContent = activeGroups;
    }

    filterGroups.forEach(function(group) {
        const clearButton = group.querySelector('.filter__group-clear');
        const checkboxesInGroup = group.querySelectorAll('input[type="checkbox"]');

        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            checkboxesInGroup.forEach(function(checkbox) {
                checkbox.checked = false;
            });
            updateFilter();
        });
    });

    const clearAllButton = main.querySelector('.filter__clear');

    clearAllButton.addEventListener('click', function() {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
        updateFilter();
    });

    updateFilter();
}

catalogFilter();


// слайдер в карточке товара




function productCardSlider() {
    const items = document.querySelectorAll('.catalog__content .card');
    if (!items.length) return;

    items.forEach(item => {
        const slider = item.querySelector('.card-img__slider');
        const pagination = item.querySelector('.card-img__pagination');

        let swiperInstance = null;

        const initSwiper = () => {
            const isDesktop = window.innerWidth >= 933;

            // Уничтожаем предыдущий инстанс, если он уже есть
            if (swiperInstance) swiperInstance.destroy(true, true);

            swiperInstance = new Swiper(slider, {
                spaceBetween: 30,
                effect: isDesktop ? 'fade' : 'slide',
                fadeEffect: {
                    crossFade: true
                },
                pagination: {
                    el: pagination,
                    clickable: false,
                },
            });

            // Навешиваем события на кастомную пагинацию заново
            pagination.querySelectorAll('.swiper-pagination-bullet').forEach((bullet, index) => {
                bullet.addEventListener('mouseover', () => {
                    swiperInstance.slideTo(index);
                });
            });
        };

        // Инициализация при загрузке
        initSwiper();

        // Обработка ресайза
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                initSwiper();
            }, 200); 
        });
    });
}

productCardSlider();


const cartRecomend = new Swiper('.cart-slider ', {
    slidesPerView: 'auto',
    spaceBetween: 2,
    speed: 800,
    observer: true,
    observeParents: true,
    navigation: {
        prevEl: '.cart-recomend__controls-prev',
        nextEl: '.cart-recomend__controls-next'
    },
    breakpoints: {
        933: {
            spaceBetween: 6,
        },
        1441: {
            spaceBetween: 8,
        }
    }
});



// Слайдер выбора дня доставки
const daySlider = new Swiper('.order-form__day-slider', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    speed: 800,
    breakpoints: {
        933: {
            slidesPerView: 5,
            spaceBetween: 6,
        },
        1441: {
            spaceBetween: 8,
            slidesPerView: 5,
        }
    }
})


// Слайдер выбора даты доставки
const timeSlider = new Swiper('.order-form__time-slider', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    speed: 800,
    breakpoints: {
        933: {
            spaceBetween: 6,
        },
        1441: {
            spaceBetween: 8,
        }
    }
})


// открытие окна нового адреса курьер/почта
function addressType() {
    console.log(1)
    const btn = document.querySelectorAll('.saveInfo__change')
    console.log(btn)
    const btnModal = document.querySelectorAll('.address-add__btn')
    if (!btn.length) return

    btn.forEach(item => {
        item.addEventListener('click', () => {
            const dataType = item.dataset.type

            console.log(dataType)
            

            btnModal.forEach(i => {
                i.setAttribute('href', `#${dataType}`)
            })
    
            
        })
    })

    
}
// addressType() 

// открытие окна нового адреса курьер/почта
function addressType() {
    const btn = document.querySelector('.toggle-href')
    const btnModal = document.querySelector('.address-add__btn')
    if (!btn) return

    btn.addEventListener('click', () => {
        const dataType = btn.dataset.type

        btnModal.setAttribute('href', `#${dataType}`)
    })
}

// addressType()


// Изменить текст в конпке при вводе комментария
function changeTextBtnComment() {
    const btn = document.getElementById('commentBtn')
    const input = document.getElementById('commentInput')
    if (!input) return

    input.addEventListener('input', () => {
        if (input.value) {
            btn.textContent = btn.dataset.change
        } else {
            btn.textContent = btn.dataset.default
        }
    })
}

changeTextBtnComment()


// изменение цвета карточки после отписки
function unsubscribeCard() {
    const links = document.querySelectorAll('.account-orderItem__subscribe')
    if (!links.length) return

    links.forEach(link => {
        const parent = link.closest('.account-orderItem')
        link.addEventListener('click', () => {
            parent.classList.toggle('remove')
        })
    })
}

unsubscribeCard() 





let isButtonShown = false;

function toggleBotomPanelPayment() {
    const orderBtn = document.getElementById('orderBtn');
    if (!orderBtn) return
    const rect = orderBtn.getBoundingClientRect();
    const bottomBlock = document.querySelector('.order-mobile__stickyPay')

    
    
    if (rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        if (!isButtonShown) {
            
            bottomBlock.classList.remove('animate')
            setTimeout(() => {
                bottomBlock.classList.remove('visible')
            }, 200)
            isButtonShown = true; 
        }
    } else {
        bottomBlock.classList.add('visible')
        setTimeout(() => {
            bottomBlock.classList.add('animate')
        })
        isButtonShown = false;
    }
}

window.addEventListener('scroll', toggleBotomPanelPayment);



function togglePaymentInfo() {
    const items = document.querySelectorAll('.order-form__payment')
    const allHiddenItems = document.querySelectorAll('.order-form__payment-content__hidden-wrapper')
    if (!items.length) return

    items.forEach(item => {
        const hiddenInfo = item.querySelector('.order-form__payment-content__hidden-wrapper')
        const input = item.querySelector('input')
        

        input.addEventListener('change', () => {

            allHiddenItems.forEach(i => {
                const collapse = new bootstrap.Collapse(i, {
                    toggle: false
                })
                collapse.hide()
            })

            if (hiddenInfo) {
                const bsCollapse = new bootstrap.Collapse(hiddenInfo, {
                    toggle: false
                })
                bsCollapse.show()
            }
        })
    })
}

togglePaymentInfo()



const offcanvasBody = document.getElementById('offcanvasBodyMap');

function setBodyHeight() {
  const offcanvasHead = document.querySelector('.offcanvas__head--has-search');
  const headerHeight = offcanvasHead.offsetHeight;
  offcanvasBody.style.height = `calc(100% - ${headerHeight}px)`;
}

if (offcanvasBody) {
    window.addEventListener('load', setBodyHeight);
    window.addEventListener('resize', setBodyHeight);
}


function searchInputActions() {
    const items = document.querySelectorAll('.form-item-search')
    if (!items.length) return


    items.forEach(item => {
        const input = item.querySelector('.form-input')
        const btnClear = item.querySelector('.form-item__clear')

        input.addEventListener('input', () => {
            if (input.value) {
                btnClear.classList.add('active')
            } else {
                btnClear.classList.remove('active')
            }
        })
    })
}


searchInputActions()


function inputClear() {
    const items = document.querySelectorAll('.form-item__clear')
    if (!items.length) return
    items.forEach(item => {
        const parent = item.closest('.form-item')
        const input = parent.querySelector('.form-input')
        const dropdown = parent.querySelector('.form-item__dropdown')
        const group = parent.querySelector('.form-item__group')

        item.addEventListener('click', () => {
            input.value = ''
            item.classList.remove('active')
            if (dropdown) {
                dropdown.classList.remove('show')
            }
            group.classList.remove('filled')
        })
    })
}

inputClear()


function showActionsAddress() {
    const items = document.querySelectorAll('.address-item')
    if (!items.length) return

    items.forEach(item => {
        const more = item.querySelector('.address-item__more')
        const actions = item.querySelector('.address-item__actions')
        const actionsContent = actions.querySelector('.address-item__actions-content')
        const closeBtn = item.querySelector('.address-item__actions-close')


        if (more) {
            more.addEventListener('click', (e) => {
                e.preventDefault()
                actions.classList.add('visible')
                setTimeout(() => {
                    actionsContent.classList.add('visible')
                }) 
            })
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                actionsContent.classList.remove('visible')
                setTimeout(() => {
                    actions.classList.remove('visible')
                }, 300)
            })
        }        
    })
}

showActionsAddress()

// function productCardFavorite() {
//   const links = document.querySelectorAll('.card-favorite');
//   if (!links.length) return;

//   links.forEach(link => {
//     const parent = link.closest('.card');
//     const lottieContainer = link.querySelector('.card-favorite__animation');

//     // Загружаем анимацию (можно один раз для всех, если путь одинаковый)
//     const anim = lottie.loadAnimation({
//       container: lottieContainer,
//       renderer: 'svg',
//       loop: false,
//       autoplay: false,
//       path: './static/js/animations/app_heart.json', // путь к твоему JSON-файлу
//     });

//     link.addEventListener('click', (e) => {
//       if (parent.classList.contains('card-selected')) {
//         parent.classList.toggle('unfavorite');
//         // Можно сделать анимацию удаления, если надо
//       } else {
//         // Добавили в избранное
//         parent.classList.add('card-selected');
//         link.classList.add('active');
//         anim.goToAndPlay(0, true); // проигрываем анимацию
//       }
//     });
//   });
// }

// productCardFavorite()


function productCardFavorite() {
    const links = document.querySelectorAll('.card-favorite')
    if (!links.length) return

    links.forEach(link => {
        const parent = link.closest('.card')

        link.addEventListener('click', (e) => {
            if (parent.classList.contains('card-selected')) {
                parent.classList.toggle('unfavorite')
            }
        })
    })
}

productCardFavorite()

// function addFavoriteProduct() {
//     const btns = document.querySelectorAll('.fav-btn')
//     if (!btns.length) return

//     btns.forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault()

//             btn.classList.toggle('active')
//         })
//     })
// }

// addFavoriteProduct()

function addFavoriteProduct() {
    const btns = document.querySelectorAll('.fav-btn')
    if (!btns.length) return

    btns.forEach(btn => {
        const animationContainer = btn.querySelector('.card-favorite__animate');

        let animation = {};

        if (animationContainer) {
            animation = lottie.loadAnimation({
            container: animationContainer,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: './static/js/animations/app_heart.json'
        })
        }

        

        btn.addEventListener('click', (e) => {
            e.preventDefault()

            btn.classList.toggle('active')

            if (btn.classList.contains('active')) {
                animation.goToAndPlay(0, true)
            }
        })
    })
}

addFavoriteProduct()




// слайдер выбора цвета
const colorSlider = new Swiper('.product-colors', {
    slidesPerView: 'auto',
    spaceBetween: 2,
    speed: 800
})


// слайдер mood
const moodSlider = new Swiper('.product-mood', {
    slidesPerView: 'auto',
    spaceBetween: 222,
    speed: 800,
    breakpoints: {
        933: {
            spaceBetween: 178,
        },
        1441: {
            spaceBetween: 222,
        }
    },
    navigation: {
        prevEl: '.mood-prev',
        nextEl: '.mood-next',
    }
})



// слайдер товаров 
function productliders() {
    const items = document.querySelectorAll('.product-slider-wrapper')
    if (!items.length) return

    items.forEach(item => {
        const slider = item.querySelector('.product-slider')
        const prev = item.querySelector('.product-prev')
        const next = item.querySelector('.product-next')

        const init = new Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 2,
            speed: 800,
            observer: true,
            observeParents: true,
            breakpoints: {
                933: {
                    spaceBetween: 6,
                },
                1441: {
                    spaceBetween: 8,
                }
            },
            navigation: {
                prevEl: prev,
                nextEl: next,
            }
        })
    })
}

productliders()






// слайдер товаров на главной

function mainProductSliders() {
    const items = document.querySelectorAll('.mainSection')
    if (!items.length) return

    items.forEach(item => {
        const slider = item.querySelector('.mainSection-slider')
        const prev = item.querySelector('.mainSection-prev')
        const next = item.querySelector('.mainSection-next')

        const init = new Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 2,
            speed: 800,
            // loop: true,
            breakpoints: {
                933: {
                    spaceBetween: 6,
                    slidesPerView: 4,
                },
                1441: {
                    spaceBetween: 8,
                    slidesPerView: 4,
                }
            },
            navigation: {
                prevEl: prev,
                nextEl: next
            }
        })
    })
}

mainProductSliders()




const popularSlider = new Swiper('.popular-slider', {
    slidesPerView: 'auto',
    spaceBetween: 2,
    speed: 800,
    loop: true,
    navigation: {
        prevEl: '.popular-prev',
        nextEl: '.popular-next',
    },
    breakpoints: {
        933: {
            spaceBetween: 6,
        },
        1441: {
            spaceBetween: 8,
        }
    }
})

const journaSllider = new Swiper('.journal-slider', {
    slidesPerView: 'auto',
    spaceBetween: 6,
    speed: 800,
    breakpoints: {
        1441: {
            spaceBetween: 8,
        }
    },
    navigation: {
        prevEl: '.journal-prev',
        nextEl: '.journal-next',
    }
})


const newSllider = new Swiper('.newCollection-slider', {
    slidesPerView: 1,
    spaceBetween: 86,
    speed: 800,
    navigation: {
        prevEl: '.newCollection-prev',
        nextEl: '.newCollection-next',
    },
    breakpoints: {
        933: {
            slidesPerView: 'auto',
            spaceBetween: 6,
        },
        1441: {
            slidesPerView: 'auto',
            spaceBetween: 8,
        }
    }
})


// слайдер товаров на главной
const reashSlider = new Swiper('.reash-slider', {
    slidesPerView: 'auto',
    spaceBetween: 2,
    speed: 800,
    breakpoints: {
        933: {
            spaceBetween: 6,
        },
        1441: {
            spaceBetween: 8,
        }
    },
    navigation: {
        prevEl: '.reash-prev',
        nextEl: '.reash-next',
    },
})

// слайдер фото товара
const productPhotos = new Swiper('.product-galleryMobile__slider', {
    speed: 800,
    pagination: {
        el: '.product-galleryMobile__pagination',
        clickable: true
    }
})


// слайдер ashgirls
const ashgirlsSlider = new Swiper('.ashgirls-slider', {
    slidesPerView: 'auto',
    spaceBetween: 73,
    speed: 800,
    breakpoints: {
        933: {
            spaceBetween: 178,
        },
        1441: {
            spaceBetween: 222,
        }
    },
    navigation: {
        prevEl: '.ashgirls-prev',
        nextEl: '.ashgirls-next',
    }
})


function dropdownProductTooltip() {
    const items = document.querySelectorAll('.product-tooltip')
    const body = document.documentElement
    if (!items.length) return

    document.addEventListener('click', e => {
        items.forEach(item => {
            const content = item.querySelector('.product-tooltip__dropdown')
            const contentInner = item.querySelector('.product-tooltip__content')
            if (!item.contains(e.target)) {
                contentInner.classList.remove('visible')
                setTimeout(() => {
                    content.classList.remove('visible')
                    body.classList.remove('mobile-overflow-hidden')
                }, 200)
            }
        })
    })

    items.forEach(item => {
        const btn = item.querySelector('.product-tooltip__btn')
        const content = item.querySelector('.product-tooltip__dropdown')
        const contentInner = item.querySelector('.product-tooltip__content')
        const closes = item.querySelectorAll('.product-tooltip__close')

        btn.addEventListener('click', e => {
            e.stopPropagation()

            items.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherContent = otherItem.querySelector('.product-tooltip__dropdown')
                    const otherInner = otherItem.querySelector('.product-tooltip__content')
                    otherInner.classList.remove('visible')
                    setTimeout(() => {
                        otherContent.classList.remove('visible')
                    }, 200)
                }
            })

            const isVisible = content.classList.contains('visible')
            if (!isVisible) {
                content.classList.add('visible')
                setTimeout(() => {
                    contentInner.classList.add('visible')
                    body.classList.add('mobile-overflow-hidden')
                }, 1)
            } else {
                contentInner.classList.remove('visible')
                setTimeout(() => {
                    content.classList.remove('visible')
                    body.classList.remove('mobile-overflow-hidden')
                }, 200)
            }
        })

        closes.forEach(closeBtn => {
            closeBtn.addEventListener('click', e => {
                e.preventDefault()
                e.stopPropagation()
                contentInner.classList.remove('visible')
                setTimeout(() => {
                    content.classList.remove('visible')
                    body.classList.remove('mobile-overflow-hidden')
                }, 200)
            })
        })
    })
}

dropdownProductTooltip()





function dropdownProductPrice() {
    const btn = document.querySelector('.product-price__old-icon')
    if (!btn) return
    const content = document.querySelector('.product-price__dropdown')
    const contentInner = content.querySelector('.product-price__dropdown-inner')
    const closes = content.querySelectorAll('.product-price__close')

    btn.addEventListener('click', () => {
        content.classList.toggle('visible')
        setTimeout(() => {
            contentInner.classList.toggle('visible')
        }, 1)
    })

    closes.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault()
            contentInner.classList.remove('visible')


            setTimeout(() => {
                content.classList.remove('visible')
            }, 200)
        })
    })
}

// dropdownProductPrice()










// function inputsLabel() {
//     const form = document.querySelector('.order-form')
//     if (!form) return

//     const inputs = form.querySelectorAll('.order-form__input')
//     const dropdownInputs = form.querySelectorAll('.order-form__input-dropdown')

//     dropdownInputs.forEach(input => {
//         const parent = input.closest('.order-form__item')
//         const labels = parent.querySelectorAll('.order-form__item-label input')
//         if (!labels.length) return

//         labels.forEach(label => {
//             label.addEventListener('change', () => {
//                 input.value = label.dataset.value
//             })
//         })
//     })

//     inputs.forEach(input => {
//         const parent = input.closest('.order-form__item')
//         const label = parent.querySelector('.form-item__label')

//         if (input.value) parent.classList.add('filled')

//         input.addEventListener('focusin', () => {
//             parent.classList.add('focused', 'filled')
//             parent.classList.remove('error')
//         })

//         input.addEventListener('focusout', () => {
//             setTimeout(() => {
//                 parent.classList.remove('focused', 'error')
//                 if (!input.value) {
//                     parent.classList.remove('filled')
//                 }
//                 label.textContent = label.dataset.default
//             }, 200)
            
//         })
//     }) 
// }

// inputsLabel()


function changeLinkText() {

    const links = document.querySelectorAll('.change-link')
  
    if (!links.length) return
  
    links.forEach(link => {
        const output = link.querySelector('.change-link__output')
        const defaultText = link.dataset.default
        const changeText = link.dataset.change
        link.addEventListener('click', function(e) {
            e.preventDefault()
            link.classList.toggle('active')
            output.textContent === defaultText ? output.textContent = changeText : output.textContent = defaultText
        })
    })
}
  
changeLinkText()
  

function addAttrTitle() {
    const titles = document.querySelectorAll('.footer-info__title');

    if (!titles.length) return;

    titles.forEach(title => {
        const screenWidth = window.innerWidth;

        if (screenWidth < 1025) {
            title.setAttribute('data-bs-toggle', 'collapse');
        } else {
            title.removeAttribute('data-bs-toggle');
        }
    });
}

window.addEventListener('resize', addAttrTitle);

addAttrTitle();


function toggleWriteLinks() {
    const btn = document.querySelector('.footer-contacts__btn');
    const content = document.querySelector('.footer-contacts__dropdown');

    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        btn.classList.toggle('selected');
        content.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        const target = e.target;

        if (!btn.contains(target) && !content.contains(target)) {
            btn.classList.remove('selected');
            content.classList.remove('show');
        }
    });
}

toggleWriteLinks();


function pinCode() {
    const pinContainer = document.querySelector(".pin-code");
    if (!pinContainer) return
    const pinCheckInput = document.querySelector(".pin-code__check");
    const pinWrapper = document.querySelector(".pin-code-wrapper");

    pinContainer.addEventListener('keyup', (event) => {
        const target = event.target;
        const maxLength = parseInt(target.getAttribute("maxlength"), 10);
        const myLength = target.value.length;

        if (myLength >= maxLength) {
            let next = target;
            while (next = next.nextElementSibling) {
                if (next == null) break;
                if (next.tagName.toLowerCase() === "input") {
                    next.focus();
                    break;
                }
            }
        }

        if (myLength === 0) {
            let next = target;
            while (next = next.previousElementSibling) {
                if (next == null) break;
                if (next.tagName.toLowerCase() === "input") {
                    next.focus();
                    break;
                }
            }
        }


        updatePinCheckValue();

        checkForError();
    }, false);

    pinContainer.addEventListener('keydown', (event) => {
        const target = event.target;
        target.value = "";
        updatePinCheckValue();
    }, false);

    function updatePinCheckValue() {
        const inputs = Array.from(pinContainer.querySelectorAll(".pin-code__input"));
        const pinValue = inputs.map(input => input.value).join("");
        pinCheckInput.value = pinValue;
    }

    function checkForError() {
        const pinCheckValue = pinCheckInput.value;
        if (pinCheckValue === "5921") {
            pinWrapper.classList.add("error");
        } else {
            pinWrapper.classList.remove("error");
        }
    }
}

pinCode();



function catalogBg() {
    const catalogBanner = document.querySelector('.catalog-banner');
    if (catalogBanner) {
      const setBgImage = () => {
        const bgUrl = window.innerWidth >= 768 ? catalogBanner.getAttribute('data-bg') : catalogBanner.getAttribute('data-mobilebg');
        catalogBanner.style.backgroundImage = `url('${bgUrl}')`;
      };
      
      // Устанавливаем фоновое изображение при загрузке страницы
      setBgImage();

      // Переключение изображений при изменении размера окна
      window.addEventListener('resize', setBgImage);
    }
  }

  // Вызываем функцию catalogBg после загрузки страницы
  catalogBg();




function startCountdown(durationInSeconds) {
    const modalBottom = document.querySelector('.modal-login__bottom');
    const repeatLink = document.querySelector('.modal-login__repeat');
    let countdown = durationInSeconds;
    let countdownInterval;

    function updateCountdownText() {
        const countdownText = modalBottom.querySelector('span');
        countdownText.textContent = countdown;
    }

    function countdownTick() {
        countdown--;
        updateCountdownText();

        if (countdown <= 0) {
            modalBottom.classList.add('repeat');
            clearInterval(countdownInterval);
        }
    }

    function resetCountdown() {
        modalBottom.classList.remove('repeat');
        countdown = durationInSeconds;
        updateCountdownText();
        clearInterval(countdownInterval);
        startCountdownTimer();
    }

    function startCountdownTimer() {
        countdownInterval = setInterval(countdownTick, 1000);
    }

    repeatLink.addEventListener('click', resetCountdown);
    updateCountdownText();

    return resetCountdown;
}

const pinCodeModal = document.getElementById('smsModal');
const resetCountdown = startCountdown(30); 

pinCodeModal.addEventListener('shown.bs.modal', event => {
    resetCountdown(); 
});

pinCodeModal.addEventListener('hidden.bs.modal', event => {
    resetCountdown(); 
});




const smsModal = new bootstrap.Modal('#smsModal', {keyboard: false})
const loginModal = new bootstrap.Modal('#loginModal', {keyboard: false})
function showSmsModal() {
    const form = document.querySelector('.modal-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        loginModal.hide()
        smsModal.show()
    })
}

showSmsModal()







function changeCountryPhone() {
    const items = document.querySelectorAll('.modal-form__c-link')
    const outputFlag = document.querySelector('.modal-form__country-flag img')
    const outputText = document.querySelector('.modal-form__country-txt')

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault()

            outputFlag.src = item.dataset.flag
            outputText.textContent = item.dataset.txt
        })
    })
}

changeCountryPhone()


function maskPhone() {
    const element = document.querySelectorAll('input[data-ru]');
    if (!element.length) return;
    const maskOptions = {
      mask: '(000)000-00-00'
    };
    element.forEach(item => {
      const mask = IMask(item, maskOptions);

      item.addEventListener('focusin', () => {
        item.setAttribute('placeholder', item.dataset.placeholder)
      })
      item.addEventListener('focusout', () => {
        item.setAttribute('placeholder', item.dataset.default)
      })
    });
}
maskPhone();


function maskPhoneSm() {
    const elements = document.querySelectorAll('input[data-ruSm]');
    if (!elements.length) return;
  
    elements.forEach(item => {
      const mask = IMask(item, { mask: '(000)000-00-00'});
      
      item.addEventListener('input', () => {
        let value = item.value.replace(/\D/g, '').replace(/^8|^7|^\+7/, ''); // Убираем +7, 8 или 7
        mask.unmaskedValue = value.slice(-10); // Оставляем последние 10 цифр
      });
      
      item.addEventListener('paste', e => {
        e.preventDefault();
        let value = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').replace(/^8|^7|^\+7/, '');
        mask.unmaskedValue = value.slice(-10);
      });
    });
}
  
maskPhoneSm();
  
  







function formInputsLabel() {
    const inputs = document.querySelectorAll('.form-input')

    if (inputs.length) {
        inputs.forEach(input => {
            const parent = input.closest('.form-item__group')
            const label = parent.querySelector('.form-item__label')
            if (input.value) parent.classList.add('filled')

            input.addEventListener('input', () => {
                parent.classList.add('filled')
            })
                
             
    
            input.addEventListener('focusin', (e) => {
                e.stopPropagation()
                parent.classList.add('focused', 'filled')
                parent.classList.remove('error')
            })
    
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    parent.classList.remove('focused')
                    parent.classList.remove('error')
                    if (!input.value) {
                        parent.classList.remove('filled')
                    }
                }, 200)
                

                if (label && label.hasAttribute('data-error')) {
                    label.textContent = label.dataset.default
                }
            })
        }) 
    }
}

formInputsLabel()


// маска ввода даты
function dateMaskInputs() {
    const items = document.querySelectorAll('input[data-input-date]')
    if (!items.length) return

    items.forEach(item => {
        IMask(item,{
              mask: Date,
              lazy: true
            }
        )
    })
}

dateMaskInputs()


function customSelect() {
    const items = document.querySelectorAll('.form-select')
    if (!items.length) return

    items.forEach(item => {
        const output = item.querySelector('.form-select__btn-txt')
        const close = item.querySelector('.form-select__close')
        const dropdown = item.querySelector('.form-select__dropdown')
        const inputs = item.querySelectorAll('.form-select__radio input')
        const btn = item.querySelector('.form-select__btn')
        const parent = item.closest('.offcanvas')
        const innerInput = item.querySelector('.form-input:not(.form-input-enter)')
        const innerInputEnter = item.querySelector('.form-input-enter')


        function showDropdown() {
            dropdown.classList.add('visible')
            item.classList.add('opened')
            document.documentElement.classList.add('mobile-overflow-hidden')
        }

        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                dropdown.classList.toggle('visible')
                btn.classList.toggle('opened')
                item.classList.add('opened')
                document.documentElement.classList.add('mobile-overflow-hidden')
                if (parent) {
                    parent.classList.add('show-sale')
                }
            })
        }

        if (innerInputEnter) {
            innerInputEnter.addEventListener('input', (e) => {
                showDropdown()
            })
        }

        if (innerInput) {
            innerInput.addEventListener('focusin', () => {
                showDropdown()
            })
        }

        inputs.forEach(input => {
            input.addEventListener('change', () => {
                
                if (btn) {
                    output.textContent = input.dataset.value
                    btn.classList.remove('opened')
                }
                dropdown.classList.remove('visible')
                setTimeout(() => {
                    item.classList.remove('opened')
                }, 200)
                if (parent) {
                    parent.classList.remove('show-sale')
                }
            })
        })

        close.addEventListener('click', (e) => {
            e.preventDefault()

            if (btn) {
                btn.classList.remove('opened')
            }
            dropdown.classList.remove('visible')
            setTimeout(() => {
                item.classList.remove('opened')
            }, 200)
            if (parent) {
                parent.classList.remove('show-sale')
            }
            document.documentElement.classList.remove('mobile-overflow-hidden')
        })

        // Закрытие по клику вне form-select и не по кнопке .product-cartBtn
        document.addEventListener('click', (e) => {
            if (!item.contains(e.target) && !e.target.closest('.product-cartBtn')) {
                if (btn) {
                    btn.classList.remove('opened')
                }
                dropdown.classList.remove('visible')
                setTimeout(() => {
                    item.classList.remove('opened')
                }, 200)
                if (parent) {
                    parent.classList.remove('show-sale')
                }
                
            }
        })
    })
}

customSelect()


function search() {
    const main = document.querySelector('.search')
    if (!main) return
    const list = main.querySelector('.search-list')
    const moreBtnWrapper = main.querySelector('.search__more')
    const moreBtn = main.querySelector('.search__more-btn')
    const formWrapper = main.querySelector('.search__top')
    const form = main.querySelector('.search-form')
    const input = form.querySelector('.search-form__input')
    const clearBtn = form.querySelector('.search-form__clear')
    const submitBtn = form.querySelector('.search-form__submit')
    const wrapper = document.getElementById('search')

    input.addEventListener('input', () => {
        if (input.value) {
            form.classList.add('has-text')
            submitBtn.removeAttribute('disabled')
        } else {
            form.classList.remove('has-text')
            submitBtn.setAttribute('disabled', 'disabled')
        }
    })
    input.addEventListener('focusin', () => {
        formWrapper.classList.add('focused')
    })
    input.addEventListener('focusout', () => {
        formWrapper.classList.remove('focused')
    })
    clearBtn.addEventListener('click', () => {
        input.value = ''
        form.classList.remove('has-text', 'show-result')
        submitBtn.setAttribute('disabled', 'disabled')
    })

    if (moreBtn) {
        moreBtn.addEventListener('click', (e) => {
            e.preventDefault()
            list.classList.add('full')
            moreBtnWrapper.classList.add('hidden')
        })
    }

    wrapper.addEventListener('hidden.bs.offcanvas', () => {
        console.log(1)
        input.value = ''
        form.classList.remove('has-text')
        submitBtn.setAttribute('disabled', 'disabled')
    })
}

search()

// показать блок с товравми в поиске
function showSearchResult() {
    const form = document.querySelector('.search-form')
    const content = document.querySelector('.search__bottom')
    const main = document.getElementById('search')
    if (!form) return

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        content.classList.add('visible')
        form.classList.add('show-result')
    })

    main.addEventListener('hidden.bs.offcanvas', () => {
        content.classList.remove('visible')
        form.classList.remove('show-result')
    })

}

showSearchResult()



function tabs() {
    const tabs = document.querySelectorAll('.tabs')
    if (!tabs.length) return
  
    tabs.forEach(tab => {
      const links = tab.querySelectorAll('.tabs-link')
      const contents = tab.querySelectorAll('.tabs-content')
  
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
  
  
          links.forEach(i => i.classList.remove('selected'))
          contents.forEach(i => i.classList.remove('active', 'animate'))
          link.classList.add('selected')
          const num = link.dataset.tabs
  
          const activeTabs = tab.querySelector(`.tabs-content[data-tabs="${num}"]`)
          activeTabs.classList.add('active')
          
          setTimeout(() => {
            activeTabs.classList.add('animate')
          })
        
        })
      })
    })
}
  
tabs()

function radioTabs() {
    const tabs = document.querySelectorAll('.tabsRadio')
    if (!tabs.length) return
  
    tabs.forEach(tab => {
      const inputs = tab.querySelectorAll('.tabsRadio-input')
      const contents = tab.querySelectorAll('.tabsRadio-content')
  
      inputs.forEach(input => {
        input.addEventListener('change', () => {

  
          contents.forEach(i => i.classList.remove('active', 'animate'))
          const num = input.dataset.tabs
          const activeTab = tab.querySelector(`.tabsRadio-content[data-tabs="${num}"]`)

          activeTab.classList.add('active')
    
          setTimeout(() => {
            activeTab.classList.add('animate')
          })
        })
      })
    })
}
  
 radioTabs()


// Функция открытия и закрытия меню
function openMenu() {
    const btn = document.querySelector('.open-menu')
    const close = document.querySelector('.header-menu__close')
    const header = document.querySelector('.header')
    const headerMenu = document.querySelector('.header__menu')
    const headerMenuInner = document.querySelector('.header__menu-inner')
    const body = document.documentElement

    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            btn.classList.toggle('active')
            body.classList.toggle('o-hidden')
            if (btn.classList.contains('active')) {
                header.classList.add('opened')
                headerMenu.classList.add('open')
                setTimeout(() => {
                    headerMenuInner.classList.add('open')
                }, 0)
            } else {
                header.classList.remove('opened')
                headerMenu.classList.remove('open')
                headerMenuInner.classList.remove('open')
            }
        })
    }

    if (close) {
        close.addEventListener('click', (e) => {
            e.preventDefault()
            btn.classList.remove('active')
            header.classList.remove('opened')
            headerMenu.classList.remove('open')
            headerMenuInner.classList.remove('open')
            body.classList.remove('o-hidden')
        })
    }
}

openMenu()


function headerPosition() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var header = document.querySelector('.header');
    var body = document.body;
    if (!header) return
    if (scrollTop > 0.1) {
      header.classList.add('scrolled');
      body.classList.add('body-pt-scroll')
    } else {
      header.classList.remove('scrolled');
      body.classList.remove('body-pt-scroll')
    }
}
  
window.addEventListener('scroll', headerPosition);
window.addEventListener('load', headerPosition);
  







// детализация скидки в корзине

function discountDetails() {
    const items = document.querySelectorAll('.account-orderItem')
    if (!items.length) return

    items.forEach(item => {
        const content = item.querySelector('.account-orderItem__price-dropdown')
        const btn = item.querySelector('.account-orderItem__price-old-icon__btn')

        if (!btn) return

        btn.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation(); // Остановка всплытия события
            content.classList.toggle('visible')
            setTimeout(() => {
                content.classList.toggle('animate')
            })
        })

        document.addEventListener('click', (e) => {
            const target = e.target
            if (!content.contains(target) && target !== btn) {
                if (content.classList.contains('visible')) {
                    content.classList.remove('visible')
                    setTimeout(() => {
                        content.classList.remove('animate')
                    })
                }
            }
        })
    })
}

discountDetails()

function cartDropdownTotal() {
    const btn = document.querySelector('.order-info__price-name-icon')
    const content = document.querySelector('.order-info__dropdown')
    if (!btn) return

    btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation(); // Остановка всплытия события
        content.classList.toggle('visible')
        setTimeout(() => {
            content.classList.toggle('animate')
        })
    })

    document.addEventListener('click', (e) => {
        const target = e.target
        if (!content.contains(target) && target !== btn) {
            if (content.classList.contains('visible')) {
                content.classList.remove('visible')
                setTimeout(() => {
                    content.classList.remove('animate')
                })
            }
        }
    })
}

cartDropdownTotal()


function cartDropdownMobile() {
    const items = document.querySelectorAll('.account-orderItem__open-mobile')
    if (!items.length) return

    items.forEach(item => {
        const parent = item.closest('.account-orderItem')
        const dropdown = parent.querySelector('.account-orderItem__mobile')
        item.addEventListener('click', (e) => {
            dropdown.classList.add('visible')
            setTimeout(() => {
                dropdown.classList.toggle('animate')
            })
        })
    })
}

cartDropdownMobile()


function setupCartSaleInfo() {
    const btn = document.querySelector('.cart-sale__icon')
    const content = document.querySelector('.cart-sale__dropdown')
    if (!btn) return

    btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation(); // Остановка всплытия события
        content.classList.toggle('visible')
        setTimeout(() => {
            content.classList.toggle('animate')
        })
    })

    document.addEventListener('click', (e) => {
        const target = e.target
        if (!content.contains(target) && target !== btn) {
            if (content.classList.contains('visible')) {
                content.classList.remove('visible')
                setTimeout(() => {
                    content.classList.remove('animate')
                })
            }
        }
    })
}

setupCartSaleInfo()


function enableBtnPromocode() {

    const items = document.querySelectorAll('.cart-promocode')
    if (!items.length) return

    items.forEach(item => {
        const input = item.querySelector('.cart-total__promocode-input');
        const button = item.querySelector('.order-info__promocode-btn');


        if (!input) return

        input.addEventListener('input', function() {
            if (this.value !== '') {
                button.removeAttribute('disabled');
            } else {
                button.setAttribute('disabled', true);
            }
        });
    })

    
}

enableBtnPromocode();


// функция увелечения и уменьшения количества товаров в корзине
function cartQty() {
    const qtyElements = document.querySelectorAll('.account-orderItem__qty');
    if (!qtyElements.length) return

    qtyElements.forEach(qtyElement => {
        const input = qtyElement.querySelector('.account-orderItem__qty-input');
        const minusBtn = qtyElement.querySelector('.account-orderItem__qty-minus');
        const plusBtn = qtyElement.querySelector('.account-orderItem__qty-plus');

        function decreaseQty() {
            let value = parseInt(input.value);
            if (value > 1) {
                value--;
                input.value = value;
                if (value === 1) {
                    minusBtn.setAttribute('disabled', '');
                }
            }
        }
        function increaseQty() {
            let value = parseInt(input.value);
            value++;
            input.value = value;
            minusBtn.removeAttribute('disabled');
        }

        minusBtn.addEventListener('click', decreaseQty);

        plusBtn.addEventListener('click', increaseQty);

        input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    });
}

cartQty()





  



function textareaHeight() {
    const textareas = document.querySelectorAll('.textareaAutoHeight');
  
    textareas.forEach(textarea => {
      const initialHeight = textarea.offsetHeight;
  
      textarea.style.overflow = 'hidden'; 
      textarea.style.height = `${initialHeight}px`;
      
      textarea.addEventListener('input', () => {
        textarea.style.height = `${initialHeight}px`; 
        textarea.style.height = Math.max(textarea.scrollHeight, initialHeight) + 'px'; 
      });
    });
}
  

textareaHeight();




function catalogActionsSticky() {
    const stickyElement = document.querySelector('._catalog__bottom-actions');
    const btns = document.querySelectorAll('._catalog__a-btn')
    const header = document.querySelector('.header');

    if (!stickyElement || !header) {
        return;
    }

    

    const headerHeight = header.offsetHeight;
    let lastScrollY = window.scrollY;
    let isTopAdded = false;
    let lastDirection = null;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const stickyOffsetTop = stickyElement.getBoundingClientRect().top + currentScrollY;

        // Проверяем, достиг ли элемент высоты header
        if (currentScrollY + headerHeight >= stickyOffsetTop) {
            if (!isTopAdded) {
                stickyElement.classList.add('_catalog__bottom-actions--top');
                isTopAdded = true;
            }

            // Определяем направление прокрутки
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';

            if (direction !== lastDirection) {
                if (direction === 'down') {
                    stickyElement.classList.add('_catalog__bottom-actions--down');
                    stickyElement.classList.remove('_catalog__bottom-actions--up');

                    setTimeout(() => {
                        if (btns.length) {
                            btns.forEach(i => {
                                i.classList.add('down')
                                i.classList.remove('up')
                            })
                        }  
                    }, 200)

                } else {
                    stickyElement.classList.add('_catalog__bottom-actions--up');
                    stickyElement.classList.remove('_catalog__bottom-actions--down');

                    setTimeout(() => {
                        if (btns.length) {
                            btns.forEach(i => {
                                i.classList.remove('down')
                                i.classList.add('up')
                            })
                        } 
                    })

                    
                }

                lastDirection = direction;
            }
        } else {
            if (isTopAdded) {
                stickyElement.classList.remove('_catalog__bottom-actions--top', '_catalog__bottom-actions--down', '_catalog__bottom-actions--up');
                if (btns.length) {
                    btns.forEach(i => {
                        i.classList.remove('down', 'up')
                    })
                } 
                isTopAdded = false;
            }
            lastDirection = null;
        }

        lastScrollY = currentScrollY;
    };

    // Привязываем обработчик к событию прокрутки
    window.addEventListener('scroll', handleScroll);

    // Выполняем обработчик сразу после загрузки страницы
    window.addEventListener('load', handleScroll);
}

catalogActionsSticky();