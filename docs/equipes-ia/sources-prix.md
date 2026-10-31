# Sources de prix : mode d'emploi

| Enseigne | Accès | Méthode | Pièges |
|---|---|---|---|
| Carrefour (Bringo) | Ouvert, y compris depuis GitHub Actions | Relevé quotidien automatique : `scraper/`, workflow `scrape-prices.yml` | Aucun connu |
| Marjane | Bloque GitHub Actions (403) | Context_dev `web-scrape`, `country: "MA"`, `waitFor: ".product-card"` | Pages parfois vides : réessayer. 30 à 50 produits par page, pas de pagination visible |
| BIM | Prospectus PDF ou images chaque semaine | Lecture par IA, dès que la clé OpenRouter est en place | Prix valables une semaine seulement |
| Souk | Pas de site | Prix de gros Médias24 (SDL Casablanca) × 1,3 à 1,8, puis relevés de la communauté | Estimation, à afficher comme telle |

## Marjane : rayons utiles
- Légumes : `/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes`
- Fruits : `/courses-en-ligne/11-marche/52-fruits-legumes/271-fruits`
- Boucherie : `/courses-en-ligne/11-marche/51-boucherie-volaille/274-boucherie`
- Volailles : `/courses-en-ligne/11-marche/51-boucherie-volaille/275-volailles`
- Lait et lben : `/courses-en-ligne/13-produits-laitiers-%C5%93ufs/64-laits-et-%C5%93ufs/248-lait-lben`
- Pâtes, riz, féculents : `/courses-en-ligne/8-epicerie/36-pates-riz-feculents`, avec les sous-rayons `149-riz-risotto`, `150-spaghetti-tagliatelles`, `146-couscous`, `147-legumes-secs-feculents` et `145-ble-cuit-quinoa-puree`
- Conserves de poisson : `/courses-en-ligne/8-epicerie/261-conserves-de-poissons`
- Huiles : `/courses-en-ligne/8-epicerie/35-huiles-et-vinaigres`
- Petit-déjeuner (avoine, miel, beurre de cacahuète) : `/courses-en-ligne/12-petit-dejeuner`
- Produits laitiers (beurre, fromages, raïb) : `/courses-en-ligne/13-produits-laitiers-%C5%93ufs`

Règle de parse : `.product-card` → `h2.title` pour le nom, `.prices` pour le prix (« 9,90DH »), `a.image@href` pour le lien.
