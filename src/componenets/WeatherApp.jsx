import React, { useState, useEffect } from 'react';
import { Search, Cloud, Sun, CloudRain, Wind, Droplets, CloudSun, CloudFog, CloudLightning, Snowflake, Moon, CloudMoon, Truck } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import SearchBar from './SearchBar';
import axios from 'axios';

const WeatherApp = () => {
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isNightMode, setIsNightMode] = useState(false);
    const apiKey = import.meta.env.VITE_API_KEY
    const [weather, setWeather] = useState({})

    useEffect(() => {
        const fetchWeatherData = async () => {
            setIsLoading(true)
            try {
                if (location == '') {
                    const forcast = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=7`)
                    setWeather(forcast.data)
                    setIsLoading(false)
                }
                else{
                    try{
                        const forecast = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`)
                        setWeather(forecast.data)
                        setIsLoading(false)
                    }catch(error)
                    {
                        alert("Error in Country. Please try again.")
                    }
                }

            } catch (error) {
                alert('An error occurred. Please try again.')
            } 
        }
        fetchWeatherData()

        const hour = new Date().getHours();
        setIsNightMode(hour >= 18 || hour < 6);
        // setIsNightMode(true); if someone is testing this code uncomment this ti activate niht mode if you are not in time

    }, [location]);




    const bgGradient = isNightMode
        ? "bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900"
        : "bg-gradient-to-b from-blue-400 to-blue-600";

    const cardBg = isNightMode
        ? "bg-gray-800/40"
        : "bg-white/20";

    return (
        <div className={`min-h-screen ${bgGradient} p-4 transition-colors duration-500`}>
            <div className="max-w-md mx-auto px-4 sm:px-0">
                <SearchBar isNightMode={isNightMode} location={location} setLocation={setLocation} /> {/* SearchBar component i might change it later */}

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {/* Main app but im still thinking of things to change still some tests */}
                        <div className={`${cardBg} backdrop-blur-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6`}>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
                                <div className="flex items-center gap-2 mb-4 sm:mb-0 text-white">
                                    <img
                                        src={`https:${weather.current.condition.icon}`}
                                        alt={weather.current.condition.text}
                                        className="w-8 h-8 drop-shadow-lg filter brightness-125"
                                    />
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-white">{weather.location.country}, {weather.location.name}</h2>
                                        <p className="text-white/70">{weather.current.condition.text}</p>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <div className="text-3xl sm:text-4xl font-bold text-white">
                                        {weather.current.temp_c}°C
                                    </div>
                                    <div className="text-sm text-white/70">
                                        H: {weather.forecast.forecastday[0].day.maxtemp_c}° L: {weather.forecast.forecastday[0].day.mintemp_c}°
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 text-white">
                                    <Droplets className="h-5 w-5" />
                                    <span>Humidity: {weather.current.humidity}%</span>
                                </div>
                                <div className="flex items-center space-x-2 text-white">
                                    <Wind className="h-5 w-5" />
                                    <span>Wind: {weather.current.wind_kph} km/h</span>
                                </div>
                            </div>
                        </div>

                        <div className={`${cardBg} backdrop-blur-md rounded-lg p-4 sm:p-6`}>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Rest of the week</h3>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                {weather.forecast.forecastday.slice(1).map((item) => (
                                    <div key={item.date} className="text-center">
                                        <p className="text-white mb-2 text-sm sm:text-base">
                                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                        <div className="text-white mb-2">
                                            <img
                                                src={`https:${item.day.condition.icon}`}
                                                alt={item.day.condition.text}
                                                className="w-8 h-8 mx-auto drop-shadow-lg filter brightness-125"
                                            />
                                        </div>
                                        <p className="text-white font-bold text-sm sm:text-base">
                                            {Math.round(item.day.avgtemp_c)}°
                                        </p>
                                        <p className="text-white/70 text-xs sm:text-sm">
                                            H: {Math.round(item.day.maxtemp_c)}° L: {Math.round(item.day.mintemp_c)}°
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;