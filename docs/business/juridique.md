# Cadre juridique (Maroc) : Mizan.ma

> ⚠️ **Ce document n'est pas un avis juridique.** C'est une synthèse de sources publiques, souvent secondaires (cabinets, presse, guides). Avant le lancement, fais valider chaque point par un avocat ou un conseil marocain, et vérifie les textes officiels (Bulletin officiel, site de la CNDP, DGI).

---

## 1. Données personnelles : loi 09-08 et CNDP

### Ce que collecte Mizan
Âge, sexe, **poids, taille**, niveau d'activité, **objectif de poids**, régime suivi, allergies (gluten, lactose), ville et e-mail.

### Pourquoi c'est sensible
- Selon un cabinet d'avocats, les données de santé sont des **données sensibles** au sens de l'article 1 de la loi 09-08, et leur collecte est **soumise à une autorisation préalable de la CNDP** (articles 12 et 21). [LPA / Lexis Maroc](https://www.lpalaw.com/wp-content/uploads/2020/05/2020.05-_-Lexis-Maroc-Fiche-Pratique-Protection-des-données-Covid-19_LFF.pdf)
- La CNDP distingue la **déclaration préalable**, pour les traitements ordinaires, et l'**autorisation préalable**, pour certains traitements dont les données sensibles. [Upsilon Consulting](https://upsilon-consulting.com/assistance-compliance-cndp/)
- **Point à faire trancher par un juriste :** le poids, la taille, l'IMC et les allergies sont-ils des « données de santé » ? Hypothèse prudente : **oui**, surtout les allergies et l'IMC. On prévoit donc une **demande d'autorisation** et pas une simple déclaration.

### Ce qu'il faut faire
| Action | Quand |
|---|---|
| Désigner le responsable du traitement (la société) et tenir un registre des traitements | Avant la bêta |
| Déposer la **demande d'autorisation CNDP** pour le profil nutritionnel, et la **déclaration** pour la liste d'attente (e-mail et ville seulement) | Avant de stocker des profils en base |
| Recueillir un **consentement explicite** et séparé pour les données du profil (case non pré-cochée, texte clair) | Dès le premier compte |
| Ne collecter que le nécessaire : l'âge plutôt que la date de naissance, aucune donnée médicale libre | Dès maintenant |
| Permettre à l'utilisateur de consulter, rectifier, supprimer et s'opposer (droits de la loi 09-08) | Bêta |
| Publier une politique de confidentialité et des mentions CNDP (numéro d'autorisation ou de récépissé) | Bêta |

### Bonne nouvelle : le calculateur actuel ne stocke rien
Aujourd'hui, le calcul se fait **entièrement dans le navigateur**, et rien n'est envoyé au serveur. Seule la liste d'attente envoie un e-mail et une ville. **À garder tant que l'autorisation CNDP n'est pas obtenue :** ne pas enregistrer les profils en base avant d'avoir le récépissé.

### Hébergement
- La loi 09-08 encadre les **transferts de données hors du Maroc**. Un hébergeur à l'étranger, comme Supabase ou Vercel (UE ou US), peut supposer une autorisation ou une garantie particulière. [DPO Consulting](https://www.dpo-consulting.com/fr-fr/blog/loi-marocaine-sur-la-protection-des-donnees-09-08), [Clym](https://www.clym.io/regulations/law-no-09-08-morocco)
- **Hypothèse à valider :** choisir une région UE pour Supabase et Vercel, et mentionner le transfert dans la demande CNDP. Alternative : un hébergement au Maroc pour les données de profil.

---

## 2. Protection du consommateur : loi 31-08

- La loi n° 31-08 (dahir n° 1-11-03 du 18 février 2011) encadre la **vente à distance** : information préalable claire, confirmation écrite du contrat, droit de rétractation. [Texte officiel, adala.justice.gov.ma](https://adala.justice.gov.ma/api/uploads/2024/03/01/protection%20de%20consommateur-1709283839988.pdf)
- **Rétractation :** **7 jours** selon La Vie Éco, portés à **30 jours** si le vendeur ne confirme pas les informations par écrit. Remboursement sous **15 jours** maximum. [La Vie Éco](https://www.lavieeco.com/affaires/e-commerce-ce-qui-changera-en-2013-24727/). SNRTnews parle d'un délai « de 7 à 30 jours selon le produit » ; les sources ne concordent pas tout à fait. [SNRTnews](https://snrtnews.com/fr/article/e-commerce-au-maroc-une-croissance-rapide-face-a-une-protection-juridique-encore-limitee) **→ vérifier les articles sur la vente à distance dans le texte officiel.**
- **Pour un abonnement premium :**
  - CGV accessibles avant le paiement, avec prix TTC en MAD, durée, reconduction et résiliation.
  - Confirmation écrite par e-mail après chaque souscription, ce qui évite de passer à 30 jours de rétractation.
  - Résiliation en un clic, aussi simple que la souscription (bonne pratique ; Planivore le fait).
  - Rappel avant chaque renouvellement annuel (bonne pratique).
- Modèle de CGV conformes à la loi 31-08 : [Captain Legal](https://www.captain.legal/ma/gestion-entreprise/cgv-maroc-modele-conforme-loi-31-08-word-et-pdf/). À adapter par un juriste.

### Paiement
- Le paiement récurrent via **CMI** dépend de la banque : la tokenisation n'est pas toujours activée par défaut. [Kolonell](https://kolonell.com/fr/blog/paiement-en-ligne-pme-casablanca-cmi-prix-2026). Une intégration standard indique l'abonnement « non pris en charge ». [CartDNA](https://cartdna.com/fr-fr/shopify-payment-methods/cmi-morocco)
- Depuis le 1er mai 2025, des **établissements de paiement** et des filiales bancaires peuvent faire de l'acquisition, ce qui ouvre des alternatives au CMI. [AllAfrica](https://fr.allafrica.com/stories/202505290300.html)
- **Conséquence :** pour le premium, prévoir aussi un **accès à vie** ou un **pack de 3 ou 12 mois en paiement unique**, qui ne demande pas d'abonnement récurrent.

---

## 3. Allégations santé et nutrition

Je n'ai pas trouvé de texte marocain spécifique aux allégations santé des applications. Les règles ci-dessous sont des **bonnes pratiques prudentes** :
- Ne **jamais promettre** une perte de poids chiffrée (« -5 kg en 1 mois »). Parler d'**estimations**.
- Mention visible : « **Ce n'est pas un avis médical** ». Elle est déjà dans le calculateur, la FAQ et les pages régimes.
- Garde-fous déjà codés : plancher de 1 200 kcal (femme) et 1 500 kcal (homme), pas de perte de poids proposée si l'IMC est inférieur à 18,5, avertissement pour les moins de 18 ans.
- À ajouter : un avertissement **grossesse, allaitement, diabète, troubles du comportement alimentaire**, et un conseil de consulter.
- Ne pas présenter un régime (céto, carnivore…) comme un traitement.
- Faire **valider le moteur par un diététicien diplômé**. Ça réduit le risque et c'est un argument marketing.
- Contenus sponsorisés (compléments, partenaires) : **les identifier clairement comme publicité**.

---

## 4. Scraping des prix et CGU des sites

### Risques
- **Contractuel :** les CGU de Bringo, Glovo ou Marjane peuvent interdire l'extraction automatisée. Il faut **les lire avant de passer à l'échelle**.
- **Propriété intellectuelle :** la loi 2-00 sur le droit d'auteur protège les compilations ; photos et descriptions sont des œuvres. Les prix et les noms de produits sont des faits, donc beaucoup moins exposés.
- **Technique :** un scraping trop agressif peut être vu comme une perturbation du service.

### Bonnes pratiques (appliquées dans le scraper)
1. Ne garder que **nom, conditionnement, prix, promo, URL**. Aucune photo ni description copiée.
2. Une requête toutes les 1 à 2 secondes, un User-Agent identifiable, une collecte **une fois par jour**.
3. Respecter `robots.txt`, ne pas contourner de protection (captcha, connexion).
4. Toujours **citer la source et la date** du prix (déjà fait sur le site).
5. **À terme :** demander un **flux officiel** ou un **partenariat** aux enseignes. Ça supprime le risque et ouvre l'affiliation.

---

## 5. Quel statut juridique pour démarrer ?

| | Auto-entrepreneur | SARL AU (associé unique) |
|---|---|---|
| Plafond de chiffre d'affaires | **200 000 MAD/an** pour les prestations de services (500 000 pour le commerce) | Pas de plafond |
| Impôt | **1 % du CA** pour les services (0,5 % pour le commerce) | IS + TVA, comptabilité obligatoire |
| Limite | Au-delà de **80 000 MAD** facturés à un seul client, la part excédentaire est imposée à 30 % (loi de finances 2023) | — |
| Image auprès des enseignes et des banques | Faible | Meilleure : contrat CMI, partenariats, levée de fonds |

Sources : [Upsilon Consulting](https://upsilon-consulting.com/auto-entrepreneur/), [Beancount, guide 2026](https://beancount.io/fr/blog/2026/09/15/morocco-auto-entrepreneur-revenue-caps-2026-cpu-cnss-crossing-guide), [Humantal](https://humantal.ma/ressources/statut-auto-entrepreneur-maroc-guide-complet), [Bladi : projet de relèvement du seuil client unique, non confirmé](https://www.bladi.net/changement-statut-auto-entrepreneur-maroc,111518.html).

**Recommandation (hypothèse) :**
- **Phase bêta, sans revenus importants :** auto-entrepreneur, simple et peu coûteux.
- **Dès les premiers paiements premium ou un contrat avec une enseigne :** passer en **SARL AU**. Un partenaire comme Carrefour ou une marque risque de dépasser les 80 000 MAD, et le contrat CMI ainsi que la demande CNDP au nom d'une société sont plus solides.

---

## Checklist avant la bêta
- [ ] Statut juridique choisi et immatriculé
- [ ] Déclaration CNDP pour la liste d'attente, demande d'autorisation pour les profils
- [ ] Politique de confidentialité, mentions légales et CGU publiées (les pages existent, à remplir)
- [ ] Consentement explicite pour les données du profil
- [ ] Avertissements santé complétés (grossesse, diabète, TCA)
- [ ] CGU des sites scrapés lues, prise de contact avec Carrefour/Label'Vie pour un flux officiel
- [ ] CGV premium conformes à la loi 31-08, avant tout paiement
