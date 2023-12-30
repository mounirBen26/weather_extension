const APIFY_URL = 'https://api.ipify.org?format=json';
const city_API_URL = 'https://ipinfo.io/';
const token = '189aa3ef16683c';

// get current ip address
let currentIp = '';
let currentCity = '';
const body = document.body
const weatherCity = document.querySelector('#weatherCity')
const weatherTemp = document.querySelector('#weatherTemp')
const weatherIcon = document.querySelector('#weatherIcon')
const weatherText = document.querySelector('#weather-text')

const forecastContainer = document.querySelector('#forcast-container')


async function getCurrentCity() {
    weatherIcon.src = "./icons/Bar Loader.gif"
    try {
        // Await the fetch call and response.json()
        const ipResponse = await fetch(APIFY_URL);
        if (!ipResponse.ok) {
            throw new Error('Network response was not ok.');
        }
        const ipData = await ipResponse.json();
        currentIp = ipData.ip;

        // Await the second fetch call for the city
        const cityResponse = await fetch(city_API_URL + currentIp + '?token=' + token);
        if (!cityResponse.ok) {
            throw new Error('Problem in network');
        }
        const cityData = await cityResponse.json();
        currentCity = cityData.city;
        console.log('======', currentCity);
        weatherCity.innerHTML = currentCity
    } catch (error) {
        console.log('error', error);
    }
    // get the current weather from the weather.api service
    const weatherFetch = await fetch(`https://api.weatherapi.com/v1/current.json?key=d3a8ad4432d44a31b99145517230112&q=${currentCity}&aqi=no`);
    if (!weatherFetch.ok) {
        throw new Error('Problem in Weather api')
    }
    const weatherData = await weatherFetch.json();
    console.log('curr', weatherData)
    const currentWeather = weatherData
    weatherText.innerHTML = currentWeather.current.condition.text
    weatherText.style.fontSize ="13px"
    weatherText.style.color = 'white'
    weatherText.style.padding = '6px'
    weatherText.style.borderRadius = '4px'
    weatherIcon.src = "https:" + currentWeather.current.condition.icon
    weatherTemp.innerHTML = parseInt(currentWeather.current.temp_c) + '°C'
    if (parseInt(currentWeather.current.temp_c) > 25) {
        weatherText.style.color = 'red'
    } else {
        weatherText.style.color = '#037fdc'
    }

}




async function getWeather() {
    const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=d3a8ad4432d44a31b99145517230112&q=Algiers&days=3&aqi=no&alerts=no')
    if (!response.ok) {
        throw new Error('httpr error', response.status)
    }
    const data = await response.json()
    console.log(data.forecast.forecastday[0].day.maxtemp_c)
    console.log(data.forecast.forecastday[0].date)
    // maxtemp.innerHTML = data.forecast.forecastday[0].day.maxtemp_c
    // mintemp.innerHTML = data.forecast.forecastday[0].day.mintemp_c
    // forcastimg.src  = 'https:' +  data.forecast.forecastday[0].day.condition.icon
    const forcastDay = data.forecast.forecastday
    const ul = document.createElement('ul')
    ul.style.fontSize ="12px"
    Object.keys(forcastDay).forEach(keys => {
        //converting days from numeric to text
        // Date string in MM/DD/YYYY format
        let dateString = forcastDay[keys].date;

        // Parse the date string to create a Date object
        let myDate = new Date(dateString);

        // Get the day of the week as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        let dayNumber = myDate.getDay();

        // Define an array of text days
        let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        // Get the text day based on the day number
        let textDay = daysOfWeek[dayNumber];

        // Output the result
        console.log(`${dateString} is a ${textDay}`);

        // end 
        const li = document.createElement('li')
        const img = document.createElement('img')
        img.src = "https:" + forcastDay[keys].day.condition.icon
        img.style.width = '40px'
        img.style.height = '40px'
        img.style.boxShadow = '0 3px 5px rgba(3, 49, 53, 0.8)'
        img.style.borderRadius ="5px"
        const p = document.createElement('p')
        img.style.marginRight = '5px'
        p.textContent = textDay + "  " + parseInt(forcastDay[keys].day.maxtemp_c) + "° / " + parseInt(forcastDay[keys].day.mintemp_c) + '°'
        li.appendChild(img)
        li.appendChild(p)
        li.style.fontWeight = 600
        li.style.listStyle = 'none'
        li.style.display = 'flex'
        li.style.flexDirection = 'column'
        li.style.marginRight = '50px'
        li.style.alignItems = 'center'
        li.style.marginTop = '3px'
        ul.appendChild(li)


        console.log('-------->>>>', forcastDay[keys].day.maxtemp_c)
        // maxtemp.innerHTML = forcastDay[keys].day.maxtemp_c
        // mintemp.innerHTML = forcastDay[keys].day.mintemp_c
        // forcastimg.src  = 'https:' +  forcastDay[keys].day.condition.icon

    }
    )
    forecastContainer.appendChild(ul)
}

getCurrentCity()
getWeather()
