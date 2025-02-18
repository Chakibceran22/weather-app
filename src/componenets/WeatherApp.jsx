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
    const [filteredForecast, setFilteredForecast] = useState([])
    
    function filterWeatherData(data) {
        const dailyData = [];
    
        data.list.forEach((forecast) => {
            const forecastDate = new Date(forecast.dt * 1000);
            const date = forecastDate.toISOString().split('T')[0];
    
            let dayData = dailyData.find((item) => item.date === date);
            
            if (!dayData) {
                dayData = {
                    date: date,
                    minTemp: forecast.main.temp_min,
                    maxTemp: forecast.main.temp_max,
                    description: forecast.weather[0].description,
                    humidity: forecast.main.humidity,
                    windSpeed: forecast.wind.speed,
                };
                dailyData.push(dayData);
            } else {
                dayData.minTemp = Math.min(dayData.minTemp, forecast.main.temp_min);
                dayData.maxTemp = Math.max(dayData.maxTemp, forecast.main.temp_max);
            }
        });
    
        return dailyData;
    }

    useEffect(() => {
        const fetchWeatherData = async () => {
            setIsLoading(true)
            try {
                if (location == '') {
                    const forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Algiers&appid=${apiKey}&units=metric`)
                    setWeather(forecast.data)
                    console.log(forecast.data)
                    console.log(filterWeatherData(forecast.data))
                    setFilteredForecast(filterWeatherData(forecast.data))
                    setIsLoading(false)
                }
                else{
                    try{
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
    }, [location]);

    const getWeatherIcon = (description) => {
        const desc = description.toLowerCase();
        if (desc.includes('rain')) return <CloudRain className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />;
        if (desc.includes('cloud')) return <Cloud className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />;
        if (desc.includes('clear')) return isNightMode ? <Moon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" /> : <Sun className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />;
        if (desc.includes('snow')) return <Snowflake className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />;
        if (desc.includes('fog') || desc.includes('mist')) return <CloudFog className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />;
        if (desc.includes('thunder')) return <CloudLightning className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />;
        return <CloudSun className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />;
    };

    const bgGradient = isNightMode
        ? "bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900"
        : "bg-gradient-to-b from-blue-400 to-blue-600";

    const cardBg = isNightMode
        ? "bg-gray-800/40"
        : "bg-white/20";

    return (
        <div className={`min-h-screen ${bgGradient} p-2 sm:p-4 transition-colors duration-500`}>
            <div className="max-w-2xl mx-auto px-2 sm:px-4">
                <SearchBar isNightMode={isNightMode} location={location} setLocation={setLocation} />

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className={`${cardBg} backdrop-blur-md rounded-lg p-3 sm:p-6 mb-3 sm:mb-6`}>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 mb-3 sm:mb-0 text-white">
                                    {getWeatherIcon(weather.list[0].weather[0].description)}
                                    <div>
                                        <h2 className="text-lg sm:text-2xl font-bold text-white">{weather.city.country}, {weather.city.name}</h2>
                                        <p className="text-sm sm:text-base text-white/70">{weather.list[0].weather[0].description}</p>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <div className="text-2xl sm:text-4xl font-bold text-white">
                                        {Math.round(weather.list[0].main.temp)}°C
                                    </div>
                                    <div className="text-xs sm:text-sm text-white/70">
                                        H: {Math.round(weather.list[0].main.temp_max)}° L: {Math.round(weather.list[0].main.temp_min)}°
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2 text-white text-sm sm:text-base">
                                    <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Humidity: {weather.list[0].main.humidity}%</span>
                                </div>
                                <div className="flex items-center float-end space-x-2 text-white text-sm sm:text-base">
                                    <Wind className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Wind: {Math.round(weather.list[0].wind.speed)} km/h</span>
                                </div>
                            </div>
                        </div>

                        <div className={`${cardBg} backdrop-blur-md rounded-lg p-3 sm:p-6`}>
                            <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-6">5-Day Forecast</h3>
                            <div className="flex flex-col sm:grid sm:grid-cols-5 gap-2 sm:gap-4">
                                {filteredForecast.slice(1, 6).map((item) => (
                                    <div key={item.date} className={`${cardBg} rounded-lg p-2 sm:p-4 flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-start text-center transition-transform hover:scale-105`}>
                                        <div className="flex items-center sm:block">
                                            <p className="text-white font-semibold text-sm sm:text-base mb-0 sm:mb-2 w-16 sm:w-auto text-left sm:text-center">
                                                {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </p>
                                            <div className="text-white ml-2 sm:ml-0 sm:mb-3">
                                                {getWeatherIcon(item.description)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center sm:block">
                                            <p className="text-white font-bold text-base sm:text-lg mb-0 sm:mb-1">
                                                {Math.round(item.maxTemp)}°
                                            </p>
                                            <p className="text-white/70 text-xs sm:text-sm">
                                                L: {Math.round(item.minTemp)}°
                                            </p>
                                        </div>
                                        <div className="hidden sm:block mt-2 pt-2 border-t border-white/10">
                                            <div className="flex items-center justify-center space-x-1 text-white/70 text-xs">
                                                <Droplets className="h-3 w-3" />
                                                <span>{item.humidity}%</span>
                                            </div>
                                            <div className="flex items-center justify-center space-x-1 text-white/70 text-xs mt-1">
                                                <Wind className="h-3 w-3" />
                                                <span>{Math.round(item.windSpeed)} km/h</span>
                                            </div>
                                        </div>
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