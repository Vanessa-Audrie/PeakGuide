/**
 * Visual Crossing Weather API Service
 * Handles daily weather forecast data from Visual Crossing API
 */
class VisualCrossingService {
  constructor() {
    this.apiKey = "WCQPBLZHREA7LZ5RAX8MREF9N";
    this.baseUrl =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
  }

  /**
   * Get daily weather forecast for a location
   * @param {string} location - Location name (kecamatan)
   * @param {number} days - Number of days to forecast (default: 7)
   * @returns {Promise<Object>} Weather forecast data
   */
  async getDailyForecast(location, days = 7) {
    try {
      const locationQuery = location.replace(/\s+/g, "%20");
      const today = new Date().toISOString().split("T")[0];

      const url = `${this.baseUrl}/${locationQuery}?unitGroup=metric&key=${this.apiKey}&contentType=json&elements=datetime,temp,humidity,precipprob,windspeed,conditions&lang=id&include=days&iconSet=icons1`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.days || data.days.length === 0) {
        throw new Error("No weather data available");
      }

      // Return only the requested number of days
      return {
        success: true,
        location: data.resolvedAddress || location,
        days: data.days.slice(0, days),
        timezone: data.timezone,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return {
        success: false,
        error: error.message,
        days: [],
      };
    }
  }
  /**
   * Comprehensive Visual Crossing conditions mapping
   * Based on Visual Crossing API documentation and Streamlit implementation
   */
  getConditionMapping() {
    return {
      type_1: "Salju Kencang",
      type_10: "Gerimis Beku Deras/Hujan Beku",
      type_11: "Gerimis Beku Ringan/Hujan Beku",
      type_12: "Kabut Beku",
      type_13: "Hujan Beku Deras",
      type_14: "Hujan Beku Ringan",
      type_15: "Tornado/Awan Corong",
      type_16: "Hujan Es",
      type_17: "Es",
      type_18: "Petir Tanpa Guntur",
      type_19: "Kabut",
      type_2: "Gerimis",
      type_20: "Hujan Di Sekitar",
      type_21: "Hujan",
      type_22: "Hujan dan Salju Deras",
      type_23: "Hujan dan Salju Ringan",
      type_24: "Hujan Deras",
      type_25: "Hujan Lebat",
      type_26: "Hujan Ringan",
      type_27: "Penurunan Coverage Awan",
      type_28: "Kenaikan Coverage Awan",
      type_29: "Coverage Awan Tidak Berubah",
      type_3: "Gerimis Berat",
      type_30: "Asap Atau Kabut",
      type_31: "Salju",
      type_32: "Salju dan Hujan Lebat",
      type_33: "Hujan Salju",
      type_34: "Salju Lebat",
      type_35: "Salju Ringan",
      type_36: "Angin Kencang",
      type_37: "Hujan Badai",
      type_38: "Badai Petir Tanpa Hujan",
      type_39: "Debu Berlian",
      type_4: "Gerimis Ringan",
      type_40: "Hujan Es",
      type_41: "Mendung",
      type_42: "Sebagian Berawan",
      type_43: "Cerah",
    };
  }

