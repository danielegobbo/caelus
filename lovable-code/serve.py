"""Server locale per la copia del sito.

Le pagine usano percorsi assoluti (/assets/...) e moduli JavaScript, quindi
vanno servite via HTTP dalla radice. Le route senza slash finale (/sobre)
vengono servite direttamente da sobre/index.html, come fa l'hosting originale.

uso: python serve.py [porta]   (predefinita 8080)
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PRIVATE = {'/serve.py', '/avvia.cmd', '/README.md', '/.gitignore', '/.gitattributes'}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        if path in PRIVATE or path.startswith('/.git'):
            self.send_error(404)
            return
        page = os.path.join(ROOT, path.strip('/'), 'index.html')
        if path != '/' and not path.endswith('/') and os.path.isfile(page):
            self.path = path + '/' + self.path[len(path):]
        super().do_GET()

    def send_head(self):
        # niente redirect 301 da /sobre a /sobre/: il router si aspetta /sobre
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            index = os.path.join(path, 'index.html')
            if os.path.isfile(index):
                f = open(index, 'rb')
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(os.fstat(f.fileno()).st_size))
                self.end_headers()
                return f
        return super().send_head()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f'Sito disponibile su http://localhost:{port}  (Ctrl+C per fermare)')
    http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
