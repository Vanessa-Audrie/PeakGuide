export class AboutPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;

    // Set up event handlers
    this.view.setSearchHandler(this.handleSearch.bind(this));
    this.view.setLoginHandler(this.handleLogin.bind(this));
    this.view.setRegisterHandler(this.handleRegister.bind(this));

    // Initial render
    this.init();
  }

  handleLogin() {
    window.location.hash = "#login";
  }

  handleRegister() {
    window.location.hash = "#register";
  }

  init() {
    const mountains = this.model.getAllMountains();
    this.view.render(mountains);
  }

  handleSearch(query) {
    const results = this.model.searchMountains(query);
    this.view.updateSearchResults(results);
  }
}
