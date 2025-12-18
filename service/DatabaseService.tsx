import "expo-sqlite";

export const connectToDatabase = async (connectionString: string) => {
    // Simulate a database connection
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (connectionString) {
                resolve(`Connected to database with connection string: ${connectionString}`);
            } else {
                reject('Connection string is required');
            }
        }, 1000);
    });
}   