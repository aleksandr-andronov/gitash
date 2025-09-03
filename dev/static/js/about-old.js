document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    smooth: true,
    lerp: 0.08,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);

  let currentScroll = 0;
  lenis.on('scroll', ({ scroll }) => {
    currentScroll = scroll;
    ScrollTrigger.update();
  });

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      } else {
        return currentScroll;
      }
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: document.querySelector('[data-lenis-container]')?.style.transform
      ? 'transform'
      : 'fixed'
  });

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });


  function changeAboutTheme() {
    const aboutPage = document.querySelector('.aboutPage');
    const blocks = document.querySelectorAll('.js-block');

    if (!aboutPage || !blocks.length) return;

    // Центр экрана
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          aboutPage.classList.remove('aboutPage--white', 'aboutPage--black');

          if (el.classList.contains('s-black')) {
            aboutPage.classList.add('aboutPage--black');
          } else if (el.classList.contains('s-white')) {
            aboutPage.classList.add('aboutPage--white');
          } 
          // s-main — никаких доп. классов, оставляем как есть
        }
      });
    }, observerOptions);

    blocks.forEach(block => observer.observe(block));
  }


function aboutYears() {
  const aboutSections = document.querySelectorAll('.aboutSection');
  const yearsList = document.querySelector('.aboutYears__list');
  const proxyList = document.querySelector('.aboutYears__proxy');
  const yearsItems = yearsList.querySelectorAll('.aboutYears__item');
  const proxyItems = proxyList.querySelectorAll('.aboutYears__item');

  function setSelected(itemNumber) {

    yearsItems.forEach(item => {
      const isSelected = item.dataset.item === itemNumber;
      item.classList.toggle('selected', isSelected);
      if (isSelected) console.log(`Main list selected: data-item=${item.dataset.item}`);
    });

    proxyItems.forEach(item => {
      const isSelected = item.dataset.item === itemNumber;
      item.classList.toggle('selected', isSelected);
      if (isSelected) console.log(`Proxy list selected: data-item=${item.dataset.item}`);
    });
  }

  function updatePosition(activeItemNumber, yearPosElem) {

    const proxyActiveItem = proxyList.querySelector(`.aboutYears__item[data-item="${activeItemNumber}"]`);

    if (!proxyActiveItem || !yearPosElem) {
      return;
    }

    const proxyRect = proxyActiveItem.getBoundingClientRect();
    const targetRect = yearPosElem.getBoundingClientRect();



    // Рассчитываем сдвиг относительно нуля, без добавления к текущему transform
    const shiftX = targetRect.left - proxyRect.left;


    gsap.to(yearsList, {
      x: shiftX,
      duration: 0.4,
      ease: "linear"
    });
  }


  aboutSections.forEach(section => {
    const itemNumber = section.dataset.item;
    const yearPosElem = section.querySelector('.aboutSection__yearPos');

    ScrollTrigger.create({
      trigger: section,
      markers: true,
      start: "top center",
      end: () => `bottom center`,
      onEnter: () => {
        setSelected(itemNumber);
        updatePosition(itemNumber, yearPosElem);
      },
      onEnterBack: () => {
        setSelected(itemNumber);
        updatePosition(itemNumber, yearPosElem);
      }
    });
  });

  window.addEventListener('resize', () => {
    const selectedItem = yearsList.querySelector('.aboutYears__item.selected');
    if (!selectedItem) {
      return;
    }
    const selectedNumber = selectedItem.dataset.item;

    const activeSection = [...document.querySelectorAll('.aboutSection')]
      .find(section => section.dataset.item === selectedNumber);

    if (!activeSection) {
      return;
    }

    const yearPosElem = activeSection.querySelector('.aboutSection__yearPos');
    updatePosition(selectedNumber, yearPosElem);
  });
}






  function photoAnimates() {
    const header = document.querySelector(".header");
    const aboutYears = document.querySelector(".aboutYears");
    const wrap = document.querySelector(".aboutFive-content__imgBottom-wrap");

    const headerHeight = header?.offsetHeight || 0;
    const aboutYearsHeight = aboutYears?.offsetHeight || 0;
    const extraOffset = 50;
    const totalOffset = headerHeight + aboutYearsHeight + extraOffset;

    const tl = gsap.timeline({
      y: '100%',
      scrollTrigger: {
        trigger: wrap,
        start: `top ${totalOffset}`,
        end: "+=200%",
        scrub: true,
        pin: true,
      },
  });

  tl.to(".aboutFive-content__imgBottom-3", {
    y: "0%",
    opacity: 1,
    duration: 0.5,
    ease: "power3.out",
  })
    .to(".aboutFive-content__imgBottom-2", {
      y: "0%",
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    }, "+=0.2") 
    .to(".aboutFive-content__imgBottom-1", {
      y: "0%",
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    }, "+=0.2");
  }

  
  

  
  



  function animateImageOnScroll({
    targetSelector,
    triggerSelector,
    fromProps,
    toProps,
    scrollOptions = {}
  }) {
    // Поддержка: строка селекторов или массив
    const selectors = Array.isArray(targetSelector)
      ? targetSelector
      : [targetSelector];

    // Объединяем все найденные элементы в один массив
    const targets = selectors
      .flatMap(selector => Array.from(document.querySelectorAll(selector)))
      .filter(el => el); // на случай, если что-то не найдено

    if (targets.length === 0) return;

    targets.forEach(target => {
      target.style.willChange = 'transform';

      const defaultToProps = {
        // immediateRender: false,
        scrollTrigger: {
          trigger: triggerSelector,
          scroller: document.body,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 6,
          ...scrollOptions
        },
      };

      gsap.fromTo(
        target,
        fromProps,
        {
          ...defaultToProps,
          ...toProps,
          scrollTrigger: {
            ...defaultToProps.scrollTrigger,
            ...toProps.scrollTrigger
          }
        }
      );
    });
  }


  ScrollTrigger.matchMedia({
    "(min-width: 481px)": function () {

      gsap.fromTo(
        '.aboutIntro-content__img-desktop img',
        { y: '100%' }, 
        { y: '0%', duration: 1, } 
      );


      animateImageOnScroll({
        targetSelector: '.aboutIntro-content__img-desktop',
        triggerSelector: '.aboutIntro',
        fromProps: { y: '16rem' }, 
        toProps: { 
          y: '-6rem', 
          scrollTrigger: {
            pin: true,
            start: 'top top',
            end: "+=150%",
            scrub: 2,
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__top-right img',
        triggerSelector: '.aboutOne-content__top-img',
        fromProps: { y: '-3rem', x: '15rem' },
        toProps: { 
          y: '3rem', 
          x: '-15rem',
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__imgTop  img',
        triggerSelector: '.aboutOne-content__top-img',
        fromProps: { y: '14rem', rotate: '12deg' },
        toProps: { y: '0rem', rotate: '0deg',
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
         }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__txt',
        triggerSelector: '.aboutOne-content__top-img',
        fromProps: { y: '8rem' },
        toProps: { 
          y: '0rem',  
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__quote',
        triggerSelector: '.aboutOne-content__top-img',
        fromProps: { y: '8rem' },
        toProps: { 
          y: '0rem',  
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutTwo-content__images-item__img--right, .aboutTwo-content__images-item__txt--right',
        triggerSelector: '.aboutTwo-content__images-item--right',
        fromProps: { y: '16rem' },
        toProps: { 
          y: '0rem',  
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });



      animateImageOnScroll({
        targetSelector: '.aboutTwo-content__images-item__year--right',
        triggerSelector: '.aboutTwo-content__images-item--right',
        fromProps: { y: '10rem' },
        toProps: { 
          y: '0rem',  
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutFourteen-content__bImg-1',
        triggerSelector: '.aboutFourteen-content__bImg',
        fromProps: { y: '10rem' },
        toProps: { 
          y: '0rem',
          scrollTrigger: {
            start: 'top center',
            end: 'bottom+=200 bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutFourteen-content__bImg-2',
        triggerSelector: '.aboutFourteen-content__bImg',
        fromProps: { y: '10rem' },
        toProps: { 
          y: '0rem',
          scrollTrigger: {
            start: 'top+=100 center',
            end: 'bottom+=200 bottom',
          }
        }
      });
    },
    "(max-width: 480px)": function () {

       gsap.fromTo(
        '.aboutIntro-content__img-mobile img',
        { y: '50%' }, 
        { y: '0%', duration: 1, } 
      );


      animateImageOnScroll({
        targetSelector: '.aboutIntro-content__img-mobile',
        triggerSelector: '.aboutIntro',
        fromProps: { y: '4rem' }, 
        toProps: { 
          y: '0rem', 
          scrollTrigger: {
            pin: true,
            start: 'top top',
            end: "+=50%",
            scrub: 2,
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__top-right img',
        triggerSelector: '.aboutOne-content__top-img',
        fromProps: { y: '0rem', x: '4rem' },
        toProps: { 
          y: '0rem', 
          x: '0rem',
          scrollTrigger: {
            start: 'top bottom',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__imgTop  img',
        triggerSelector: '.aboutOne-content__top-img',
        fromProps: { y: '2.5rem', rotate: '12deg' },
        toProps: { y: '0rem', rotate: '0deg' }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__txt',
        triggerSelector: '.aboutOne-content__txt',
        fromProps: { y: '2rem' },
        toProps: { 
          y: '0rem',  
          scrollTrigger: {
            start: 'top bottom',
            end: 'bottom bottom',
            
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__quote',
        triggerSelector: '.aboutOne-content__quote',
        fromProps: { opacity: '0', y: '1rem' },
        toProps: { 
          opacity: '1',  
          y: '0rem',
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutOne-content__author',
        triggerSelector: '.aboutOne-content__quote',
        fromProps: { opacity: '0', y: '1rem' },
        toProps: { 
          opacity: '1',  
          y: '0rem',
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutTwo-content__images-item__img--right, .aboutTwo-content__images-item__txt--right',
        triggerSelector: '.aboutTwo-content__images-item--right',
        fromProps: { y: '8rem' },
        toProps: { 
          y: '0rem',  
          scrollTrigger: {
            start: 'top+200 center',
            end: 'bottom bottom',
          }
        }
      });



      animateImageOnScroll({
        targetSelector: '.aboutTwo-content__images-item__year--right',
        triggerSelector: '.aboutTwo-content__images-item--right',
        fromProps: { y: '4rem' },
        toProps: { 
          y: '2rem',  
          scrollTrigger: {
            start: 'top center',
            end: 'bottom bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutFourteen-content__bImg-1',
        triggerSelector: '.aboutFourteen-content__bImg',
        fromProps: { y: '3rem' },
        toProps: { 
          y: '0rem',
          scrollTrigger: {
            start: 'top center',
            end: 'bottom+=200 bottom',
          }
        }
      });

      animateImageOnScroll({
        targetSelector: '.aboutFourteen-content__bImg-2',
        triggerSelector: '.aboutFourteen-content__bImg',
        fromProps: { y: '3rem' },
        toProps: { 
          y: '0rem',
          scrollTrigger: {
            start: 'top+=100 center',
            end: 'bottom+=200 bottom',
          }
        }
      });
    },
  });

  

  animateImageOnScroll({
    targetSelector: '.aboutOne-content__top-left',
    triggerSelector: '.aboutOne-content__top-img',
    fromProps: { y: '8rem', x: '8rem' },
    toProps: { y: '0rem', x: '0rem' }
  });

  

  animateImageOnScroll({
    targetSelector: '.aboutOne-content__imgBottom-img__inner',
    triggerSelector: '.aboutOne-content__imgBottom',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom bottom',
      }
     }
  });

  animateImageOnScroll({
    targetSelector: '.aboutOne-content__imgBottom-decorTxt',
    triggerSelector: '.aboutOne-content__imgBottom',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',  
      scrollTrigger: {
        start: 'top+=100 bottom',
        end: 'bottom bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutTwo-content__images-item__year--left',
    triggerSelector: '.aboutTwo-content__images-item--left',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',  
      scrollTrigger: {
        start: 'top center',
        end: 'bottom bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutTwo-content__images-item__img--left, .aboutTwo-content__images-item__txt--left',
    triggerSelector: '.aboutTwo-content__images-item--left',
    fromProps: { y: '16rem' },
    toProps: { 
      y: '-4rem',  
      scrollTrigger: {
        start: 'top+200 center',
        end: 'bottom bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutThree-content__img-img img',
    triggerSelector: '.aboutThree-content__img',
    fromProps: { y: '4rem' },
    toProps: { 
      y: '0rem',  
      scrollTrigger: {
        start: 'top+=100 bottom',
        end: 'bottom bottom',
        
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutFour-content__img-img img',
    triggerSelector: '.aboutFour-content__img',
    fromProps: { y: '4rem' },
    toProps: { 
      y: '0rem',  
      scrollTrigger: {
        start: 'top+=100 bottom',
        end: 'bottom bottom',
      }
    }
  });

  photoAnimates();

  animateImageOnScroll({
    targetSelector: '.aboutFive-content__imgTop-img__inner',
    triggerSelector: '.aboutFive-content__imgTop-img',
    fromProps: { y: '4rem', x: '-4rem' },
    toProps: { 
      x: '0rem',
      y: '0rem',  
      scrollTrigger: {
        start: 'top-=200 center',
        end: 'bottom bottom',
      }
    }
  });

  


  animateImageOnScroll({
    targetSelector: '.aboutFive-content__imgBottom-left img',
    triggerSelector: '.aboutFive-content__imgBottom-wrap',
    fromProps: { y: '4rem', x: '-4rem' },
    toProps: { 
      x: '0rem',
      y: '0rem',  
      scrollTrigger: {
        start: 'top+=1200 100%',
        end: 'top 200%',
        
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutSix-content__img-1',
    triggerSelector: '.aboutSix-content__img',
    fromProps: { y: '10rem', rotate: '4deg' },
    toProps: { 
      y: '0rem',
      rotate: '-2deg', 
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom+=200 bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutSix-content__img-2',
    triggerSelector: '.aboutSix-content__img',
    fromProps: { y: '10rem', rotate: '4deg' },
    toProps: { 
      y: '0rem',
      rotate: '-2deg', 
      scrollTrigger: {
        start: 'top+=100 bottom',
        end: 'bottom+=200 bottom',
      }
    }
  });


  animateImageOnScroll({
    targetSelector: '.aboutEight-content__img-1',
    triggerSelector: '.aboutEight-content__img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom+=200 bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutEight-content__img-2',
    triggerSelector: '.aboutEight-content__img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom+=200 bottom',
      }
    }
  });



  animateImageOnScroll({
    targetSelector: '.aboutNine-content__img-1',
    triggerSelector: '.aboutNine-content__img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom+=200 bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutNine-content__img-2',
    triggerSelector: '.aboutNine-content__img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom+=200 bottom',
      }
    }
  });



  animateImageOnScroll({
    targetSelector: '.aboutTen-content__img-1',
    triggerSelector: '.aboutTen-content__img',
    fromProps: { y: '10rem', rotate: '10deg' },
    toProps: { 
      y: '0rem',
      rotate: '0deg'
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutTen-content__img-2',
    triggerSelector: '.aboutTen-content__img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutTen-content__img-txt',
    triggerSelector: '.aboutTen-content__img',
    fromProps: { y: '10rem', rotate: '0deg' },
    toProps: { 
      y: '0rem',
      rotate: '5deg',
      crollTrigger: {
        start: 'top center',
        end: 'bottom+=200 bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutEleven-content__txtImg-img',
    triggerSelector: '.aboutEleven-content__txtImg-img',
    fromProps: { y: '10rem', rotate: '0deg' },
    toProps: { 
      y: '0rem',
      rotate: '8deg',
      scrollTrigger: {
        start: "top bottom",
        end: "bottom center"
      }
    }
  });


  animateImageOnScroll({
    targetSelector: '.aboutEleven-content__gifs-item__img--left',
    triggerSelector: '.aboutEleven-content__gifs-item__gif--left',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem'
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutEleven-content__gifs-item__img--right',
    triggerSelector: '.aboutEleven-content__gifs-item__gif--right',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem'
    }
  });



  animateImageOnScroll({
    targetSelector: '.aboutEleven-content__img-1',
    triggerSelector: '.aboutEleven-content__img',
    fromProps: {  rotate: '0deg' },
    toProps: { 

      rotate: '3deg'
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutEleven-content__img-txt',
    triggerSelector: '.aboutEleven-content__img',
    fromProps: { y: '-2rem', rotate: '0deg' },
    toProps: { 
      y: '0rem',
      rotate: '-7deg'
    }
  });








   animateImageOnScroll({
    targetSelector: '.aboutTwelve-content__txtImg-img__main',
    triggerSelector: '.aboutTwelve-content__txtImg-img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutTwelve-content__txtImg-img__decor-1',
    triggerSelector: '.aboutTwelve-content__txtImg-img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+=100 bottom',
        end: 'bottom bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutTwelve-content__txtImg-img__decor-2',
    triggerSelector: '.aboutTwelve-content__txtImg-img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+=200 bottom',
        end: 'center center',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutTwelve-content__txtImg-img__decor-3, .aboutTwelve-content__txtImg-img__second',
    triggerSelector: '.aboutTwelve-content__txtImg-img',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+=300 bottom',
        end: 'center center',
      }
    }
  });


  animateImageOnScroll({
    targetSelector: '.aboutThirteen-content__images-1, .aboutThirteen-content__images-4, .aboutThirteen-content__images-6',
    triggerSelector: '.aboutThirteen-content__images',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+=100 bottom',
        end: 'center center',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutThirteen-content__images-2, .aboutThirteen-content__images-3, .aboutThirteen-content__images-5, .aboutThirteen-content__images-7',
    triggerSelector: '.aboutThirteen-content__images',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+=200 center',
        end: 'center center',
      }
    }
  });


  animateImageOnScroll({
    targetSelector: '.aboutThirteen-banner__txt, .aboutThirteen-banner__logo',
    triggerSelector: '.aboutThirteen-banner',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+=100 center',
        end: 'bottom bottom',
      }
    }
  });

  

  animateImageOnScroll({
    targetSelector: '.aboutThirteen-content__bImages-3,  .aboutThirteen-content__bImages-5,  .aboutThirteen-content__bImages-8, .aboutThirteen-content__bImages-9',
    triggerSelector: '.aboutThirteen-content__bImages',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top center',
        end: 'bottom bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: ' .aboutThirteen-content__bImages-4,  .aboutThirteen-content__bImages-7',
    triggerSelector: '.aboutThirteen-content__bImages',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+100 center',
        end: 'bottom bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: ' .aboutThirteen-content__bImages-6',
    triggerSelector: '.aboutThirteen-content__bImages',
    fromProps: { y: '10rem' },
    toProps: { 
      y: '0rem',
      scrollTrigger: {
        start: 'top+300 center',
        end: 'bottom bottom',
      }
    }
  });
  

  animateImageOnScroll({
    targetSelector: '.aboutFourteen-content__tImg-2 img',
    triggerSelector: '.aboutFourteen-content__tImg',
    fromProps: { y: '4rem', rotate: '10deg' },
    toProps: { 
      y: '0rem',
      rotate: '0deg',
      scrollTrigger: {
        start: 'top bottom',
        end: 'top center',
      }
    }
  });

  




  animateImageOnScroll({
    targetSelector: '.aboutFifteen-content__img-3',
    triggerSelector: '.aboutFifteen-content__img',
    fromProps: { y: '10rem', rotate: '0deg' },
    toProps: { 
      y: '0rem',
      rotate: '-9deg',
      scrollTrigger: {
        start: 'top center',
        end: 'bottom+=200 bottom',
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutFifteen-content__img-2',
    triggerSelector: '.aboutFifteen-content__img',
    fromProps: { y: '10rem', rotate: '0deg' },
    toProps: { 
      y: '0rem',
      rotate: '7deg',
      scrollTrigger: {
        start: 'top+=100 center',
        end: 'bottom+=200 bottom',
      }
    }
  });


  
  changeAboutTheme();
  aboutYears();
  
  const sectionsOpacity = ['.aboutTwo', '.aboutThree', '.aboutFour', '.aboutSix', '.aboutSeven', '.aboutEight', '.aboutNine', '.aboutTen', '.aboutEleven', '.aboutTwelve', '.aboutThirteen', '.aboutFourteen', '.aboutFifteen']


  ScrollTrigger.matchMedia({
    "(min-width: 481px)": function () {
      sectionsOpacity.forEach(item => {
        const trigger = item + ` .aboutSection__yearPos`;

        animateImageOnScroll({
          targetSelector: item,
          triggerSelector: trigger,
          fromProps: { opacity: '0', y: '100' },
          toProps: { 
            opacity: '1', 
            y: '0',
            scrollTrigger: {
              start: 'top 30%',
              // end: 'bottom 70%',
              scrub: 2,
            }
          }
        });
      });
    },
    "(max-width: 481px)": function () {
        sectionsOpacity.forEach(item => {
        const trigger = item + ` .aboutSection__yearPos`;

        animateImageOnScroll({
          targetSelector: item,
          triggerSelector: trigger,
          fromProps: { opacity: '0', y: '100' },
          toProps: { 
            opacity: '1', 
            y: '0',
            scrollTrigger: {
              start: 'top 30%',
              // end: 'bottom 70%',
              scrub: 2,
            }
          }
        });
      });
    },
  })

  

});





 




