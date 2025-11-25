import gunungData from "../assets/data/gunung_indonesia.json";
import cartenzImg from "../assets/images/cartenz.jpg";

export class MapView {
  constructor() {
    this.app = document.getElementById("app");
  }

  render() {
    this.app.innerHTML = `
      <header>
        <nav-bar active-page="#map"></nav-bar>
      </header>
      <main class="map-page-full-container" style="position:relative;">
        <div class="side-panel-container">
          <div id="gunung-highlight-card" class="gunung-highlight-card"></div>
          <div class="search-panel">
            <div class="search-bar">
              <span class="search-icon">
                <i class="bi bi-search"></i>
              </span>
              <input id="search-gunung" type="text" placeholder="Telusuri Gunung Indonesia" autocomplete="off" />
              <button id="search-exit-btn" class="search-exit-btn" type="button" title="Tutup Pencarian" style="display:none;">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <ul id="search-result-list" class="search-result-list"></ul>
          </div>
        </div>
        <div id="map"></div>
        <div id="gunung-highlight-card-mobile" class="gunung-highlight-card-mobile"></div>
      </main>
      <footer-component></footer-component>
    `;
    this.initMap();
  }

  initMap() {
    if (typeof L === "undefined" || typeof L.MarkerClusterGroup === "undefined") {
      return;
    }

    const map = L.map("map", {
      scrollWheelZoom: true,
      wheelPxPerZoomLevel: 120,
      zoomAnimation: true,
      zoomDelta: 0.25,
      zoomSnap: 0,
      zoomControl: false,
    }).setView([-2.5, 118], 5);

    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        updateWhenZooming: true,
        updateInterval: 100,
      }
    ).addTo(map);

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" }
    );

    const customControl = L.control({ position: "topright" });
    customControl.onAdd = function () {
      const div = L.DomUtil.create("div", "custom-map-controls");
      div.innerHTML = `
        <button class="ctrl-btn" id="layer-btn" title="Ganti Layer">
          <svg width="24" height="24"><rect x="4" y="6" width="16" height="3" rx="1.5" fill="none" stroke="#222" stroke-width="2"/><rect x="4" y="11" width="16" height="3" rx="1.5" fill="none" stroke="#222" stroke-width="2"/><rect x="4" y="16" width="16" height="3" rx="1.5" fill="none" stroke="#222" stroke-width="2"/></svg>
        </button>
        <div id="layer-dropdown" class="layer-dropdown">
          <button class="layer-option" data-layer="osm">OpenStreetMap</button>
          <button class="layer-option" data-layer="satellite">Satelit</button>
        </div>
        <button class="ctrl-btn" id="zoom-in-btn" title="Zoom In">+</button>
        <button class="ctrl-btn" id="zoom-out-btn" title="Zoom Out">-</button>
        <button class="ctrl-btn" id="locate-btn" title="Lokasi Saya">
          <svg width="24" height="24"><circle cx="12" cy="12" r="10" stroke="#222" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" fill="none" stroke="#222" stroke-width="2"/></svg>
        </button>
        <button class="ctrl-btn" id="north-btn" title="Arah Utara">
          <svg width="24" height="24"><polygon points="12,4 16,20 12,16 8,20" fill="none" stroke="#222" stroke-width="2"/><polygon points="12,4 13,8 11,8" fill="#f44336"/></svg>
        </button>
      `;
      return div;
    };
    customControl.addTo(map);

    document.getElementById("layer-btn").onclick = function () {
      if (map.hasLayer(osm)) {
        map.removeLayer(osm);
        map.addLayer(satellite);
      } else {
        map.removeLayer(satellite);
        map.addLayer(osm);
      }
    };

    document.getElementById("zoom-in-btn").onclick = function () {
      map.zoomIn();
    };

    document.getElementById("zoom-out-btn").onclick = function () {
      map.zoomOut();
    };

    document.getElementById("locate-btn").onclick = function () {
      map.locate({ setView: true, maxZoom: 12 });
    };

    document.getElementById("north-btn").onclick = function () {
      map.setBearing ? map.setBearing(0) : map.setView(map.getCenter(), map.getZoom());
    };

    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 13,
    });

    const allMarkers = gunungData
      .map((gunung) => {
        if (gunung.Latitude && gunung.Longitude) {
          const lat = gunung.Latitude * (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
          const marker = L.circleMarker([lat, gunung.Longitude], {
            radius: 9,
            color: "#388e3c",
            weight: 2,
            fillColor: "#69f0ae",
            fillOpacity: 0.7,
          }).bindPopup(
            `<b>${gunung.Nama}</b><br>${gunung.Provinsi}<br>Ketinggian: ${gunung["Ketinggian (dpl)"]} mdpl`
          );
          marker.gunungNama = gunung.Nama.toLowerCase();
          marker.gunungData = gunung;
          return marker;
        }
        return null;
      })
      .filter(Boolean);

    allMarkers.forEach((marker) => markersCluster.addLayer(marker));
    map.addLayer(markersCluster);

    const searchInput = document.getElementById("search-gunung");
    const resultList = document.getElementById("search-result-list");
    const searchExitBtn = document.getElementById("search-exit-btn");
    const searchBar = document.querySelector(".search-bar");

    function renderResults(keyword) {
      resultList.innerHTML = "";
      if (!keyword) return;
      const results = gunungData
        .filter((g) => g.Nama.toLowerCase().includes(keyword))
        .slice(0, 2);

      results.forEach((gunung) => {
        const marker = allMarkers.find((m) => m.gunungData === gunung);
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="result-icon">
            <svg width="20" height="20" fill="none" stroke="#222" stroke-width="2" viewBox="0 0 24 24"><path d="M3 20L12 4L21 20H3Z" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span>
            <div class="result-title">${gunung.Nama}</div>
            <div class="result-sub">${gunung.Provinsi} &bull; ${gunung["Ketinggian (dpl)"]} mdpl</div>
          </span>
        `;
        li.addEventListener("click", () => {
          const lat = gunung.Latitude * (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
          map.setView([lat, gunung.Longitude], 11, { animate: true, duration: 1.5 });
          const onMoveEnd = () => {
            if (marker) marker.openPopup();
            showHighlightCard([gunung]);
            map.off("moveend", onMoveEnd);
          };
          map.on("moveend", onMoveEnd);
        });
        resultList.appendChild(li);
      });
    }

    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase();
      renderResults(keyword);
      searchExitBtn.style.display = keyword ? "flex" : "none";
    });

    searchExitBtn.addEventListener("click", function () {
      searchInput.value = "";
      resultList.innerHTML = "";
      resultList.classList.remove("active");
      searchBar.classList.remove("expanded");
      searchExitBtn.style.display = "none";
      searchInput.blur();
    });

    const highlightCard = document.getElementById("gunung-highlight-card");
    const highlightCardMobile = document.getElementById("gunung-highlight-card-mobile");

    function showHighlightCardMobile(gunung) {
      if (!highlightCardMobile) return;
      if (!gunung) {
        highlightCardMobile.classList.remove("active");
        highlightCardMobile.innerHTML = "";
        return;
      }
      const imgSrc = gunung.Gambar || cartenzImg;
      highlightCardMobile.innerHTML = `
        <button class="close-highlight-btn" aria-label="Tutup">&times;</button>
        <div class="highlight-card-content-mobile" data-mountain-id="${gunung.Id}">
          <img src="${imgSrc}" alt="${gunung.Nama}" onerror="this.src='${cartenzImg}'" />
          <div>
            <div class="highlight-title-mobile">${gunung.Nama}</div>
            <div class="highlight-sub-mobile">${gunung.Provinsi}</div>
            <div class="highlight-meta-mobile">${gunung["Ketinggian (dpl)"]} mdpl</div>
          </div>
        </div>
      `;
      highlightCardMobile.classList.add("active");

      const mobileContent = highlightCardMobile.querySelector(".highlight-card-content-mobile");
      if (mobileContent) {
        const mountainId = mobileContent.getAttribute("data-mountain-id");

        mobileContent.addEventListener("touchstart", () => {
          mobileContent.classList.add("touch-active");
        });

        mobileContent.addEventListener("touchend", () => {
          mobileContent.classList.remove("touch-active");
        });

        mobileContent.addEventListener("touchcancel", () => {
          mobileContent.classList.remove("touch-active");
        });

        mobileContent.addEventListener("click", () => {
          if (mountainId) {
            window.location.hash = `#/mountain/${mountainId}`;
          }
        });
      }

      highlightCardMobile.querySelector(".close-highlight-btn").onclick = () => {
        highlightCardMobile.classList.remove("active");
        highlightCardMobile.innerHTML = "";
      };
    }

    function showHighlightCard(gunungList) {
      if (!Array.isArray(gunungList)) gunungList = [gunungList];
      if (!gunungList.length) {
        highlightCard.innerHTML = `<div>Tidak ada gunung di area ini.</div>`;
        highlightCard.style.display = "flex";
        return;
      }

      if (highlightCard.classList.contains("minimized")) {
        highlightCard.innerHTML = `
          <div class="highlight-card-header-bar">
            <span class="highlight-card-title">Jelajah</span>
            <button id="minimize-highlight-card" class="highlight-min-btn" title="Maximize">
              <svg width="20" height="20" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="2" rx="1" fill="#222"/></svg>
            </button>
          </div>
        `;
        highlightCard.style.display = "flex";
        const minimizeBtn = document.getElementById("minimize-highlight-card");
        if (minimizeBtn) {
          minimizeBtn.onclick = function (e) {
            e.stopPropagation();
            highlightCard.classList.remove("minimized");
            showHighlightCard(gunungList);
          };
        }
        return;
      }

      highlightCard.innerHTML = `
        <div class="highlight-card-header-bar">
          <span class="highlight-card-title">Jelajah</span>
          <button id="minimize-highlight-card" class="highlight-min-btn" title="Minimize">
            <svg width="20" height="20" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="2" rx="1" fill="#222"/></svg>
          </button>
        </div>
        <div class="highlight-list">
          ${gunungList
            .slice(0, 6)
            .map(
              (gunung, index) => `
            <div class="highlight-card-item" data-mountain-id="${gunung.Id}" data-index="${index}">
              <div class="highlight-img-wrap">
                <img src="${gunung.Gambar || cartenzImg}" alt="${gunung.Nama}" onerror="this.src='${cartenzImg}'" />
              </div>
              <div class="highlight-info">
                <div class="highlight-title">${gunung.Nama}</div>
                <div class="highlight-sub">${gunung.Provinsi}</div>
                <div class="highlight-meta">${gunung["Ketinggian (dpl)"]} mdpl</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
      highlightCard.style.display = "flex";

      const highlightCardItems = highlightCard.querySelectorAll(".highlight-card-item");
      highlightCardItems.forEach((cardItem) => {
        const mountainId = cardItem.getAttribute("data-mountain-id");

        cardItem.addEventListener("click", () => {
          if (mountainId) {
            window.location.hash = `#/mountain/${mountainId}`;
          }
        });
      });

      const minimizeBtn = document.getElementById("minimize-highlight-card");
      if (minimizeBtn) {
        minimizeBtn.onclick = function (e) {
          e.stopPropagation();
          highlightCard.classList.add("minimized");
          showHighlightCard(gunungList);
        };
      }
    }

    allMarkers.forEach((marker) => {
      marker.on("click", () => {
        const gunung = marker.gunungData;
        if (window.innerWidth <= 768) {
          showHighlightCardMobile(gunung);
        } else {
          showHighlightCard([gunung]);
        }
      });
    });

    function getGunungInBounds(bounds) {
      return gunungData.filter((gunung) => {
        if (!gunung.Latitude || !gunung.Longitude) return false;
        const lat = gunung.Latitude * (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
        const lng = gunung.Longitude;
        return bounds.contains([lat, lng]);
      });
    }

    map.on("moveend", () => {
      const bounds = map.getBounds();
      const gunungSekitar = getGunungInBounds(bounds);
      showHighlightCard(gunungSekitar);
    });

    const bounds = map.getBounds();
    const gunungSekitar = getGunungInBounds(bounds);
    showHighlightCard(gunungSekitar);

    searchInput.addEventListener("focus", () => {
      searchBar.classList.add("expanded");
      resultList.classList.add("active");
    });

    searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (!searchInput.value) {
          searchBar.classList.remove("expanded");
          resultList.classList.remove("active");
        }
      }, 100);
    });

    searchBar.addEventListener("click", () => {
      searchBar.classList.add("expanded");
      resultList.classList.add("active");
      searchInput.focus();
    });

    const layerBtn = document.getElementById("layer-btn");
    const layerDropdown = document.getElementById("layer-dropdown");

    layerBtn.onclick = function (e) {
      e.stopPropagation();
      layerDropdown.classList.toggle("open");
    };

    document.addEventListener("click", function () {
      layerDropdown.classList.remove("open");
    });

    layerDropdown.querySelectorAll(".layer-option").forEach((btn) => {
      btn.onclick = function (e) {
        e.stopPropagation();
        layerDropdown.classList.remove("open");
        if (this.dataset.layer === "osm") {
          if (!map.hasLayer(osm)) {
            map.addLayer(osm);
            map.removeLayer(satellite);
          }
        } else if (this.dataset.layer === "satellite") {
          if (!map.hasLayer(satellite)) {
            map.addLayer(satellite);
            map.removeLayer(osm);
          }
        }
      };
    });

    let userMarker = null;

    map.on("locationfound", function (e) {
      if (userMarker) {
        map.removeLayer(userMarker);
      }
      userMarker = L.marker(e.latlng, {
        icon: L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        }),
      })
        .addTo(map)
        .bindPopup("Lokasi Anda")
        .openPopup();
    });

    map.on("locationerror", function () {
      alert("Lokasi tidak ditemukan atau akses GPS ditolak.");
    });
  }
}
