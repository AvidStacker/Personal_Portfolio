const sections = document.querySelectorAll('.section');
const upArrow = document.querySelector('.scroll-up');
const downArrow = document.querySelector('.scroll-down');

function getCurrentSectionIndex() {
    let index = 0;

    sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) index = i;
    });

    return index;
}

function scrollNextGlobal() {
    const next = sections[getCurrentSectionIndex() + 1];
    if (next) next.scrollIntoView({ behavior: "smooth" });
}

function scrollPrevGlobal() {
    const prev = sections[getCurrentSectionIndex() - 1];
    if (prev) prev.scrollIntoView({ behavior: "smooth" });
}

function updateArrows() {
    const current = getCurrentSectionIndex();

    upArrow.style.opacity = current === 0 ? "0" : "0.7";
    downArrow.style.opacity = current === sections.length - 1 ? "0" : "0.7";

    upArrow.style.pointerEvents = current === 0 ? "none" : "auto";
    downArrow.style.pointerEvents = current === sections.length - 1 ? "none" : "auto";
}

window.addEventListener('scroll', () => {
    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top < window.innerHeight - 100) {
            sec.classList.add('visible');
        }
    });

    updateArrows();
});

window.addEventListener('load', () => {
    document.querySelector('#home').classList.add('visible');
    updateArrows();
});