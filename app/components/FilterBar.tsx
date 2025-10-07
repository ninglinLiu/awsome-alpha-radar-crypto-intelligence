interface FilterBarProps {
  filters: {
    source: string
    type: string
    min_score: number
    hours: number
  }
  onFilterChange: (filters: any) => void
  onRefresh: () => void
}

export default function FilterBar({ filters, onFilterChange, onRefresh }: FilterBarProps) {
  const sources = ['All', 'Binance', 'CoinDesk', 'DeFiLlama', 'CoinMarketCap']
  const types = ['All', 'listing', 'announcement', 'onchain', 'news', 'trending']
  const timeRanges = [
    { label: '6h', value: 6 },
    { label: '24h', value: 24 },
    { label: '48h', value: 48 },
    { label: '7d', value: 168 }
  ]

  const handleSourceChange = (source: string) => {
    onFilterChange({ ...filters, source: source === 'All' ? '' : source })
  }

  const handleTypeChange = (type: string) => {
    onFilterChange({ ...filters, type: type === 'All' ? '' : type })
  }

  const handleTimeRangeChange = (hours: number) => {
    onFilterChange({ ...filters, hours })
  }

  const handleScoreChange = (score: number) => {
    onFilterChange({ ...filters, min_score: score })
  }

  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>🔍</span> Filters
        </h3>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          <span>🔄</span> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Source Filter */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Source</label>
          <select
            value={filters.source || 'All'}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Type</label>
          <select
            value={filters.type || 'All'}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'All' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Time Range</label>
          <div className="flex gap-2">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value)}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  filters.hours === range.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Min Score Filter */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Min Score: {filters.min_score}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.min_score}
            onChange={(e) => handleScoreChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  )
}

