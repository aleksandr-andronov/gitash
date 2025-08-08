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


changeAboutTheme()

function aboutYears() {
  const aboutSections = document.querySelectorAll('.aboutSection');
  const yearsList = document.querySelector('.aboutYears__list');
  const proxyList = document.querySelector('.aboutYears__proxy');
  const yearsItems = yearsList.querySelectorAll('.aboutYears__item');
  const proxyItems = proxyList.querySelectorAll('.aboutYears__item');

  function setSelected(itemNumber) {
    console.log(`setSelected called with itemNumber: ${itemNumber}`);

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
    console.log(`updatePosition called with activeItemNumber: ${activeItemNumber}`);

    const proxyActiveItem = proxyList.querySelector(`.aboutYears__item[data-item="${activeItemNumber}"]`);

    if (!proxyActiveItem || !yearPosElem) {
      console.warn('Missing elements for positioning:', { proxyActiveItem, yearPosElem });
      return;
    }

    const proxyRect = proxyActiveItem.getBoundingClientRect();
    const targetRect = yearPosElem.getBoundingClientRect();

    console.log('proxyActiveItem left:', proxyRect.left);
    console.log('yearPosElem left:', targetRect.left);

    // Рассчитываем сдвиг относительно нуля, без добавления к текущему transform
    const shiftX = targetRect.left - proxyRect.left;

    console.log('Calculated shiftX (absolute):', shiftX);

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
        console.log(`ScrollTrigger onEnter for section data-item=${itemNumber}`);
        setSelected(itemNumber);
        updatePosition(itemNumber, yearPosElem);
      },
      onEnterBack: () => {
        console.log(`ScrollTrigger onEnterBack for section data-item=${itemNumber}`);
        setSelected(itemNumber);
        updatePosition(itemNumber, yearPosElem);
      }
    });
  });

  window.addEventListener('resize', () => {
    const selectedItem = yearsList.querySelector('.aboutYears__item.selected');
    if (!selectedItem) {
      console.log('Resize: no selected item found');
      return;
    }
    const selectedNumber = selectedItem.dataset.item;

    const activeSection = [...document.querySelectorAll('.aboutSection')]
      .find(section => section.dataset.item === selectedNumber);

    if (!activeSection) {
      console.log('Resize: no active section found for selectedNumber', selectedNumber);
      return;
    }

    const yearPosElem = activeSection.querySelector('.aboutSection__yearPos');
    console.log('Resize event - recalculating position for selectedNumber:', selectedNumber);
    updatePosition(selectedNumber, yearPosElem);
  });
}




// function aboutYears() {
//   const sections = document.querySelectorAll('.aboutSection[data-item]');
//   const years = document.querySelectorAll('.aboutYears__item.ttl[data-item]');
//   const list = document.querySelector('.aboutYears__list')

//   if (!sections.length || !years.length) return;

//   const observerOptions = {
//     root: null,
//     rootMargin: '-50% 0px -50% 0px', // Центр экрана
//     threshold: 0
//   };

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         const currentItem = entry.target.dataset.item;

//         list.dataset.pos = `${currentItem}`

//         years.forEach(year => {
//           if (year.dataset.item === currentItem) {
//             year.classList.add('selected');
//           } else {
//             year.classList.remove('selected');
//           }
//         });
//       }
//     });
//   }, observerOptions);

//   sections.forEach(section => observer.observe(section));
// }

// aboutYears();

  function photoAnimates() {
    const header = document.querySelector(".header");
    const aboutYears = document.querySelector(".aboutYears");
    const wrap = document.querySelector(".aboutFive-content__imgBottom-wrap");

    const headerHeight = header?.offsetHeight || 0;
    const aboutYearsHeight = aboutYears?.offsetHeight || 0;
    const extraOffset = 50;
    const totalOffset = headerHeight + aboutYearsHeight + extraOffset;

    // Create a GSAP timeline tied to ScrollTrigger
    const tl = gsap.timeline({
      y: '100%',
      scrollTrigger: {
        trigger: wrap,
        start: `top ${totalOffset}`, // when wrap's top hits (header + aboutYears + 50)
        end: "+=200%", // duration of pin/scroll
        scrub: true, // enables scroll-linked animation
        pin: true,
        markers: false, // remove in production
      },
  });

  // Sequentially animate the 3 items in from below
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
    }, "+=0.2") // small delay
    .to(".aboutFive-content__imgBottom-1", {
      y: "0%",
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    }, "+=0.2");
  }

  photoAnimates()
  aboutYears()



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
          markers: false,
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
          y: '-4rem',  
          scrollTrigger: {
            start: 'top+200 center',
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
        triggerSelector: '.aboutOne-content__txt',
        fromProps: { y: '12rem' },
        toProps: { 
          y: '0rem',  
          scrollTrigger: {
            start: 'top+=200 bottom',
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

  // animateImageOnScroll({
  //   targetSelector: '.aboutThree-content__img-left svg',
  //   triggerSelector: '.aboutThree-content__img',
  //   fromProps: { y: '16rem' },
  //   toProps: { 
  //     y: '0rem',  
  //     scrollTrigger: {
  //       start: 'top+=200 bottom',
  //       end: 'bottom bottom',
  //       markers: true,
  //     }
  //   }
  // });


  animateImageOnScroll({
    targetSelector: '.aboutFour-content__title',
    triggerSelector: '.aboutFour-content__title',
    fromProps: { opacity: '0.5' },
    toProps: { 
      opacity: '1',
      scrollTrigger: {
        start: 'top-=200 center',
        end: 'bottom bottom',
        scrub: 1,
      }
    }
  });

  animateImageOnScroll({
    targetSelector: '.aboutFour-content__txt',
    triggerSelector: '.aboutFour-content__txt',
    fromProps: { opacity: '0.5' },
    toProps: { 
      opacity: '1',
      scrollTrigger: {
        start: 'top-=200 center',
        end: 'bottom bottom',
        scrub: 1,
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
        // markers: true,
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
        markers: true,
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
        start: 'top center',
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
        start: 'top+=100 center',
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
        start: 'top+=200 center',
        end: 'bottom bottom',
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
        start: 'top+=300 center',
        end: 'bottom bottom',
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
        start: 'top+=100 center',
        end: 'bottom bottom',
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
        end: 'bottom bottom',
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
      rotate: '0deg'
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

  


});





 





 