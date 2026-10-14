# Caelus — copie del sito "Dentista para Kandengues"

Questo repository raccoglie le copie locali del sito pubblicato su Lovable
<https://kandengues-smile-studio.lovable.app/>, sito di una clinica di
odontopediatria a Vila do Gamek, Luanda (contenuti in portoghese).

Il sito originale è un'app React (TanStack Start, Vite, Tailwind) generata con Lovable.
Il codice sorgente React/TypeScript non è qui: rimane nel progetto Lovable.
Il repository contiene il sito già compilato, così come viene pubblicato.

## Contenuto

| Cartella | Descrizione | Porta locale |
| --- | --- | --- |
| `lovable-code/` | Copia esatta del sito pubblicato: HTML delle 10 pagine, JavaScript e CSS compilati, immagini, favicon, `robots.txt` e `sitemap.xml`, identici byte per byte all'originale. | 8080 |
| `lovable/` | Altra copia del sito, creata con uno strumento diverso, senza gli script di analytics dell'hosting. | 8080 |
| `lovable-codex/` | Altra copia creata con Codex, con l'HTML non modificato. | 8081 |

Le pagine sono: Início, Sobre, Serviços, Médicos, Galeria, Blog, Contacto, FAQ,
Política de Privacidade e Termos e Condições.

## Avvio

Serve Python 3. In una delle cartelle:

```sh
python serve.py      # oppure doppio clic su avvia.cmd
```

Poi apri `http://localhost:8080` (`8081` per `lovable-codex`).

Non aprire `index.html` direttamente dal disco: le pagine usano percorsi assoluti
(`/assets/...`) e moduli JavaScript, che funzionano solo tramite un server HTTP.

`serve.py`, `avvia.cmd`, `README.md` e `mirror-report.json` servono solo in locale.
Per pubblicare il sito su un hosting statico vanno esclusi.

## Cosa è stato fatto

1. **Analisi del sito.** Pagine, struttura e contenuti del sito pubblicato.
   Ogni pagina arriva dal server già renderizzata, poi React la rende interattiva.
2. **Prima ricostruzione statica.** Versione in HTML, CSS e JavaScript vanilla, senza React,
   con lo stesso aspetto e le stesse funzioni (animazioni, contatori, menu mobile, galleria,
   FAQ, banner cookie). Ora si trova fuori da questo repository, in
   `C:\Users\danie\apps\lovable-claude`, e compare nella cronologia git.
3. **Confronto dei contenuti.** Le copie hanno lo stesso testo, le stesse immagini e lo stesso CSS.
   L'unica eccezione sono le risposte della FAQ, che nella copia originale si trovano nel
   JavaScript e non nell'HTML.
4. **Copia esatta in `lovable-code/`.** Crawl ricorsivo del sito, inclusi i moduli JavaScript
   caricati dinamicamente: 10 pagine e 43 asset, scaricati senza alcuna modifica.
   È stato aggiunto `serve.py`, che serve le route senza slash finale (`/sobre`) come
   l'hosting originale.
5. **Verifica.** Il sito è stato servito in locale e aperto in Chrome.
   React si avvia correttamente e le pagine corrispondono a quelle online.
6. **Pubblicazione su GitHub.** Le tre copie sono state riunite in questo repository,
   conservando la cronologia di `lovable-code`.

## Note

- `.gitattributes` è impostato a `* -text`: git non modifica i fine riga,
  così i file restano identici all'originale.
- I nomi dei file in `assets/` contengono un hash (es. `index-DXsFLA3-.js`) e sono richiamati
  dal JavaScript: non vanno rinominati.
- Google Fonts, mappe, WhatsApp e social funzionano solo con una connessione a Internet.
- La newsletter non invia dati: mostra solo un messaggio di conferma, come nell'originale.
- Da verificare con la clinica: le urgenze risultano disponibili "solo la domenica",
  mentre l'orario dichiarato è da lunedì a sabato.