  /**
   * Translate Visual Crossing condition strings to Indonesian
   * @param {string} conditionStr - Comma-separated condition types
   * @returns {string} Translated conditions in Indonesian
   */
  translateConditions(conditionStr) {
    if (!conditionStr) {
      return "Kondisi Tidak Diketahui";
    }

    const conditionMapping = this.getConditionMapping();
    const conditionIds = conditionStr.split(",").map((c) => c.trim());
    const descriptions = [];

    for (const cid of conditionIds) {
      const desc = conditionMapping[cid] || "Kondisi Tidak Diketahui";
      descriptions.push(desc);
    }

    return descriptions.join(", ");
  }
  /**
   * Map individual weather condition to Indonesian
   * @param {string} condition - Single weather condition
   * @returns {string} Indonesian translation
   */
  translateSingleCondition(condition) {
    const conditionLower = condition.toLowerCase().trim();

    // Mapping berdasarkan kondisi Visual Crossing yang umum
    const conditionMap = {
      // Clear conditions
      clear: "Cerah",
      sunny: "Cerah",
      fair: "Cerah",

      // Cloudy conditions
      "partly cloudy": "Sebagian Berawan",
      "partly-cloudy": "Sebagian Berawan",
      "mostly cloudy": "Sebagian Berawan",
      "scattered clouds": "Sebagian Berawan",
      overcast: "Mendung",
      cloudy: "Berawan",

      // Rain conditions
      rain: "Hujan",
      "light rain": "Hujan Ringan",
      "heavy rain": "Hujan Deras",
      drizzle: "Gerimis",
      showers: "Hujan Ringan",
      thunderstorms: "Badai Petir",

      // Wind conditions
      windy: "Berangin",
      breezy: "Berangin",
      gusty: "Berangin",

      // Fog conditions
      fog: "Kabut",
      mist: "Kabut",
      haze: "Kabut",

      // Snow conditions
      snow: "Salju",
      ice: "Es",
      hail: "Hujan Es",
    };

    return conditionMap[conditionLower] || condition;
  }
  /**
   * Map Visual Crossing conditions to local weather types
   * Visual Crossing returns condition strings like:
   * "type_21", "type_22", "type_21,type_22", etc.
   * @param {string} conditions - Visual Crossing weather conditions string
   * @returns {Object} Local weather mapping with icon and description
   */
  mapWeatherConditions(conditions) {
    if (!conditions) {
      return {
        weather: "cerah",
        icon: "bi-sun",
        desc: "Cerah",
        translated: "Cerah",
      };
    }

    // Get the condition mapping
    const conditionMapping = this.getConditionMapping();

    // Split multiple conditions by comma and translate them
    const conditionList = conditions.split(",").map((c) => c.trim());
    const translatedConditions = conditionList.map((condition) => {
      // Check if it's a type_X format or plain text
      if (condition.startsWith("type_")) {
        return conditionMapping[condition] || condition;
      } else {
        // Fallback to single condition translation for plain text
        return this.translateSingleCondition(condition);
      }
    });
    const translatedText = translatedConditions.join(", ");

    const conditionsLower = conditions.toLowerCase();
    // Highest priority: thunderstorm/storm conditions (type_37, type_38)
    if (
      conditionsLower.includes("thunderstorm") ||
      conditionsLower.includes("thunder") ||
      conditionsLower.includes("storm") ||
      conditionsLower.includes("lightning") ||
      conditionsLower.includes("type_37") ||
      conditionsLower.includes("type_38") ||
      conditionsLower.includes("type_18")
    ) {
      return {
        weather: "badai",
        icon: "bi-cloud-lightning-rain",
        desc: translatedText,
        translated: translatedText,
      };
    }

    // Snow/ice conditions (type_1, type_31, type_32, type_33, type_34, type_35, type_16, type_17, type_40)
    if (
      conditionsLower.includes("snow") ||
      conditionsLower.includes("blizzard") ||
      conditionsLower.includes("ice") ||
      conditionsLower.includes("hail") ||
      conditionsLower.includes("freezing") ||
      conditionsLower.includes("type_1") ||
      conditionsLower.includes("type_31") ||
      conditionsLower.includes("type_32") ||
      conditionsLower.includes("type_33") ||
      conditionsLower.includes("type_34") ||
      conditionsLower.includes("type_35") ||
      conditionsLower.includes("type_16") ||
      conditionsLower.includes("type_17") ||
      conditionsLower.includes("type_40")
    ) {
      return {
        weather: "salju",
        icon: "bi-snow",
        desc: translatedText,
        translated: translatedText,
      };
    }

    // Rain conditions (type_21, type_24, type_25, type_26, type_20, type_2, type_3, type_4)
    if (
      conditionsLower.includes("rain") ||
      conditionsLower.includes("drizzle") ||
      conditionsLower.includes("shower") ||
      conditionsLower.includes("precipitation") ||
      conditionsLower.includes("type_21") ||
      conditionsLower.includes("type_24") ||
      conditionsLower.includes("type_25") ||
      conditionsLower.includes("type_26") ||
      conditionsLower.includes("type_20") ||
      conditionsLower.includes("type_2") ||
      conditionsLower.includes("type_3") ||
      conditionsLower.includes("type_4") ||
      conditionsLower.includes("type_10") ||
      conditionsLower.includes("type_11") ||
      conditionsLower.includes("type_13") ||
      conditionsLower.includes("type_14") ||
      conditionsLower.includes("type_22") ||
      conditionsLower.includes("type_23")
    ) {
      // Heavy rain conditions (type_24, type_25)
      if (
        conditionsLower.includes("heavy") ||
        conditionsLower.includes("torrential") ||
        conditionsLower.includes("downpour") ||
        conditionsLower.includes("type_24") ||
        conditionsLower.includes("type_25")
      ) {
        return {
          weather: "hujan_deras",
          icon: "bi-cloud-rain-heavy",
          desc: translatedText,
          translated: translatedText,
        };
      }
      // Light rain conditions (type_26, type_2, type_4)
      if (
        conditionsLower.includes("light") ||
        conditionsLower.includes("drizzle") ||
        conditionsLower.includes("type_26") ||
        conditionsLower.includes("type_2") ||
        conditionsLower.includes("type_4")
      ) {
        return {
          weather: "hujan_ringan",
          icon: "bi-cloud-drizzle",
          desc: translatedText,
          translated: translatedText,
        };
      }
      // General rain (type_21)
      return {
        weather: "hujan",
        icon: "bi-cloud-rain",
        desc: translatedText,
        translated: translatedText,
      };
    }

    // Fog/mist conditions (type_19, type_30)
    if (
      conditionsLower.includes("fog") ||
      conditionsLower.includes("mist") ||
      conditionsLower.includes("haze") ||
      conditionsLower.includes("smoke") ||
      conditionsLower.includes("type_19") ||
      conditionsLower.includes("type_30") ||
      conditionsLower.includes("type_12")
    ) {
      return {
        weather: "kabut",
        icon: "bi-cloud-haze",
        desc: translatedText,
        translated: translatedText,
      };
    }

    // Windy conditions (type_36)
    if (
      conditionsLower.includes("wind") ||
      conditionsLower.includes("breezy") ||
      conditionsLower.includes("gusty") ||
      conditionsLower.includes("type_36")
    ) {
      return {
        weather: "berangin",
        icon: "bi-wind",
        desc: translatedText,
        translated: translatedText,
      };
    }

    // Cloudy conditions (type_41, type_42)
    if (
      conditionsLower.includes("cloud") ||
      conditionsLower.includes("overcast") ||
      conditionsLower.includes("type_41") ||
      conditionsLower.includes("type_42") ||
      conditionsLower.includes("type_27") ||
      conditionsLower.includes("type_28") ||
      conditionsLower.includes("type_29")
    ) {
      // Partly cloudy (type_42)
      if (
        conditionsLower.includes("partly") ||
        conditionsLower.includes("partial") ||
        conditionsLower.includes("scattered") ||
        conditionsLower.includes("type_42")
      ) {
        return {
          weather: "berawan_sebagian",
          icon: "bi-cloud-sun",
          desc: translatedText,
          translated: translatedText,
        };
      }
      // Mostly/fully cloudy (type_41)
      return {
        weather: "berawan",
        icon: "bi-cloud",
        desc: translatedText,
        translated: translatedText,
      };
    }

    // Clear conditions (type_43)
    if (
      conditionsLower.includes("clear") ||
      conditionsLower.includes("sunny") ||
      conditionsLower.includes("fair") ||
      conditionsLower.includes("type_43")
    ) {
      return {
        weather: "cerah",
        icon: "bi-sun",
        desc: translatedText,
        translated: translatedText,
      };
    }

    // Default to clear weather with translated conditions
    return {
      weather: "cerah",
      icon: "bi-sun",
      desc: translatedText,
      translated: translatedText,
    };
  }
  /**
   * Format weather data for the frontend cards with comprehensive condition mapping
   * @param {Array} weatherDays - Array of weather days from Visual Crossing
   * @returns {Array} Formatted weather data for cards
   */
  formatWeatherForCards(weatherDays) {
    if (!weatherDays || weatherDays.length === 0) {
      throw new Error("No weather data available from Visual Crossing API");
    }

    return weatherDays.map((day) => {
      const weatherMapping = this.mapWeatherConditions(day.conditions);
      return {
        weather: weatherMapping.weather,
        icon: weatherMapping.icon,
        desc: weatherMapping.desc,
        translated_desc: weatherMapping.translated || weatherMapping.desc,
        temp: `${day.temp.toFixed(1)}°`,
        wind: `${day.windspeed.toFixed(1)} km/h`,
        precip: `${(day.precipprob || 0).toFixed(1)}%`,
        humid: `${(day.humidity || 0).toFixed(1)}%`,
        datetime: day.datetime,
        conditions: day.conditions,
        // Raw data for ML predictions
        raw_temp: day.temp,
        raw_windspeed: day.windspeed,
        raw_precipprob: day.precipprob || 0,
        raw_humidity: day.humidity || 0,
      };
    });
  }

