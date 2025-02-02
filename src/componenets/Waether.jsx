import React from "react";
import axios from "axios";
import { useEffect } from "react";

const Weather = () => {
    const apiKey = 'e0c63cd209f34f2c83a204458250102'
    // navigator.geolocation.getCurrentPosition((position) => {
    //     const lat = position.coords.latitude
    //     const long = position.coords.longitude
    //   console.log(lat, long)  
    // })
    useEffect(() => {
        const fecthData = async() => {
            const forCast = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=3`)

            console.log(forCast)
        }
        fecthData()
    })
    return (
        <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl text-white">Weather</h1>
        </div>
    );
}

export default Weather;