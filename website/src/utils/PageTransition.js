export class PageTransition {
  constructor() {
    this.app = document.getElementById("app");
    this.isTransitioning = false;
  }

  async transition(renderCallback, duration = 300) {
    if (this.isTransitioning) {
      renderCallback();
      return;
    }

    this.isTransitioning = true;

    try {
      this.app.style.opacity = "0";
      this.app.style.transition = `opacity ${duration}ms ease-in-out`;

      await new Promise((resolve) => setTimeout(resolve, duration));

      renderCallback();

      await new Promise((resolve) => setTimeout(resolve, 50));
      this.app.style.opacity = "1";

      await new Promise((resolve) => setTimeout(resolve, duration));
    } catch (error) {
      console.error("Page transition error:", error);
      renderCallback();
    } finally {
      this.app.style.transition = "";
      this.isTransitioning = false;
    }
  }

  immediate(renderCallback) {
    renderCallback();
  }
}

export default new PageTransition();
