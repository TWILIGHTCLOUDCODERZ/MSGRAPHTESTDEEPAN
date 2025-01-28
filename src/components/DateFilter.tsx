import React from 'react';
import { Calendar, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  downloadCSV: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  searchQuery,
  setSearchQuery,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  downloadCSV,
}) => {
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="p-2 border rounded"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || undefined}
            className="p-2 border rounded"
            placeholderText="End Date"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={clearFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Clear Filters
          </button>
          <button
            onClick={downloadCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Download className="h-5 w-5 inline-block mr-1" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;