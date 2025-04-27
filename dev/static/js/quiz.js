function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function firstScreen() {
  window.addEventListener('load', async () => {
    
    const intro = document.querySelector('.ashQuiz-intro');
    const quiz = document.querySelector('.ashQuiz');
    const lineItems = intro.querySelectorAll('.ashQuiz-progress__tickets-item');

    if (!intro || !quiz) return

    

    await delay(1000)
    intro.classList.add('show-text')

    await delay(800)
    quiz.classList.add('second-bg')
    intro.classList.add('logo-top')

    await delay(1)
    intro.classList.add('show-img')

    await delay(1)
    intro.classList.add('show-btn')
    await delay(1000)
    intro.classList.add('show-line')

    await delay(800)
    for (const item of lineItems) {
      await delay(75)
      item.classList.add('active')
    }
  })
}

firstScreen()

  
  

function ashQuiz() {
    const main = document.querySelector('.ashQuiz');
    const intro = document.querySelector('.ashQuiz-intro');
    const questions = document.querySelector('.ashQuiz-questions');
    const answerButton = document.getElementById('answer');
    const blockForm = document.querySelector('.ashQuiz-form');
    const blockAnswer = document.querySelector('.ashQuiz-answer');
    const blockProgress = main.querySelector('.ashQuiz-progress');
    const blockFinal = main.querySelector('.ashQuiz-final');
    const formButtons = main.querySelector('.ashQuiz-form__controls');
    const tickets = document.querySelector('.ashQuiz-progress .ashQuiz-progress__tickets');
    const ticketItems = tickets.querySelectorAll('.ashQuiz-progress__tickets-item');
    const contentBlocks = main.querySelectorAll('.ashQuiz-answer__content');
    const outputStepNumber = main.querySelector('.ashQuiz-head__ask span');
    const blockHead = main.querySelector('.ashQuiz-head');
    const steps = main.querySelectorAll('.ashQuiz-form__step')
    const introBtn = main.querySelector('.ashQuiz-intro__btn');
    const answerBtn = main.querySelector('.ashQuiz-answer__btn');
    const finalLogo = main.querySelector('.ashQuiz-final__img');
    const finalTitle = main.querySelector('.ashQuiz-final__title');
    const finalTxt = main.querySelector('.ashQuiz-final__txt');
    const finalButtons = main.querySelector('.ashQuiz-final__buttons')
    const labels = main.querySelectorAll('.ashQuiz-form__label');
    const labelInputs = main.querySelectorAll('.ashQuiz-form__label input')
    const getPrizeBtn = main.querySelector('#getPrize');
    const getPrizeContent = main.querySelector('.ashQuiz-getPrize');
    const cancelPrizeBtn = getPrizeContent.querySelectorAll('.ashQuiz-getPrize__cancel');
    const confirmPrizeBtn = getPrizeContent.querySelectorAll('.ashQuiz-getPrize__confirm');
    const btnShowProgress = main.querySelector('#showProgress');

    const getPrizeOutputSum = main.querySelectorAll('.ashQuiz-getPrize__txt span')

    const defaultTitle = 'А&nbsp;мы&nbsp;знакомы?';
    const defaultTxt = 'Упс, кажется, вы&nbsp;не&nbsp;угадали. Чтобы получить промокод, надо пройти чуть дальше. Попробуете ещё раз?';

    const getPrizeTitle = 'Решили не&nbsp;рисковать?';
    const getPrizeTxt = 'Ваш промокод уже у&nbsp;вас! Используйте его в&nbsp;приложении или на&nbsp;сайте ASH. И&nbsp;возвращайтесь&nbsp;&mdash; вдруг в&nbsp;следующий раз пойдёте ва-банк?';

    const burnThreeTitle = 'Не&nbsp;всё потеряно!';
    const burnThreeTxt = 'Вы&nbsp;ошиблись, но&nbsp;дошли до&nbsp;третьего вопроса&nbsp;&mdash; а&nbsp;это первая несгораемая сумма. Сохраняйте промокод на&nbsp;1000 рублей и&nbsp;используйте его на&nbsp;сайте или в&nbsp;приложении.';

    const burnSixTitle = 'Было близко!';
    const burnSixTxt = 'Вы&nbsp;ответили правильно на&nbsp;шесть вопросов&nbsp;&mdash; это уже серьёзно. Хотя дальше не&nbsp;получилось, ваш промокод на&nbsp;2500 рублей остался с&nbsp;вами.';

    const burnNineTitle = 'Вы&nbsp;случайно не&nbsp;работаете в&nbsp;ASH?';
    const burnNineTxt = 'Тогда откуда вы&nbsp;столько о&nbsp;нас знаете? Вы&nbsp;ответили правильно на&nbsp;все вопросы и&nbsp;выиграли максимальный приз&nbsp;&mdash; промокод на&nbsp;5000&nbsp;рублей. Хорошего шоппинга!';
    
    const correctSound = new Audio('./static/audio/correct.mp3');
    const wrongSound = new Audio('./static/audio/wrong.mp3');
    const levelSound = new Audio('./static/audio/level.mp3');
    

    const backgroundSound = new Audio('./static/audio/background.mp3');
    backgroundSound.loop = true;  
    backgroundSound.volume = 0.1;  
    introBtn.addEventListener('click', () => {
      intro.classList.add('hidden');
      questions.classList.add('visible');
      blockForm.classList.add('visible');

      backgroundSound.play();
    })

    let quizStatus = true;
    let stepNumber = 1;
    let previousVisibleBlock = null;


    getPrizeBtn.addEventListener('click', () => {
      const currentStep = main.querySelector('.ashQuiz-form__step.active');
      const currentStepNumber = currentStep.dataset.step;
      if (currentStepNumber == 4 || currentStepNumber == 7 || +currentStepNumber == 10) {
        getPrizeContent.classList.add('burn');
      }
      getPrizeContent.classList.add('visible');
      retainClasses(questions, ['ashQuiz-questions', 'visible']);
    })



    btnShowProgress.addEventListener('click', () => {
      blockHead.classList.toggle('show-progress');
    
      if (blockProgress.classList.contains('visible')) {
        // если progress открыт — закрываем его и возвращаем предыдущий блок
        blockProgress.classList.remove('visible');
        if (previousVisibleBlock) {
          previousVisibleBlock.classList.add('visible');
        }
      } else {
        // если progress закрыт — открываем его и запоминаем текущий активный блок
        if (blockForm.classList.contains('visible')) {
          previousVisibleBlock = blockForm;
        } else if (blockAnswer.classList.contains('visible')) {
          previousVisibleBlock = blockAnswer;
        } else {
          previousVisibleBlock = null;
        }
    
        // скрываем все блоки кроме head и progress
        blockForm.classList.remove('visible');
        blockAnswer.classList.remove('visible');
    
        // показываем progress
        blockProgress.classList.add('visible');
      }
    });
    
    
    

    cancelPrizeBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        getPrizeContent.classList.remove('visible', 'burn');
      })
    })


    async function showFinal() {

      promocode.classList.remove('hidden');
      copyBtn.classList.remove('hidden');
      repeatBtn.classList.add('btn-outline');

      switch (true) {
        case (stepNumber >= 10):
          finalTitle.innerHTML = burnNineTitle;
          finalTxt.innerHTML = burnNineTxt;
          break;
        case (stepNumber >= 8):
          finalTitle.innerHTML = burnSixTitle;
          finalTxt.innerHTML = burnSixTxt;
          break;
        case (stepNumber >= 5):
          finalTitle.innerHTML = burnThreeTitle;
          finalTxt.innerHTML = burnThreeTxt;
          break;
        default:
          finalTitle.innerHTML = defaultTitle;
          finalTxt.innerHTML = defaultTxt;

          promocode.classList.add('hidden');
          copyBtn.classList.add('hidden');
          repeatBtn.classList.remove('btn-outline');
      }
      

      await delay(1000);
      tickets.classList.add('hide-items');
      await delay(1000);
      blockProgress.classList.add('full');
      await delay(800);
      blockProgress.classList.add('show-promo');
      blockFinal.classList.add('visible');
      await delay(1);
      blockFinal.classList.add('animate');

      document.body.style.setProperty('--accent-color', '#FFFFFF');

    }
    

    confirmPrizeBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        const activeStep = main.querySelector('.ashQuiz-form__step.active');
        const selectedRadio = activeStep.querySelector('.correct');
        const isRadioSelected = !!selectedRadio;
    
        blockHead.classList.add('hidden');
        getPrizeContent.classList.remove('visible', 'burn');
        blockForm.classList.remove('visible');
        blockProgress.classList.add('visible');
    
        showFinal();
    
        let finalStep;
    
        if (isRadioSelected) {
          finalStep = stepNumber;
        } else {
          finalStep = stepNumber - 1;
        }
    
        // Выставляем текст по финальному шагу
        switch (finalStep) {
          case 3:
            finalTitle.innerHTML = burnThreeTitle;
            finalTxt.innerHTML = burnThreeTxt;
            break;
          case 6:
            finalTitle.innerHTML = burnSixTitle;
            finalTxt.innerHTML = burnSixTxt;
            break;
          case 9:
            finalTitle.innerHTML = burnNineTitle;
            finalTxt.innerHTML = burnNineTxt;
            break;
          default:
            finalTitle.innerHTML = getPrizeTitle;
            finalTxt.innerHTML = getPrizeTxt;
        }
    
        promocode.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
        repeatBtn.classList.add('btn-outline');
      });
    });
    
    

    function wasSelectedOnStep(step) {
      const stepElement = main.querySelector(`.ashQuiz-form__step[data-step="${step}"]`);
      if (!stepElement) return false;
      return !!stepElement.querySelector('input[type="radio"]:checked');
    }
    
    

    const promocode = main.querySelector('.ashQuiz-final__promocode');
    const copyBtn = main.querySelector('#copyPromo');


    const repeatBtn = main.querySelector('#repeatQuiz');


    repeatBtn.addEventListener('click', () => {
      blockProgress.classList.remove('visible', 'full', 'show-promo')
      blockHead.classList.remove('hidden')
      blockForm.classList.add('visible')
      steps.forEach(i => i.classList.remove('active'));
      steps[0].classList.add('active');
      ticketItems.forEach(i => {
        i.classList.remove('animate', 'animate-ticket');
        i.classList.add('no-info');
      })
      labels.forEach(i => {
        i.classList.remove('correct', 'wrong');
      })
      labelInputs.forEach(i => i.checked = false);
      outputStepNumber.textContent = 1;
      blockFinal.classList.remove('visible', 'animate');
      finalLogo.classList.remove('visible', 'animate');
      tickets.classList.remove('hide-items');
      stepNumber = 1;
      quizStatus = true;
      formButtons.classList.remove('ashQuiz-form__controls--two-btn');
      finalTitle.classList.remove('hide');
      finalTxt.classList.remove('hide');
      finalButtons.classList.remove('hide', 'hide-2');
      repeatBtn.classList.add('btn-outline');
      promocode.classList.remove('hide', 'hidden');
      document.body.style.setProperty('--accent-color', '#000000');
      copyBtn.classList.remove('hidden');
      
      retainClasses(questions, ['ashQuiz-questions', 'visible']);

      getPrizeOutputSum.forEach(i => i.innerHTML = '1&nbsp;000');
    })


    copyBtn.addEventListener('click', async () => {
      promocode.classList.add('hide')

      await delay(800)
      finalTitle.classList.add('hide')
      finalTxt.classList.add('hide')
      finalButtons.classList.add('hide')

      await delay(800)
      finalButtons.classList.add('hide-2')
      repeatBtn.classList.remove('btn-outline')
      finalLogo.classList.add('visible')
      await delay(1)
      finalLogo.classList.add('animate')
    })


    

    

    function retainClasses(element, allowedClasses) {
      element.className = Array.from(element.classList)
        .filter(cls => allowedClasses.includes(cls))
        .join(' ');
    }

    

  
    if (!answerButton) return;
  
    answerButton.addEventListener('click', () => {
      const activeStep = document.querySelector('.ashQuiz-form__step.active');
      if (!activeStep) return;
    
      const activeStepNumber = activeStep.dataset.step;
      const blockContent = document.querySelector(`.ashQuiz-answer__content[data-content="${activeStepNumber}"]`);
    
      stepNumber = +activeStepNumber + 1;
    
      // Найти выбранный input типа radio в активном шаге
      const selectedInput = activeStep.querySelector('.ashQuiz-form__label-input[type="radio"]:checked');
      if (!selectedInput) return;
    
      // Найти все radio-инпуты внутри активного шага
      const allInputs = activeStep.querySelectorAll('.ashQuiz-form__label-input[type="radio"]');
    
      // Сброс старых классов
      allInputs.forEach(input => {
        const label = input.closest('.ashQuiz-form__label');
        if (!label) return;
        label.classList.remove('correct', 'wrong');
      });
    
      const selectedLabel = selectedInput.closest('.ashQuiz-form__label');
    
      if (selectedInput.dataset.answer === 'correct') {
        // Ответ правильный
        selectedLabel.classList.add('correct');
        correctSound.play();
      } else {
        // Ответ неправильный
        selectedLabel.classList.add('wrong');
        quizStatus = false;
        wrongSound.play();
    
        // Найти правильный ответ и подсветить его
        const correctInput = activeStep.querySelector('.ashQuiz-form__label-input[data-answer="correct"]');
        if (correctInput) {
          const correctLabel = correctInput.closest('.ashQuiz-form__label');
          if (correctLabel) {
            correctLabel.classList.add('correct');
          }
        }
      }
    
      setTimeout(() => {
        blockForm.classList.remove('visible');
        blockAnswer.classList.add('visible');
        contentBlocks.forEach(i => i.classList.remove('visible'));
        blockContent.classList.add('visible');
        main.classList.add(`step-${activeStepNumber}`);
        retainClasses(questions, ['ashQuiz-questions', 'visible']);
      }, 1600)
    });
    
    


    answerBtn.addEventListener('click', async () => {
      retainClasses(main, ['ashQuiz', 'second-bg']);
      const curentTicket = document.querySelector(`.ashQuiz-progress .ashQuiz-progress__tickets-item[data-item="${+stepNumber-1}"]`)
      const currentStep = document.querySelector(`.ashQuiz-form__step[data-step="${stepNumber}"]`)
      blockHead.classList.add('hidden');
      blockAnswer.classList.remove('visible');
      blockProgress.classList.add('visible');
      document.querySelectorAll('.ashQuiz-progress .ashQuiz-progress__tickets-item.animate-ticket').forEach(el => el.classList.remove('animate-ticket'));

      
      
      if (!quizStatus) {

        curentTicket.classList.add('no-info');
        await delay(800)
        curentTicket.classList.add('animate');
        levelSound.play();



        showFinal()
      } else {
        

        if (stepNumber < 10) {
          
          await delay(800)
          curentTicket.classList.add('animate');
          levelSound.play();
          await delay(400);
          curentTicket.classList.add('animate-ticket');


          await delay(1500)
          blockProgress.classList.remove('visible');
          blockHead.classList.remove('hidden');
          blockForm.classList.add('visible');


          if (currentStep.classList.contains('ashQuiz-form__step-has-bg')) {
            questions.classList.add(currentStep.dataset.bg)
          } 
          

          if (+stepNumber >= 2) {
            formButtons.classList.add('ashQuiz-form__controls--two-btn');
          }

          if (+stepNumber >= 7) {
            getPrizeOutputSum.forEach(i => i.innerHTML = '2&nbsp;500');
          }


          steps.forEach(i => i.classList.remove('active'));
          currentStep.classList.add('active');

          await delay(200)
          if (+stepNumber == 7) {
            currentStep.classList.add('animate-images')
          }

          outputStepNumber.textContent = stepNumber;
        } else {
          document.querySelectorAll('.ashQuiz-progress .ashQuiz-progress__tickets-item.animate-ticket').forEach(el => el.classList.remove('animate-ticket'));
          await delay(800)
          curentTicket.classList.add('animate');
          await delay(400);
          curentTicket.classList.add('animate-ticket');

          showFinal();
        }
      }
    }); 
}
  
ashQuiz()


