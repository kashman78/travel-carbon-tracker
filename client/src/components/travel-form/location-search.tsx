import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Search } from "lucide-react";
import { searchPlaces } from "@/lib/google-maps";

interface LocationSearchProps {
  value: string;
  onLocationSelect: (address: string, coordinates: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function LocationSearch({ 
  value, 
  onLocationSelect, 
  placeholder = "Search for location...",
  required = false 
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ address: string; coordinates: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchPlaces(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (address: string, coordinates: string) => {
    onLocationSelect(address, coordinates);
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        className="pr-12"
        required={required}
        readOnly
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {isSearching && (
              <div className="text-sm text-gray-500 text-center py-4">
                Searching...
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleLocationSelect(result.address, result.coordinates)}
                  >
                    <div className="font-medium text-sm">{result.address}</div>
                    <div className="text-xs text-gray-500">{result.coordinates}</div>
                  </div>
                ))}
              </div>
            )}
            
            {!isSearching && searchQuery && searchResults.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4">
                No locations found. Try a different search term.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
