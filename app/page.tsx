'use client'

import { useEffect, useState } from 'react'
import Header from './components/Header'
import SignalCard from './components/SignalCard'
import StatsPanel from './components/StatsPanel'
import FilterBar from './components/FilterBar'
import { fetchSignals, fetchStats } from './lib/api'

export default function Home() {
  const [signals, setSignals] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    source: '',
    type: '',
    min_score: 0,
    hours: 48
  })

  useEffect(() => {
    loadData()
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [signalsData, statsData] = await Promise.all([
        fetchSignals(filters),
        fetchStats()
      ])
      setSignals(signalsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="mb-8 animate-fadeIn">
            <StatsPanel stats={stats} />
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar 
            filters={filters} 
            onFilterChange={setFilters}
            onRefresh={loadData}
          />
        </div>

        {/* Signals Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : signals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No signals found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {signals.map((signal, index) => (
              <SignalCard 
                key={signal.id} 
                signal={signal} 
                rank={index + 1}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {signals.length >= 50 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              Load More Signals
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="mb-2">
            🛰️ <span className="gradient-text font-semibold">Alpha Radar</span> - 
            Decentralized Crypto Intelligence Aggregator
          </p>
          <p className="text-sm">
            "信息自由的起点，是洞察之物的公平。"
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="https://github.com/ninglinLiu/awsome-alpha-radar-crypto-intelligence" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
              ⭐ GitHub
            </a>
            <a href="https://twitter.com/ninglin000" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
              🐦 X (Twitter)
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