  /**
   * Get detailed weather information for display
   * @param {string} location - Location name
   * @param {number} days - Number of days
   * @returns {Promise<Object>} Detailed weather information
   */
  async getDetailedWeatherForecast(location, days = 7) {
    const result = await this.getDailyForecast(location, days);

    if (!result.success) {
      return result;
    }

    const formattedDays = this.formatWeatherForCards(result.days);

    return {
      ...result,
      days: formattedDays,
      summary: {
        location: result.location,
        total_days: formattedDays.length,
        weather_types: [...new Set(formattedDays.map((day) => day.weather))],
        avg_temp: (
          formattedDays.reduce((sum, day) => sum + day.raw_temp, 0) /
          formattedDays.length
        ).toFixed(1),
        avg_humidity: (
          formattedDays.reduce((sum, day) => sum + day.raw_humidity, 0) /
          formattedDays.length
        ).toFixed(1),
        avg_wind: (
          formattedDays.reduce((sum, day) => sum + day.raw_windspeed, 0) /
          formattedDays.length
        ).toFixed(1),
        avg_precip: (
          formattedDays.reduce((sum, day) => sum + day.raw_precipprob, 0) /
          formattedDays.length
        ).toFixed(1),
      },
    };
  }
}

export default new VisualCrossingService();
