import gspread
from google.oauth2.service_account import Credentials
import psycopg2
import psycopg2.extras
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
db_config = {
    "host": os.getenv('DB_HOST'),
    "user": os.getenv('DB_USER'),
    "password": os.getenv('DB_PASSWORD'),
    "database": os.getenv('DB_NAME'),
    "port": os.getenv('DB_PORT')
}

# Google Sheets setup
GOOGLE_SHEET_ID = os.getenv('GOOGLE_SHEET_ID')
JSON_KEY_FILE = os.getenv('JSON_KEY_FILE')

# List of classes
CLASSES = [
    "Bard", "Cleric", "Druid", "Magus", "Paladin", "Ranger",
    "Sorcerer", "Warlock", "Wizard"
]

# Field mapping for Google Sheets
FIELD_MAPPING = {
    'Spell Name': 'spell_name', 'Level': 'spell_level', 'School': 'spell_school',
    'Casting Time': 'spell_casting_time', 'Reaction': 'spell_reaction', 'Ritual': 'spell_ritual',
    'Range': 'spell_range', 'Components': 'spell_components', 'Material': 'spell_materials',
    'Duration': 'spell_duration', 'Concentration': 'spell_concentration', 'Description': 'spell_description',
}

# Hash function for spell validation
def calculate_spell_hash(spell):
    hash_input = "|".join([str(spell.get(field, '')) for field in FIELD_MAPPING.values()])
    return hashlib.sha256(hash_input.encode()).hexdigest()

# Fetch spells from Google Sheets
def get_spells_from_google_sheet():
    try:
        scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        credentials = Credentials.from_service_account_file(JSON_KEY_FILE, scopes=scope)
        client = gspread.authorize(credentials)
        sheet = client.open_by_key(GOOGLE_SHEET_ID).sheet1
        return [{FIELD_MAPPING[key]: row.get(key, '') for key in FIELD_MAPPING} for row in sheet.get_all_records() if any(row.values())]
    except Exception as e:
        print(f"Error fetching data from Google Sheets: {e}")
        return []

# Create new database tables
def create_tables(cursor):
    # Main spells table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS spells (
            spell_name VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
            spell_level INTEGER NOT NULL,
            spell_school VARCHAR(50) NOT NULL,
            spell_casting_time VARCHAR(50) NOT NULL,
            spell_reaction VARCHAR(255),
            spell_ritual BOOLEAN NOT NULL DEFAULT FALSE,
            spell_range VARCHAR(50) NOT NULL,
            spell_components VARCHAR(10) NOT NULL,
            spell_materials VARCHAR(255),
            spell_duration VARCHAR(50) NOT NULL,
            spell_concentration BOOLEAN NOT NULL DEFAULT FALSE,
            spell_description TEXT NOT NULL,
            spell_hash CHAR(64) NOT NULL
        );
    """)

    # Classes table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS classes (
            class_name VARCHAR(50) UNIQUE PRIMARY KEY NOT NULL
        );
    """)

    # Class spell list (junction table) - Using `spell_name` instead of `spell_id`
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS class_spell_lists (
            spell_name VARCHAR(255) NOT NULL REFERENCES spells(spell_name) ON DELETE CASCADE,
            class_name VARCHAR(50) NOT NULL REFERENCES classes(class_name) ON DELETE CASCADE,
            PRIMARY KEY (spell_name, class_name)
        );
    """)

    # Add indexes on `spell_name` and `class_name` for performance
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_class_spell_lists_spell_name ON class_spell_lists (spell_name);
    """)
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_class_spell_lists_class_name ON class_spell_lists (class_name);
    """)

    # Insert class names into the classes table
    cursor.executemany("INSERT INTO classes (class_name) VALUES (%s) ON CONFLICT (class_name) DO NOTHING;",
                   [(class_name,) for class_name in CLASSES])

    print("Database tables created successfully.")

# Update spells in the Spells table
def update_spells(cursor, spells):
    spell_values = []
    for spell in spells:
        spell_hash = calculate_spell_hash(spell)

        spell_values.append((
            spell['spell_name'], spell['spell_level'], spell['spell_school'], spell['spell_casting_time'], 
            spell['spell_reaction'], bool(spell['spell_ritual']), spell['spell_range'], 
            spell['spell_components'], spell['spell_materials'], spell['spell_duration'], 
            bool(spell['spell_concentration']), spell['spell_description'], spell_hash
        ))

    spell_insert_query = """
        INSERT INTO spells (
            spell_name, spell_level, spell_school, spell_casting_time, 
            spell_reaction, spell_ritual, spell_range, spell_components, 
            spell_materials, spell_duration, spell_concentration, 
            spell_description, spell_hash
        ) VALUES %s
        ON CONFLICT (spell_name) DO UPDATE SET
            spell_level = EXCLUDED.spell_level,
            spell_school = EXCLUDED.spell_school,
            spell_casting_time = EXCLUDED.spell_casting_time,
            spell_reaction = EXCLUDED.spell_reaction,
            spell_ritual = EXCLUDED.spell_ritual,
            spell_range = EXCLUDED.spell_range,
            spell_components = EXCLUDED.spell_components,
            spell_materials = EXCLUDED.spell_materials,
            spell_duration = EXCLUDED.spell_duration,
            spell_concentration = EXCLUDED.spell_concentration,
            spell_description = EXCLUDED.spell_description,
            spell_hash = EXCLUDED.spell_hash;
    """
    
    psycopg2.extras.execute_values(cursor, spell_insert_query, spell_values)

    print("Spells updated successfully.")

# Associate spells with class spell lists
def import_class_spells(cursor, client):
    sheet = client.open_by_key(GOOGLE_SHEET_ID)

    # Get the existing spell names in the database
    cursor.execute("SELECT spell_name FROM spells;")
    existing_spells = {row[0] for row in cursor.fetchall()}

    class_spell_values = []
    missing_spells = set()

    for class_name in CLASSES:
        try:
            spell_names = sheet.worksheet(f"{class_name}_Spell_List").col_values(1)
        except Exception as e:
            print(f"Error fetching class sheet {class_name}: {e}")
            continue

        for spell_name in spell_names:
            spell_name = spell_name.strip()  # Remove extra spaces

            if spell_name in existing_spells:
                class_spell_values.append((spell_name, class_name))
            else:
                missing_spells.add(spell_name)

    # Print missing spells
    if missing_spells:
        print(f"Warning: The following spells are missing from spells table and cannot be added to class_spell_lists:\n{missing_spells}")

    # Bulk insert class spell associations
    if class_spell_values:
        psycopg2.extras.execute_values(cursor, """
            INSERT INTO class_spell_lists (spell_name, class_name)
            VALUES %s
            ON CONFLICT (spell_name, class_name) DO NOTHING;
        """, class_spell_values)
        print(f"{len(class_spell_values)} class-spell associations updated.")

# Run
if __name__ == "__main__":
    try:
        connection = psycopg2.connect(**db_config)
        cursor = connection.cursor()

        create_tables(cursor)
        spells = get_spells_from_google_sheet()
        update_spells(cursor, spells)
        
        connection.commit()

        scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        credentials = Credentials.from_service_account_file(JSON_KEY_FILE, scopes=scope)
        client = gspread.authorize(credentials)

        import_class_spells(cursor, client)

        connection.commit()

    except psycopg2.Error as err:
        print(f"Database Error: {err}")
    finally:
        connection.close()
        cursor.close()