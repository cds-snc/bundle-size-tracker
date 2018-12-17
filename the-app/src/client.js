import React from "react";
import ReactDOM from "react-dom";
import { Layout } from "./components/Layout";
const app = document.getElementById("app");

let over9000 = require('over-9k')
over9000(9001) // true

//ReactDOM.hydrate(<Layout />, app);
ReactDOM.render(<Layout />, app);
