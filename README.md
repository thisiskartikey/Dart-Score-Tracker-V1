# 🎯 Dart Score Tracker

A simple, intuitive web application for tracking scores during classic 301/501 dart games. Perfect for when you need a quick, low-cognitive-load way to keep track of your dart throws and scores.

## Features

- **Quick Input**: Select the number hit and ring type (Single/Double/Triple) with simple button clicks
- **Auto-Scoring**: Automatically calculates and updates scores as you enter darts
- **Bust Prevention**: Warns you before entering scores that would result in a bust
- **Winning Options**: Shows possible finishing combinations when you're close to winning
- **Game History**: Tracks all your games with player names, scores, and dates
- **Player Profiles**: Save player names and view game history per player
- **301 & 501 Games**: Switch between classic game types

## How to Use

1. **Start a Game**:
   - Choose between 301 or 501 game
   - Enter Player 1 and Player 2 names
   - Click "Start Game"

2. **Enter Dart Throws**:
   - Click the number you hit (1-20, Bull, or Miss)
   - Select the ring type: Single, Double, or Triple
   - Click "Add Dart" to record the throw
   - The score updates automatically

3. **End Your Turn**:
   - After entering all 3 darts (or fewer), click "End Turn"
   - The game switches to the other player

4. **Winning**:
   - Must finish on a double or double bull
   - The app shows winning options when you're close
   - Game ends automatically when a player wins

5. **View History**:
   - Click "View History" to see all past games
   - History is saved in your browser's local storage

## Rules

- **Bust**: If your score goes below 0 or ends at 1, it's a bust and your turn ends
- **Winning**: Must finish on a double (or double bull) to win
- **Score Calculation**: 
  - Single = face value (1-20)
  - Double = 2x face value
  - Triple = 3x face value
  - Single Bull = 25
  - Double Bull = 50

## Technical Details

- Pure HTML, CSS, and JavaScript (no dependencies)
- Data stored in browser's localStorage
- Responsive design works on desktop and mobile
- No internet connection required after initial load
- Supports 2-5 players
- Material Design UI

## GitHub Pages Deployment

Want to access your app from anywhere? Deploy it to GitHub Pages!

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for detailed instructions on:
- Creating a GitHub repository
- Uploading your files
- Enabling GitHub Pages
- Accessing your app from any device

Once deployed, you can access your app at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

## Getting Started

### Desktop
Simply open `index.html` in any modern web browser. No installation or setup required!

### Mobile (On-the-Go)

**Option 1: Direct Browser Access**
1. Transfer the files to your phone (via email, cloud storage, etc.)
2. Open `index.html` in your mobile browser
3. The app is fully responsive and touch-optimized

**Option 2: Add to Home Screen (Recommended)**
1. Open `index.html` in your mobile browser (Safari on iOS, Chrome on Android)
2. Tap the browser menu (three dots on Android, share button on iOS)
3. Select "Add to Home Screen" or "Install App"
4. The app will appear as an icon on your home screen
5. Launch it like a native app - it works offline!

**Option 3: Host Online**
- Upload the files to any web hosting service
- Access from any device with internet connection
- Works great with services like GitHub Pages, Netlify, or Vercel

## How It Works

### Simplified Input Flow
- **Single**: Just click the number (e.g., click "14" = Single 14)
- **Double**: Click "Double" button, then click the number (e.g., Double → "14" = Double 14)
- **Triple**: Click "Triple" button, then click the number (e.g., Triple → "20" = Triple 20)
- **Bull**: Click "Single Bull" or "Double Bull" button
- **Miss**: Click "Miss" button
- **Auto-advance**: After 3 darts, turn automatically ends (or click "End Turn" manually)
- **Undo**: Click "↶ Undo" to remove the last dart

### Player Selection
- Select players from dropdown if they've played before
- Or choose "New Player..." to enter a new name
- All players are saved automatically for future games
