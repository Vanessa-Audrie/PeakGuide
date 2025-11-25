import VisualCrossingService from "../utils/VisualCrossingService.js";

export class MountainDetailView {
  constructor() {
    this.app = document.getElementById("app");
    this.weatherData = null;
  }

  render(mountain, presenter = null) {
    this.currentMountain = mountain;
    this.presenter = presenter;

    // Initialize weather data loading
    this.loadWeatherData();

    this.app.innerHTML = `
      <header>
        <nav-bar></nav-bar>
      </header>      
      <main class="mountain-detail">
        <section class="mountain-tabs">
          <div class="tabs-container">
            <a href="#section-ikhtisar" class="tab active" data-section="section-ikhtisar">Ikhtisar</a>
            <a href="#section-cuaca" class="tab" data-section="section-cuaca">Cuaca</a>
            <a href="#section-jalur" class="tab" data-section="section-jalur">Jalur</a>
            <a href="#section-area-sekitar" class="tab" data-section="section-area-sekitar">Area Sekitar</a>
          </div>
        </section>

        <div id="section-ikhtisar" class="section-container">
          ${this.renderIkhtisarTab(mountain)}
        </div>
        <div id="section-cuaca" class="section-container">
          ${this.renderCuacaTab(mountain)}
        </div>
        <div id="section-jalur" class="section-container">
          ${this.renderJalurTab(mountain)}
        </div>
        <div id="section-area-sekitar" class="section-container">
          ${this.renderAreaSekitarTab(mountain)}
        </div>
      </main>

      <footer-component></footer-component>
    `;

    this.setupNavbarBehavior();
    this.bindEvents();
  }

  setupNavbarBehavior() {
    setTimeout(() => {
      const navBar = document.querySelector("nav-bar");
      const mountainTabs = document.querySelector(".mountain-tabs");

      if (navBar) {
        navBar.style.setProperty("--navbar-position", "static");
      }

      if (mountainTabs) {
        mountainTabs.style.position = "sticky";
        mountainTabs.style.top = "0";
        mountainTabs.style.zIndex = "999";
        mountainTabs.style.backgroundColor = "white";
      }
    }, 100);
  }

  renderIkhtisarTab(mountain) {
    return `
      <section class="mountain-header">
        <h1>${mountain.name}</h1>
        <p class="mountain-info">${mountain.location}</p>
        <div class="mountain-content-container">
          <div class="mountain-image-wrapper">
            <section class="mountain-gallery">
              <div class="main-image">
                <img src="${
                  mountain.mainImage && mountain.mainImage.startsWith("http")
                    ? mountain.mainImage
                    : require("../assets/images/" + mountain.mainImage)
                }" 
                  alt="${mountain.name}" 
                  class="main-photo" 
                  onerror="this.src='${require("../assets/images/bromo.jpg")}'" />
              </div>
            </section>
          </div>

          <section class="mountain-details">
            <div class="mountain-description">
              <h3>${mountain.name} - ${mountain.altitude} mdpl</h3>
              <p>${mountain.description}</p>
            </div>
          </section>
        </div>
      </section>
    `;
  }

  async loadWeatherData() {
    try {
      const kecamatanName = this.currentMountain.kecamatan;

      if (!kecamatanName) {
        throw new Error("Could not determine location for weather data");
      }

      const weatherResult = await VisualCrossingService.getDailyForecast(
        kecamatanName,
        7
      );

      if (!weatherResult.success || weatherResult.days.length === 0) {
        throw new Error(
          `Failed to load weather data: ${weatherResult.error || "No data available"}`
        );
      }

      this.weatherData = VisualCrossingService.formatWeatherForCards(
        weatherResult.days
      );

      this.updateWeatherDisplay();
    } catch (error) {
      this.showWeatherError(error.message);
    }
  }

