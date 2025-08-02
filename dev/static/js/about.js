const lenis = new Lenis();

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf);

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
  const sections = document.querySelectorAll('.aboutSection[data-item]');
  const years = document.querySelectorAll('.aboutYears__item.ttl[data-item]');
  const list = document.querySelector('.aboutYears__list')

  if (!sections.length || !years.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Центр экрана
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentItem = entry.target.dataset.item;

        list.dataset.pos = `${currentItem}`

        years.forEach(year => {
          if (year.dataset.item === currentItem) {
            year.classList.add('selected');
          } else {
            year.classList.remove('selected');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

aboutYears();
