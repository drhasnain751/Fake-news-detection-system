# Fake News Detection Platform

A full-stack machine learning platform designed to detect fake news using advanced natural language processing. The platform features an intuitive dashboard, an admin management panel, and a seamless ML microservice architecture.

## 🚀 Live Deployment Guide

### 1. Push to GitHub
1. Initialize git in your project root: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Create a new repository on GitHub.
5. Push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

### 2. Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `frontend`.
5. Add the Environment Variable `VITE_API_URL` pointing to your deployed backend URL.
6. Click **Deploy**.

### 3. Deploy Backend & ML Service on Render
1. Log in to [Render](https://render.com/) and click **New > Web Service**.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. *(Optional)* For the ML Service, create another Web Service on Render:
   - Root Directory: `ml-service`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

---

## 💻 How to Run Locally in VS Code (Manual Setup)

To run the entire platform locally, follow these steps:

### 1. Download from GitHub
1. Open your terminal or Git Bash.
2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   ```
3. Open the project folder in VS Code:
   ```bash
   cd your-repo
   code .
   ```

### 2. Start the Backend (Node.js/SQLite)
Open a new integrated terminal in VS Code (`Ctrl` + `` ` ``), and run:
```bash
cd backend
npm install
npm run dev
```
*The backend will start on http://localhost:5000 and automatically initialize the SQLite database and seed the default admin account.*

### 3. Start the ML Service (Python/Flask)
Open a **second** terminal window in VS Code, and run:
```bash
cd ml-service

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install requirements and run
pip install -r requirements.txt
flask run --port=5001
```
*The ML API will start on http://localhost:5001.*

### 4. Start the Frontend (React/Vite)
Open a **third** terminal window in VS Code, and run:
```bash
cd frontend
npm install
npm run dev
```
*The React app will launch on http://localhost:5173. Open this link in your browser!*

---

## 🔐 How to Use Login & Authentication

The platform features an advanced role-based access control system. Here is how to use it:

### 1. User Registration (Signup)
1. Navigate to the `/signup` page.
2. Enter your Name, a valid Email, and a secure Password.
3. Accept the Terms & Conditions and click **Create Account**.
4. You will be automatically authenticated, securely saved into the database, and redirected to your personal **User Dashboard**.

### 2. Standard User Login
1. Navigate to the `/login` page.
2. Enter the credentials you just registered with.
3. You will be routed to the `/dashboard` where you can analyze news, view your personal prediction history, and update your profile settings.

### 3. Admin Login
The system automatically creates a default Administrator account when the backend server starts. 
1. Navigate to the `/login` page.
2. Enter the seeded Admin credentials:
   - **Email:** `admin@fakenews.com`
   - **Password:** `adminpassword123`
3. The system will detect your `admin` role and redirect you to the **Admin Control Panel** (`/admin`).
4. From the Admin Dashboard, you can monitor global predictions, manage users, upload training datasets, and monitor ML model performance!

---

## 🧠 Machine Learning Models & Accuracy

Our system uses an ensemble approach of powerful NLP classification models trained to analyze text semantics, syntax, and sentiment to classify articles as **REAL** or **FAKE**.

### Models Used:
1. **Logistic Regression**
   - **Accuracy Achieved:** **90+%**
   - *Why it's used:* Excellent for high-dimensional sparse text data when combined with TF-IDF vectorization.
2. **Multinomial Naive Bayes**
   - **Accuracy Achieved:** **95.68%**
   - *Why it's used:* A robust probabilistic classifier highly effective for text classification and spam detection.

### Text Processing (TF-IDF):
The models use `TfidfVectorizer` (Term Frequency-Inverse Document Frequency) limited to 10,000 max features, extracting both single words (unigrams) and 2-word combinations (bigrams), stripping out common English stopwords for maximum accuracy.

---

## 📊 Dataset Details

**Dataset Name:** ISOT Fake News Detection Dataset
**Type:** Binary Text Classification

**Overview:** 
This massive dataset contains over 44,000 articles, specifically filtered to provide a balanced distribution between authentic and fabricated news. 

**Contents:**
- **Fake.csv:** 23,481 fake news articles (Collected from untrustworthy web sources and flagged by fact-checking organizations).
- **True.csv:** 21,417 true news articles (Collected directly from Reuters.com, covering real-world political and world news).

**Columns:**
- `Title`: The title of the news article.
- `Text`: The full body text of the article.
- `Subject`: The category/subject of the news (e.g., politicsNews, worldnews).
- `Date`: The publish date of the article (spanning 2016 - 2017).

---

## 📱 Responsive Design Guarantee

This application is fully responsive. CSS flexbox, grid, and media queries have been utilized to ensure the dashboard, charts, forms, and admin panels look perfect on:
- 🖥️ Large Desktop Monitors (1080p / 4k)
- 💻 Laptops (13" to 15")
- 📱 Tablets (iPad, Galaxy Tab)
- 📲 Mobile Phones (iPhone, Android)

The sidebar cleanly collapses into a mobile-friendly hamburger menu on smaller screens, and data tables automatically scroll horizontally to prevent layout breaking.

---

## 🧪 Demo News Samples for Testing

If you want to quickly test the ML detection engine, copy and paste the following texts into the **Detect News** dashboard:

### 🟢 Sample 1: REAL News
> WASHINGTON (Reuters) - The U.S. Senate on Thursday approved a sweeping tax overhaul bill, bringing President Donald Trump and his fellow Republicans a step closer to their goal of slashing taxes for businesses and the wealthy. The 51-49 vote passed shortly after midnight.

### 🔴 Sample 2: FAKE News
> BREAKING: Pope Francis Shocks World, Endorses Donald Trump for President. In an unprecedented move, the Vatican has released a statement today urging all Americans to vote for Donald Trump in the upcoming election. News outlets are completely stunned by this revelation.

### 🔴 Sample 3: FAKE News
> Hillary Clinton has officially been indicted by the FBI for her emails. Top officials report that she was secretly arrested during the night and is currently being held at a high-security military base in Cuba. Mainstream media refuses to report on this!