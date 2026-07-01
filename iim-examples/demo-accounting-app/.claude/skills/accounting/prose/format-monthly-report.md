# Prose — Format du rapport mensuel

> Cette prose est un skill **sans script** : c'est le LLM qui rédige, en suivant les règles ci-dessous à la lettre.

## Quand l'utiliser

Après avoir appelé `summarize-month` et éventuellement `detect-overdue` dans la même conversation. L'utilisateur (le trésorier de l'asso IIMPACT) veut lire un rapport clair pour son bureau.

## Contraintes de rédaction

### Longueur
6 à 10 phrases. Pas de bullet points sauf pour lister les impayés.

### Ton
Professionnel neutre. Ni fataliste ("hélas"), ni marketing ("ravi de vous annoncer"). Ce que ferait un expert-comptable en 2 minutes.

### Chiffres
- Toujours arrondir au **centime** dans le texte : "5 733,00 €", pas "5733".
- Séparateur milliers : espace insécable côté FR.
- Ne JAMAIS inventer un chiffre. Uniquement ceux du JSON de `summarize-month`.

### Interdits absolus
- ❌ Pas de noms de fichiers ou de chemins
- ❌ Pas de mention "d'après le JSON" ou "selon les données"
- ❌ Pas d'emoji
- ❌ Pas d'em dashes
- ❌ Pas de "je"/"nous" — parler à la 3e personne du bureau

### Structure obligatoire (dans cet ordre)

1. **Ouverture (1 phrase)** — le mois, le total encaissé.
2. **Répartition (1-2 phrases)** — TVA à reverser, HT total.
3. **Top clients (1 phrase)** — nommer le premier + son montant.
4. **Payés vs impayés (1 phrase)** — ratio + montant impayé.
5. **Section impayés (si `detect-overdue` retourne quelque chose)** — bullet par facture, format `<clientName> — <amountTtc> € — <daysOverdue> jours de retard`.
6. **Clôture (1 phrase)** — action recommandée : relance des impayés si > 0, sinon "aucune action de recouvrement requise".

## Exemple GOOD

> En juin 2026, l'association a encaissé 5 733,00 € toutes taxes comprises pour 25 factures émises. Le hors-taxes s'élève à 4 870,00 €, ce qui laisse 863,00 € de TVA à reverser au trimestre. Le principal contributeur est Louis Martin, avec 720,00 € sur 3 factures. À date, 15 factures sont soldées et 5 restent impayées pour un montant total de 1 240,00 €.
>
> Factures en retard :
> - Marie Dupont — 240,00 € — 22 jours de retard
> - Jean Bernard — 180,00 € — 35 jours de retard
> - Sophie Leclerc — 420,00 € — 47 jours de retard
>
> Une relance individualisée des cinq clients concernés est recommandée cette semaine.

## Exemple BAD (ce qu'un LLM sans cadrage produirait)

> Voici le rapport de juin 2026 selon le JSON summarize-month.json ! Nous avons été ravis d'encaisser 5733€ 💰 en juin. Le top client est louis martin, super. La TVA c'est 863€. Il y a 5 impayés à gérer, désolé pour cette mauvaise nouvelle.

Anti-patterns présents dans le BAD :
- Emojis
- Mention "selon le JSON"
- Séparateur manquant ("5733€" au lieu de "5 733,00 €")
- Nom mal capitalisé
- Ton marketing ("ravi", "super")
- Ton fataliste ("désolé")
- "Nous" pluriel
- Manque la répartition HT + reverser TVA
- Impayés non détaillés

## Anti-patterns d'invocation (WLGW)

| # | AP | BAD | GOOD |
|---|---|---|---|
| AP1 | Rédiger sans avoir appelé `summarize-month` | Le LLM invente des chiffres | Toujours appeler le script d'abord, JSON en entrée |
| AP2 | Inventer les impayés sans `detect-overdue` | Chiffres fantômes | Appeler `detect-overdue`, PASSER le résultat |
| AP3 | Ignorer les contraintes de format | Bullet points partout | Seuls les impayés en bullets, tout le reste en prose |
| AP4 | Mentionner "d'après les données" | Casse l'illusion de rédaction humaine | Écrire comme si le rédacteur avait les infos en tête |
