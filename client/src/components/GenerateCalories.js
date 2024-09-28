import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const GenerateCalories = () => {
    const [diet, setDiet] = useState("1");
    const [units, setUnits] = useState("1");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [gender, setGender] = useState("5");
    const [activityLevel, setActivityLevel] = useState("1.2");
    const [goal, setGoal] = useState("0");
    const [calorieDeficitSurplus, setCalorieDeficitSurplus] = useState("");
    const [protein, setProtein] = useState("1");
    const [fatCarbSplit, setFatCarbSplit] = useState(50);
    const [maintenanceCalories, setMaintenanceCalories] = useState(null);
    const [macros, setMacros] = useState({});
    const [showChart, setShowChart] = useState(false);
    
    const calculateCaloriesAndMacros = () => {
        let weightInKg = units === "1" ? parseFloat(weight) : parseFloat(weight) / 2.20462;
        let heightInCm = units === "1" ? parseFloat(height) : parseFloat(height) * 2.54;

        const bmr = 10 * weightInKg + 6.25 * heightInCm + parseFloat(gender) - 5 * parseFloat(age);
        const tdee = bmr * parseFloat(activityLevel);
        const goalAdjustment = parseFloat(goal);
        const adjustedCalories = tdee * (1 + goalAdjustment / 100);

        const proteinGrams = parseFloat(protein) * (units === "1" ? weightInKg : parseFloat(weight));
        const fatCalories = (adjustedCalories * fatCarbSplit) / 100;
        const carbCalories = adjustedCalories - fatCalories - proteinGrams * 4;
        const fatGrams = fatCalories / 9;
        const carbGrams = carbCalories / 4;

        setMaintenanceCalories(adjustedCalories.toFixed(0));
        setMacros({
            protein: proteinGrams.toFixed(0),
            fat: fatGrams.toFixed(0),
            carbs: carbGrams.toFixed(0),
        });
        setShowChart(true);
    };

    const data = [
        { name: "Protein", value: parseFloat(macros.protein) || 0 },
        { name: "Fat", value: parseFloat(macros.fat) || 0 },
        { name: "Carbohydrates", value: parseFloat(macros.carbs) || 0 },
    ];

    const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
                <h2 className="text-3xl font-bold mb-4 text-center">Maintenance Calories Calculator</h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Diet</label>
                            <select
                                className="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={diet}
                                onChange={(e) => setDiet(e.target.value)}
                            >
                                <option value="1">Standard</option>
                                <option value="2">Leangains</option>
                                <option value="3">Keto</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Units</label>
                            <select
                                className="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                            >
                                <option value="1">Metric (kg, cm)</option>
                                <option value="2">Imperial (lb, in)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-bold mb-2">Stats</h3>
                            <label className="block mb-1">Age:</label>
                            <input
                                type="number"
                                className="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            <label className="block mb-1">Weight:</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="flex-grow border border-gray-300 p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                                <span className="border border-gray-300 p-2 rounded-r">{units === "1" ? "kg" : "lb"}</span>
                            </div>
                            <label className="block mb-1">Height:</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="flex-grow border border-gray-300 p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                                <span className="border border-gray-300 p-2 rounded-r">{units === "1" ? "cm" : "in"}</span>
                            </div>
                            <label className="block mb-1">Gender:</label>
                            <div className="flex space-x-4">
                                <label className={`flex items-center ${gender === "5" ? "text-blue-600" : ""}`}>
                                    <input
                                        type="radio"
                                        value="5"
                                        checked={gender === "5"}
                                        onChange={() => setGender("5")}
                                    />{" "}
                                    Male
                                </label>
                                <label className={`flex items-center ${gender === "-160" ? "text-blue-600" : ""}`}>
                                    <input
                                        type="radio"
                                        value="-160"
                                        checked={gender === "-160"}
                                        onChange={() => setGender("-160")}
                                    />{" "}
                                    Female
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2">Modifiers</h3>
                            <label className="block mb-1">Activity Level:</label>
                            <select
                                className="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                            >
                                <option value="1.2">Sedentary</option>
                                <option value="1.375">Lightly Active</option>
                                <option value="1.55">Moderately Active</option>
                                <option value="1.725">Very Active</option>
                                <option value="1.9">Extremely Active</option>
                            </select>
                            <label className="block mb-1">Goal:</label>
                            <select
                                className="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                            >
                                <option value="-20">Lose Weight (–20%)</option>
                                <option value="-10">Slowly Lose Weight (–10%)</option>
                                <option value="0">Maintain Weight (0%)</option>
                                <option value="10">Slowly Gain Weight (+10%)</option>
                                <option value="20">Gain Weight (+20%)</option>
                            </select>
                            <label className="block mb-1">Calorie Deficit/Surplus:</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="flex-grow border border-gray-300 p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={calorieDeficitSurplus}
                                    onChange={(e) => setCalorieDeficitSurplus(e.target.value)}
                                />
                                <span className="border border-gray-300 p-2 rounded-r">kcal</span>
                            </div>
                            <label className="block mb-1">Protein Goal:</label>
                            <select
                                className="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                            >
                                <option value="1">1g/kg</option>
                                <option value="1.5">1.5g/kg</option>
                                <option value="2">2g/kg</option>
                            </select>
                            <label className="block mb-1">Fat/Carb Split:</label>
                            <input
                                type="number"
                                value={fatCarbSplit}
                                min={0}
                                max={100}
                                onChange={(e) => setFatCarbSplit(e.target.value)}
                                className="block w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="w-full bg-orange-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={calculateCaloriesAndMacros}
                    >
                        Calculate
                    </button>
                </form>

                {showChart && (
                    <div className="mt-6">
                        <h3 className="text-2xl font-semibold text-center mb-4">Macros Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
                {maintenanceCalories && (
                    <div className="mt-6 text-center">
                        <h3 className="text-xl font-semibold">Your Maintenance Calories: <span className="text-blue-600">{maintenanceCalories} kcal</span></h3>
                        <Link to="/generate" className="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Go to Meal Planner
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateCalories;
