# AM7 Barber — sito vetrina

Landing page a pagina singola di **AM7 Barber**, barberia in Via Vittorio Emanuele 91 a Bra (CN).
Obiettivo del sito: presentare servizi, listino, orari e portare il contatto su WhatsApp o telefono.

## Stack

HTML, CSS e JavaScript vanilla. **Nessuna build, nessuna dipendenza runtime, nessun framework.**
I file si pubblicano così come sono. Il JavaScript è solo miglioramento progressivo: con JS
disattivato restano leggibili identità, listino, orari, indirizzo e contatti.

## Struttura

```text
.
├── index.html              # unica pagina di contenuto
├── styles.css              # design system e layout
├── script.js               # carosello gallery, reel video, anno nel footer
├── 404.html                # pagina di errore (noindex, fuori sitemap)
├── manifest.json           # identità per browser, display "browser"
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── CNAME                   # am7barberstudio.it
├── .nojekyll               # niente elaborazione Jekyll su GitHub Pages
├── .gitignore
├── .gitattributes
├── assets/
│   ├── icons/              # set favicon / apple-touch / manifest
│   ├── fonts/              # Fraunces + Inter self-hosted, con licenze
│   ├── social-cover.jpg    # 1200x630, immagine Open Graph
│   ├── logo-mark.png       # logo approvato, master delle icone
│   ├── Taglio1-6.jpg       # galleria tagli
│   ├── 12/13/14-gallery-*.jpg  # interni del locale
│   └── VideoTelefono.mp4   # reel nel mockup telefono
└── legal/
    └── privacy.html        # informativa — DA REDIGERE (noindex)
```

## Server locale

```powershell
python -m http.server 8000
```

Aprire `http://localhost:8000/`. **Non** aprire con `file://`: percorsi e font si comportano
diversamente.

## Deploy

- **Hosting:** GitHub Pages, repository `simatwebstudio/Am7-Barber-landing-page`, branch `main`, cartella radice.
- **Dominio canonico:** `https://am7barberstudio.it/` — servito alla radice del dominio, non sotto il nome del repository.
- `CNAME` contiene il solo hostname, senza protocollo. `.nojekyll` disattiva l'elaborazione Jekyll.
- Prima di considerare il deploy concluso: verificare DNS, certificato HTTPS e redirect al dominio primario.

Il sito usa percorsi relativi per gli asset, quindi funziona anche in anteprima locale o in
sottocartella. Fanno eccezione i link "torna alla home" di `404.html`, che puntano a `/` perché il
sito vive alla radice del dominio: se un giorno venisse pubblicato sotto sottocartella vanno corretti.

## Asset, font e licenze

| Risorsa | Origine | Licenza / stato |
|---|---|---|
| Fraunces v38, Inter v20 (woff2 variabili, self-hosted) | fonts.gstatic.com | SIL OFL 1.1 — testi in `assets/fonts/OFL-*.txt`, **non rimuovere** |
| `assets/logo-mark.png` | logo fornito dal cliente | uso autorizzato |
| `assets/icons/*`, `favicon.ico`, `assets/social-cover.jpg` | generati dal logo approvato | derivati, proporzioni originali, nessuna reinterpretazione |
| Foto tagli e interni, `VideoTelefono.mp4` | materiale del cliente | **liberatoria da confermare** per le persone ritratte |

Dettagli sui font e su come rigenerarli: `assets/fonts/README.md`.

## Integrazioni esterne

**Il sito non effettua alcuna richiesta a terze parti al caricamento.** Nessun analytics, nessun
pixel, nessun font remoto, nessun iframe, nessun widget, nessun form, nessun cookie proprio,
nessun uso di `localStorage` o `sessionStorage`.

Le uniche uscite verso l'esterno sono **link che partono solo dopo un click dell'utente**:

| Destinazione | Dove | Finalità |
|---|---|---|
| `wa.me` (WhatsApp) | hero, listino, sezione prenota | prenotazione |
| `tel:+393272459352` | hero, prenota, footer, 404, privacy | chiamata diretta |
| `instagram.com/am7_barberstudio` | sezione social, footer | profilo ufficiale |
| `maps.app.goo.gl` | sezione "Dove trovarci" | indicazioni stradali |

Non essendoci strumenti di tracciamento, **non è previsto alcun banner di consenso cookie**.
Se in futuro si aggiunge analytics, una mappa incorporata o un form, vanno aggiornati questo
inventario e l'informativa **prima** di attivare l'integrazione.

## Stato delle informative legali

| Documento | Stato |
|---|---|
| `legal/privacy.html` | **DA REDIGERE** — pagina volutamente vuota su indicazione del committente. È `noindex, nofollow` ed è esclusa da `sitemap.xml`. Va compilata e riportata a `index, follow` prima di considerare il sito pubblicabile. |
| Cookie policy | Non prevista: nessun cookie né strumento di tracciamento. Da introdurre solo se cambia la configurazione tecnica. |

Il contenuto della privacy va verificato dal titolare o da un professionista competente: non va
copiato da altri siti né generato automaticamente.

## Dati duplicati — aggiornare ovunque

