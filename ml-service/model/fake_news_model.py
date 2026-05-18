import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved')
LR_MODEL_PATH = os.path.join(MODEL_DIR, 'lr_model.joblib')
NB_MODEL_PATH = os.path.join(MODEL_DIR, 'nb_model.joblib')

os.makedirs(MODEL_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# Synthetic training data (used when no real dataset is available)
# ---------------------------------------------------------------------------
FAKE_SAMPLES = [
    "SHOCKING: Scientists discover miracle cure that doctors don't want you to know about",
    "BREAKING: President secretly conspires with aliens to control world economy",
    "You won't believe what this celebrity did that the mainstream media is hiding",
    "EXPOSED: Government putting chemicals in water to control population mind",
    "Miracle weight loss pill doctors hate – lose 30 pounds in 3 days guaranteed",
    "URGENT: Share this before it gets deleted – the truth about vaccines",
    "Secret underground society controls all world governments shocking revelation",
    "This man cured cancer with one simple trick big pharma tried to suppress",
    "ALERT: 5G towers are actually mind control devices leaked documents reveal",
    "Billionaires plan to microchip entire population through drinking water",
    "Anonymous insider reveals deep state plot to overthrow elected government",
    "Fake moon landing finally proven by leaked NASA documents shocking truth",
    "Politicians caught in massive pedophile ring mainstream media won't report",
    "New world order globalists planning to eliminate 90% of world population",
    "Chemtrails proven to contain toxic substances government denies existence",
    "Alien technology discovered in Area 51 government cover-up for 70 years",
    "Famous actor reveals Hollywood satanic rituals in explosive tell-all interview",
    "Central banks printing unlimited money to enslave population in debt forever",
    "Climate change is a hoax invented by globalists to impose carbon taxes",
    "Election was stolen by corrupt officials using foreign voting machines confirmed",
]

REAL_SAMPLES = [
    "The Federal Reserve raised interest rates by 25 basis points at its latest meeting",
    "Scientists published new research on climate change effects in Nature journal",
    "The United Nations held emergency talks on the ongoing humanitarian crisis",
    "Stock markets closed lower today amid concerns about inflation and supply chains",
    "Health officials confirmed new guidelines for COVID-19 vaccination schedules",
    "The government announced a new infrastructure investment plan worth billions",
    "Researchers at MIT developed a new battery technology with higher energy density",
    "The Supreme Court issued a ruling on campaign finance regulations today",
    "NASA successfully launched its latest satellite mission to study Earth's atmosphere",
    "European Central Bank announced plans to gradually reduce quantitative easing",
    "World Health Organization released updated data on global disease burden trends",
    "Congressional leaders reached a bipartisan agreement on the budget proposal",
    "Apple reported quarterly earnings that exceeded analyst expectations slightly",
    "New study shows regular exercise reduces risk of cardiovascular disease significantly",
    "The International Monetary Fund revised its global growth forecast downward",
    "City council approved new zoning regulations for affordable housing development",
    "Scientists discover new species of deep sea fish in Pacific Ocean expedition",
    "University researchers publish findings on renewable energy efficiency improvements",
    "Federal investigators concluded their probe into corporate accounting irregularities",
    "Local government announces expansion of public transportation infrastructure",
]

def create_training_data():
    import pandas as pd
    import glob
    
    base_dir = os.path.dirname(__file__)
    project_root = os.path.join(base_dir, '..', '..')
    
    # Try to find Fake.csv and True.csv anywhere in the project
    fake_csvs = [f for f in glob.glob(os.path.join(project_root, '**', 'Fake.csv'), recursive=True) if os.path.isfile(f)]
    true_csvs = [f for f in glob.glob(os.path.join(project_root, '**', 'True.csv'), recursive=True) if os.path.isfile(f)]
    dataset_csvs = [f for f in glob.glob(os.path.join(project_root, '**', 'dataset.csv'), recursive=True) if os.path.isfile(f)]
    
    texts = []
    labels = []
    
    try:
        # Load Kaggle Fake.csv and True.csv if they exist
        if fake_csvs or true_csvs:
            if fake_csvs:
                print(f"Loading Fake news dataset from {fake_csvs[0]}...")
                df_fake = pd.read_csv(fake_csvs[0])
                if 'text' in df_fake.columns:
                    fake_texts = df_fake['text'].astype(str).tolist()
                    texts.extend(fake_texts)
                    labels.extend([0] * len(fake_texts))
                    print(f"Loaded {len(fake_texts)} Fake samples.")
                    
            if true_csvs:
                print(f"Loading True news dataset from {true_csvs[0]}...")
                df_true = pd.read_csv(true_csvs[0])
                if 'text' in df_true.columns:
                    true_texts = df_true['text'].astype(str).tolist()
                    texts.extend(true_texts)
                    labels.extend([1] * len(true_texts))
                    print(f"Loaded {len(true_texts)} True samples.")
                    
            if texts:
                return texts, labels

        # Fallback to dataset.csv with a label column
        if dataset_csvs:
            dataset_path = dataset_csvs[0]
            print(f"Loading combined dataset from {dataset_path}...")
            df = pd.read_csv(dataset_path)
            
            text_col = next((c for c in ['text', 'news', 'content', 'title', 'article'] if c in df.columns), None)
            label_col = next((c for c in ['label', 'target', 'is_fake', 'fake', 'class'] if c in df.columns), None)
            
            if text_col and label_col:
                df = df.dropna(subset=[text_col, label_col])
                texts = df[text_col].astype(str).tolist()
                
                df_labels = df[label_col]
                if df_labels.dtype == object:
                    df_labels = df_labels.astype(str).str.lower().map({'real': 1, 'true': 1, '1': 1, 'fake': 0, 'false': 0, '0': 0}).fillna(0)
                labels = df_labels.astype(int).tolist()
                print(f"Loaded {len(texts)} combined samples.")
                return texts, labels
            else:
                print("Could not find text/label columns in dataset.csv.")
    except Exception as e:
        print(f"Error loading dataset: {e}")


    print("No valid dataset.csv found. Using synthetic training data...")
    texts = FAKE_SAMPLES * 15 + REAL_SAMPLES * 15
    labels = [0] * (len(FAKE_SAMPLES) * 15) + [1] * (len(REAL_SAMPLES) * 15)

    # Add augmented samples
    import random
    random.seed(42)
    aug_texts, aug_labels = [], []
    for text, label in zip(texts, labels):
        words = text.split()
        if len(words) > 5:
            shuffled = words[:]
            random.shuffle(shuffled[:3])
            aug_texts.append(' '.join(shuffled))
            aug_labels.append(label)

    texts += aug_texts
    labels += aug_labels
    return texts, labels


def train_models():
    """Train Logistic Regression and Naive Bayes models."""
    print("Preparing training data...")
    texts, labels = create_training_data()
    X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42)

    # Logistic Regression pipeline
    lr_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True,
            min_df=2,
        )),
        ('clf', LogisticRegression(max_iter=1000, C=1.0, random_state=42))
    ])

    # Naive Bayes pipeline
    nb_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True,
        )),
        ('clf', MultinomialNB(alpha=0.1))
    ])

    print("Training Logistic Regression...")
    lr_pipeline.fit(X_train, y_train)
    lr_preds = lr_pipeline.predict(X_test)
    lr_acc = accuracy_score(y_test, lr_preds)
    print(f"LR Accuracy: {lr_acc:.4f}")

    print("Training Naive Bayes...")
    nb_pipeline.fit(X_train, y_train)
    nb_preds = nb_pipeline.predict(X_test)
    nb_acc = accuracy_score(y_test, nb_preds)
    print(f"NB Accuracy: {nb_acc:.4f}")

    # Save models
    joblib.dump(lr_pipeline, LR_MODEL_PATH)
    joblib.dump(nb_pipeline, NB_MODEL_PATH)
    print(f"Models saved to {MODEL_DIR}")

    return {'lr_accuracy': lr_acc, 'nb_accuracy': nb_acc}


