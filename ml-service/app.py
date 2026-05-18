import os
import sys
import time
import traceback

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5000", "*"])

# Load models at startup
print("🚀 Starting Fake News Detection ML Service...")
lr_model, nb_model = None, None
model_loaded = False
model_accuracy = {'lr': 0, 'nb': 0}
startup_time = time.time()

def load_ml_models():
    global lr_model, nb_model, model_loaded
    try:
        from model.fake_news_model import load_models
        lr_model, nb_model = load_models()
        model_loaded = True
        print("✅ ML Models ready!")
    except Exception as e:
        print(f"❌ Model loading error: {e}")
        traceback.print_exc()
        model_loaded = False

load_ml_models()


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'Fake News Detection ML API',
        'model_loaded': model_loaded,
        'uptime': round(time.time() - startup_time, 2)
    })


@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'online' if model_loaded else 'degraded',
        'model': 'Ensemble (Logistic Regression + Naive Bayes)',
        'vectorizer': 'TF-IDF (ngram 1-2, max_features=10000)',
        'model_loaded': model_loaded,
        'uptime_seconds': round(time.time() - startup_time, 2),
    })


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing "text" field in request body'}), 400

        text = data['text'].strip()
        if len(text) < 10:
            return jsonify({'error': 'Text must be at least 10 characters'}), 400

        if not model_loaded:
            return jsonify({'error': 'ML model not loaded. Please try again later.'}), 503

        start = time.time()
        from model.fake_news_model import predict as ml_predict
        result = ml_predict(text, lr_model, nb_model)
        result['processing_time_ms'] = round((time.time() - start) * 1000, 1)
        result['text_length'] = len(text)
        result['word_count'] = len(text.split())

        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/retrain', methods=['POST'])
def retrain():
    try:
        from model.fake_news_model import train_models
        print("🔄 Retraining models...")
        results = train_models()
        load_ml_models()
        return jsonify({
            'message': 'Models retrained successfully',
            'accuracy': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/analyze/batch', methods=['POST'])
def batch_analyze():
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        if not texts or not isinstance(texts, list):
            return jsonify({'error': 'Provide a "texts" array'}), 400
        if len(texts) > 50:
            return jsonify({'error': 'Max 50 texts per batch'}), 400

        from model.fake_news_model import predict as ml_predict
        results = []
        for text in texts:
            result = ml_predict(str(text), lr_model, nb_model)
            results.append(result)

        return jsonify({'results': results, 'total': len(results)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
