# Known problems

- Warnungen in der Datei `scripts/main.js`
  - `check-html`
    - Ich habe noch keinen Weg gefunden ohne die `document.createElement` Methode ein DOM-Element zu erstellen.
    - Würde man auf die Properties innerHTML zugreifen, besteht das Risiko einer XSS-Schwachstelle.
  - `use-action-map`
    - Diese Warnung hindert mich daran normale Switch-Statements zu verwenden.
    - Ich verstehe den Grund für diese Regel nicht, deshalb ignoriere ich sie
  - `no-while`
    - Diese Warnung hindert mich daran normale While-Statements zu verwenden.
    - Ich verstehe den Grund für diese Regel nicht, deshalb ignoriere ich sie
