import os
from dotenv import load_dotenv
import mysql.connector

# 1. ŁADUJEMY DANE Z PLIKU .ENV
# Ta funkcja szuka pliku .env w tym samym folderze i "wyciąga" z niego hasła
load_dotenv()

# 2. PRZYPISUJEMY DANE DO ZMIENNYCH
# os.getenv pobiera konkretną wartość, którą wcześniej wpisałaś do .env
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

def test_connection():
    try:
        # 3. PRÓBA POŁĄCZENIA Z BAZĄ AIVEN
        mydb = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            database=DB_NAME
        )
        
        print("✅ Sukces! Połączono z bazą danych Aiven.")
        
        # 4. POBIERANIE DANYCH (Przykładowe zapytanie)
        cursor = mydb.cursor()
        cursor.execute("SELECT name, ww_per_100g FROM products LIMIT 5")
        
        products = cursor.fetchall()
        
        print("\n--- Lista produktów w bazie ---")
        for p in products:
            print(f"Produkt: {p[0]} | WW: {p[1]}")
            
        mydb.close() # Zawsze zamykamy połączenie po zakończeniu pracy

    except Exception as e:
        print(f"❌ Błąd połączenia: {e}")

if __name__ == "__main__":
    test_connection()