@echo off
start "" /b cmd /c "timeout /nobreak 5 > nul & start "" http://127.0.0.1:3000"
@echo on
npm start