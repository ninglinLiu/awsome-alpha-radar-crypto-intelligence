const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchSignals(filters: {
  source?: string
  type?: string
  min_score?: number
  hours?: number
  limit?: number
  offset?: number
}) {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, String(value))
    }
  })

  const response = await fetch(`${API_URL}/api/signals?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch signals')
  }

  const data = await response.json()
  return data.data || []
}

export async function fetchStats() {
  const response = await fetch(`${API_URL}/api/stats`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }

  const data = await response.json()
  return data.data || {}
}

export async function fetchSignalById(id: number) {
  const response = await fetch(`${API_URL}/api/signals/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch signal')
  }

  const data = await response.json()
  return data.data
}

export async function submitFeedback(feedback: {
  signal_id: number
  user_id?: string
  rating: number
  comment?: string
}) {
  const response = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  })

  if (!response.ok) {
    throw new Error('Failed to submit feedback')
  }

  return await response.json()
}

export async function triggerCrawl() {
  const response = await fetch(`${API_URL}/api/crawl`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to trigger crawl')
  }

  return await response.json()
}


