
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  recentSearches: string[];
  onSelectRecentSearch: (city: string) => void;
  onClearRecentSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  recentSearches,
  onSelectRecentSearch,
  onClearRecentSearch
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city name (e.g., London, Tokyo, New York)"
          className="rounded-xl"
        />
        <Button type="submit" variant="default" className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      
      {recentSearches.length > 0 && (
        <div className="p-4 bg-secondary dark:bg-secondary/50 rounded-xl animate-fade-in">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((city) => (
              <div 
                key={city} 
                className="flex items-center bg-background dark:bg-card px-3 py-1.5 rounded-lg text-sm"
              >
                <button
                  onClick={() => onSelectRecentSearch(city)}
                  className="mr-1.5"
                >
                  {city}
                </button>
                <button
                  onClick={() => onClearRecentSearch(city)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove ${city} from recent searches`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
