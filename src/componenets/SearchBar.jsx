import React, { useState } from 'react';
import { Search, Cloud, Sun, CloudRain, } from 'lucide-react';

const SearchBar = () => {
    const [location, setLocation] = useState('');


    return (
        <div className="relative mb-6" >
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search location..."
                className="w-full p-4 pr-12 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 outline-none"
            />
            <Search className="absolute right-4 top-4 text-white/70" />
        </div >

    );
};

export default SearchBar;