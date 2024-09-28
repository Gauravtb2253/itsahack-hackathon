import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

const GenerateRecipe = () => {
  const [goal, setGoal] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    lowCarb: false,
    other: "",
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [schedule, setSchedule] = useState('');

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
    } else {
      setStates([]);
    }
    setSelectedState("");
    setSelectedCity("");
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
    setSelectedCity("");
  }, [selectedState, selectedCountry]);

  const handleDietaryRestrictionChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setDietaryRestrictions((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setDietaryRestrictions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      goal,
      dietaryRestrictions,
      selectedCountry,
      selectedState,
      selectedCity,
      schedule,
    };

    try {
      const response = await fetch("http://localhost:5001/api/generate-mealplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Recipe created:", data);
      } else {
        console.error("Error creating recipe:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="container mx-auto p-7 mt-11">
      <h2 className="text-3xl font-bold mb-4 text-center text-orange-500">Personalized Nutrition Input</h2>

      <form
        onSubmit={handleRecipeSubmit}
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 transition duration-300 ease-in-out transform hover:shadow-2xl"
      >
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Dietary Restrictions:</h3>
          {[
            { label: "Vegan", name: "vegan" },
            { label: "Vegetarian", name: "vegetarian" },
            { label: "Gluten-Free", name: "glutenFree" },
            { label: "Dairy-Free", name: "dairyFree" },
            { label: "Nut-Free", name: "nutFree" },
            { label: "Low-Carb", name: "lowCarb" },
          ].map((restriction) => (
            <label key={restriction.name} className="block mb-2">
              <input
                type="checkbox"
                name={restriction.name}
                checked={dietaryRestrictions[restriction.name]}
                onChange={handleDietaryRestrictionChange}
                className="mr-2 leading-tight"
              />
              <span className="text-lg">{restriction.label}</span>
            </label>
          ))}
          <label className="block">
            <input
              type="text"
              name="other"
              value={dietaryRestrictions.other}
              onChange={handleDietaryRestrictionChange}
              placeholder="Other dietary restrictions"
              className="border rounded w-full py-2 px-3 text-gray-700 mt-2 border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200"
            />
          </label>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Location:</h3>
          <label className="block mb-2">
            <span className="block mb-1">Country:</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700 transition duration-200 focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            <span className="block mb-1">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700 transition duration-200 focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block mb-1">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700 transition duration-200 focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            <span className="block mb-1">Schedule:</span>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700 transition duration-200 focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="">Select Schedule</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
        >
          Generate Meal Plan
        </button>
      </form>
    </div>
  );
};

export default GenerateRecipe;
