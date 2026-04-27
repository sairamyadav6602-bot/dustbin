# Smart Dustbin Hardware Integration

This directory contains the code that runs *physically on the smart dustbin* (e.g., on a Raspberry Pi or connected laptop). 

It is completely separated from the web app. The only way the dustbin communicates with the app is by writing to a shared Firebase database in the cloud.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Add Firebase Credentials:**
   - Go to your Firebase Console -> Project Settings -> Service Accounts.
   - Click "Generate new private key".
   - Download the JSON file, rename it to `serviceAccountKey.json`, and place it in this `dustbin_hardware` folder.

## How it works
When waste is successfully disposed of, `main.py` generates a secure random 6-character code. It then uploads this code to the `codes` collection in Firebase Firestore with a status of `unused`.

Finally, it displays the code on a screen or prints it, so the user can enter it into their mobile app!

## Run the Script
```bash
python main.py
```
