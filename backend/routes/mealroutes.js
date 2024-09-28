const express = require("express");
const router = express.Router();
const MealPlan = require("../Models/MealPlan");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDBKaJCznbPCiiP3agJlxgTdSYLZ5BIU9U");

router.post("/generate-mealplan", async (req, res) => {
  const {
    dietaryRestrictions,
    userid,
    selectedCountry,
    selectedState,
    selectedCity,
    schedule,
    maintenanceCalorie,
    protein,
    fat,
    carbs
  } = req.body;

  const mealPlanPrompt = `You are a nutrition expert.
  They have the following dietary restrictions: ${Object.entries(
    dietaryRestrictions
  )
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(", ")}.
  The user lives in ${selectedCity}, ${selectedState}, ${selectedCountry}.
  You have to generate a meal plan for the user.
  They aim for a goal of ${maintenanceCalorie} calories, with ${protein} grams of protein, ${fat} grams of fat and ${carbs} grams of carbs.
  Provide a meal-plan for this much time period: ${schedule}.
  
  Incorporate ingredients that are locally available and commonly used in regional dishes.

  The format of the meal plan should include breakfast, lunch, evening snack and dinner. Just make sure that the total number of calories match the ${maintenanceCalorie} and the total macro nutrients match the user's requirements as well. Provide the macronutrients for each meal as well.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const mealPlanResult = await model.generateContent(mealPlanPrompt);
    const generatedMealPlan = mealPlanResult.response.text().trim();

    console.log(generatedMealPlan);

    // await MealPlan.create({
    //   userId: userid,
    //   mealPlan: generatedMealPlan,
    //   goal : maintenanceCalorie,
    //   dietaryRestrictions: JSON.stringify(dietaryRestrictions),
    //   selectedCountry,
    //   selectedState,
    //   selectedCity,
    //   schedule,
    //   protein,
    //   fats:req.body.fat,
    //   carbs
    // });

    res.json({ mealPlan: generatedMealPlan });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the meal plan." });
  }
});

router.post("generate-recipe", async (req,res) => {
  const {mealType, calories, protein, carbs, fats, selectedCountry, selectedState, selectedCity, dietaryRestrictions} = req.body;

  const recipePrompt = `You are a nutrition expert generating recipes for a user based on their location (${selectedCity}, ${selectedState}, ${selectedCountry}) and dietary preferences.
  
  They have the following dietary restrictions: ${Object.entries(
    dietaryRestrictions
  )
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(", ")}.

  Suggest 2-3 recipes for ${mealType} with ${calories} calories, ${protein} grams of protein, ${fats} grams of fats and ${carbs} grams of carbs.
  
  Each recipe should include:
  - Meal name (preferably a local dish or something inspired by regional cuisine)
  - Ingredients (must include local ingredients)
  - Step-by-step instructions
  - Cooking time
  - Must match the nutritional values (calories, protein, carbs, and fats)`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const recipeResult = await model.generateContent(recipePrompt);
    const generatedRecipe = recipeResult.response.text().trim();

    console.log(generatedRecipe);

    res.json({ generatedRecipe });
  } catch (error) {
    console.error("Error generating recipes:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the recipes." });
  }
})


router.get("/getmealplan/:id", async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.params.id });
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;