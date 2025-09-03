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
        pinType: document.querySelector('.aboutPage')?.style.transform
            ? 'transform'
            : 'fixed'
    });

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

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
        start: window.matchMedia("(max-width: 480px)").matches ? "top 25%" : "top center",
        end: () => window.matchMedia("(max-width: 480px)").matches ? "bottom 25%" : "bottom center",
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

    function getOffset() {
      const header = document.querySelector(".header");
      const aboutYears = document.querySelector(".aboutYears");

      const headerHeight = header?.offsetHeight || 0;
      const aboutYearsHeight = aboutYears?.offsetHeight || 0;
      const extraOffset = 0;

      return headerHeight + aboutYearsHeight + extraOffset;
    }

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

  const sectionsContent = ['.aboutThree-content', '.aboutFour-content', '.aboutSix-content', '.aboutEight-content', '.aboutNine-content', '.aboutTen-content', '.aboutThirteen-content', '.aboutFourteen-content']

    ScrollTrigger.matchMedia({
      "(max-width: 480px)": function() {


        // анимация на первом экране
        gsap.to('.aboutIntro-content__img', {
          y: '-2rem',
          scrollTrigger: {
            trigger: ".aboutIntro",
            pin: true,
            start: 'top top',
            end: "+=50%",
            scrub: true,
            ease: "power2.inOut",
          }
        });

        gsap.to('.aboutIntro-content__img-mobile img', { 
            y: '0%', 
            duration: 1, 
            ease: "power2.inOut",
        });

        // анимация 2000

        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutOne-content__top-img',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 4,
            ease: "power2.inOut",
          }
        }).fromTo('.aboutOne-content__top-right', {
          y: '-3rem',
          x: '3rem'
        }, {y: '0rem', x: '0rem'}).fromTo('.aboutOne-content__imgTop', {
          rotate: -12,
          y: '4rem'
        }, {y: '-2rem', rotate: -6}, '0');

        gsap.timeline({
          scrollTrigger: {
                trigger: ".aboutOne-content__imgBottom",
                start: "top bottom",
                end: "bottom top",
                scrub: 4,
                ease: "power2.inOut",
            }
        }).from('.aboutOne-content__imgBottom-img', {
            y: '2rem',
            x: '-2rem'
        }).from('.aboutOne-content__imgBottom-decorTxt', {
            y: '2rem',
            x: '-2rem'
        }, '<0.1');

        // анимация 2005
        gsap.fromTo('.aboutThree-content__img-img', { 
          y: '1rem' },{ 
          y: '-1rem',
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: '.aboutThree-content__img-img',
            start: 'top bottom',
            end: 'top top',
            scrub: 4
          }
        })


        // анимация 2006

        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutFour-content', 
            start: 'top 80%',
            end: 'top center',
            scrub: 4,
            ease: "power2.inOut",
          }
        }).from('.aboutFour-content__title', {
          opacity: 0,
        }).from('.aboutFour-content__txt', {
          opacity: 0,
        }, '<0.2');

        gsap.fromTo('.aboutFour-content__img-img', { 
          y: '2rem' },{ 
          y: '-2rem',
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: '.aboutFour-content__img-img',
            start: 'top bottom',
            end: 'top top',
            scrub: 4
          }
        })


        gsap.timeline({
          scrollTrigger: {
            trigger: ".aboutFive-content__imgBottom-wrap",
            start: () => `top ${getOffset()}`,
            end: "+=100%",
            scrub: true,
            pin: true,
          }
        })
        // --- блок 3 ---
        .from(".aboutFive-content__imgBottom-3", { 
          y: '50%' 
        }, "<") // двигается со скроллом
        .from(".aboutFive-content__imgBottom-3", { 
          opacity: 0, 
          duration: 0.3, 
          ease: "power1.out" 
        }, "<") // быстрое появление

        // --- блок 2 ---
        .from(".aboutFive-content__imgBottom-2", { 
          y: '50%' 
        })
        .from(".aboutFive-content__imgBottom-2", { 
          opacity: 0, 
          duration: 0.3, 
          ease: "power1.out" 
        }, "<")

        // --- блок 1 ---
        .from(".aboutFive-content__imgBottom-1", { 
          y: '50%' 
        })
        .from(".aboutFive-content__imgBottom-1", { 
          opacity: 0, 
          duration: 0.3, 
          ease: "power1.out" 
        }, "<");

        

        // анимация 2019-2020
        gsap.from('.aboutThirteen-content__images-1, .aboutThirteen-content__images__txt-5', {
          y: '4rem',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.aboutThirteen-content__images-1',
            start: 'top bottom',
        end: 'bottom top',
            scrub: 4,
          }
        })

        gsap.from('.aboutThirteen-content__images-2, .aboutThirteen-content__images__txt-2', {
          y: '4rem',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.aboutThirteen-content__images-2',
            start: 'top bottom',
        end: 'bottom top',
            scrub: 4
          }
        })

        gsap.from('.aboutThirteen-content__images-4', {
          y: '4rem',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.aboutThirteen-content__images-4',
            start: 'top bottom',
        end: 'bottom top',
            scrub: 4
          }
        })

        gsap.from('.aboutThirteen-content__images-3, .aboutThirteen-content__images__txt-3', {
          y: '4rem',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.aboutThirteen-content__images-3',
            start: 'top bottom',
        end: 'bottom top',
            scrub: 4
          }
        })

        gsap.from('.aboutThirteen-content__images-5, .aboutThirteen-content__images__txt-1, .aboutThirteen-content__images-6', {
          y: '4rem',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.aboutThirteen-content__images-5',
            start: 'top bottom',
        end: 'bottom top',
            scrub: 4
          }
        })

        gsap.from('.aboutThirteen-content__images-7, .aboutThirteen-content__images__txt-7, .aboutThirteen-content__images__txt-4', {
          y: '4rem',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.aboutThirteen-content__images-7',
            sstart: 'top bottom',
        end: 'bottom top',
            scrub: 4
          }
        })

        // анимация 2021

        gsap.from('.aboutFourteen-content__tImg-2', {
          rotate: -8,
          scrollTrigger: {
            trigger: '.aboutFourteen-content',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 4,
          }
        })

        // анимация 2022

        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutFifteen-content',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 4,
          }
        }).from('.aboutFifteen-content__img-2', {
          rotate: 0
        }).from('.aboutFifteen-content__img-3', {
          rotate: 0
        }, '<0.2')

         sectionsContent.forEach(i => {
          gsap.from(i, {
            opacity: 0,
            scrollTrigger: {
              trigger: i,
              start: 'top center',
              end: 'top 25%',
              scrub: true
            }
          })
        })
      },

      "(min-width: 481px)": function() {
        // анимация на первом экране
        gsap.to('.aboutIntro-content__img', {
          y: '-6rem',
          scrollTrigger: {
            trigger: ".aboutIntro",
            pin: true,
            start: 'top top',
            end: "+=50%",
            scrub: true,
            ease: "power2.inOut",
          }
        });

        gsap.to('.aboutIntro-content__img-desktop img', { 
            y: '0%', 
            duration: 1, 
            ease: "power2.inOut",
        });

        // анимация 2000

        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutOne-content__top-img',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 4,
            ease: "power2.inOut",
          }
        }).fromTo('.aboutOne-content__top-right', {
          y: '-2rem',
          x: '4rem'
        }, {y: '4rem', x: '-8rem'}).fromTo('.aboutOne-content__imgTop', {
          rotate: -12,
          y: '4rem'
        }, {y: '-4rem', rotate: -6}, '0').fromTo('.aboutOne-content__top-left', {
          y: '4rem',
          x: '4rem'
        }, {y: '-2rem', x: '-2rem'}, '0')

        gsap.timeline({
          scrollTrigger: {
                trigger: ".aboutOne-content__imgBottom",
                start: "top bottom",
                end: "bottom top",
                scrub: 4,
                ease: "power2.inOut",
            }
        }).fromTo('.aboutOne-content__imgBottom-img', {
            y: '4rem',
            x: '-4rem'
        }, {y: '-4rem', x: '0rem'}).fromTo('.aboutOne-content__imgBottom-decorTxt', {
            y: '4rem',
            x: '-4rem'
        }, {y: '-4rem', x: '0rem'}, '<0.1');

        // анимация 2005
        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutThree-content', 
            start: 'top 80%',
            end: 'top center',
            scrub: 2,
            ease: "power2.inOut",
          }
        }).from('.aboutThree-content__txt', {
          opacity: 0,
        });

        gsap.fromTo('.aboutThree-content__img-img', { 
          y: '2rem' },{ 
          y: '-2rem',
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: '.aboutThree-content__img-img',
            start: 'top bottom',
            end: 'top top',
            scrub: 4
          }
        })

        // анимация 2006

        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutFour-content', 
            start: 'top 80%',
            end: 'top center',
            scrub: 4,
            ease: "power2.inOut",
          }
        }).from('.aboutFour-content__title', {
          opacity: 0,
        }).from('.aboutFour-content__txt', {
          opacity: 0,
        }, '<0.2');

        gsap.fromTo('.aboutFour-content__img-img', { 
          y: '2rem' },{ 
          y: '-2rem',
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: '.aboutFour-content__img-img',
            start: 'top bottom',
            end: 'top top',
            scrub: 4
          }
        })


        // анимация 2010

        gsap.timeline({
          scrollTrigger: {
            trigger: ".aboutFive-content__imgBottom-wrap",
            start: () => `top ${getOffset()}`,
            end: "+=150%",
            scrub: 2,
            pin: true,
            
          }
        })
        .from(".aboutFive-content__imgBottom-3", {
          y: '50%',
          opacity: 0,
        })
        .from(".aboutFive-content__imgBottom-2", {
          y: '50%',
          opacity: 0,
        })
        .from(".aboutFive-content__imgBottom-1", {
          y: '50%',
          opacity: 0,
        });

        // анимация 2019-2020
        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutThirteen-content__images',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 4,
          }
        }).from('.aboutThirteen-content__images-1, .aboutThirteen-content__images__txt-1, .aboutThirteen-content__images-3, .aboutThirteen-content__images__txt-3, .aboutThirteen-content__images-5, .aboutThirteen-content__images__txt-5, .aboutThirteen-content__images-7', {
          y: '4rem',
        }).from('.aboutThirteen-content__images-2, .aboutThirteen-content__images__txt-2, .aboutThirteen-content__images-4, .aboutThirteen-content__images__txt-4, .aboutThirteen-content__images-6, .aboutThirteen-content__images__txt-6', {
          y: '4rem',
        }, '<0.2')

        // анимация 2021

        gsap.from('.aboutFourteen-content__tImg-2', {
          rotate: -8,
          scrollTrigger: {
            trigger: '.aboutFourteen-content__tImg',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 4,
          }
        })

        // анимация 2022

        gsap.timeline({
          scrollTrigger: {
            trigger: '.aboutFifteen-content__img',
            start: 'top bottom',
            end: 'bottom yop',
            scrub: 4,
          }
        }).from('.aboutFifteen-content__img-2', {
          rotate: 0
        }).from('.aboutFifteen-content__img-3', {
          rotate: 0
        }, '<0.2')
      }
    });





    
    


    // анимация 2000
    gsap.timeline({
        scrollTrigger: {
            trigger: ".aboutOne-content__top-img",
            start: "top 70%",
            end: "top 20%",
            scrub: 4,
            ease: "power2.inOut",
        }
    }).from('.aboutOne-content__txt', {
        opacity: 0,
        y: '4rem'     
    }, "<0.2").from('.aboutOne .aboutOne-content__quote', {
        opacity: 0,
        y: '4rem' 
    }, "<0.2").from('.aboutOne-content__author', {
        opacity: 0,
        y: '4rem' 
    }, "<0.2");

    

    

    // анимация 2002-2004

    gsap.from('.aboutTwo-content__txt', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.aboutTwo-content',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 4,
        ease: "power2.inOut",
      }
    })

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutTwo-content__images-item--left',
        start: "top bottom",
        end: "bottom top",
        scrub: 4,
        ease: "power2.inOut",
      }
    }).fromTo('.aboutTwo-content__images-item__year--left', {
      y: '4rem'
    }, {y: '-2rem'}).fromTo('.aboutTwo-content__images-item__img--left', {
      y: '4rem'
    }, {y: '-2rem'}, '<0.2').fromTo('.aboutTwo-content__images-item__txt--left', {
      y: '4rem'
    }, {y: '-2rem'}, '<0.2')

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutTwo-content__images-item--right',
        start: "top bottom",
        end: "bottom top",
        scrub: 4,
        ease: "power2.inOut",
      }
    }).fromTo('.aboutTwo-content__images-item__year--right', {
      y: '4rem'
    }, {y: '-2rem'}).fromTo('.aboutTwo-content__images-item__img--right', {
      y: '4rem'
    }, {y: '-2rem'}, '<0.2').fromTo('.aboutTwo-content__images-item__txt--right', {
      y: '4rem'
    }, {y: '-2rem'}, '<0.2')

    
    

    

    // анимация 2010

    gsap.fromTo('.aboutFive-content__imgTop', {
      x: '-4rem',
      y: '4rem',
    }, {
      x: '2rem', 
      y: '-2rem', 
      scrollTrigger: {
        trigger: '.aboutFive-content__imgTop',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
        ease: "power2.inOut",
      }
    })
    

    // анимация 2011

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutSix-content',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    }).from('.aboutSix-content__txt', {
      opacity: 0,
    }).from('.aboutSix-content__img', {
      opacity: 0,
    }, '<0.2')


    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutSix-content__img',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    }).from('.aboutSix-content__img-1', {
      rotate: '-5'
    }).from('.aboutSix-content__img-2', {
      rotate: '5'
    }, '<0.2')


    // анимация 2012

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutEight-content',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    }).from('.aboutEight-content__txt', {
      opacity: 0,
    })


    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutEight-content__img',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    }).from('.aboutEight-content__img-1', {
      y: '8rem'
    }).from('.aboutEight-content__img-2', {
      y: '8rem'
    }, '<0.2')


    // анимация 2013-2014

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutNine-content',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    }).from('.aboutNine-content__txt', {
      opacity: 0,
    }).from('.aboutNine-content__img', {
      opacity: 0,
    }, '<0.2')


    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutNine-content__img',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
        
      }
    }).from('.aboutNine-content__img-1', {
      y: '8rem'
    }).from('.aboutNine-content__img-2', {
      y: '8rem'
    }, '<0.2')

    // анимация 2015

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutTen-content',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    }).from('.aboutTen-content__title', {
      opacity: 0,
    }).from('.aboutTen-content__img', {
      opacity: 0,
    }, '<0.2')


    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutTen-content__img',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    }).from('.aboutTen-content__img-1', {
      y: '8rem',
      rotate: -8,
    }).from('.aboutTen-content__img-txt', {
      y: '2rem',
      rotate: 0
    }, '<0.2')

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutEleven-content__txtImg',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    }).from('.aboutEleven-content__txtImg-txt', {
      opacity: 0
    }).from('.aboutEleven-content__txtImg-img', {
      opacity: 0
    }, '0')


    gsap.from('.aboutEleven-content__txtImg-img', {
      rotate: 0,
      scrollTrigger: {
        trigger: '.aboutEleven-content__txtImg',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4
      }
    })


    gsap.from('.aboutEleven-content__gifs-item__img--left', {
      y: '6rem',
      scrollTrigger: {
        trigger: '.aboutEleven-content__gifs-item__gif--left',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    })

    gsap.from('.aboutEleven-content__gifs-item__img--right', {
      y: '6rem',
      scrollTrigger: {
        trigger: '.aboutEleven-content__gifs-item__gif--right',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    })

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutEleven-content__quote',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    }).from('.aboutEleven-content__quote', {
      opacity: 0,
      y: '2rem' 
    }).from('aboutEleven-content__author', {
      opacity: 0,
      y: '2rem'
    }, '<0.2').from('.aboutEleven-content__b-txt', {
      opacity: 0,
      y: '2rem'
    }, '<0.2')



    gsap.from('.aboutEleven__bottom', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.aboutEleven__bottom',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    })


    gsap.from('.aboutEleven-content__img-1', {
      rotate: -8,
      scrollTrigger: {
        trigger: '.aboutEleven-content__img-list',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    })

    // анимация 2018

    gsap.from('.aboutTwelve-content', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.aboutTwelve-content',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    })


    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutTwelve-content',
        start: 'top-=200 bottom',
        end: 'bottom top',
        scrub: 4,
      }
    }).from('.aboutTwelve-content__txtImg-img__main', {
      y: '4rem'
    }).from('.aboutTwelve-content__txtImg-img__decor-1', {
      x: '2rem',
      y: '-2rem'
    }, '<0.2').from('.aboutTwelve-content__txtImg-img__second', {
      y: '4rem'
    }, '<0.2');

    // анимация 2019-2020

    gsap.from('.aboutThirteen__top', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.aboutThirteen__top',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    })

    


    gsap.from('.aboutThirteen-banner__logo, .aboutThirteen-banner__txt', {
      y: '2rem',
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.aboutThirteen-banner',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    })


    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutThirteen-content__b-txt',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    }).from('.aboutThirteen-content__b-txt', {
      opacity: 0
    }).from('.aboutThirteen-content__b-title', {
      opacity: 0,
    }, '<0.2').from('.aboutThirteen-content__bImages', {
      opacity: 0
    }, '<0.2');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutThirteen-content__bImages',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    }).from('.aboutThirteen-content__bImages-1, .aboutThirteen-content__bImages-2, .aboutThirteen-content__bImages-5, .aboutThirteen-content__bImages-7, .aboutThirteen-content__bImages-9', {
      y: '8rem'
    }).from('.aboutThirteen-content__bImages-3, .aboutThirteen-content__bImages-4, .aboutThirteen-content__bImages-6, .aboutThirteen-content__bImages-8, .aboutThirteen-content__bImages-10', {
      y: '8rem'
    }, '<0.2');

    // анимация 2021


    gsap.timeline({
      scrollTrigger: {
        trigger: '.aboutFourteen-content__bImg',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      }
    }).from('.aboutFourteen-content__bImg-1', {
      y: '8rem'
    }).from('.aboutFourteen-content__bImg-2', {
      y: '8rem'
    }, '<0.2')

    // анимация 2022

    gsap.from('.aboutFifteen-content', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.aboutFifteen-content',
        start: 'top 80%',
        end: 'top center',
        scrub: 4,
      }
    })

    

    changeAboutTheme();
    aboutYears();
});