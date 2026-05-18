# Comprehensive Project Documentation
## Final Year Project: AI-Powered Fake News Detection Platform

---

### 1. Abstract
The rapid spread of misinformation and fake news on digital platforms poses a significant threat to public trust and society. This project aims to combat this issue by developing a full-stack, AI-powered Fake News Detection Platform. Utilizing Natural Language Processing (NLP) and Machine Learning (ML) techniques, the system classifies news articles as either **REAL** or **FAKE** with high accuracy. The platform provides a user-friendly frontend dashboard, a secure backend, and a dedicated machine learning microservice.

---

### 2. Objectives
- **Automated Detection:** To automatically analyze the textual content of news articles and detect fabricated information.
- **High Accuracy:** To utilize ensemble Machine Learning models to achieve over 95% accuracy in text classification.
- **Usability:** To provide a responsive, intuitive Web Application where users can paste news text and get instant credibility scores.
- **Admin Management:** To allow administrators to upload new datasets, retrain models dynamically, and monitor platform statistics.

---

### 3. System Architecture
The application is built on a **Microservices Architecture**, separating the user interface, business logic, and heavy machine learning computations.

1. **Frontend (Client-Side):** A responsive Single Page Application (SPA) built with React.js that communicates with the backend via RESTful APIs.
2. **Backend (Server-Side):** A Node.js/Express application acting as the primary API gateway, handling user authentication, database management, and routing prediction requests to the ML service.
3. **ML Service (Microservice):** A Python Flask API dedicated purely to text preprocessing, keyword extraction, and executing the Machine Learning models.
4. **Database Layer:** A local SQLite relational database storing user credentials, historical predictions, and dataset metadata.

---

### 4. Technology Stack
#### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Vanilla CSS (Modern Glassmorphism Design, Fully Responsive)
- **State Management:** React Context API
- **Icons & Animations:** Lucide React, Framer Motion

#### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Security:** JWT (JSON Web Tokens) for Authentication, Bcrypt for password hashing.

#### Machine Learning Service
- **Language:** Python 3.10+
- **Web Framework:** Flask
- **Data Processing:** Pandas, NumPy
- **NLP & ML:** Scikit-Learn (TF-IDF, Logistic Regression, Naive Bayes), NLTK (Stopwords removal, Lemmatization)

---

### 5. Dataset Description
The model is trained on the **ISOT Fake News Detection Dataset** from Kaggle, a widely recognized academic dataset.
- **Total Records:** 44,898 articles.
- **Real News (`True.csv`):** 21,417 articles sourced from verified publishers (e.g., Reuters).
- **Fake News (`Fake.csv`):** 23,481 articles flagged by fact-checking organizations like PolitiFact.
- **Features Used:** `Title` and `Text` are combined to analyze the semantic meaning of the article.

---

### 6. Machine Learning Methodology
#### 6.1 Data Preprocessing
Before feeding text into the models, the Python ML service executes a rigorous NLP pipeline:
1. **Lowercasing:** Converting all text to lowercase to maintain uniformity.
2. **Noise Removal:** Stripping out URLs, HTML tags, and special characters using Regex.
3. **Tokenization & Stopword Removal:** Breaking text into tokens and removing common English stopwords (e.g., "the", "is", "at") using the NLTK library.
4. **Vectorization:** Using `TfidfVectorizer` to convert text into numerical format. It extracts unigrams and bigrams (`ngram_range=(1,2)`) and limits features to 10,000 for optimal memory usage and performance.

#### 6.2 Model Selection & Training
The system uses an **Ensemble Approach** utilizing two distinct algorithms:
1. **Logistic Regression (LR):** Achieves **99.19% Accuracy**. LR is highly effective for linearly separable, high-dimensional text data.
2. **Multinomial Naive Bayes (NB):** Achieves **95.68% Accuracy**. A probabilistic classifier that calculates the likelihood of a text belonging to a class based on word frequencies.

**Prediction Logic:** When a user submits an article, both models evaluate the text. The final confidence score is calculated using a weighted average (60% LR, 40% NB) to provide a highly reliable final prediction.

---

### 7. Core Modules & Features
#### User Module
- **Authentication:** Secure Login and Registration using JWT.
- **Dashboard:** A personalized interface where users can submit news articles for scanning.
- **History:** Users can view their past scans, including confidence scores and extracted keywords.
- **Profile:** Theme settings and account management.

#### Admin Module
- **Analytics:** A high-level overview of total users, predictions made, and platform growth.
- **User Management:** Ability to view, activate, deactivate, or delete user accounts.
- **Dataset Management:** Admins can upload new CSV datasets.
- **Dynamic Retraining:** A unique feature allowing admins to click "Retrain Model." This triggers the Python service to read the newly uploaded dataset, vectorize the data, train new LR and NB models, and save them (`.joblib`) without restarting the server.

---

### 8. Deployment & Execution Flow
#### Manual Local Execution
1. **Backend:** Navigate to `/backend`, run `npm install`, then `npm run dev`. (Runs on port 5000).
2. **ML Service:** Navigate to `/ml-service`, activate Python virtual environment, install `requirements.txt`, and run `flask run --port=5001`.
3. **Frontend:** Navigate to `/frontend`, run `npm install`, then `npm run dev`. (Runs on port 5173).

#### Production Deployment Strategy
- **Frontend (Vercel):** Connected to the GitHub repository. Vercel automatically builds the Vite React app and serves it globally on a CDN.
- **Backend (Render):** Deployed as a Node Web Service. Environment variables (`JWT_SECRET`, `ML_SERVICE_URL`) are configured in the Render dashboard.
- **ML Service (Render):** Deployed as a Python Web Service using `gunicorn` to serve the Flask API.

---

### 9. Conclusion
This Fake News Detection Platform successfully demonstrates the integration of modern web development technologies with advanced machine learning algorithms. By achieving over 95% accuracy and wrapping the complex ML logic in an intuitive, responsive user interface, it provides a highly viable tool for combating misinformation in the digital age.
