# GitHub Pages Setup Guide

This guide will help you deploy your Dart Score Tracker app to GitHub Pages so you can access it from anywhere on any device.

**👋 Welcome!** If you're new to coding, don't worry! This guide explains everything step-by-step, including simple explanations (like you're 5 years old) for technical terms.

---

## Step 1: Create a GitHub Account (if you don't have one)

**What is GitHub?** (ELI5: Think of GitHub like Google Drive, but specifically for code. It's a place where you can store your code files online and share them with others.)

1. Go to [github.com](https://github.com)
2. Click "Sign up" in the top right corner
3. Enter your email, create a password, and choose a username
4. Verify your email address when prompted
5. You're all set! 🎉

---

## Step 2: Set Up Git on Your Computer (IMPORTANT - Do This First!)

**What is Git?** (ELI5: Git is like a magic notebook that remembers every change you make to your files. It helps you save different versions of your work, just like saving different drafts of a document.)

**What is Terminal/Command Prompt?** (ELI5: It's like a text-based way to talk to your computer. Instead of clicking buttons, you type commands and the computer does what you ask.)

### For Windows:
1. Open **Command Prompt** or **PowerShell**
   - Press `Windows Key + R`, type `cmd`, and press Enter
   - OR search for "Command Prompt" in the Start menu

### For Mac:
1. Open **Terminal**
   - Press `Cmd + Space`, type "Terminal", and press Enter
   - OR go to Applications → Utilities → Terminal

### Set Your Identity (This fixes the "author identity unknown" error!)

**Why do we need this?** (ELI5: Git needs to know who you are, like signing your name on your homework. It uses your name and email to label all the changes you make.)

Run these two commands (replace with YOUR information):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "John Smith"
git config --global user.email "john.smith@gmail.com"
```

**What does `--global` mean?** (ELI5: It means "remember this for all my projects on this computer." Without it, you'd have to tell Git your name every time you start a new project.)

**✅ Check it worked:**
```bash
git config --global user.name
git config --global user.email
```

These commands should show you the name and email you just entered.

---

## Step 3: Create a New Repository on GitHub

**What is a Repository?** (ELI5: A repository (or "repo") is like a folder on GitHub where you store all your project files. It's your project's home on the internet.)

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `dart-score-tracker` (or any name you like)
   - **Description**: "A dart scoring app" (optional)
   - **Visibility**: Select **"Public"** (this is required for free GitHub Pages)
   - **⚠️ IMPORTANT**: Do NOT check "Add a README file" or any other options
5. Click **"Create repository"**

**Why Public?** (ELI5: GitHub Pages (the free website hosting) only works with public repositories. Don't worry - people can see your code, but they can't change it unless you let them.)

---

## Step 4: Upload Your Files to GitHub

You have two options. **Option A is easier for beginners**, but **Option B is better for future updates**.

### Option A: Using GitHub Web Interface (Easier for Beginners)

**What we're doing:** (ELI5: We're uploading your files to GitHub, like dragging files into Google Drive.)

1. After creating your repository, you'll see a page with instructions
2. Look for a link that says **"uploading an existing file"** and click it
3. Drag and drop all your files into the upload area:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md` (if you have it)
   - `GITHUB_SETUP.md` (optional)
4. Scroll down to the bottom
5. In the "Commit changes" box, type: `Initial commit: Dart Score Tracker`
   - **What is a commit?** (ELI5: A commit is like saving your work. It's a snapshot of your files at that moment.)
6. Click the green **"Commit changes"** button

**Done!** Your files are now on GitHub! 🎉

---

### Option B: Using Git Command Line (Better for Future Updates)

**What we're doing:** (ELI5: We're using commands to tell Git to save your files and send them to GitHub, like using a magic spell to teleport your files to the internet.)

#### Step 4.1: Navigate to Your Project Folder

**What is "navigate"?** (ELI5: It means "go to" or "open" a folder. Like double-clicking a folder to open it, but using text commands instead.)

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Type this command to go to your project folder:

**For Windows:**
```bash
cd "C:\Users\YourName\Claude\Test Folder"
```
(Replace with your actual folder path)

**For Mac:**
```bash
cd ~/Desktop/Test\ Folder
```
(Replace with your actual folder path)

**How to find your folder path:**
- **Windows**: Right-click your folder → Properties → Copy the "Location" path
- **Mac**: Right-click your folder → Get Info → Copy the path shown

#### Step 4.2: Initialize Git Repository

**What is "initialize"?** (ELI5: It means "set up" or "prepare." We're telling Git "Hey, I want to use you to track changes in this folder.")

```bash
git init
```

**What you should see:** "Initialized empty Git repository in [your folder path]"

#### Step 4.3: Add Your Files

**What is "add"?** (ELI5: We're telling Git "Hey, pay attention to these files! I want to save them.")

```bash
git add .
```

**What does the dot (.) mean?** (ELI5: The dot means "everything in this folder." It's like saying "add all my files" instead of listing each one.)

**What you should see:** (Usually nothing - that's okay! No error means it worked.)

#### Step 4.4: Commit Your Files

**What is "commit"?** (ELI5: It's like taking a photo of your files. Git saves a snapshot of how your files look right now, so you can always go back to this version.)

```bash
git commit -m "Initial commit: Dart Score Tracker"
```

**What does `-m` mean?** (ELI5: It means "message." We're giving this save a name/description, like labeling a photo.)

**What you should see:** Something like "1 file changed" or "X files changed"

**⚠️ If you get an error about "author identity unknown":**
- Go back to Step 2 and set up your Git identity first!
- Then come back and try this step again.

#### Step 4.5: Connect to GitHub

**What is "remote"?** (ELI5: It means "far away." We're telling Git where your files live on the internet - on GitHub.)

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `REPO_NAME` with your repository name (e.g., `dart-score-tracker`)

**Example:**
```bash
git remote add origin https://github.com/johnsmith/dart-score-tracker.git
```

**How to find your repository URL:**
1. Go to your repository on GitHub
2. Click the green "Code" button
3. Copy the HTTPS URL shown

#### Step 4.6: Push to GitHub

**What is "push"?** (ELI5: It means "send" or "upload." We're sending your files from your computer to GitHub, like uploading photos to the cloud.)

```bash
git branch -M main
git push -u origin main
```

**What does `branch -M main` mean?** (ELI5: We're naming our main version of the code "main." It's like calling your main document "Final Version.")

**What does `push -u origin main` mean?** (ELI5: "Send my files to GitHub, and remember this connection for next time.")

**What you should see:** Your files uploading, then "Branch 'main' set up to track remote branch 'main'"

**⚠️ If GitHub asks for your username and password:**
- Username: Your GitHub username
- Password: You'll need to use a **Personal Access Token** (not your regular password)
- See "Creating a Personal Access Token" section below if needed

---

## Step 5: Enable GitHub Pages

**What is GitHub Pages?** (ELI5: It's like free web hosting. GitHub will turn your code files into a real website that anyone can visit with a web address.)

1. Go to your repository on GitHub
2. Click on the **"Settings"** tab (at the top of the page)
3. Scroll down in the left sidebar and click **"Pages"**
4. Under **"Source"**, select **"Deploy from a branch"**
5. Select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
6. Click **"Save"**

**What you should see:** A message saying "Your site is ready to be published at..." (it might take a minute)

---

## Step 6: Access Your App

1. Wait 1-2 minutes for GitHub to build your website
2. Go back to Settings → Pages
3. You'll see your website URL:
   ```
   https://YOUR_USERNAME.github.io/REPO_NAME/
   ```
4. Click the link or copy it to your browser!

**🎉 Congratulations!** Your app is now live on the internet!

---

## Step 7: Update Files (Making Changes Later)

### Using GitHub Web Interface (Easier):

1. Go to your repository on GitHub
2. Click on the file you want to change (e.g., `index.html`)
3. Click the pencil icon (✏️) in the top right
4. Make your changes
5. Scroll down, type a message like "Updated colors"
6. Click **"Commit changes"**

### Using Git Command Line:

**What we're doing:** (ELI5: We're saving our changes and sending the updated files to GitHub.)

1. Make your changes to files on your computer
2. Open Terminal/Command Prompt in your project folder
3. Run these commands:

```bash
# Tell Git about your changes
git add .

# Save your changes with a message
git commit -m "Description of what you changed"

# Send changes to GitHub
git push
```

**Example:**
```bash
git add .
git commit -m "Changed button colors to orange"
git push
```

---

## Creating a Personal Access Token (If Needed)

**What is a Personal Access Token?** (ELI5: It's like a special password that GitHub gives you to prove you're allowed to upload files. It's safer than using your real password.)

**When do you need this?** When Git asks for a password when you run `git push`.

### Steps:

1. Go to GitHub.com and sign in
2. Click your profile picture (top right) → **Settings**
3. Scroll down in the left sidebar → **Developer settings**
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. Give it a name like "My Dart App"
7. Check the box for **"repo"** (this gives permission to upload files)
8. Scroll down and click **Generate token**
9. **⚠️ IMPORTANT**: Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`
10. Save it somewhere safe (you won't see it again!)

**How to use it:**
- When Git asks for a password, paste your token instead
- Username: Your GitHub username
- Password: Paste your token

---

## Important Notes

### Data Storage

**How does data storage work?** (ELI5: Your game history is saved in your browser, like cookies. Each device remembers its own games, but they don't talk to each other.)

- ✅ Game history saves automatically on each device
- ⚠️ Each device has its own separate history
- ⚠️ Clearing browser data will delete history

### Cross-Device Sync (Future Enhancement)

**Why can't my phone and computer share the same history?** (ELI5: Right now, it's like each device has its own notebook. To share notebooks, we'd need a special cloud service, which is more complicated to set up.)

To sync across devices, you'd need:
- A database service (like Firebase or Supabase)
- User accounts
- More complex code

For now, each device keeps its own game history.

---

## Troubleshooting

### "Author identity unknown" Error

**Problem:** Git doesn't know who you are.

**Solution:** Go back to Step 2 and set up your Git identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### App Not Loading?

- Wait 2-3 minutes after enabling GitHub Pages (it takes time to build)
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check the URL is correct
- Make sure all files were uploaded correctly

### Changes Not Showing?

- GitHub Pages takes 1-2 minutes to update
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check that you committed and pushed your changes

### "Permission Denied" or "Authentication Failed"

- Make sure you're using a Personal Access Token (not your password)
- Check that your token has "repo" permissions
- Make sure your username and repository name are correct

### Need More Help?

- GitHub Pages Docs: https://docs.github.com/en/pages
- GitHub Community: https://github.community/
- Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics

---

## Quick Reference: Common Git Commands

**For beginners - what each command does:**

- `git init` - "Start tracking this folder"
- `git add .` - "Pay attention to all my files"
- `git commit -m "message"` - "Save a snapshot with this name"
- `git push` - "Send my files to GitHub"
- `git status` - "Show me what files have changed"

---

## Quick Access

Once set up, bookmark your GitHub Pages URL for quick access on any device!

**Your URL will be:**
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

Enjoy your Dart Score Tracker! 🎯
