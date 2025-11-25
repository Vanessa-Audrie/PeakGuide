export class ExploreView {
  constructor() {
    this.app = document.getElementById("app");
  }

  render(mountains) {
    this.allMountains = mountains;

    const highMountains = mountains.filter(m => m.altitude > 3000);
    const mediumMountains = mountains.filter(m => m.altitude >= 2000 && m.altitude <= 3000);
    const lowMountains = mountains.filter(m => m.altitude < 2000);

    this.app.innerHTML = `
      <header>
        <nav-bar active-page="#jelajah"></nav-bar>
      </header>

      <section class="hero" style="background-image: url('${require("../assets/images/cartenz.jpg")}')" aria-label="Hero section">
        <div class="hero-content">
          <h1>JELAJAHI GUNUNG DI INDONESIA</h1>
          <div class="search-wrapper">
            <form class="search-container" role="search" aria-label="Pencarian gunung">
              <input type="search" placeholder="Cari gunung di Indonesia" id="searchInput" aria-label="Cari gunung di Indonesia" autocomplete="off"/>
              <button type="submit" class="search-btn" aria-label="Tombol cari">
                <img src="${require("../assets/icon/search-icon.svg")}" alt="Icon pencarian"/>
              </button>
            </form>
            <div id="search-suggestions" class="search-suggestions" style="display: none;">
              <ul id="suggestions-list" class="suggestions-list"></ul>
            </div>
          </div>
        </div>
      </section>

      <main>
        <!-- High Mountains (>3000 mdpl) -->
        <section class="mountains-category-section" id="high-mountains-section" aria-labelledby="high-mountains-heading">
          <div class="category-header">
            <h2 id="high-mountains-heading">Gunung Tinggi (>3000 mdpl)</h2>
            <p class="category-count">${highMountains.length} gunung tersedia</p>
          </div>
          <div class="card-container" id="high-mountains-container">
            ${this.renderMountainCards(highMountains)}
          </div>
        </section>

        <!-- Medium Mountains (2000-3000 mdpl) -->
        <section class="mountains-category-section" id="medium-mountains-section" aria-labelledby="medium-mountains-heading">
          <div class="category-header">
            <h2 id="medium-mountains-heading">Gunung Menengah (2000-3000 mdpl)</h2>
            <p class="category-count">${mediumMountains.length} gunung tersedia</p>
          </div>
          <div class="card-container" id="medium-mountains-container">
            ${this.renderMountainCards(mediumMountains)}
          </div>
        </section>

        <!-- Low Mountains (<2000 mdpl) -->
        <section class="mountains-category-section" id="low-mountains-section" aria-labelledby="low-mountains-heading">
          <div class="category-header">
            <h2 id="low-mountains-heading">Gunung Rendah (<2000 mdpl)</h2>
            <p class="category-count">${lowMountains.length} gunung tersedia</p>
          </div>
          <div class="card-container" id="low-mountains-container">
            ${this.renderMountainCards(lowMountains)}
          </div>
        </section>
      </main>

      <footer-component></footer-component>
    `;
    
    this.bindEvents();
  }

  renderMountainCards(mountains) {
    if (!mountains || mountains.length === 0) {
      return `
        <div class="no-mountains-message">
          <p>Tidak ada gunung dalam kategori ini.</p>
        </div>
      `;
    }

    return mountains
      .map((mountain) => {
        const imageUrl =
          mountain.mainImage && mountain.mainImage.startsWith("http")
            ? mountain.mainImage
            : require("../assets/images/" + mountain.mainImage);

        return `            
          <article class="card" data-id="${mountain.id}">
            <a href="#/mountain/${mountain.id}" class="card-link">
              <img src="${imageUrl}" alt="Pemandangan Gunung ${mountain.name}" 
                  onerror="this.src='${require("../assets/images/bromo.jpg")}'" />
              <div class="card-content">
                <h3>${mountain.name}</h3>
                <p>${mountain.location}</p>
                <p class="altitude">${mountain.altitude} mdpl</p>
              </div>
            </a>
          </article>
        `;
      })
      .join("");
  }

  bindEvents() {
    const searchForm = document.querySelector(".search-container");
    const searchInput = document.getElementById("searchInput");
    
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (query.length >= 2) {
          const searchResults = this.getSuggestions(query);
          this.showSearchResults(searchResults);
          this.hideSuggestions();
        } else {
          this.showDefaultContent();
        }
      });
    }
    
    setTimeout(() => {
      this.setupAutocomplete();
      this.setupCardNavigation();
    }, 100);
  }

  setupAutocomplete() {
    const searchInput = document.getElementById("searchInput");
    const suggestionsContainer = document.getElementById("search-suggestions");
    const suggestionsList = document.getElementById("suggestions-list");

    if (!searchInput || !suggestionsContainer || !suggestionsList) {
      return;
    }

    let currentFocus = -1;
    
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      currentFocus = -1;

      if (query.length < 2) {
        this.hideSuggestions();
        if (query.length === 0) {
          this.showDefaultContent();
        }
        return;
      }

      const suggestions = this.getSuggestions(query);
      this.showSuggestions(suggestions);
    });

    searchInput.addEventListener("focus", (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        const suggestions = this.getSuggestions(query);
        this.showSuggestions(suggestions);
      }
    });

    searchInput.addEventListener("blur", () => {
      setTimeout(() => this.hideSuggestions(), 150);
    });

    searchInput.addEventListener("keydown", (e) => {
      const items = suggestionsList.querySelectorAll("li");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentFocus = Math.min(currentFocus + 1, items.length - 1);
        this.setActiveSuggestion(currentFocus);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentFocus = Math.max(currentFocus - 1, -1);
        this.setActiveSuggestion(currentFocus);
      } else if (e.key === "Enter") {
        const query = searchInput.value.trim();
        
        if (currentFocus >= 0 && items[currentFocus]) {
          e.preventDefault();
          items[currentFocus].click();
        } 

        else if (query.length >= 2) {
          e.preventDefault();
          const searchResults = this.getSuggestions(query);
          this.showSearchResults(searchResults);
          this.hideSuggestions();
        }

        else if (query.length === 0) {
          e.preventDefault();
          this.showDefaultContent();
        }
      } else if (e.key === "Escape") {
        this.hideSuggestions();
        searchInput.blur();
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        this.hideSuggestions();
      }
    });
  }


  getSuggestions(query) {
    if (!this.allMountains || !Array.isArray(this.allMountains)) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    return this.allMountains
      .filter(
        (mountain) =>
          (mountain.name && mountain.name.toLowerCase().includes(searchTerm)) ||
          (mountain.location && mountain.location.toLowerCase().includes(searchTerm))
      )
      .slice(0, 8)
      .map((mountain) => ({
        id: mountain.id,
        name: mountain.name || "Nama tidak tersedia",
        location: mountain.location || "Lokasi tidak tersedia",
        altitude: mountain.altitude || "N/A",
      }));
  }

  showSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById("search-suggestions");
    const suggestionsList = document.getElementById("suggestions-list");

    if (!suggestions || suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    suggestionsList.innerHTML = suggestions
      .map(
        (suggestion) => `
      <li class="suggestion-item" data-mountain-id="${suggestion.id}">
        <div class="suggestion-icon">
          <i class="bi bi-geo-alt"></i>
        </div>
        <div class="suggestion-content">
          <div class="suggestion-name">${this.highlightMatch(
            suggestion.name,
            document.getElementById("searchInput").value
          )}</div>
          <div class="suggestion-details">${suggestion.location} • ${suggestion.altitude} mdpl</div>
        </div>
      </li>
    `
      )
      .join("");

    suggestionsList.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const mountainId = item.getAttribute("data-mountain-id");
        this.navigateToMountain(mountainId);
      });
    });

    suggestionsContainer.style.display = "block";
  }

  hideSuggestions() {
    const suggestionsContainer = document.getElementById("search-suggestions");
    if (suggestionsContainer) {
      suggestionsContainer.style.display = "none";
    }
  }

  setActiveSuggestion(index) {
    const items = document.querySelectorAll(".suggestion-item");
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
  }

  highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(regex, "<strong>$1</strong>");
  }

  navigateToMountain(mountainId) {
    window.location.hash = `#/mountain/${mountainId}`;
    this.hideSuggestions();

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
    }
  }

  showSearchResults(searchResults) {
    const sections = document.querySelectorAll(".mountains-category-section");
    sections.forEach(section => section.style.display = "none");

    const mainElement = document.querySelector("main");
    
    if (searchResults.length > 0) {
      mainElement.innerHTML = `
        <section class="mountains-category-section" style="display: block;">
          <div class="category-header">
            <h2>Hasil Pencarian</h2>
            <p class="category-count">${searchResults.length} gunung ditemukan</p>
          </div>
          <div class="card-container">
            ${this.renderMountainCards(searchResults.map(result => ({
              id: result.id,
              name: result.name,
              location: result.location,
              altitude: result.altitude,
              mainImage: this.findMountainImage(result.id),
            })))}
          </div>
        </section>
      `;
    } else {
      mainElement.innerHTML = `
        <section class="mountains-category-section" style="display: block;">
          <div class="no-mountains-message" style="padding: 4rem 2rem;">
            <p>Tidak ada gunung yang ditemukan untuk pencarian ini.</p>
          </div>
        </section>
      `;
    }
  }

  showDefaultContent() {
    if (this.allMountains) {
      const highMountains = this.allMountains.filter(m => m.altitude > 3000);
      const mediumMountains = this.allMountains.filter(m => m.altitude >= 2000 && m.altitude <= 3000);
      const lowMountains = this.allMountains.filter(m => m.altitude < 2000);

      const mainElement = document.querySelector("main");
      mainElement.innerHTML = `
        <section class="mountains-category-section" id="high-mountains-section">
          <div class="category-header">
            <h2>Gunung Tinggi (>3000 mdpl)</h2>
            <p class="category-count">${highMountains.length} gunung tersedia</p>
          </div>
          <div class="card-container">
            ${this.renderMountainCards(highMountains)}
          </div>
        </section>

        <section class="mountains-category-section" id="medium-mountains-section">
          <div class="category-header">
            <h2>Gunung Menengah (2000-3000 mdpl)</h2>
            <p class="category-count">${mediumMountains.length} gunung tersedia</p>
          </div>
          <div class="card-container">
            ${this.renderMountainCards(mediumMountains)}
          </div>
        </section>

        <section class="mountains-category-section" id="low-mountains-section">
          <div class="category-header">
            <h2>Gunung Rendah (<2000 mdpl)</h2>
            <p class="category-count">${lowMountains.length} gunung tersedia</p>
          </div>
          <div class="card-container">
            ${this.renderMountainCards(lowMountains)}
          </div>
        </section>
      `;
    }
  }

  findMountainImage(mountainId) {
    if (this.allMountains) {
      const mountain = this.allMountains.find((m) => m.id === mountainId);
      return mountain ? mountain.mainImage : "bromo.jpg";
    }
    return "bromo.jpg";
  }

  setupCardNavigation() {
    document.addEventListener("click", (e) => {
      const cardLink = e.target.closest(".card-link");
      if (cardLink) {
        e.preventDefault();
        window.location.hash = cardLink.getAttribute("href");
      }
    });
  }
}
