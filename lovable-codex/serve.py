from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
os.chdir(Path(__file__).resolve().parent)
print("Sito disponibile su http://localhost:8081", flush=True)
ThreadingHTTPServer(("127.0.0.1", 8081), SimpleHTTPRequestHandler).serve_forever()
