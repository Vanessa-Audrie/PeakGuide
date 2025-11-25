export class HomePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.init();
  }

  init() {
    const mountains = this.model.getAllMountains();
    this.view.setMountainsData(mountains);
    this.view.render(mountains);
  }
}
