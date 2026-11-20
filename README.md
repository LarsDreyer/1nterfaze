# Kompendium for nedoverrettet terrengsykling
Statisk nettside uten byggesteg. Slett alt i repoet, legg inn innholdet i zip-filen, og aktiver GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). `CNAME` peker på 1nterfaze.com (slett filen hvis du ikke bruker eget domene).

- `index.html` · `css/style.css` (farger øverst) · `js/app.js` (visning + editor) · `data/content.js` (alt innhold) · `img/` (bilder fra presentasjonen)
- **Admin:** trykk på låsen, passord `password` (endre `PASSORD` i `js/app.js`). Klikk i en tekst for å skrive; bruk B/I/Lenke i bunnlinjen; legg til blokker, bilder, YouTube-lenker og undersider nederst på hver side.
- **Publisere:** lag en GitHub-token (fine-grained, kun dette repoet, *Contents: Read and write*), trykk «GitHub-token», lim inn, og trykk «Publiser». Da committes `data/content.js` rett fra nettleseren. Uten token: «Eksporter» og erstatt `data/content.js` manuelt.
- **Viktig:** passordet ligger i koden og er ikke ekte sikkerhet. Det som faktisk beskytter publisering er GitHub-tokenet. Endringer lagres som utkast i din nettleser til du publiserer.
