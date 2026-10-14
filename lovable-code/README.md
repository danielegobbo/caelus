# Dentista para Kandengues — copia esatta

Copia esatta del sito pubblicato <https://kandengues-smile-studio.lovable.app/>:
HTML delle 10 pagine, JavaScript e CSS compilati, immagini, favicon, `robots.txt`
e `sitemap.xml`, scaricati senza modifiche (stessi nomi e stessi byte).

## Avvio

Fai doppio clic su `avvia.cmd`, oppure esegui:

```sh
python serve.py        # poi apri http://localhost:8080
```

Serve Python 3. Non aprire `index.html` direttamente dal disco: le pagine usano
percorsi assoluti (`/assets/...`) e moduli JavaScript, che funzionano solo via HTTP.

## Note

- Sono file compilati, non il progetto sorgente React/TypeScript di Lovable:
  per modificarli comodamente serve l'export del progetto da Lovable.
- Le pagine includono gli script di analytics dell'hosting Lovable (`/~flock.js`,
  `/__l5e/...`): in locale non trovano il servizio e vengono ignorati.
- Google Fonts, mappe, WhatsApp e social richiedono Internet.
- `serve.py`, `avvia.cmd` e questo README non fanno parte del sito.
