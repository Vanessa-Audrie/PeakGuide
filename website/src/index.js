import "./components/navbar-component.js";
import "./components/footer-component.js";
import "./assets/styles/styles.css";
import "./assets/styles/mountain-detail.css";
import "./assets/styles/about-page.css";
import "./assets/styles/main.css";
import { HomeView } from "./views/HomeView";
import { AboutView } from "./views/AboutView";
import { ExploreView } from "./views/ExploreView";
import { MapView } from "./views/MapView"; 
import { MountainModel } from "./models/MountainModel";
import { HomePresenter } from "./presenters/HomePresenter";
import { AboutPresenter } from "./presenters/AboutPresenter";
import { MountainDetailPresenter } from "./presenters/MountainDetailPresenter";
import { MountainDetailView } from "./views/MountainDetailView";
import { ExplorePresenter } from "./presenters/ExplorePresenter";
import { MapPresenter } from "./presenters/MapPresenter"; 
import pageTransition from "./utils/PageTransition.js";

document.addEventListener("DOMContentLoaded", () => {
  const model = new MountainModel();

  async function handleRoute() {
    const hash = window.location.hash;

    await pageTransition.transition(() => {
      if (hash.startsWith("#/mountain/")) {
        const mountainId = hash.split("/")[2];
        const mountainDetailView = new MountainDetailView();
        const mountainDetailPresenter = new MountainDetailPresenter(
          mountainDetailView,
          model,
          mountainId
        );
        mountainDetailPresenter.init();
      } else if (hash === "#about") {
        const aboutView = new AboutView();
        new AboutPresenter(aboutView, model);
      } else if (hash === "#jelajah") {
        const exploreView = new ExploreView();
        new ExplorePresenter(exploreView, model);
      } else if (hash === "#peta") {
        const mapView = new MapView();
        new MapPresenter(mapView, model);
      } else {
        const homeView = new HomeView();
        new HomePresenter(homeView, model);
      }
    });
  }

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
});