def load_models():
    """Load saved models or train new ones."""
    if os.path.exists(LR_MODEL_PATH) and os.path.exists(NB_MODEL_PATH):
        print("Loading saved models...")
        lr_model = joblib.load(LR_MODEL_PATH)
        nb_model = joblib.load(NB_MODEL_PATH)
        print("Models loaded successfully")
        return lr_model, nb_model
    else:
        print("No saved models found. Training new models...")
        train_models()
        return load_models()


def predict(text, lr_model, nb_model):
    """Predict with ensemble of both models."""
    from preprocessing.text_processor import clean_text, extract_keywords

    cleaned = clean_text(text)
    if not cleaned:
        cleaned = text

    # Get probabilities from both models
    lr_proba = lr_model.predict_proba([cleaned])[0]
    nb_proba = nb_model.predict_proba([cleaned])[0]

    # Ensemble: weighted average
    ensemble_proba = 0.6 * lr_proba + 0.4 * nb_proba

    pred_idx = np.argmax(ensemble_proba)
    confidence = round(float(ensemble_proba[pred_idx]) * 100, 1)
    prediction = 'REAL' if pred_idx == 1 else 'FAKE'

    keywords = extract_keywords(text)

    return {
        'prediction': prediction,
        'confidence': confidence,
        'lr_confidence': round(float(lr_proba[pred_idx]) * 100, 1),
        'nb_confidence': round(float(nb_proba[pred_idx]) * 100, 1),
        'keywords': keywords,
        'model': 'Ensemble (LR + Naive Bayes)',
        'cleaned_text_length': len(cleaned.split()),
    }
