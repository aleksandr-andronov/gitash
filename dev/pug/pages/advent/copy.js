function copyPromo() {
    const main = document.querySelector('.advent-gift__promocode')
    if (!main) return

    const title = main.querySelector('.advent-gift__promocode-title__txt')
    main.addEventListener('click', () => {
        main.classList.add('copied')
        title.textContent = main.dataset.change
    })
}

copyPromo()