import { MountainDetailView } from "../views/MountainDetailView";

export class MountainDetailPresenter {
  constructor(view, model, mountainId) {
    this.view = view || new MountainDetailView();
    this.model = model;
    this.mountainId = mountainId;

    this.mountainData = this.model.getMountainById(this.mountainId);

    if (!this.mountainData) {
      this.mountainData = this.model.getAllMountains()[0];
    }
  }

  init() {
    this.view.render(this.mountainData, this);
  }

  getMountainById(id) {
    return this.model.getMountainById(id);
  }

  getAllMountains() {
    return this.model.getAllMountains();
  }

  getNearbyMountains() {
    return this.model.getNearbyMountains(this.mountainId, 4);
  }
}
