interface Signal {
  id: number
  title: string
  source: string
  type: string
  timestamp: string
  score: number
  sentiment: string
  tags: string[]
  url: string
  summary?: string
}

interface SignalCardProps {
  signal: Signal
  rank: number
}

export default function SignalCard({ signal, rank }: SignalCardProps) {
  const typeEmoji: Record<string, string> = {
    listing: '🆕',
    announcement: '📢',
    onchain: '⛓️',
    news: '📰',
    trending: '🔥'
  }

  const sentimentColor: Record<string, string> = {
    Positive: 'text-green-400 bg-green-900/30',
    Negative: 'text-red-400 bg-red-900/30',
    Neutral: 'text-gray-400 bg-gray-900/30'
  }

  const scoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
      <div className="flex items-start justify-between gap-4">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-700'
          }`}>
            {rank}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-start gap-2 mb-2">
            <span className="text-2xl">{typeEmoji[signal.type] || '📌'}</span>
            <h3 className="text-lg font-semibold text-white leading-tight flex-1">
              {signal.title}
            </h3>
          </div>

          {/* Summary */}
          {signal.summary && (
            <p className="text-gray-300 mb-3 text-sm leading-relaxed">
              {signal.summary}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full">
              {signal.source}
            </span>
            
            <span className={`px-3 py-1 rounded-full ${sentimentColor[signal.sentiment] || sentimentColor.Neutral}`}>
              {signal.sentiment}
            </span>

            {signal.tags && typeof signal.tags === 'string' 
              ? JSON.parse(signal.tags).slice(0, 3).map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full">
                    #{tag}
                  </span>
                ))
              : Array.isArray(signal.tags) 
                ? signal.tags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full">
                      #{tag}
                    </span>
                  ))
                : null
            }

            <span className="text-gray-500">
              🕒 {formatTimestamp(signal.timestamp)}
            </span>
          </div>
        </div>

        {/* Score & Action */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <div className="text-center">
            <div className={`text-3xl font-bold ${scoreColor(signal.score)}`}>
              {signal.score.toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">Score</div>
          </div>

          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
          >
            View →
          </a>
        </div>
      </div>
    </div>
  )
}

