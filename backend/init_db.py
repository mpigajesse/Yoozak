import os
import subprocess
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Chemin du répertoire du projet
BASE_DIR = Path(__file__).resolve().parent

# Charger les variables d'environnement
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Paramètres de connexion
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')

# Fonction pour créer la base de données
def create_database():
    try:
        # Connexion à PostgreSQL pour créer la base de données
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database="postgres"  # Se connecter à la base par défaut
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Vérifier si la base de données existe déjà
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Création de la base de données {DB_NAME}...")
            cursor.execute(f"CREATE DATABASE {DB_NAME}")
            print(f"Base de données {DB_NAME} créée avec succès!")
        else:
            print(f"La base de données {DB_NAME} existe déjà.")
        
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"Erreur lors de la création de la base de données: {e}")
        return False

# Fonction pour exécuter le script SQL
def execute_sql_script():
    try:
        # Chemin vers le fichier SQL
        sql_file_path = os.path.join(BASE_DIR, 'init_db.sql')
        
        # Commande pour exécuter le script SQL avec psql
        command = [
            'psql',
            f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}',
            '-f', sql_file_path
        ]
        
        # Exécution de la commande
        print("Exécution du script SQL...")
        result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("Script SQL exécuté avec succès!")
            return True
        else:
            print(f"Erreur lors de l'exécution du script SQL: {result.stderr}")
            return False
    except Exception as e:
        print(f"Erreur lors de l'exécution du script SQL: {e}")
        return False

if __name__ == "__main__":
    print("Initialisation de la base de données...")
    
    # Créer la base de données
    if create_database():
        # Exécuter le script SQL
        execute_sql_script()
    
    print("Processus d'initialisation terminé.") 