const API_URL = "https://localhost:3000/api/users";

// Function to register a user
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

// Function to login a user
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};
