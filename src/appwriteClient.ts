import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Validate environment variables
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint) {
  throw new Error("Appwrite Endpoint is missing. Make sure VITE_APPWRITE_ENDPOINT is set in your .env file.");
}
if (!projectId) {
  throw new Error("Appwrite Project ID is missing. Make sure VITE_APPWRITE_PROJECT_ID is set in your .env file.");
}

const client = new Client();

client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId); // Your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID }; // Export ID utility for creating unique IDs

console.log("Appwrite client initialized."); // Optional: for debugging

export default client;