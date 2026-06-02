// CONFIGURATION DE L'APPLICATION PORFOLIO
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll("nav a[data-tab]");
    const sections = document.querySelectorAll("section");
    const indicator = document.querySelector(".nav-indicator");

    // GESTION DU HUB DE NAVIGATION DE LA PRÉSENTATION
    document.querySelectorAll(".hub-btn[data-hub-tab]").forEach(hubBtn => {
        hubBtn.addEventListener("click", (e) => {
            const mainTabTarget = hubBtn.dataset.hubTab;
            if (!mainTabTarget) return;

            e.preventDefault();
            const subTabTarget = hubBtn.dataset.hubSubtab;

            // Activation de l'onglet principal via ton système existant
            const targetNav = document.querySelector(`nav a[data-tab="${mainTabTarget}"]`);
            if (targetNav) {
                targetNav.click();
            }

            // CORRECTION : On cible uniquement les sous-blocs de #projets pour éviter les conflits globaux
            if (subTabTarget) {
                document.querySelectorAll("#projets .projets-block").forEach(b => b.classList.remove("active"));
                const targetBlock = document.getElementById(subTabTarget);
                if (targetBlock) {
                    targetBlock.classList.add("active");
                }
            }
        });
    });
	
	// FONCTION DE CALCUL DYNAMIQUE DES COMPTEURS
    function updateProjectCounters() {
        // Compte toutes les cartes (classiques et unique) présentes dans la section des projets
        const totalCount = document.querySelectorAll("#projets-block .projet-card, #projets-block .projet-card-unique").length;
        
        // Identifie le conteneur du semestre actuellement visible (.active)
        const activeTab = document.querySelector("#projets-block .tab-content.active");
        const currentCount = activeTab ? activeTab.querySelectorAll(".projet-card, .projet-card-unique").length : 0;

        // Injection des valeurs dans le HTML
        document.getElementById("total-project-count").textContent = totalCount;
        document.getElementById("current-project-count").textContent = currentCount;
    }

    // Calcul initial au chargement de la page
    updateProjectCounters();

    // Recalcul automatique lors d'un clic sur les onglets de semestres
    document.querySelectorAll(".projet-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            // Le délai de 10ms permet d'attendre que l'onglet ait fini de recevoir 
            // la classe '.active' avant de lancer le décompte
            setTimeout(updateProjectCounters, 10);
        });
    });

    // DICTIONNAIRE UNIQUE DES APPRENTISSAGES CRITIQUES (AC)
	const glossaireAC = {
		"Aucun": "Aucun apprentissage critique pour ce projet",
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

    // Gestion de l'indicateur de navigation
    function moveIndicator(el) {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const nav = el.closest("nav").getBoundingClientRect();
        indicator.style.width = r.width + "px";
        indicator.style.left = (r.left - nav.left) + "px";
    }

    // Commutation des onglets principaux
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove("active"));
            sections.forEach(s => s.classList.remove("active"));

            tab.classList.add("active");
            const targetSection = document.getElementById(target);
            if(targetSection) targetSection.classList.add("active");
            
            moveIndicator(tab);
        });
    });

    // Navigation depuis le sous-menu déroulant
    document.querySelectorAll(".dropdown-menu div").forEach(sub => {
        sub.addEventListener("click", (e) => {
            e.stopPropagation();
            
            // On force l'activation de l'onglet parent
            const projetTab = document.querySelector('a[data-tab="projets"]');
            projetTab.click();
            
            // On affiche le sous-bloc demandé (Scolaire ou Blocs projets)
			document.querySelectorAll("#projets .projets-block").forEach(b => b.classList.remove("active"));            
            const targetBlock = document.getElementById(sub.dataset.subtab);
            if (targetBlock) targetBlock.classList.add("active");
        });
    });

    // Navigation par boutons internes (Semestres S1, S2, S3)
    document.querySelectorAll(".projet-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const parent = btn.closest(".projets-block");
            parent.querySelectorAll(".projet-tab-btn").forEach(b => b.classList.remove("active"));
            parent.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            const targetContent = document.getElementById(btn.dataset.target);
            if (targetContent) targetContent.classList.add("active");
        });
    });

    // Gestion globale de l'ouverture de la modale
    // Gestion globale de l'ouverture de la modale
    window.openDetails = function(card) {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const acCodes = card.getAttribute('data-ac');
        const extra = card.getAttribute('data-extra');
        const illustrations = card.getAttribute('data-illustrations'); // <-- Récupération des images

        document.getElementById('panelTitle').innerText = title;
        document.getElementById('panelDesc').innerText = desc;
        document.getElementById('panelExtra').innerText = extra;

        const tagElem = card.querySelector('.category-tag') || card.querySelector('[class*="tag-"]');
        if (tagElem) {
            const computedStyle = window.getComputedStyle(tagElem);
            const tagColor = computedStyle.color;           
            const tagBgColor = computedStyle.backgroundColor; 
            
            panelTitle.style.borderImage = `linear-gradient(to bottom, ${tagColor}, ${tagBgColor}) 1`;
        } else {
            panelTitle.style.borderImage = `linear-gradient(to bottom, #007BFF, #99caff) 1`; 
        }
        
        const acContainer = document.getElementById('panelAC');
        acContainer.innerHTML = '';

        if (acCodes) {
            acCodes.split(',').forEach(code => {
                const codeNettoye = code.trim();
                const texteComplet = glossaireAC[codeNettoye] || "Compétence spécifique validée.";

                const badge = document.createElement('div');
                badge.className = 'badge-ac-complet';
                badge.innerHTML = `<strong>${codeNettoye}</strong> : ${texteComplet}`;
                acContainer.appendChild(badge);
            });
        }

        // <-- AJOUT : Gestion dynamique de la section Illustrations
        const illustrationsContainer = document.getElementById('panelIllustrations');
        if (illustrationsContainer) {
            illustrationsContainer.innerHTML = ''; // On vide le conteneur précédent
            
            if (illustrations && illustrations.trim() !== "") {
                // Création d'un titre adapté pour la section
                const titleSec = document.createElement('h3');
                titleSec.className = 'panel-section-title';
                titleSec.innerText = "Illustrations & Documents (cliquer)";
                illustrationsContainer.appendChild(titleSec);

                // Création de la galerie
                const gallery = document.createElement('div');
                gallery.className = 'panel-illustrations-gallery';

                illustrations.split(',').forEach(url => {
                    const cleanUrl = url.trim();
                    if (cleanUrl !== "") {
                        // Détection de l'extension du fichier
                        const isPdf = cleanUrl.toLowerCase().endsWith('.pdf');

                        if (isPdf) {
                            // Conteneur de l'aperçu
                            const pdfContainer = document.createElement('div');
                            pdfContainer.className = 'panel-illustration-pdf-container';
                            
                            // "view=Fit" force la page du PDF à prendre toute la place disponible
                            pdfContainer.innerHTML = `
                                <object data="${cleanUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit" type="application/pdf" class="panel-illustration-pdf-object"></object>
                                <div class="panel-illustration-pdf-overlay" title="Ouvrir le document PDF"></div>
                            `;

                            // Clic pour ouvrir le vrai PDF entier
                            pdfContainer.addEventListener('click', () => window.open(cleanUrl, '_blank'));
                            
                            gallery.appendChild(pdfContainer);
                        } else {
                            // Logique pour une image classique
                            const img = document.createElement('img');
                            img.src = cleanUrl;
                            img.className = 'panel-illustration-img';
                            img.alt = "Illustration du projet";
                            img.addEventListener('click', () => window.open(img.src, '_blank'));
                            gallery.appendChild(img);
                        }
                    }
                });
                illustrationsContainer.appendChild(gallery);
            }
        }

        document.getElementById('detailsPanel').classList.add('active');
        document.getElementById('panelOverlay').classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    window.closeDetails = function() {
        document.getElementById('detailsPanel').classList.remove('active');
        document.getElementById('panelOverlay').classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaure le scroll
    };

    // Ajustement de la ligne de navigation au chargement et au redimensionnement
    moveIndicator(document.querySelector("nav a.active"));
    window.addEventListener("resize", () => moveIndicator(document.querySelector("nav a.active")));
});