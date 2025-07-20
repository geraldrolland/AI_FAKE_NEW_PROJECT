from bs4 import BeautifulSoup
import re
import pickle
from keras.preprocessing.sequence import pad_sequences
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import os
import nltk
from .model import model
from .chrome_driver import driver

def CS(user_input):
    print("🔷 Starting Cyber Security Analysis...")
    
    # 📌 download NLTK resources if you haven’t already


    # 🔷 Load model & tokenizer

    with open(os.path.join("ai", "tokenizer.pkl"), "rb") as f:
        print("🔷 Loading tokenizer...")
        tokenizer = pickle.load(f)

    # 🔷 Config
    max_len = 50
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    print("🔷 Configuring Cyber Security keywords...")
    
    cs_keywords = [
        'cyber', 'hack', 'breach', 'malware', 'phishing', 'ransomware',
        'infrastructure', 'ddos', 'security', 'data', 'attack', 'vulnerability',
        'privacy', 'leak', 'spyware', 'exploit', 'threat', 'database'
    ]
    
    def clean_text(text):
        print("🔷 Cleaning text...")
        text = str(text).lower()
        text = re.sub(r'[^a-z\s]', ' ', text)
        tokens = nltk.word_tokenize(text)
        tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words]
        return ' '.join(tokens)
    

    sites = [url.strip() for url in user_input.split(",") if url.strip()]
    print(f"🔷 Found {len(sites)} websites to analyze.")
    if not sites:
        print("⚠️ No websites entered. Exiting.")
        exit()

    for url in sites:
        print("🔍 Validating URL format...")
        print(f"\n📡 Scraping: {url}")
        try:
            driver.get(url)
            driver.implicitly_wait(5)
            html = driver.page_source
    
            soup = BeautifulSoup(html, "html.parser")
            all_headlines = [
                h.text.strip()
                for tag in ["h1", "h2", "h3", "h4", "h5", "h6"]
                for h in soup.find_all(tag)
            ]
    
            # 🔷 Filter CS-related only
            headlines = [h for h in all_headlines if any(kw in h.lower() for kw in cs_keywords)]
    
            if not headlines:
                raise ValueError("No CS-related headlines found.")
            else:
                results = []
                for text in headlines:
                    cleaned = clean_text(text)
                    seq = tokenizer.texts_to_sequences([cleaned])
                    padded = pad_sequences(seq, maxlen=max_len, padding='post', truncating='post')
                    pred = model.predict(padded, verbose=0)
                    trusted = 'Real' if int(pred[0][0] <= 0.5) else 'Fake'
                    result = {"headline": text, "trusted": trusted}
                    results.append(result)
                    print(f"📰 {text}")
                print(f"🔍 {len(results)} CS-related headlines found.")
                return results
        except Exception as e:
            raise ValueError(f"Error processing {url}: {str(e)}")
    
    driver.quit()
