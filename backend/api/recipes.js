const recipes = require('../recipes.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { ingredients } = req.body;

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Invalid ingredients list' });
  }

  const lower = ingredients.map(i => i.toLowerCase());

  const matched = recipes.filter(recipe =>
    recipe.ingredients.some(ing => lower.includes(ing.toLowerCase()))
  );

  const results = matched.slice(0, 5).map(r => ({
    title: r.title,
    instructions: r.instructions,
    videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(r.videoQuery)}`
  }));

  res.status(200).json(results);
}