  updateWeatherDisplay() {
    const weatherForecastContainer = document.querySelector(".weather-forecast");
    if (weatherForecastContainer && this.weatherData) {
      const today = new Date();
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

      const weatherCardsHTML = this.weatherData
        .map((data, index) => {
          const currentDate = new Date(today);
          currentDate.setDate(today.getDate() + index);
          const dayName = dayNames[currentDate.getDay()];
          const dateNumber = currentDate.getDate();
          const monthName = monthNames[currentDate.getMonth()];
          const year = currentDate.getFullYear();

          return `
            <div class="forecast-card" data-weather="${data.weather}" data-day="${dayName}" data-index="${index}">
              <div class="forecast-day">${dayName}</div>
              <div class="forecast-date">${dateNumber} ${monthName} ${year}</div>
              <div class="forecast-icon">
                <i class="bi ${data.icon}"></i>
              </div>
              <div class="forecast-temp">${data.temp}</div>
              <div class="forecast-desc">${data.desc}</div>
              <div class="forecast-details">
                <div class="forecast-wind"><i class="bi bi-wind"></i> ${data.wind}</div>
                <div class="forecast-precip"><i class="bi bi-cloud-rain-heavy"></i> ${data.precip}</div>
                <div class="forecast-humid"><i class="bi bi-droplet"></i> ${data.humid}</div>
              </div>
            </div>
          `;
        })
        .join("");

      weatherForecastContainer.innerHTML = weatherCardsHTML;
    }
  }

