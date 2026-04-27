import random
import string
import time
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# ==========================================
# DUSTBIN CODE GENERATOR & FIREBASE UPLOADER
# ==========================================

# 1. Initialize Firebase Admin SDK
# You must download your 'serviceAccountKey.json' from Firebase Console
# Settings -> Service Accounts -> Generate New Private Key
try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Successfully connected to Firebase!")
except Exception as e:
    print("❌ Failed to connect to Firebase. Did you add serviceAccountKey.json?")
    print(f"Error: {e}")
    exit()

def generate_code(length=6):
    """Generate a random 6-character alphanumeric code."""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def create_and_upload_code():
    """Generates a code and uploads it to the 'codes' collection in Firestore."""
    new_code = generate_code()
    
    # Create the document in Firestore
    code_data = {
        'code': new_code,
        'status': 'unused',
        'timestamp': firestore.SERVER_TIMESTAMP,
        'used_by': None
    }
    
    try:
        # Save to a collection named 'codes' using the code as the document ID
        db.collection('codes').document(new_code).set(code_data)
        
        print("\n==============================")
        print("🗑️ WASTE DISPOSED CORRECTLY!")
        print(f"🎉 Your Reward Code: {new_code}")
        print("==============================\n")
        
        return new_code
    except Exception as e:
        print(f"Error uploading code to Firebase: {e}")
        return None

# Simulation Loop (Simulating the dustbin sensing waste)
if __name__ == "__main__":
    print("🤖 Smart Dustbin is running and waiting for waste...")
    print("Press Ctrl+C to stop.")
    
    try:
        while True:
            # Simulate waiting for a person to throw waste
            # In a real dustbin, this would be triggered by an ultrasonic or IR sensor
            input("Press Enter to simulate successful waste disposal...")
            
            create_and_upload_code()
            
            # Wait a few seconds before the next disposal is allowed
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\nDustbin turned off.")
