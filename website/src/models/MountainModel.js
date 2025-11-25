import gunungData from "../assets/data/gunung_indonesia.json";

export class Mountain {
  constructor(
    id,
    nama,
    provinsi,
    kabupaten,
    kecamatan,
    ketinggian,
    jenisGunung,
    status,
    akses,
    jarakKm,
    jarakM,
    elevationGain,
    estimatedTime,
    latitude,
    longitude,
    deskripsi,
    gambar,
    baseDifficulty,
    kesulitan
  ) {
    this.id = id;
    this.name = nama;
    this.location = `${kabupaten}, ${provinsi}`;
    this.kecamatan = kecamatan;
    this.kabupaten = kabupaten;
    this.provinsi = provinsi;
    this.altitude = ketinggian;
    this.mainImage = gambar || "bromo.jpg";
    this.description = deskripsi;
    this.baseDifficulty = baseDifficulty;
    this.difficulty = baseDifficulty;
    this.difficultyLabel = kesulitan;
    this.distance = jarakM ? (jarakM / 1000).toFixed(1) : "N/A";
    this.distanceMeters = jarakM;
    this.lat = latitude;
    this.long = longitude;
    this.jenisGunung = jenisGunung;
    this.status = status;
    this.access = akses;
    this.jarakKm = jarakKm;
    this.elevationGain = elevationGain;
    this.estimatedTime = estimatedTime;
    this.ulasan = Math.floor(Math.random() * 100) + 10;
  }

  getDifficultyColor(difficulty) {
    if (difficulty <= 2) return "#28a745";
    if (difficulty <= 4) return "#17a2b8";
    if (difficulty <= 6) return "#ffc107";
    if (difficulty <= 8) return "#fd7e14";
    return "#dc3545";
  }
}

export class MountainModel {
  constructor() {
    this.mountains = gunungData.map(
      (data) =>
        new Mountain(
          data.Id,
          data.Nama,
          data.Provinsi,
          data.Kabupaten,
          data.Kecamatan,
          data["Ketinggian (dpl)"],
          data["Jenis Gunung"],
          data.Status,
          data.Akses,
          data["Jarak (km)"],
          data["Jarak (m)"],
          data["Elevation gain (m)"],
          data["Estimated Time "],
          data.Latitude,
          data.Longitude,
          data.Deskripsi,
          data.Gambar,
          data.BaseDifficulty,
          data.Kesulitan
        )
    );
  }

  getAllMountains() {
    return this.mountains;
  }

  getMountainById(id) {
    return this.mountains.find((mountain) => mountain.id === parseInt(id));
  }

  //Daftar Gunung
  searchMountains(query) {
    const searchTerm = query.toLowerCase();
    return this.mountains.filter(
      (mountain) =>
        mountain.name.toLowerCase().includes(searchTerm) ||
        mountain.location.toLowerCase().includes(searchTerm)
    );
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  getNearbyMountains(mountainId, limit = 4) {
    const currentMountain = this.getMountainById(mountainId);
    if (!currentMountain || !currentMountain.lat || !currentMountain.long) {
      return this.mountains
        .filter((m) => m.id !== parseInt(mountainId))
        .slice(0, limit);
    }

    const mountainsWithDistance = this.mountains
      .filter((mountain) => mountain.id !== parseInt(mountainId))
      .filter((mountain) => mountain.lat && mountain.long)
      .map((mountain) => ({
        ...mountain,
        distance: this.calculateDistance(
          currentMountain.lat,
          currentMountain.long,
          mountain.lat,
          mountain.long
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    return mountainsWithDistance.slice(0, limit);
  }
}
