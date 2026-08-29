# Font self-hosted

| File | Famiglia | Subset | Peso file |
|---|---|---|---|
| `fraunces-latin.woff2` | Fraunces v38 | latin | 36 KB |
| `fraunces-latin-ext.woff2` | Fraunces v38 | latin-ext | 33 KB |
| `inter-latin.woff2` | Inter v20 | latin | 47 KB |
| `inter-latin-ext.woff2` | Inter v20 | latin-ext | 83 KB |

Sono **woff2 variabili** con il solo asse `wght` (100–900): un file copre tutti i
pesi usati dal sito. Contengono solo il **tondo** — il corsivo di `<em>`,
`.signature` e `.hero__brand span` è sintetizzato dal browser, esattamente come
avveniva con Google Fonts.

I `@font-face` stanno in testa a `styles.css`. Il subset `latin-ext` viene
scaricato solo se in pagina compare un carattere di quell'intervallo: per un
sito in italiano di fatto non parte mai, quindi il costo reale è ~83 KB.

`index.html` fa il `preload` dei due file `latin` (servono entrambi above the
fold). L'attributo `crossorigin` è obbligatorio anche se il font è same-origin:
senza, il browser scarica il file due volte.

## Rigenerare i file

```bash
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Inter:wght@400;500;600&display=swap"
```

Lo user agent serve a farsi restituire i `woff2`: con uno user agent vecchio
Google risponde con `ttf`. Nel CSS che torna, tutte le dichiarazioni di peso di
una stessa famiglia puntano allo **stesso** file — sono quelli da scaricare.
Se cambia la versione della famiglia (`v38`, `v20`) cambia anche l'URL.

## Serve il corsivo vero?

Fraunces ha un corsivo disegnato, molto diverso dall'inclinazione sintetica.
Per usarlo servono altri due file (`Fraunces:ital,wght@1,400;1,600`) e un
`@font-face` con `font-style: italic`. Cambia l'aspetto di "Stile personale."
nella hero, del marchio in navbar e della firma in "Chi siamo".

## Licenze

Entrambe le famiglie sono sotto **SIL Open Font License 1.1**: l'uso su web è
libero, anche commerciale, a condizione di distribuire il testo della licenza
insieme ai font — sono i file `OFL-Fraunces.txt` e `OFL-Inter.txt` in questa
cartella. Non vanno rimossi.
