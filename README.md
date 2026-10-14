# Dentista para Kandengues — sito statico

Ricostruzione locale del sito <https://kandengues-smile-studio.lovable.app/>
(clinica di odontopediatria a Luanda), convertito da app React/Lovable in un sito
statico HTML + CSS + JavaScript vanilla. Non serve nessun build né Node.js.

## Avvio

Apri `index.html` direttamente nel browser, oppure servi la cartella con un server statico:

```sh
python -m http.server 8000
# poi apri http://localhost:8000
```

## Struttura

```
index.html          Home
sobre.html          Sobre nós
servicos.html       Serviços
medicos.html        Médicos
galeria.html        Galeria (con lightbox)
blog.html           Blog
contacto.html       Contacto
faq.html            FAQ (accordion)
privacidade.html    Política de Privacidade
termos.html         Termos e Condições
favicon.png
assets/
  css/styles.css    CSS Tailwind compilato dell'originale (non modificare a mano)
  css/site.css      Stili aggiuntivi: lightbox, toast, reduced-motion
  js/main.js        Interattività (sostituisce React)
  img/              Immagini
```

## Cosa fa `main.js`

- animazioni di comparsa allo scroll (`[data-reveal]`) e contatori animati (`[data-count]`)
- header compatto dopo lo scroll, menu mobile, pulsante "torna su"
- banner cookie (memorizzato in `localStorage` con la chiave `dpk-cookies`)
- lightbox della galleria, accordion della FAQ, newsletter con messaggio di conferma

## Note

- `styles.css` contiene solo le classi Tailwind usate dall'originale. Se aggiungi
  classi Tailwind nuove all'HTML, non avranno effetto: scrivi il CSS in `site.css`.
- La newsletter non invia dati da nessuna parte (come nell'originale): mostra solo la conferma.
- Contenuti da verificare con la clinica: le urgenze sono indicate "solo la domenica",
  mentre l'orario dichiarato è lunedì–sabato.
