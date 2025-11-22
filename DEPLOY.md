# How to Deploy to GitHub Pages

This project is ready to be hosted on GitHub Pages for free! Follow these simple steps:

## 1. Create a New Repository on GitHub
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **+** icon in the top-right corner and select **New repository**.
3. Name your repository (e.g., `pokemon-memory-helper`).
4. Make sure it is **Public**.
5. **Do not** initialize with README, .gitignore, or License (we already have these).
6. Click **Create repository**.

## 2. Push Your Code
Open your terminal in this project folder and run the following commands (replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual details):

```bash
# Link your local folder to the GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename the default branch to main (if it isn't already)
git branch -M main

# Push your code
git push -u origin main
```

## 3. Enable GitHub Pages
1. Go to your repository page on GitHub.
2. Click on **Settings** (top tab).
3. In the left sidebar, click on **Pages**.
4. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
5. Under **Branch**, select **main** and folder **/(root)**.
6. Click **Save**.

## 4. Done!
Wait a minute or two, and refresh the Pages settings page. You will see your live URL at the top (e.g., `https://your-username.github.io/pokemon-memory-helper/`).
