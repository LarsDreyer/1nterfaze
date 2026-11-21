# 1nterfaze MTB: Kompendium for nedoverrettet terrengsykling
Statisk nettside uten byggesteg. Slett alt i repoet, legg inn innholdet i zip-filen og aktiver GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). `CNAME` peker på 1nterfaze.com.

## Hvor endrer jeg hva?
| Det du vil endre | Fil |
|---|---|
| Navn, fanetittel, repo, passord | `js/config.js` |
| Tekst, sider, videoer, bilder | Editoren på siden (se under), lagres i `data/content.js` |
| Farger, fonter, avstander, animasjon | `css/style.css` (variabler øverst) |
| Ny blokktype (f.eks. sitat) | `blk()` + `LBL` + `addbar()` i `js/app.js` |
| Ikon / bokmerkeikon | `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `img/logo-mark.png` |

## Editoren
- Åpne menyen med låsen (eller gå til `#/admin`), passord står i `js/config.js`. Innloggingen varer i 8 timer.
- Klikk i en tekst og skriv. Bruk B / I / Lenke i bunnlinjen for formatering.
- Nederst på hver side (også forsiden): legg til overskrift, tekst, lister, merknad, tabell, bilde og YouTube-video, flytt blokker med ↑ ↓, og legg til, flytt eller slett sider.
- YouTube: legg til «YouTube-video» og lim inn en vanlig lenke (watch, youtu.be, shorts eller embed).

## Publisere
1. Lag en GitHub-token (fine-grained, kun dette repoet, *Contents: Read and write*).
2. Trykk «GitHub-token» i bunnlinjen og lim den inn (lagres kun i din nettleser).
3. Trykk «Publiser». `data/content.js` committes rett fra nettleseren og siden oppdateres for alle etter ca. 1 minutt.

Uten token: «Eksporter» og erstatt `data/content.js` i repoet manuelt.

**Husk:** passordet ligger i koden og er ikke ekte sikkerhet. Det som beskytter publisering er GitHub-tokenet. Endringer lagres som utkast i din nettleser til du publiserer. Når nytt innhold publiseres fra et annet sted, forkastes gamle utkast automatisk.
