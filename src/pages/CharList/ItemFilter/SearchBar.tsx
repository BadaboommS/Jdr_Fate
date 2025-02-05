import { useEffect, useState } from "react";
import { SearchFilterList } from "./SearchFilterList";
import { SearchCharControl } from "./SearchCharControl";

interface SearchBarInterface {
    onSearch: (query: string) => void;
}

export function SearchBar ({ onSearch }: SearchBarInterface) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        onSearch(query !== '' ? query : '');
    }, [query, onSearch]);

    return (
        <div className="flex flex-col align-top h-screen w-50 bg-gray-200 flex items-center">
            <SearchCharControl changeQuery={(query: string) => setQuery(query)} />
            <SearchFilterList changeQuery={(query: string) => setQuery(query)} />
        </div>
    )
}