import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Download required NLTK data
def download_nltk_data():
    packages = ['punkt', 'stopwords', 'wordnet', 'averaged_perceptron_tagger', 'punkt_tab']
    for pkg in packages:
        try:
            nltk.download(pkg, quiet=True)
        except Exception as e:
            print(f"Could not download {pkg}: {e}")

download_nltk_data()

lemmatizer = WordNetLemmatizer()

try:
    STOP_WORDS = set(stopwords.words('english'))
except:
    STOP_WORDS = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'])

def clean_text(text):
    """Full NLP preprocessing pipeline."""
    if not text or not isinstance(text, str):
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # Remove punctuation and special characters
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Tokenize
    try:
        tokens = word_tokenize(text)
    except:
        tokens = text.split()
    
    # Remove stopwords and lemmatize
    tokens = [
        lemmatizer.lemmatize(token)
        for token in tokens
        if token not in STOP_WORDS and len(token) > 2
    ]
    
    return ' '.join(tokens)

def extract_keywords(text, top_n=8):
    """Extract top keywords from text."""
    if not text:
        return []
    
    words = text.lower().split()
    
    # Filter stopwords and short words
    filtered = [w for w in words if w not in STOP_WORDS and len(w) > 3 and w.isalpha()]
    
    # Count frequency
    freq = {}
    for word in filtered:
        freq[word] = freq.get(word, 0) + 1
    
    # Sort by frequency and return top_n
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [word for word, count in sorted_words[:top_n]]

def get_text_features(text):
    """Get numerical features of text."""
    words = text.split()
    sentences = re.split(r'[.!?]+', text)
    
    return {
        'word_count': len(words),
        'char_count': len(text),
        'sentence_count': len([s for s in sentences if s.strip()]),
        'avg_word_length': sum(len(w) for w in words) / max(len(words), 1),
        'exclamation_count': text.count('!'),
        'question_count': text.count('?'),
        'uppercase_ratio': sum(1 for c in text if c.isupper()) / max(len(text), 1),
    }
