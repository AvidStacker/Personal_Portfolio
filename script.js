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

const text = "Isak Lagerberg";
const speed = 100;
const displayTime = 2500;

let i = 0;

function typeWriter() {
    const element = document.getElementById("typewriter");

    // SKRIV
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        // ⏸ Vänta innan vi tar bort texten
        setTimeout(() => {
            element.innerHTML = "";
            i = 0;
            typeWriter();
        }, displayTime);
    }
}

window.addEventListener("load", () => {
    typeWriter();
});

function openModal(project) {
    const modal = document.getElementById("modal");
    const title = document.getElementById("modal-title");
    const text = document.getElementById("modal-text");

    if (project === "homelab") {
        title.innerText = "Homelab Infrastructure";
        text.innerText = `
        Full virtualiserad miljö byggd med Proxmox.

        - Netbird för säker access
        - TrueNAS Scale för lagring
        - Portainer för container management

        Media automation stack:
        Radarr, Sonarr, NZB, Jellyfin, Emby
        `;
    }

    else if (project === "netprobe") {
        title.innerText = "NetProbe";
        text.innerText = `
        Verktyg för nätverksanalys och scanning.

        - Port scanning
        - Nätverksinspektion
        - Fokus på säkerhet och analys
        `;
    }

    else if (project === "fallingsand") {
        title.innerText = "Falling Sand";
        text.innerText = `
        Interaktiv fysiksimulering.

        - Sand, vätska och gas
        - Realtids rendering
        - Fokus på simulation och systemlogik
        `;
    }

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}
