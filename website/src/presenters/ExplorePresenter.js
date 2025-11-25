export class ExplorePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.init();
  }

  init() {
    const mountains = this.model.getAllMountains();
    this.view.render(mountains);
  }
}
