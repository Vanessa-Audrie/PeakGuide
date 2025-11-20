class NavBar extends HTMLElement {
  static get observedAttributes() {
    return ["active-page"];
  }

  constructor() {
    super();

    // Initialize state
    this._isMenuOpen = false;

    // Bind event handlers
    this._onHamburgerClick = this._onHamburgerClick.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);

    // Initial render
    this.render();
  }

  connectedCallback() {
    this._setupEventListeners();

    // Set initial active page
    const hash = window.location.hash || "/";
    this._updateActivePage(hash);

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      this._updateActivePage(window.location.hash);
    });
  }

  disconnectedCallback() {
    document.removeEventListener("click", this._onDocumentClick);
    window.removeEventListener("hashchange", this._updateActivePage);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active-page") {
      this._updateActivePage(newValue);
    }
  }

  render() {
    this.innerHTML = `
      <nav class="navbar" aria-label="Main navigation">
        <div class="navbar-container">
          <a href="/" class="nav-brand">PeakGuide</a>
          <button class="hamburger-menu" aria-label="Toggle menu" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          <div class="nav-menu">
            <ul class="nav-links" role="menubar">
              <li role="none"><a href="/#" role="menuitem" aria-current="page">Beranda</a></li>
              <li role="none"><a href="#jelajah" role="menuitem">Jelajah</a></li>
              <li role="none"><a href="#about" role="menuitem">Tentang</a></li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  _setupEventListeners() {
    const hamburgerBtn = this.querySelector(".hamburger-menu");

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener("click", this._onHamburgerClick);
    }

    document.addEventListener("click", this._onDocumentClick);
  }

  _updateActivePage(page) {
    const links = this.querySelectorAll(".nav-links a");
    links.forEach((link) => {
      if (link.getAttribute("href") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  _onHamburgerClick(e) {
    e.stopPropagation();
    const hamburger = this.querySelector(".hamburger-menu");
    const navMenu = this.querySelector(".nav-menu");
    const navbar = this.querySelector(".navbar");

    this._isMenuOpen = !this._isMenuOpen;
    hamburger.setAttribute("aria-expanded", this._isMenuOpen);

    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    navbar.classList.toggle("menu-active");
  }

  _onDocumentClick(e) {
    if (!this.contains(e.target)) {
      const hamburger = this.querySelector(".hamburger-menu");
      const navMenu = this.querySelector(".nav-menu");
      const navbar = this.querySelector(".navbar");

      if (this._isMenuOpen) {
        this._isMenuOpen = false;
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        navbar.classList.remove("menu-active");
      }
    }
  }
}

customElements.define("nav-bar", NavBar);
