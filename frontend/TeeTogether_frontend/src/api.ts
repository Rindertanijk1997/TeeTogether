const API_BASE_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

// 🔹 Registrera en ny användare
export const registerUser = async (username: string, password: string, city: string, age: number) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, city, age }),
  });
  return response.json();
};

// 🔹 Logga in en användare
export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

// 🔹 Hämta alla användare
export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
};

// 🔹 Skicka en vänförfrågan
export const sendFriendRequest = async (userId: string, friendId: string) => {
  const response = await fetch(`${API_BASE_URL}/friends/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });
  return response.json();
};

// 🔹 Acceptera en vänförfrågan
export const acceptFriendRequest = async (userId: string, friendId: string) => {
  const response = await fetch(`${API_BASE_URL}/friends/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });
  return response.json();
};

// 🔹 Söka efter golfvänner
export const searchGolfFriends = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/friends/search?userId=${userId}`);
  return response.json();
};

// 🔹 Ta bort en vän
export const removeFriend = async (userId: string, friendId: string) => {
  const response = await fetch(`${API_BASE_URL}/friends/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });
  return response.json();
};

// 🔹 Registrera en golf-rond
export const registerRound = async (userId: string, course: string, score: number, newHCP: number) => {
  const response = await fetch(`${API_BASE_URL}/registerRound`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, course, score, newHCP }),
  });
  return response.json();
};

