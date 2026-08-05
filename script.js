/* =========================================
   JFA — FORCE & ACTION
   COMPTEUR DE VOTES
========================================= */


/*
    ==================================================
    IMPORTANT
    ==================================================

    Tu dois remplacer ces deux valeurs par celles
    de ton projet Supabase.

    Exemple :

    const SUPABASE_URL =
    "https://abcdefgh.supabase.co";

    const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIs...";
*/


const SUPABASE_URL = "TON_URL_SUPABASE";

const SUPABASE_KEY = "TA_CLE_ANON_SUPABASE";



/* =========================================
   ELEMENTS HTML
========================================= */

const voteCount = document.getElementById("voteCount");

const voteButton = document.getElementById("voteButton");

const voteButtonNav = document.getElementById("voteButtonNav");

const voteMessage = document.getElementById("voteMessage");

const mobileMenu = document.getElementById("mobileMenu");

const mobileNavigation = document.getElementById("mobileNavigation");



/* =========================================
   VERIFICATION CONFIGURATION
========================================= */

function supabaseReady() {

    return (

        SUPABASE_URL !== "TON_URL_SUPABASE"

        &&

        SUPABASE_KEY !== "TA_CLE_ANON_SUPABASE"

    );

}



/* =========================================
   RECUPERER LE NOMBRE DE VOTES
========================================= */

async function getVotes() {


    if (!supabaseReady()) {

        voteCount.textContent = "0";

        console.warn(
            "Supabase n'est pas encore configuré."
        );

        return;

    }


    try {


        const response = await fetch(

            `${SUPABASE_URL}/rest/v1/votes?select=id`,

            {

                method: "GET",

                headers: {

                    "apikey": SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`

                }

            }

        );


        if (!response.ok) {

            throw new Error(
                "Erreur lors de la récupération des votes."
            );

        }


        const data = await response.json();


        voteCount.textContent =
            data.length.toLocaleString("fr-FR");


    }


    catch (error) {


        console.error(error);


        voteCount.textContent = "—";


    }

}



/* =========================================
   ENREGISTRER UN VOTE
========================================= */

async function registerVote() {


    if (!supabaseReady()) {

        voteMessage.textContent =
            "Le compteur doit encore être configuré.";

        return;

    }


    voteButton.disabled = true;


    if (voteButtonNav) {

        voteButtonNav.disabled = true;

    }


    voteMessage.textContent =
        "Enregistrement du vote...";


    try {


        const response = await fetch(

            `${SUPABASE_URL}/rest/v1/votes`,

            {

                method: "POST",

                headers: {

                    "apikey": SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`,

                    "Content-Type":
                        "application/json",

                    "Prefer":
                        "return=minimal"

                },

                body: JSON.stringify({})

            }

        );


        if (!response.ok) {

            throw new Error(
                "Le vote n'a pas pu être enregistré."
            );

        }


        await getVotes();


        voteMessage.textContent =
            "Merci pour ton soutien à JFA !";


    }


    catch (error) {


        console.error(error);


        voteMessage.textContent =
            "Une erreur est survenue. Réessaie.";


    }


    voteButton.disabled = false;


    if (voteButtonNav) {

        voteButtonNav.disabled = false;

    }

}



/* =========================================
   BOUTON VOTE PRINCIPAL
========================================= */

if (voteButton) {

    voteButton.addEventListener(
        "click",
        registerVote
    );

}



/* =========================================
   BOUTON VOTE DU MENU
========================================= */

if (voteButtonNav) {

    voteButtonNav.addEventListener(

        "click",

        () => {

            document
                .getElementById("accueil")
                .scrollIntoView({
                    behavior: "smooth"
                });

            registerVote();

        }

    );

}



/* =========================================
   MENU MOBILE
========================================= */

if (mobileMenu) {


    mobileMenu.addEventListener(

        "click",

        () => {

            mobileNavigation.classList.toggle(
                "active"
            );

        }

    );

}



/* =========================================
   FERMER LE MENU MOBILE APRES UN CLIC
========================================= */

if (mobileNavigation) {


    const mobileLinks =
        mobileNavigation.querySelectorAll("a");


    mobileLinks.forEach(

        link => {


            link.addEventListener(

                "click",

                () => {

                    mobileNavigation
                        .classList
                        .remove("active");

                }

            );

        }

    );

}



/* =========================================
   LANCEMENT
========================================= */

getVotes();