  renderCuacaTab(mountain) {
    return `
      <section class="cuaca-section">
        <div class="cuaca-container">
          <h2>CUACA</h2>
          <p class="weather-instruction">Data cuaca real-time untuk 7 hari ke depan</p>

          <div class="weather-forecast">
            <div class="weather-loading-state">
              <div class="loading-spinner">🌤️</div>
              <h3>Memuat Data Cuaca Real-time</h3>
              <p>Mengambil data cuaca dari Visual Crossing API...</p>
              <div class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderJalurTab(mountain) {
    return `
      <section class="jalur-section">
        <div class="jalur-container">
          <h2>JALUR PENDAKIAN</h2>
          <div class="jalur-info-card">
            <div class="jalur-status">
              <div class="status-header">
                <i class="bi bi-sign-turn-right"></i>
                <h3>Status Jalur</h3>
              </div>
              <span class="status open">${mountain.access || "Tidak Tersedia"}</span>
            </div>

            <div class="jalur-main-info">
              <div class="jalur-detail-item">
                <div class="detail-icon">
                  <i class="bi bi-signpost-split"></i>
                </div>
                <div class="detail-info">
                  <h4>Jarak Tempuh</h4>
                  <p>${mountain.distance || "N/A"} km</p>
                </div>
              </div>
              
              <div class="jalur-detail-item">
                <div class="detail-icon">
                  <i class="bi bi-graph-up"></i>
                </div>
                <div class="detail-info">
                  <h4>Kenaikan Elevasi</h4>
                  <p>${mountain.elevationGain || "N/A"} m</p>
                </div>
              </div>

              <div class="jalur-detail-item">
                <div class="detail-icon">
                  <i class="bi bi-clock"></i>
                </div>
                <div class="detail-info">
                  <h4>Estimasi Waktu</h4>
                  <p>${mountain.estimatedTime || "-"}</p>
                </div>
              </div>

              <div class="jalur-detail-item">
                <div class="detail-icon">
                  <i class="bi bi-bar-chart"></i>
                </div>
                <div class="detail-info">
                  <h4>Tingkat Kesulitan</h4>
                  <div class="difficulty-display">
                    <span class="difficulty-score" style="color: ${mountain.getDifficultyColor(mountain.difficulty)}">${mountain.difficulty}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="jalur-notes">
            <div class="note-header">
              <i class="bi bi-info-circle"></i>
              <h3>Catatan Penting</h3>
            </div>
            <ul class="note-list">
              <li>Pendakian harus mendaftar di pos basecamp</li>
              <li>Wajib membawa kartu identitas</li>
              <li>Bawa perlengkapan pendakian yang memadai</li>
              <li>Saat musim hujan, perhatikan peringatan cuaca</li>
              <li>Dilarang membawa alkohol dan meninggalkan sampah</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  renderAreaSekitarTab(mountain) {
    const nearbyMountains = this.presenter
      ? this.presenter.getNearbyMountains()
      : [];

    return `
      <section class="area-sekitar-section">
        <div class="area-sekitar-container">
          <h2>AREA SEKITAR</h2>
          <p class="area-description">Jelajahi gunung-gunung lain di sekitar ${mountain.name} yang mungkin menarik untuk Anda kunjungi.</p>
          
          <div class="nearby-mountains">
            <h3>Gunung Terdekat</h3>
            <div class="card-container">
              ${this.renderMountainCards(nearbyMountains)}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderMountainCards(mountains) {
    if (!mountains || mountains.length === 0) {
      return `<p class="no-mountains">Belum ada data gunung terdekat yang tersedia.</p>`;
    }

    return mountains
      .map((mountain) => {
        const distanceText = mountain.distance
          ? `<p class="distance">~${mountain.distance.toFixed(0)} km dari sini</p>`
          : "";
        return `            
          <article class="card" data-id="${mountain.id}">
            <a href="#/mountain/${mountain.id}" class="card-link">
              <img src="${
                mountain.mainImage && mountain.mainImage.startsWith("http")
                  ? mountain.mainImage
                  : require("../assets/images/" + mountain.mainImage)
              }" 
                alt="Pemandangan Gunung ${mountain.name}" 
                onerror="this.src='${require("../assets/images/bromo.jpg")}'" />
              <div class="card-content">
                <h3>${mountain.name}</h3>
                <p>${mountain.location}</p>
                <p class="altitude">${mountain.altitude} mdpl</p>
                ${distanceText}
              </div>
            </a>
          </article>
        `;
      })
      .join("");
  }

  bindEvents() {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = tab.getAttribute("data-section");

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          const tabsHeight = document.querySelector(".mountain-tabs")?.offsetHeight || 0;

          let navbarHeight = 0;
          try {
            const navbarElement = document.querySelector("nav-bar");
            if (navbarElement && navbarElement.shadowRoot) {
              const navbarInner = navbarElement.shadowRoot.querySelector(".navbar");
              navbarHeight = navbarInner?.offsetHeight || 70;
            } else {
              navbarHeight = 70;
            }
          } catch (error) {
            navbarHeight = 70;
          }

          const offset = tabsHeight + navbarHeight;

          window.scrollTo({
            top: targetSection.offsetTop - offset,
            behavior: "smooth",
          });
        }
      });
    });

    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY + 200;
      const sections = document.querySelectorAll(".section-container");

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const sectionId = section.getAttribute("id");

          tabs.forEach((tab) => {
            if (tab.getAttribute("data-section") === sectionId) {
              tabs.forEach((t) => t.classList.remove("active"));
              tab.classList.add("active");
            }
          });
        }
      });
    });

    this.setupMountainCardClickHandlers();
  }

  setCurrentMountain(mountain) {
    this.currentMountain = mountain;
  }

  setupMountainCardClickHandlers() {
    const mountainCards = document.querySelectorAll(".card[data-id]");

    mountainCards.forEach((card) => {
      const cardLink = card.querySelector(".card-link");

      if (cardLink) {
        cardLink.addEventListener("click", () => {
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }, 100);
        });
      }
    });
  }

  showWeatherError(errorMessage) {
    const weatherForecastContainer = document.querySelector(".weather-forecast");
    if (weatherForecastContainer) {
      weatherForecastContainer.innerHTML = `
        <div class="weather-api-error">
          <div class="error-icon">⚠️</div>
          <h3>Gagal Memuat Data Cuaca</h3>
          <p>Tidak dapat mengambil data cuaca dari Visual Crossing API.</p>
          <p class="error-detail">Error: ${errorMessage}</p>
          <p class="error-suggestion">Pastikan koneksi internet stabil dan coba refresh halaman.</p>
          <button class="retry-weather-btn" onclick="location.reload()">Coba Lagi</button>
        </div>
      `;
    }
  }
}
