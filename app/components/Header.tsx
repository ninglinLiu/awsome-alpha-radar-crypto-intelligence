export default function Header() {
  return (
    <header className="border-b border-gray-800 glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-4xl">🛰️</div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Alpha Radar
              </h1>
              <p className="text-sm text-gray-400">
                Decentralized Crypto Intelligence
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                onClick={() => window.open('https://twitter.com/ninglin000', '_blank')}
              >
                🐦 Follow on X
              </button>
              <button 
                className="px-4 py-2 border border-gray-700 hover:border-purple-500 rounded-lg transition-colors text-sm font-medium"
                onClick={() => window.open('https://github.com/ninglinLiu/awsome-alpha-radar-crypto-intelligence', '_blank')}
              >
                ⭐ Star on GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

