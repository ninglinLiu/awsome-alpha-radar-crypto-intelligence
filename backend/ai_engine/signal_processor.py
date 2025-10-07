"""
AI Signal Engine - 语义聚类、情绪分析、热度计算
"""
import os
import json
from datetime import datetime, timedelta
from typing import List, Dict
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

class SignalProcessor:
    """AI驱动的信号处理引擎"""
    
    def __init__(self):
        self.embedding_model = "text-embedding-3-small"
        self.summarization_model = "gpt-4o-mini"
        
    def get_embedding(self, text: str) -> List[float]:
        """获取文本的向量表示"""
        try:
            response = client.embeddings.create(
                input=text,
                model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"❌ Embedding error: {e}")
            return [0.0] * 1536
    
    def analyze_sentiment(self, text: str) -> Dict:
        """分析情绪（Positive/Negative/Neutral）"""
        try:
            response = client.chat.completions.create(
                model=self.summarization_model,
                messages=[
                    {"role": "system", "content": "You are a crypto market sentiment analyzer. Respond with ONLY one word: Positive, Negative, or Neutral."},
                    {"role": "user", "content": f"Analyze sentiment: {text}"}
                ],
                temperature=0.3,
                max_tokens=10
            )
            sentiment = response.choices[0].message.content.strip()
            
            # Convert to score
            sentiment_scores = {
                'Positive': 1.0,
                'Neutral': 0.5,
                'Negative': 0.0
            }
            return {
                'sentiment': sentiment,
                'score': sentiment_scores.get(sentiment, 0.5)
            }
        except Exception as e:
            print(f"❌ Sentiment analysis error: {e}")
            return {'sentiment': 'Neutral', 'score': 0.5}
    
    def generate_summary(self, text: str, max_length: int = 100) -> str:
        """生成智能摘要"""
        try:
            response = client.chat.completions.create(
                model=self.summarization_model,
                messages=[
                    {"role": "system", "content": "Summarize crypto news in one clear sentence. Focus on actionable insights."},
                    {"role": "user", "content": text}
                ],
                temperature=0.5,
                max_tokens=50
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Summary generation error: {e}")
            return text[:max_length] + "..."
    
    def calculate_heat_index(self, signals: List[Dict], time_window_hours: int = 24) -> float:
        """计算热度指数（基于时间窗口内的信号密度）"""
        cutoff_time = datetime.utcnow() - timedelta(hours=time_window_hours)
        recent_signals = [
            s for s in signals 
            if datetime.fromisoformat(s.get('timestamp', '1970-01-01T00:00:00Z').replace('Z', '+00:00')) > cutoff_time
        ]
        
        # Heat = count * recency_boost
        heat = len(recent_signals) * (1 + (len(recent_signals) / 10))
        return min(heat, 100.0)
    
    def semantic_clustering(self, signals: List[Dict], similarity_threshold: float = 0.85) -> List[List[Dict]]:
        """语义聚类：将相似新闻合并"""
        if not signals:
            return []
        
        # Get embeddings for all signals
        embeddings = []
        for signal in signals:
            text = f"{signal.get('title', '')} {signal.get('raw_text', '')}"
            embedding = self.get_embedding(text)
            embeddings.append(embedding)
        
        embeddings = np.array(embeddings)
        
        # Simple clustering based on cosine similarity
        clusters = []
        used_indices = set()
        
        for i, emb1 in enumerate(embeddings):
            if i in used_indices:
                continue
            
            cluster = [signals[i]]
            used_indices.add(i)
            
            for j, emb2 in enumerate(embeddings):
                if j in used_indices or i == j:
                    continue
                
                # Cosine similarity
                similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
                
                if similarity >= similarity_threshold:
                    cluster.append(signals[j])
                    used_indices.add(j)
            
            clusters.append(cluster)
        
        return clusters
    
    def calculate_signal_score(self, signal: Dict, source_trust: float = 0.5) -> float:
        """
        多维度信号评分
        Score = (w1 * SourceTrust) + (w2 * Sentiment) + (w3 * Recency) + (w4 * Type)
        """
        # Weights
        w1, w2, w3, w4 = 0.3, 0.2, 0.3, 0.2
        
        # Source trust (from database or default)
        source_score = source_trust
        
        # Sentiment score
        sentiment_text = signal.get('sentiment', 'Neutral')
        sentiment_map = {'Positive': 1.0, 'Neutral': 0.5, 'Negative': 0.0}
        sentiment_score = sentiment_map.get(sentiment_text, 0.5)
        
        # Recency score (decay over 48 hours)
        try:
            timestamp = datetime.fromisoformat(signal.get('timestamp', '1970-01-01T00:00:00Z').replace('Z', '+00:00'))
            hours_ago = (datetime.utcnow().replace(tzinfo=timestamp.tzinfo) - timestamp).total_seconds() / 3600
            recency_score = max(0, 1 - (hours_ago / 48))
        except:
            recency_score = 0.5
        
        # Type score (importance by type)
        type_map = {
            'listing': 1.0,
            'announcement': 0.9,
            'onchain': 0.8,
            'news': 0.6,
            'trending': 0.7
        }
        type_score = type_map.get(signal.get('type', 'news'), 0.5)
        
        # Final score
        score = (w1 * source_score + w2 * sentiment_score + 
                w3 * recency_score + w4 * type_score) * 100
        
        return round(score, 2)
    
    def process_signal(self, signal: Dict) -> Dict:
        """处理单个信号：添加情绪、摘要、评分"""
        text = f"{signal.get('title', '')} {signal.get('raw_text', '')}"
        
        # Sentiment analysis
        sentiment_result = self.analyze_sentiment(text)
        signal['sentiment'] = sentiment_result['sentiment']
        
        # Generate summary if raw_text exists
        if signal.get('raw_text'):
            signal['summary'] = self.generate_summary(text)
        else:
            signal['summary'] = signal.get('title', '')[:100]
        
        # Calculate score
        signal['score'] = self.calculate_signal_score(signal)
        
        return signal
    
    def process_batch(self, signals: List[Dict]) -> List[Dict]:
        """批量处理信号"""
        processed = []
        print(f"🤖 Processing {len(signals)} signals with AI...")
        
        for i, signal in enumerate(signals):
            try:
                processed_signal = self.process_signal(signal)
                processed.append(processed_signal)
                if (i + 1) % 10 == 0:
                    print(f"   Processed {i + 1}/{len(signals)}...")
            except Exception as e:
                print(f"❌ Error processing signal: {e}")
                processed.append(signal)
        
        # Sort by score
        processed.sort(key=lambda x: x.get('score', 0), reverse=True)
        
        print(f"✅ AI processing completed!")
        return processed


if __name__ == "__main__":
    # Test
    processor = SignalProcessor()
    
    test_signal = {
        'title': 'Bitcoin ETF approval imminent',
        'source': 'CoinDesk',
        'type': 'news',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'raw_text': 'SEC expected to approve Bitcoin ETF by end of week'
    }
    
    result = processor.process_signal(test_signal)
    print(json.dumps(result, indent=2))

