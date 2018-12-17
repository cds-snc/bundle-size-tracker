import express from "express";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { Layout } from "./components/Layout";

const app = express();
const port = parseInt(process.env.PORT, 10) || 4000;

app.use(express.static(path.resolve(__dirname, "../dist")));

app.get("/*", (req, res) => {
  const jsx = <Layout />;
  const reactDom = renderToString(jsx);
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(htmlTemplate(reactDom));
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`Ready on http://localhost:${port}`);
});

function htmlTemplate(reactDom) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React SSR</title>
        </head>

        <body>
            <div id="app">${reactDom}</div>
            <script src="./bundle.js"></script>
        </body>
        </html>
    `;
}
