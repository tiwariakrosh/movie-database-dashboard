"use client";

import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface DashboardFiltersProps {
  onSearchChange: (search: string) => void;
  onGenreChange: (genre: string) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Crime",
  "Drama",
  "Fantasy",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const SORT_OPTIONS = [
  { value: "rating", label: "Rating (High to Low)" },
  { value: "rating-asc", label: "Rating (Low to High)" },
  { value: "year", label: "Year (Newest)" },
  { value: "year-asc", label: "Year (Oldest)" },
  { value: "title", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "reviewCount", label: "Review Count" },
];

export function DashboardFilters({
  onSearchChange,
  onGenreChange,
  onSortChange,
  onPageSizeChange,
}: DashboardFiltersProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleSortChange = useCallback(
    (value: string) => {
      if (value.includes("-asc")) {
        const sortBy = value.replace("-asc", "");
        onSortChange(sortBy, "asc");
      } else if (value.includes("-desc")) {
        const sortBy = value.replace("-desc", "");
        onSortChange(sortBy, "desc");
      } else {
        onSortChange(value, "desc");
      }
    },
    [onSortChange]
  );

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col-reverse md:flex-row justify-between gap-3">
        <div className="flex flex-wrap gap-2 w-full md:w-auto mb-2">
          <Select onValueChange={onGenreChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {GENRES.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => onPageSizeChange(Number.parseInt(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 relative w-full h-fit md:w-auto max-w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search movies, directors, cast..."
            className="pl-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
