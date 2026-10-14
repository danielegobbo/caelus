# Dentista para Kandengues — copia locale

Copia dei file pubblici di https://kandengues-smile-studio.lovable.app/.
Include HTML delle dieci pagine, CSS, JavaScript compilato, immagini e favicon.

## Avvio

Eseguire `avvia.cmd` oppure `python serve.py`, poi aprire http://localhost:8080.
È necessario Python 3. Non aprire direttamente index.html: i moduli richiedono HTTP.

## Hosting

Caricare il contenuto di questa cartella su un hosting statico, escludendo
serve.py, avvia.cmd, README.md e mirror-report.json. Le pagine hanno il proprio
index.html nelle sottocartelle. Le risorse usano percorsi assoluti dalla radice.

## Limiti

Questa è una copia del sito pubblicato, con JavaScript compilato; non è il
progetto sorgente React/TypeScript di Lovable. Per modificarne agevolmente i
componenti serve l'esportazione del progetto originale.
Google Fonts, mappe e collegamenti esterni richiedono Internet. Non vengono
copiati servizi privati o database. I collegamenti WhatsApp, email e social
mantengono le destinazioni originali. Rimossa la telemetria specifica dell'hosting.
