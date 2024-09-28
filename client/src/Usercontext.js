import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [ready, setReady] = useState(false);
  const [maintenanceCalories,setMaintenanceCalories] = useState(0)
  const [protein,setProtein] = useState(0)
  const [fats,setFats] = useState(0)
  const [carbs,setCarbs] = useState(0)
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready, setReady ,maintenanceCalories,setMaintenanceCalories,protein,setProtein, fats,setFats,carbs,setCarbs}}>

      {children}
    </UserContext.Provider>
  );
}
