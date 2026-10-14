@echo off
cd /d "%~dp0"
echo Apri http://127.0.0.1:8080 nel browser.
echo Mantieni questa finestra aperta mentre usi il sito.
"C:\Users\danie\AppData\Local\Programs\Python\Python313\python.exe" "%~dp0serve.py"
pause
