document.addEventListener("DOMContentLoaded", () => {

    const voteButton = document.getElementById("voteButton");
    const voteButtonNav = document.getElementById("voteButtonNav");
    const voteCount = document.getElementById("voteCount");
    const voteMessage = document.getElementById("voteMessage");

    // ==============================
    // COMPTEUR JFA
    // ==============================

    const STORAGE_COUNT = "jfa_vote_count";
    const STORAGE_DATE = "jfa_last_date";

    // Date actuelle
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    // Récupération du compteur
    let count = parseInt(localStorage.getItem(STORAGE_COUNT)) || 0;

    // Dernière date où le compteur a été ouvert
    const lastDate = localStorage.getItem(STORAGE_DATE);

    // ==============================
    // +2 PAR JOUR
    // ==============================

    if (lastDate) {

        const last = new Date(lastDate);
        const current = new Date(todayString);

        // Nombre de jours passés depuis la dernière visite
        const difference =
            Math.floor((current - last) / (1000 * 60 * 60 * 24));

        if (difference > 0) {

            // +2 par jour passé
            count += difference * 2;

        }

    }

    // Sauvegarde
    localStorage.setItem(STORAGE_COUNT, count);
    localStorage.setItem(STORAGE_DATE, todayString);

    // Affichage initial
    voteCount.textContent = count;


    // ==============================
    // BOUTON VOTE JFA
    // ==============================

    function voteJFA() {

        count++;

        // Sauvegarde
        localStorage.setItem(STORAGE_COUNT, count);

        // Affichage
        voteCount.textContent = count;

        // Petit message
        voteMessage.textContent = "Merci pour ton soutien à JFA !";

        // Animation du compteur
        voteCount.style.transform = "scale(1.2)";

        setTimeout(() => {
            voteCount.style.transform = "scale(1)";
        }, 200);

    }


    // Gros bouton
    if (voteButton) {
        voteButton.addEventListener("click", voteJFA);
    }

    // Bouton VOTE JFA du menu
    if (voteButtonNav) {
        voteButtonNav.addEventListener("click", voteJFA);

        // Amène automatiquement vers le compteur
        voteButtonNav.addEventListener("click", () => {
            document.querySelector(".vote-section").scrollIntoView({
                behavior: "smooth"
            });
        });
    }


    // ==============================
    // MENU MOBILE
    // ==============================

    const mobileMenu = document.getElementById("mobileMenu");
    const mobileNavigation = document.getElementById("mobileNavigation");

    if (mobileMenu && mobileNavigation) {

        mobileMenu.addEventListener("click", () => {
            mobileNavigation.classList.toggle("active");
        });

    }

});

// ==============================
// COOKIE BANNER
// ==============================

const cookieBanner = document.getElementById("cookieBanner");
const cookieAccept = document.getElementById("cookieAccept");
const cookieRefuse = document.getElementById("cookieRefuse");

const cookieChoice = localStorage.getItem("jfa_cookie_choice");

// Afficher la bannière si aucun choix n'a été fait
if (!cookieChoice) {

    setTimeout(() => {
        cookieBanner.classList.add("active");
    }, 500);

}

// Accepter
if (cookieAccept) {

    cookieAccept.addEventListener("click", () => {

        localStorage.setItem("jfa_cookie_choice", "accepted");

        cookieBanner.classList.remove("active");

    });

}

// Refuser
if (cookieRefuse) {

    cookieRefuse.addEventListener("click", () => {

        localStorage.setItem("jfa_cookie_choice", "refused");

        cookieBanner.classList.remove("active");

    });

}
