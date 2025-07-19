from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import re
import pickle
from keras.preprocessing.sequence import pad_sequences
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import os
import nltk
from .model import model

def CS(user_input):
    
    # 📌 download NLTK resources if you haven’t already


    # 🔷 Load model & tokenizer

    with open(os.path.join("ai", "tokenizer.pkl"), "rb") as f:
        tokenizer = pickle.load(f)

    # 🔷 Config
    max_len = 50
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    
    cs_keywords = [
        'cyber', 'hack', 'breach', 'malware', 'phishing', 'ransomware',
        'infrastructure', 'ddos', 'security', 'data', 'attack', 'vulnerability',
        'privacy', 'leak', 'spyware', 'exploit', 'threat', 'database'
    ]
    
    def clean_text(text):
        text = str(text).lower()
        text = re.sub(r'[^a-z\s]', ' ', text)
        tokens = nltk.word_tokenize(text)
        tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words]
        return ' '.join(tokens)
    

    sites = [url.strip() for url in user_input.split(",") if url.strip()]
    
    if not sites:
        print("⚠️ No websites entered. Exiting.")
        exit()

    # 🔷 Headless Chrome with human-like options
    options = Options()
    options.add_argument("--headless=new")  # or "--headless"
    options.add_argument("start-maximized")
    options.add_argument("disable-infobars")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    for url in sites:
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
                return results
        except Exception as e:
            raise ValueError(f"Error processing {url}: {str(e)}")
    
    driver.quit()
