import { Router, Route } from "@solidjs/router";
import { Layout } from "./Layout";
import { TopPage } from "./pages/TopPage";
import { CatalogPage } from "./pages/CatalogPage";
import { ApiPage } from "./pages/ApiPage";
import "./soluid-all.css";
import "./catalog.css";

export function App() {
  return (
    <Router base="/soluid" root={Layout}>
      <Route path="/" component={TopPage} />
      <Route path="/catalog" component={CatalogPage} />
      <Route path="/api" component={ApiPage} />
    </Router>
  );
}
