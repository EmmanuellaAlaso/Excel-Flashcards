# Sheetwise

Sheetwise is a browser-based Excel flashcard and quiz app. It has six learning
sessions, with 12 cards in each session, including practical scenarios.

## Run locally

Open `index.html` in a modern browser. The site has no build step, package
installation, or external dependencies.

## Publish with GitHub Pages

1. Create a GitHub repository and add the contents of this folder.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch you committed to and the `/ (root)` folder, then save.

The site will be available at the Pages URL GitHub displays. Progress and timer
preferences are stored in the browser's local storage.

## Project files

- `index.html` — page markup and local asset links
- `css/styles.css` — responsive layout, card styling, and light/dark themes
- `js/data.js` — flashcard and scenario content
- `js/app.js` — study, quiz, timer, and saved-progress behavior
