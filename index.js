const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const recipes = require('./train.json');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Utility to get a YouTube link from ingredients
function generateYouTubeLink(ingredients) {
  const query = encodeURIComponent(`recipe with ${ingredients.slice(0, 3).join(' ')}`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

app.get("/", (req, res) => {
  res.send("Welcome to my app")
});

app.post('/recipes', (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Invalid or missing ingredients array' });
  }

  const inputIngredients = ingredients.map(i => i.toLowerCase());

  // Score each recipe by number of matched ingredients
  const scored = recipes.map(recipe => {
    const matchCount = recipe.ingredients.filter(ing =>
      inputIngredients.includes(ing.toLowerCase())
    ).length;
    return { ...recipe, matchCount };
  });

  // Sort by most matches, then take top 5
  const topMatches = scored
    .filter(r => r.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 5);

  // Prepare response
  const result = topMatches.map(r => ({
    id: r.id,
    matchedCount: r.matchCount,
    ingredients: r.ingredients,
    videoUrl: generateYouTubeLink(r.ingredients)
  }));

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
