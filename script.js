// GESTION DES ONGLETS PRINCIPAUX
const tabs = document.querySelectorAll("nav a[data-tab]");
const sections = document.querySelectorAll("section");
const indicator = document.querySelector(".nav-indicator");

const glossaireAC = {
    "AC11.01": "Implémenter des conceptions simples",
    "AC11.02": "Élaborer des conceptions simples",
    "AC11.03": "Faire des essais et évaluer leurs résultats en regard des spécifications",
    "AC11.04": "Développer des interfaces utilisateurs",
	"AC12.01": "Analyser un problème avec méthode (découpage en éléments algorithmiques simples, structure de données...)",
	"AC12.02": "Comparer des algorithmes pour des problèmes classiques (tris simples, recherche...)",
	"AC12.03": "Formaliser et mettre en œuvre des outils mathématiques pour l’informatique",
	"AC13.01": "Identifier les différents composants (matériels et logiciels) d’un système numérique",
	"AC13.02": "Utiliser les fonctionnalités de base d’un système multitâches / multiutilisateurs",
	"AC13.03": "Installer et configurer un système d’exploitation et des outils de développement",
	"AC13.04": "Configurer un poste de travail dans un réseau d’entreprise",
	"AC14.01": "Mettre à jour et interroger une base de données relationnelle (en requêtes directes ou à travers une application)",
	"AC14.02": "Visualiser des données",
	"AC14.03": "Concevoir une base de données relationnelle à partir d’un cahier des charges",
	"AC15.01": "Appréhender les besoins du client et de l'utilisateur",
	"AC15.02": "Mettre en place les outils de gestion de projet",
	"AC15.03": "Identifier les acteurs et les différentes phases d’un cycle de développement",
	"AC16.01": "Appréhender l’écosystème numérique",
	"AC16.02": "Découvrir les aptitudes requises selon les différents secteurs informatiques (RSE, contraintes)",
	"AC16.03": "Identifier les statuts, les fonctions et les rôles de chaque membre d’une équipe pluridisciplinaire",
	"AC16.04": "Acquérir les compétences interpersonnelles pour travailler en équipe"
};

function moveIndicator(el) {
    const r = el.getBoundingClientRect();
    const nav = el.closest("nav").getBoundingClientRect();
    indicator.style.width = r.width + "px";
    indicator.style.left = (r.left - nav.left) + "px";
}

tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        e.preventDefault();
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(target).classList.add("active");
        moveIndicator(tab);
    });
});

// GESTION DU SOUS-MENU (PROJETS)
document.querySelectorAll(".dropdown-menu div").forEach(sub => {
    sub.addEventListener("click", () => {
        // Switch vers l'onglet Projets
        document.querySelector('a[data-tab="projets"]').click();
        
        // Switch entre Scolaire et Grille de Projets
        document.querySelectorAll(".projets-block").forEach(b => b.classList.remove("active"));
        document.getElementById(sub.dataset.subtab).classList.add("active");
    });
});

// ONGLETS INTERNES (S1, S2...)
document.querySelectorAll(".projet-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const parent = btn.closest(".projets-block");
        parent.querySelectorAll(".projet-tab-btn").forEach(b => b.classList.remove("active"));
        parent.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        document.getElementById(btn.dataset.target).classList.add("active");
    });
});

// PANNEAU DE DÉTAILS
function openDetails(card) {
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    const acCodes = card.getAttribute('data-ac'); // ex: "AC11.01, AC11.02"
    const extra = card.getAttribute('data-extra');

    document.getElementById('panelTitle').innerText = title;
    document.getElementById('panelDesc').innerText = desc;
    document.getElementById('panelExtra').innerText = extra;

    // Gestion automatique des AC
    const acContainer = document.getElementById('panelAC');
    acContainer.innerHTML = ''; // On vide l'ancien contenu

    if (acCodes) {
        const listeCodes = acCodes.split(',');
        
        listeCodes.forEach(code => {
            const codeNettoye = code.trim();
            // On cherche la description dans notre dictionnaire
            const texteComplet = glossaireAC[codeNettoye] || "Description non renseignée";

            // Création du badge stylisé
            const badge = document.createElement('div');
            badge.className = 'badge-ac-complet';
            badge.innerHTML = `<strong>${codeNettoye}</strong> : ${texteComplet}`;
            acContainer.appendChild(badge);
        });
    }

    document.getElementById('detailsPanel').classList.add('active');
    document.getElementById('panelOverlay').classList.add('active');
}

function closeDetails() {
    document.getElementById('detailsPanel').classList.remove('active');
    document.getElementById('panelOverlay').classList.remove('active');
    
    // Réactiver le scroll
    document.body.style.overflow = 'auto';
}

// Initialisation de l'indicateur au chargement
window.onload = () => moveIndicator(document.querySelector("nav a.active"));