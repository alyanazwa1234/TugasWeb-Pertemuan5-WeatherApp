const setDayNightMode = () => {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 18) {
        document.body.classList.remove("night");
    } else {
        document.body.classList.add("night");
    }
};

setDayNightMode();
const apiKey = "f85a5556ff5923d5cd4edb4f2a00e283";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherResult = document.getElementById("weatherResult");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");

const historyList = document.getElementById("historyList");

let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];


const getWeather = async (city) => {

    loading.style.display = "block";
    errorMessage.textContent = "";
    weatherResult.style.display = "none";

    try {

        const response = await fetch(
            `${apiUrl}?q=${city}&appid=${apiKey}&units=metric&lang=id`
        );

        if (!response.ok) {
            throw new Error("Kota tidak ditemukan");
        }

        const data = await response.json();

        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temperature.textContent = `${Math.round(data.main.temp)} °C`;
        description.textContent = data.weather[0].description;
        humidity.textContent = `${data.main.humidity}%`;
        feelsLike.textContent = `${Math.round(data.main.feels_like)} °C`;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherIcon.alt = data.weather[0].description;

        weatherResult.style.display = "block";

        addHistory(data.name);

    } catch (error) {

        errorMessage.textContent =
            "Kota tidak ditemukan atau terjadi masalah koneksi.";

    } finally {

        loading.style.display = "none";
    }
};


const addHistory = (city) => {

    searchHistory = searchHistory.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    searchHistory.unshift(city);

    searchHistory = searchHistory.slice(0, 5);

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(searchHistory)
    );

    showHistory();
};


const showHistory = () => {

    historyList.innerHTML = "";

    searchHistory.map(city => {

        const li = document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", () => {
            cityInput.value = city;
            getWeather(city);
        });

        historyList.appendChild(li);
    });
};


searchButton.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {

        errorMessage.textContent =
            "Silakan masukkan nama kota terlebih dahulu.";

        return;
    }

    getWeather(city);
});


cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchButton.click();
    }

});


showHistory();