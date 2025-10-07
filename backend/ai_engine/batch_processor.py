"""
Batch AI Processor - Processes all unprocessed signals
"""
import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
from signal_processor import SignalProcessor
from dotenv import load_dotenv
import json

load_dotenv()

def connect_db():
    """Connect to PostgreSQL database"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not found in environment")
        sys.exit(1)
    
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def process_batch():
    """Process all signals that haven't been analyzed yet"""
    print("🤖 Starting batch AI processing...")
    
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        # Get signals without sentiment or score
        cursor.execute("""
            SELECT * FROM signals
            WHERE (sentiment IS NULL OR score = 0)
            AND timestamp > NOW() - INTERVAL '7 days'
            ORDER BY timestamp DESC
            LIMIT 100
        """)
        
        signals = cursor.fetchall()
        
        if not signals:
            print("✅ No signals to process")
            return
        
        print(f"📊 Found {len(signals)} signals to process")
        
        processor = SignalProcessor()
        
        # Process each signal
        for i, signal in enumerate(signals):
            try:
                # Convert to dict
                signal_dict = dict(signal)
                
                # Process with AI
                processed = processor.process_signal(signal_dict)
                
                # Update database
                cursor.execute("""
                    UPDATE signals
                    SET 
                        sentiment = %s,
                        score = %s,
                        summary = %s,
                        updated_at = NOW()
                    WHERE id = %s
                """, (
                    processed['sentiment'],
                    processed['score'],
                    processed.get('summary', signal_dict.get('title', '')[:200]),
                    signal_dict['id']
                ))
                
                if (i + 1) % 10 == 0:
                    conn.commit()
                    print(f"   ✅ Processed {i + 1}/{len(signals)} signals")
                
            except Exception as e:
                print(f"   ❌ Error processing signal {signal['id']}: {e}")
                continue
        
        conn.commit()
        print(f"✅ Batch processing completed! Processed {len(signals)} signals")
        
    except Exception as e:
        print(f"❌ Batch processing error: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    process_batch()