Ogni dato qui sotto compare in **più punti**. Modificandone uno vanno aggiornati tutti, altrimenti
contenuto visibile, dati strutturati e SEO locale entrano in conflitto.

| Dato | Valore attuale | Dove compare |
|---|---|---|
| Telefono | +39 327 245 9352 | `index.html`: link `tel:` in hero / prenota / footer, testo `.booking__proof`, JSON-LD `telephone`, `og:description` e `twitter:description` · `404.html` · `legal/privacy.html` · questo README |
| WhatsApp | `wa.me/393272459352` | `index.html`, 3 occorrenze (hero, listino, prenota) |
| Indirizzo | Via Vittorio Emanuele, 91 — Bra (CN) | `index.html`: `.hero__meta`, sezione "Chi siamo", `address` in "Dove trovarci", `address` nel footer, `meta description`, JSON-LD `address` · `404.html` · `legal/privacy.html` |
| Orari | Mar-Sab 09:00-12:00 / 13:00-20:00; Lun e Dom chiuso | `index.html`: `.hero__meta`, testo sezione "Orari", card giorno per giorno, footer, JSON-LD `openingHoursSpecification` |
| Listino | 11 voci da 5 a 50 euro | `index.html`: sezione "Servizi & prezzi" **e** JSON-LD `hasOfferCatalog` |
| Ragione sociale / P.IVA | AM7 BARBER DI OUALID AHMED · 04075780041 | footer di `index.html`, JSON-LD `legalName` e `vatID`, `legal/privacy.html` |
| Instagram | @am7_barberstudio | sezione social, footer, JSON-LD `sameAs` |
| Dominio | `https://am7barberstudio.it/` | `CNAME`, `robots.txt`, `sitemap.xml`, `canonical`, tutti gli `og:` / `twitter:`, tutti gli `@id` e gli URL nel JSON-LD |

## Come aggiornare i contenuti ricorrenti

- **Prezzi:** sezione `#servizi` in `index.html` **e** blocco `hasOfferCatalog` nel JSON-LD dentro `<head>`. I prezzi variabili ("da 30 euro") usano `priceSpecification.minPrice`.
- **Orari:** sezione `#orari`, `.hero__meta`, footer **e** `openingHoursSpecification` nel JSON-LD.
- **Foto gallery:** sostituire i file in `assets/` mantenendo `width`, `height` e `alt` coerenti con il file reale.
- **Logo e icone:** sostituire `assets/logo-mark.png`, poi rigenerare l'intero set (`assets/icons/`, `favicon.ico`, `assets/social-cover.jpg`) dallo stesso master, mantenendo le proporzioni originali.

## Dati ancora da confermare

- [ ] **CAP 12042** in `address.postalCode` del JSON-LD: è il CAP di Bra ma non compare sul sito. Confermare o rimuovere.
- [ ] **Email di contatto:** non esiste sul sito. Serve per l'informativa privacy e potrebbe essere aggiunta al JSON-LD.
- [ ] **Segnaposto nella sezione "Chi siamo"** di `index.html`: `[ETÀ]`, `[NOME SCUOLA]`, `[CITTÀ]`, `[N]` e `[ANNO]` (3 volte) sono **inventati e visibili in pagina**. Vanno sostituiti con i dati reali del titolare prima della pubblicazione.
- [ ] **Foto del titolare** nella stessa sezione: al momento c'è un placeholder grafico, non un'immagine.
- [ ] **Liberatoria** per le persone ritratte nelle foto dei tagli e nel video.

## Controlli prima della pubblicazione

- [ ] Nessun segnaposto `[...]` residuo in `index.html`.
- [ ] `legal/privacy.html` redatta, `robots` riportato a `index, follow`, pagina aggiunta a `sitemap.xml`.
- [ ] `git status` pulito, nessun file di lavoro o segreto tracciato.
- [ ] Console del browser senza errori, nessun 404 sugli asset, nessun mixed content.
- [ ] Sessione pulita nel pannello Rete: confermare zero richieste a terze parti al caricamento.
- [ ] Larghezze 320 / 375 / 768 / 1024 / 1366: nessun overflow orizzontale.
- [ ] Tastiera: skip link, focus visibile, frecce della gallery, `Escape`; zoom al 200%.
- [ ] `prefers-reduced-motion`: carosello e video non partono da soli.
- [ ] JavaScript disattivato: contenuti e contatti restano leggibili.
- [ ] Icone: favicon, apple-touch e icone del manifest caricano e hanno le dimensioni dichiarate.
- [ ] Anteprima Open Graph verificata su un validatore social.
- [ ] JSON-LD passato al Rich Results Test di Google.
- [ ] `robots.txt` e `sitemap.xml` raggiungibili sul dominio di produzione.
- [ ] `404.html` restituisce davvero status 404 sull'hosting.
- [ ] Telefono, WhatsApp, Instagram e mappa provati da dispositivo reale.
- [ ] Lighthouse / PageSpeed su mobile.
- [ ] Sitemap inviata in Search Console.
- [ ] Approvazione del cliente su dati, contenuti e informativa.
