/* =====================================================
CONFIGURATION SUPABASE
===================================================== */

/*
REMPLACE CES DEUX VALEURS PAR CELLES DE TON PROJET SUPABASE
*/

const SUPABASE_URL = "https://rirhfjamdyevyonaiwtv.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_NJvytBzdudauoH7B-QhKKg_ENDuaQuO";

const supabaseClient = supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

/* =====================================================
ÉLÉMENTS
===================================================== */

const authScreen = document.getElementById("auth-screen");
const siteContent = document.getElementById("site-content");

const emailStep = document.getElementById("email-step");
const otpStep = document.getElementById("otp-step");
const profileStep = document.getElementById("profile-step");

const emailInput = document.getElementById("email");
const otpInput = document.getElementById("otp");

const firstNameInput = document.getElementById("first-name");
const classInput = document.getElementById("class-name");

const authMessage = document.getElementById("auth-message");

const sendOtpButton = document.getElementById("send-otp");
const verifyOtpButton = document.getElementById("verify-otp");
const saveProfileButton = document.getElementById("save-profile");

/* =====================================================
AFFICHER / CACHER LE SITE
===================================================== */

function showSite() {


authScreen.style.display = "none";

siteContent.style.display = "block";


}

function showAuth() {


authScreen.style.display = "flex";

siteContent.style.display = "none";


}

function showAuthMessage(text) {


authMessage.textContent = text;


}

/* =====================================================
ENVOI DU CODE OTP
===================================================== */

sendOtpButton.addEventListener("click", async () => {


const email = emailInput.value.trim();

if (!email) {

    showAuthMessage(
        "Entre ton adresse e-mail."
    );

    return;
}


sendOtpButton.disabled = true;

sendOtpButton.textContent = "ENVOI EN COURS...";

showAuthMessage(
    "Envoi du code..."
);


const { error } = await supabaseClient.auth.signInWithOtp({

    email: email

});


if (error) {

    console.error(error);

    showAuthMessage(
        "Erreur : " + error.message
    );

    sendOtpButton.disabled = false;

    sendOtpButton.textContent = "RECEVOIR LE CODE";

    return;
}


emailStep.style.display = "none";

otpStep.style.display = "block";


showAuthMessage(
    "Le code a été envoyé par e-mail 📩"
);


});

/* =====================================================
VÉRIFICATION DU CODE
===================================================== */

verifyOtpButton.addEventListener("click", async () => {


const email = emailInput.value.trim();

const token = otpInput.value.trim();


if (!token) {

    showAuthMessage(
        "Entre le code reçu par e-mail."
    );

    return;
}


verifyOtpButton.disabled = true;

verifyOtpButton.textContent = "VÉRIFICATION...";


const { data, error } =
    await supabaseClient.auth.verifyOtp({

        email: email,

        token: token,

        type: "email"

    });


if (error) {

    console.error(error);

    showAuthMessage(
        "Code incorrect ou expiré."
    );

    verifyOtpButton.disabled = false;

    verifyOtpButton.textContent = "SE CONNECTER";

    return;
}


console.log(
    "Utilisateur connecté :",
    data.user
);


await checkProfile(data.user);


});

/* =====================================================
VÉRIFIER LE PROFIL
===================================================== */

async function checkProfile(user) {


const {
    data: profile,
    error
} = await supabaseClient

    .from("profiles")

    .select("*")

    .eq("id", user.id)

    .maybeSingle();


if (error) {

    console.error(error);

    showAuthMessage(
        "Impossible de charger ton profil."
    );

    return;
}


/*
    PROFIL EXISTANT
*/

if (profile) {

    showSite();

    return;
}


/*
    NOUVEAU COMPTE
*/

otpStep.style.display = "none";

profileStep.style.display = "block";


showAuthMessage(
    "Dernière étape : renseigne ton prénom et ta classe."
);


}

/* =====================================================
ENREGISTRER LE PROFIL
===================================================== */

saveProfileButton.addEventListener("click", async () => {


const firstName =
    firstNameInput.value.trim();

const className =
    classInput.value.trim();


if (!firstName || !className) {

    showAuthMessage(
        "Remplis ton prénom et ta classe."
    );

    return;
}


const {
    data: {
        user
    }
} = await supabaseClient.auth.getUser();


if (!user) {

    showAuthMessage(
        "Ta session a expiré. Reconnecte-toi."
    );

    return;
}


saveProfileButton.disabled = true;

saveProfileButton.textContent =
    "CRÉATION...";


const { error } =
    await supabaseClient

        .from("profiles")

        .insert({

            id: user.id,

            first_name: firstName,

            class: className

        });


if (error) {

    console.error(error);

    showAuthMessage(
        "Erreur lors de la création du profil : " +
        error.message
    );

    saveProfileButton.disabled = false;

    saveProfileButton.textContent =
        "ACCÉDER AU SITE";

    return;
}


showSite();


});

/* =====================================================
SESSION EXISTANTE
===================================================== */

async function checkExistingSession() {


const {
    data: {
        session
    }
} = await supabaseClient.auth.getSession();


if (!session) {

    showAuth();

    return;
}


console.log(
    "Session existante :",
    session.user
);


await checkProfile(session.user);


}

checkExistingSession();

/* =====================================================
MENU MOBILE
===================================================== */

const mobileMenu =
document.getElementById("mobileMenu");

const mobileNavigation =
document.getElementById("mobileNavigation");

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

if (mobileNavigation) {


mobileNavigation
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileNavigation.classList.remove(
                    "active"
                );

            }
        );

    });


}

/* =====================================================
BANDEAU COOKIES
===================================================== */

const cookieBanner =
document.getElementById("cookieBanner");

const cookieAccept =
document.getElementById("cookieAccept");

const cookieRefuse =
document.getElementById("cookieRefuse");

const cookieChoice =
localStorage.getItem("jfa_cookie_choice");

if (!cookieChoice) {


setTimeout(() => {

    cookieBanner.classList.add("active");

}, 800);


}

if (cookieAccept) {


cookieAccept.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "jfa_cookie_choice",
            "accepted"
        );

        cookieBanner.classList.remove(
            "active"
        );

    }
);


}

if (cookieRefuse) {


cookieRefuse.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "jfa_cookie_choice",
            "refused"
        );

        cookieBanner.classList.remove(
            "active"
        );

    }
);


}

/* =====================================================
COMPTEUR DE VOTE
===================================================== */

/*
IMPORTANT :


Cette partie est volontairement simple.
Elle utilise le compteur déjà présent
sur ton site.

Si tu veux que le compteur soit réellement
commun à tous les visiteurs, il faudra ensuite
le connecter à une table Supabase dédiée.


*/

const voteButton =
document.getElementById("voteButton");

const voteButtonNav =
document.getElementById("voteButtonNav");

const voteMessage =
document.getElementById("voteMessage");

function handleVoteClick() {


if (voteMessage) {

    voteMessage.textContent =
        "Merci pour ton soutien à JFA ❤️";

}


}

if (voteButton) {


voteButton.addEventListener(
    "click",
    handleVoteClick
);


}

if (voteButtonNav) {


voteButtonNav.addEventListener(
    "click",
    () => {

        const voteSection =
            document.querySelector(
                ".vote-section"
            );

        if (voteSection) {

            voteSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    }
);


}
