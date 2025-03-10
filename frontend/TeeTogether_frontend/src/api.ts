const API_BASE_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

// 🔹 Hjälpfunktion för att hantera fetch-förfrågningar med felhantering
const fetchData = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fel vid API-anrop: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("API-fel:", error);
    return { error: "Ett fel uppstod vid API-anrop." };
  }
};

// 🔹 Registrera en ny användare
export const registerUser = async (username: string, password: string, city: string, age: number) => {
  return fetchData(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, city, age }),
  });
};

// 🔹 Logga in en användare
export const loginUser = async (username: string, password: string) => {
  return fetchData(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
};

// 🔹 Hämta en specifik användare
export const getUser = async (userId: string) => {
  return fetchData(`${API_BASE_URL}/users/${userId}`);
};

// 🔹 Uppdatera en användares profil
export const updateUser = async (userId: string, updateData: { username?: string; city?: string; currentHCP?: number }) => {
  return fetchData(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
};

// 🔹 Hämta alla användare
export const getUsers = async () => {
  return fetchData(`${API_BASE_URL}/users`);
};

// 🔹 Skicka en vänförfrågan
export const sendFriendRequest = async (userId: string, friendId: string) => {
  return fetchData(`${API_BASE_URL}/friends/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });
};

// 🔹 Hämta vänförfrågningar (de du har fått)
export const getFriendRequests = async (userId: string) => {
  return fetchData(`${API_BASE_URL}/friends/requests?userId=${userId}`);
};

// 🔹 Acceptera en vänförfrågan
export const acceptFriendRequest = async (userId: string, friendId: string) => {
  return fetchData(`${API_BASE_URL}/friends/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });
};

// 🔹 Avvisa en vänförfrågan (om du vill kunna neka en förfrågan)
export const declineFriendRequest = async (userId: string, friendId: string) => {
  return fetchData(`${API_BASE_URL}/friends/decline`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });
};

// 🔹 Hämta användarens vänner
export const getFriends = async (userId: string) => {
  return fetchData(`${API_BASE_URL}/friends/search?userId=${userId}`);
};

// 🔹 Ta bort en vän
export const removeFriend = async (userId: string, friendId: string) => {
  return fetchData(`${API_BASE_URL}/friends/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });
};

// 🔹 Registrera en golf-rond
export const registerRound = async (userId: string, course: string, score: number, newHCP: number) => {
  return fetchData(`${API_BASE_URL}/registerRound`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, course, score, newHCP }),
  });
};

export const getUserRounds = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/rounds?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error("Kunde inte hämta ronder");
  }

  const data = await response.json();
  console.log("🎯 Hämtade ronder från API:", data);

  return data; // Returnerar den hämtade datan
};


// 🔹 Söka efter golfvänner
export const searchGolfFriends = async (userId: string) => {
  return fetchData(`${API_BASE_URL}/friends/search?userId=${userId}`);
};
