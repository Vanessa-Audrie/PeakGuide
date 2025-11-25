export class HomeView {
  constructor() {
    this.app = document.getElementById("app");
  }

  render(mountains) {
    this.app.innerHTML = `
      <header>
        <nav-bar></nav-bar>
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
        <section class="mulai-jelajah-section" aria-labelledby="jelajah-heading">
          <h2 id="jelajah-heading">Mulai Jelajahi dari Sini</h2>
          <div class="card-container">
            ${this.renderMountainCards(
              [65, 73, 86, 51]
                .map((id) => mountains.find((mountain) => mountain.id === id))
                .filter((mountain) => mountain)
            )}
          </div>
        </section>
        
        <section class="destinasi-populer-section" aria-labelledby="populer-heading">
          <h2 id="populer-heading">Destinasi Populer</h2>
          <div class="card-container">
            ${this.renderMountainCards(
              [170, 79, 197, 159]
                .map((id) => mountains.find((mountain) => mountain.id === id))
                .filter((mountain) => mountain)
            )}
          </div>
        </section>

        <section class="feature-section">
          <h2>Setiap Puncak Punya Cerita, Setiap Pendaki Punya Tujuan</h2>
          <div class="feature-container">
            <div class="feature-image">
              <img src="${require("../assets/images/lawu.jpg")}" alt="Pendaki di gunung" />
            </div>
            <div class="feature-content">                            
              <p>Semangat petualangan memanggil jiwa untuk menjelajahi ketinggian, seperti rekan pendaki di samping ini. Namun, di balik setiap pendakian hebat, ada perencanaan yang matang.</p>
              <p>Seringkali kita bertanya: Kapan cuaca terbaik untuk mendaki? Apakah gunung ini sesuai dengan kemampuan saya? Berapa lama waktu yang dibutuhkan? Mencari jawaban yang akurat bisa jadi tantangan.</p>
              <p>Berangkat dari kebutuhan itu, Website Gunung Indonesia hadir sebagai panduan informatif bagi setiap pendaki, mulai dari pemula hingga profesional. Melalui informasi lokasi, kondisi cuaca terkini, serta tingkat kesulitan, platform ini membantu kamu merencanakan perjalanan dengan lebih aman dan terukur. Dengan satu langkah kecil di sini, kamu bisa mempersiapkan langkah besar menuju puncak impianmu.</p>
              <div class="feature-icons">
                <div class="feature-icon">
                  <img src="${require("../assets/icon/heavy-rain.png")}" alt="Icon cuaca" />
                </div>
                <div class="feature-icon">
                  <img src="${require("../assets/icon/mountain.png")}" alt="Icon tingkat kesulitan gunung" />
                </div>
                <div class="feature-icon">
                  <img src="${require("../assets/icon/map.png")}" alt="Icon peta dan rute" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer-component></footer-component>
    `;
    this.bindEvents();
  }

  renderMountainCards(mountains) {
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

  setMountainsData(mountains) {
    this.mountainsData = mountains;
    this.originalMountains = mountains;
  }

  setupAutocomplete() {
    const searchInput = document.getElementById("searchInput");
    const suggestionsContainer = document.getElementById("search-suggestions");
    const suggestionsList = document.getElementById("suggestions-list");

    if (!searchInput || !suggestionsContainer || !suggestionsList) return;

    let currentFocus = -1;
    
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      currentFocus = -1;

      if (query.length < 2) {
        this.hideSuggestions();
        if (query.length === 0) this.showDefaultContent();
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
        e.preventDefault();
        if (currentFocus >= 0 && items[currentFocus]) {
          items[currentFocus].click();
        } else {
          const query = searchInput.value.trim();
          if (query.length >= 2) {
            const searchResults = this.getSuggestions(query);
            this.showSearchResults(searchResults);
            this.hideSuggestions();
          } else if (query.length === 0) {
            this.showDefaultContent();
          }
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
    if (!this.mountainsData || !Array.isArray(this.mountainsData)) return [];

    const searchTerm = query.toLowerCase();
    return this.mountainsData
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
    if (searchInput) searchInput.value = "";
  }

  showSearchResults(searchResults) {
    const jelajahSection = document.querySelector(".mulai-jelajah-section");
    const populerSection = document.querySelector(".destinasi-populer-section");
    const featureSection = document.querySelector(".feature-section");

    // Hide default sections
    if (jelajahSection) jelajahSection.style.display = "none";
    if (populerSection) populerSection.style.display = "none";
    if (featureSection) featureSection.style.display = "none";

    const mainElement = document.querySelector("main");

    // Create or update search results section
    let searchSection = document.getElementById("search-results-section");
    if (!searchSection) {
      searchSection = document.createElement("section");
      searchSection.id = "search-results-section";
      searchSection.className = "mulai-jelajah-section";
      mainElement.insertBefore(searchSection, mainElement.firstChild);
    }

    if (searchResults.length > 0) {
      const mountainsForCards = searchResults.map((result) => ({
        id: result.id,
        name: result.name,
        location: result.location,
        altitude: result.altitude,
        mainImage: this.findMountainImage(result.id),
      }));

      searchSection.innerHTML = `
        <h2>Hasil Pencarian</h2>
        <p class="category-count" style="color: #1a1a19; font-size: 1rem; margin: -1rem auto 2rem; max-width: 1200px; opacity: 0.8;">
          ${searchResults.length} gunung ditemukan
        </p>
        <div class="card-container">
          ${this.renderMountainCards(mountainsForCards)}
        </div>
      `;
    } else {
      searchSection.innerHTML = `
        <h2>Hasil Pencarian</h2>
        <p class="category-count" style="color: #1a1a19; font-size: 1rem; margin: -1rem auto 2rem; max-width: 1200px; opacity: 0.8;">
          0 gunung ditemukan
        </p>
        <div style="text-align: center; padding: 40px; color: #666;">
          <p>Tidak ada gunung yang ditemukan untuk pencarian ini.</p>
        </div>
      `;
    }

    searchSection.style.display = "block";
  }

  showDefaultContent() {
    const jelajahSection = document.querySelector(".mulai-jelajah-section");
    const populerSection = document.querySelector(".destinasi-populer-section");
    const featureSection = document.querySelector(".feature-section");
    const searchSection = document.getElementById("search-results-section");

    // Hide search results
    if (searchSection) searchSection.style.display = "none";

    // Show default sections
    if (jelajahSection) jelajahSection.style.display = "block";
    if (populerSection) populerSection.style.display = "block";
    if (featureSection) featureSection.style.display = "block";

    // Restore original content
    if (this.originalMountains) {
      const jelajahContainer = document.querySelector(".mulai-jelajah-section .card-container");
      const populerContainer = document.querySelector(".destinasi-populer-section .card-container");

      if (jelajahContainer) {
        jelajahContainer.innerHTML = this.renderMountainCards(
          [65, 73, 86, 51]
            .map((id) => this.originalMountains.find((mountain) => mountain.id === id))
            .filter((mountain) => mountain)
        );
      }

      if (populerContainer) {
        populerContainer.innerHTML = this.renderMountainCards(
          [170, 79, 197, 159]
            .map((id) => this.originalMountains.find((mountain) => mountain.id === id))
            .filter((mountain) => mountain)
        );
      }
    }
  }

  findMountainImage(mountainId) {
    if (this.originalMountains) {
      const mountain = this.originalMountains.find((m) => m.id === mountainId);
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
