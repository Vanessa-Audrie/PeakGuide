const API_CONFIG = {
  baseURL: "https://hiplan-production.up.railway.app/api",
  mlRecomBackendURL: "https://hiplan-ml-recommender-system.up.railway.app", // ML backend URL
  mlWeatherBackendURL: "https://hiplan-ml-weather-pred.up.railway.app", // ML Weather Prediction URL
  mlDifficultyBackendURL: "https://hiplan-ml-diff-and-time-pred.up.railway.app", // ML Difficulty & Time Prediction URL
  endpoints: {
    register: "/register",
    login: "/login",
    profile: "/profile",
    health: "/health",
    // ML endpoints
    recommendations: "/rekomendasi",
    difficultyPrediction: "/predict",
    weatherSeasonality: "/forecast/seasonality",
    weatherMonthly: "/forecast/monthly",
    weatherRange: "/forecast/range",
  },

  getURL: function (endpoint) {
    return this.baseURL + this.endpoints[endpoint];
  },

  getMLURL: function (endpoint) {
    return this.mlRecomBackendURL + this.endpoints[endpoint];
  },
  getWeatherMLURL: function (endpoint) {
    return this.mlWeatherBackendURL + this.endpoints[endpoint];
  },

  getDifficultyMLURL: function (endpoint) {
    return this.mlDifficultyBackendURL + this.endpoints[endpoint];
  },
};

export default API_CONFIG;
