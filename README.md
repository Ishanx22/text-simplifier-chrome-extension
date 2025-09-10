
# Recipe Genie

✨ Recipe Genie is your casual kitchen buddy that instantly whips up recipes from the ingredients you already have. Simply add what’s in your kitchen, set optional calorie or protein goals, and let the genie do the magic. Quick, smart, and effortless — cooking made simple for everyone.


## Images





## Features

🧞 Ingredient-Based Recipes – Generate recipes instantly from the ingredients you already have.

⚡ Quick & Easy – Acts as a casual kitchen helper for fast recipe suggestions.

🍽 Custom Macros – Add calorie or protein preferences to get health-focused recipes.

🎯 Personalized Results – Recipes are tailored only from your selected available ingredients.

🌍 For Everyone – Designed for all users, from beginners to experienced home cooks.

## Deployment

To deploy this project run

1) Setup Api Key

2) Install Node

3) Install Dependencies

```bash
  npm install
```
4) Start backend

```bash
  cd backend
  node server.js
```
5) Start frontend

```bash
  cd frontend
  npm start
```


## Tech Stack

Backend-Node,Express,REST API,axios

Frontend- React




## API Reference

### Setup: API Key

1. Get your DeepSeek (R1 Free) API key:  
   [https://openrouter.ai/deepseek/deepseek-r1:free/api](https://openrouter.ai/deepseek/deepseek-r1:free/api)

2. Open `AI-RecipeApp/frontend/src/App.js` and replace line 58 with your key:

```javascript
const API_KEY = "YOUR_API_KEY_HERE";


