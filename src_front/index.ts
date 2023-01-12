import "./router";
import { state } from "./state";
import * as dotenv from "dotenv";
import { Router } from '@vaadin/router';
import { initRoutes } from "./router";
// Pages
import "./pages/welcome"
import "./pages/createuser"
import "./pages/home"
import "./pages/report"
import "./pages/misdatos"
import "./pages/petsreported"
import "./pages/editPet"

(async () => {
  dotenv.config();
  state.initLocalStorage();
  let root = document.getElementById("root")
  initRoutes(root)
  
})();
