import AsyncStorage from "@react-native-async-storage/async-storage";



// Save data (generic function for any key)
export const saveDataToStorage = async (key, value, limit = 15) => {
    try {
        const storedData = await AsyncStorage.getItem(key);
        let dataList = storedData ? JSON.parse(storedData) : [];

        // Remove existing occurrences of the value
        dataList = dataList.filter(item => item !== value);

        // Add the new value at the beginning
        dataList.unshift(value);

        // Keep only the latest `limit` number of items
        dataList = dataList.slice(0, limit);
        console.log(dataList,"dataList");

        await AsyncStorage.setItem(key, JSON.stringify(dataList));
    } catch (error) {
        console.error(`Error saving data for key (${key}):`, error);
    }
};

// Retrieve data (generic function)
export const getDataFromStorage = async (key) => {
    try {
        const storedData = await AsyncStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error(`Error retrieving data for key (${key}):`, error);
        return [];
    }
};

// Clear data (generic function)
export const clearAllStorage = async () => {
    try {
        await AsyncStorage.clear();
        console.log("All AsyncStorage data has been cleared.");
    } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
    }
};

export const removeDataFromStorage = async (key, valueToRemove) => {
    try {

        console.log(valueToRemove,"valueToRemove");
        const storedData = await AsyncStorage.getItem(key);
        let dataList = storedData ? JSON.parse(storedData) : [];

        // Filter out the specific item
        dataList = dataList.filter(item => item !== valueToRemove);

        // Save the updated list back to AsyncStorage
        await AsyncStorage.setItem(key, JSON.stringify(dataList));

        console.log(`Item "${valueToRemove}" removed successfully.`);
    } catch (error) {
        console.error(`Error removing data for key (${key}):`, error);
    }
};


export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

// Get token
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

// Remove token (logout)
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
    } catch (error) {
        console.error('Error removing token:', error);
    }
};
  