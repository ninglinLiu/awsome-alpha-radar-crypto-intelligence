interface StatsData {
  overview: {
    total_signals: string
    total_sources: string
    avg_score: string
    positive_count: string
    negative_count: string
    neutral_count: string
  }
  by_source: Array<{ source: string; count: string; avg_score: string }>
  by_type: Array<{ type: string; count: string }>
}

interface StatsPanelProps {
  stats: StatsData
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const { overview } = stats

  const StatCard = ({ 
    icon, 
    label, 
    value, 
    color = 'purple' 
  }: { 
    icon: string
    label: string
    value: string | number
    color?: string 
  }) => (
    <div className="glass rounded-xl p-4 hover:border-purple-500 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <div className={`text-2xl font-bold text-${color}-400`}>{value}</div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  )

  const totalSignals = parseInt(overview.total_signals) || 0
  const positiveCount = parseInt(overview.positive_count) || 0
  const negativeCount = parseInt(overview.negative_count) || 0
  const neutralCount = parseInt(overview.neutral_count) || 0

  const sentimentScore = totalSignals > 0 
    ? ((positiveCount / totalSignals) * 100).toFixed(0)
    : 50

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📡"
          label="Total Signals (24h)"
          value={totalSignals}
          color="blue"
        />
        
        <StatCard
          icon="⭐"
          label="Avg Score"
          value={parseFloat(overview.avg_score).toFixed(1)}
          color="yellow"
        />
        
        <StatCard
          icon="🔗"
          label="Data Sources"
          value={overview.total_sources}
          color="purple"
        />
        
        <StatCard
          icon="📊"
          label="Market Sentiment"
          value={`${sentimentScore}%`}
          color={parseInt(sentimentScore) >= 60 ? 'green' : parseInt(sentimentScore) >= 40 ? 'yellow' : 'red'}
        />
      </div>

      {/* Sentiment Breakdown */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>💭</span> Sentiment Analysis
        </h3>
        
        <div className="space-y-3">
          {/* Positive */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-400">📈 Positive</span>
              <span className="text-gray-400">{positiveCount} ({totalSignals > 0 ? ((positiveCount/totalSignals)*100).toFixed(0) : 0}%)</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${totalSignals > 0 ? (positiveCount/totalSignals)*100 : 0}%` }}
              />
            </div>
          </div>

          {/* Neutral */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">➡️ Neutral</span>
              <span className="text-gray-400">{neutralCount} ({totalSignals > 0 ? ((neutralCount/totalSignals)*100).toFixed(0) : 0}%)</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gray-500 to-gray-400 transition-all duration-500"
                style={{ width: `${totalSignals > 0 ? (neutralCount/totalSignals)*100 : 0}%` }}
              />
            </div>
          </div>

          {/* Negative */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-400">📉 Negative</span>
              <span className="text-gray-400">{negativeCount} ({totalSignals > 0 ? ((negativeCount/totalSignals)*100).toFixed(0) : 0}%)</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                style={{ width: `${totalSignals > 0 ? (negativeCount/totalSignals)*100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


