import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ isNightMode, location, setLocation }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    
    const handleLocationSearch = async() => {
        setLocation(query);
        setQuery('');
    }
    const searchBg = isNightMode
        ? "bg-gray-800/30"
        : "bg-white/20";

    const focusRing = isFocused
        ? isNightMode
            ? "ring-2 ring-blue-400"
            : "ring-2 ring-white"
        : "";

    return (
        <div className="relative mb-4 sm:mb-6">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search location..."
                className={`w-full p-3 sm:p-4 pr-12 rounded-lg ${searchBg} 
                    backdrop-blur-md text-white placeholder-white/70 
                    outline-none transition-all duration-300 
                    hover:bg-opacity-40 ${focusRing}`}
            />
            <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 
                    p-2 text-white/70 hover:text-white transition-colors 
                    duration-300 rounded-full hover:bg-white/10"
                onClick={handleLocationSearch}
            >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
        </div>
    );
};

export default SearchBar;