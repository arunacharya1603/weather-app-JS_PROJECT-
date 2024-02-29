const input = document.querySelector("input");
const button = document.getElementById("btn");
const icon = document.querySelector(".icon");
const weather = document.querySelector(".weather");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");

let mapLinkAdded = false;

button.addEventListener("click", () => {
  let city = input.value;
  getWeather(city);
});

function getWeather(city) {
  console.log(city);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e50f5e54dc168aa0c2412ce567412724`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const iconCode = data.weather[0].icon;
      icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}.png"
        alt="Weather Icon"/>`;

      const weatherCondition = data.weather[0].main.toLowerCase();
      const weatherBox = document.querySelector(".weather-box");
      weatherBox.classList.remove("sunny", "rainy", "cloudy", "haze"); // Add more classes as needed

      // Add class based on weather condition
      if (weatherCondition === "clear") {
        weatherBox.classList.add("sunny");
      } else if (weatherCondition === "rain") {
        weatherBox.classList.add("rainy");
      }else if(weatherCondition === "drizzle"){
        weatherBox.classList.add("drizzle");
      } else if (weatherCondition === "clouds") {
        weatherBox.classList.add("cloudy");
      } else if (weatherCondition === "haze") {
        weatherBox.classList.add("haze");
      }

      const body = document.querySelector("body");
      body.classList.remove("sunny", "rainy", "cloudy", "hazy", "drizzle"); // Add "hazy" class

      // Set background based on weather condition
      if (weatherCondition === "clear") {
        body.classList.add("sunny");
      } else if (weatherCondition === "rain") {
        body.classList.add("rainy");
      } else if (weatherCondition === "drizzle") {
        body.classList.add("drizzle");
      } else if (weatherCondition === "clouds") {
        body.classList.add("cloudy");
      } else if (weatherCondition === "haze") {
        // Check for "Haze" condition
        body.classList.add("hazy");
      }

      const weatherCity = data.name;
      const weatherCountry = data.sys.country;
      const longitude = data.coord.lon;
      const latitude = data.coord.lat;
      const mapLink = document.createElement("a");

      mapLink.href = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`;
      mapLink.textContent = "View Map";
      if (!mapLinkAdded) {
        document.querySelector(".map-container").appendChild(mapLink);
        mapLinkAdded = true; // Update the flag
      }

      const sunrise = data.sys.sunrise * 1000;
      const sunset = data.sys.sunset * 1000;
      const sunriseDate = new Date(sunrise);
      const sunsetDate = new Date(sunset);
      const sunriseLocalTime = sunriseDate.toLocaleTimeString();
      const sunsetLocalTime = sunsetDate.toLocaleTimeString();
      weather.innerHTML = `
      <div style="
      width: 221px;
  ">Longitude:${longitude} Latitude:${latitude}</div>
      <div style="
      margin-top: 57px;
      width: 8rem;
  ">${weatherCity}, ${weatherCountry}</div>
      <div style="
      width: 243px;
  ">Sunrise:${sunriseLocalTime} Sunset:${sunsetLocalTime}</div>`;

      const temp = data.main.temp;
      const celciusTemp = temp - 273.15;
      const celTemp = celciusTemp.toFixed(1);
      const maxTemp = (data.main.temp_max - 273.15).toFixed(1);
      const minTemp = (data.main.temp_min - 273.15).toFixed(1);

      const feel = data.main.feels_like;
      const celciusFeel = feel - 273.15;
      const celFeel = celciusFeel.toFixed(1);
      const cloudCover = data.clouds.all;
      let cloudPer;
      if (cloudCover === 0 || cloudCover === null) {
        cloudPer = "No Cloud Cover";
      } else {
        cloudPer = "Cloudy";
      }

      const humidity = data.main.humidity;
      const pressure = data.main.pressure;

      temperature.innerHTML = `<div><b>Temp:</b>${celTemp}°C <b>Maxi-Temp:</b>${maxTemp}°C <b>Mini-Temp:</b>${minTemp}°C</div> <div style="
      width: 350px;
  ">Feels Like:${celFeel}°C<br/> Humidity:${humidity}<br/> ${cloudPer}<br/>  Pressure:${pressure}</div>`;

      // Update other elements as needed
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
    });
}
