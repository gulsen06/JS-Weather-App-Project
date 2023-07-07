//DOM

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner form input");
const msgSpan = document.querySelector(".top-banner .msg");
const list = document.querySelector(".cities");

//variable

let units = "metric"; // imperial (f), boş bırakırsak default kelvin değeri
let lang = "en"; // Almanca için de kullanılacak
let url; //Api isteği için adres
let cities = []; //Sorgulanan şehirlerin ismini tutacak

const apiKey = "de0e378e47b8a72587fe49c0c3feb7f1";

// localStorage.setItem("apiKey", '8c40fd9549fbc5a923e2efd36b4e88bf') //şifresiz gönderme

// localStorage.setItem("apiKey",EncryptStringAES('8c40fd9549fbc5a923e2efd36b4e88bf')); //local storage e şifreli kaydeder.

// const apiKey = DecryptStringAES(localStorage.getItem("apiKey")) //localstorage den alınan şifreli key bilgisini açığa çıkarır

//language

const clearAllButton = document.getElementById("clear-all");
const langButton = document.getElementById("lang");
const searchEl = document.getElementById("search");

//location
const locate = document.getElementById("locate");

locate.addEventListener("click", () => {
  navigator.geolocation?.getCurrentPosition(({ coords }) => {
    const { latitude, longitude } = coords;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&lang=${lang}`;

    getWeatherDataFromApi();
  });
});

// form submit

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    const cityName = input.value;
    // console.log(cityName)

    url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

    getWeatherDataFromApi();
  }

  form.reset(); // Form içerisindeki tüüm inputları sıfırlar
});

//language button

langButton.addEventListener("click", (e) => {
  if (e.target.id == "de") {
    lang = "de";
    input.setAttribute("placeholder", "🔍Suche nach einer Stadt");
    searchEl.innerHTML = "SUCHE";
    clearAllButton.innerHTML = "Alles Löschen";
  } else if (e.target.id == "en") {
    lang = "en";
    input.setAttribute("placeholder", `🔍Search for a city`);
    searchEl.innerHTML = "SEARCH";
    clearAllButton.innerHTML = "Clear All";
  } else if (e.target.id == "clear-all") {
    cities = [];
    list.innerHTML = "";
  }
});

const getWeatherDataFromApi = async () => {
  try {
    // const response = await fetch(url).then((response)=> response.json()); // fetch ile istek atma
    const response = await axios(url); // axios ile istek atma
    // console.log(response)

    //Data Destruction
    // const {main, name, weather, sys} = response //fetch
    const { main, name, weather, sys } = response.data; //axios

    // console.log(weather[0].icon)// gelen veriyi kontrol etmek

    // const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    if (cities.indexOf(name) == -1) {
      cities.unshift(name);
      //cities.push(name)//append kullanırsak push metodu daha iyi olur
      //  console.log(cities)

      const resultData = document.createElement("li");
      resultData.classList.add("city");
      resultData.setAttribute("id", `${name}`);
      resultData.innerHTML = `
        <h2 class="city-name" >
        <div>
          <span>${name}</span>
          <sup>${sys.country}</sup> 
        </div>  
          <button type='button' class='single-clear-btn'>X</button>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
           <img class="city-icon" src="${iconUrl}">
          <figcaption>${weather[0].description}</figcaption>
        </figure>`;

      // list.append(resultData); //sona ekler
      list.prepend(resultData); //öne ekler

      const singleClearButton = document.querySelectorAll(".single-clear-btn");
      // console.log(singleClearButton)

      singleClearButton.forEach((button) => {
        button.addEventListener("click", (e) => {
          delete cities[cities.indexOf(e.target.closest(".city").id)];
          console.log(cities);

          e.target.closest(".city").remove();

          console.log(cities);
        });
      });
    } else {
      if (lang == "de") {
        msgSpan.innerText = `Sie kennen das Wetter für die ${name} bereits. Bitte suchen Sie nach einer anderen Stadt 😉`;
      } else {
        msgSpan.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
      }

      setInterval(() => {
        msgSpan.innerText = "";
      }, 4000);
    }
  } catch (error) {
    if (lang == "de") {
      msgSpan.innerText = `Stadt nicht gefunden`;
    } else {
      msgSpan.innerText = "City not found!";
    }

    setInterval(() => {
      msgSpan.innerText = "";
    }, 4000);
  }
};
