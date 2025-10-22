import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

export function FilterControls({ sortOrder, onSortChange, showUpcoming, onShowUpcomingChange }) {
  const handleSortChange = (newSort) => {
    onSortChange(newSort);
    const sortLabel = newSort === 'newest-first' ? 'newest first' : 'oldest first';
    toast.success(`Sorted by ${sortLabel}`);
  };

  const handleUpcomingToggle = (checked) => {
    onShowUpcomingChange(checked);
    toast.success(checked ? 'Showing upcoming concerts' : 'Hiding upcoming concerts');
  };
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">Filters:</span>
        </div>

        {/* Sort Order Select */}
        <div className="flex items-center gap-2">
          <Label htmlFor="sort-order" className="text-white/80 text-sm">
            Sort by:
          </Label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newest-first" className="bg-purple-900">Newest First</option>
            <option value="oldest-first" className="bg-purple-900">Oldest First</option>
          </select>
        </div>

        {/* Show Upcoming Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-upcoming"
            checked={showUpcoming}
            onCheckedChange={handleUpcomingToggle}
            className="border-white/40 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
          <Label
            htmlFor="show-upcoming"
            className="text-white/80 text-sm cursor-pointer"
          >
            Show upcoming concerts
          </Label>
        </div>
      </div>
    </Card>
  );
}
