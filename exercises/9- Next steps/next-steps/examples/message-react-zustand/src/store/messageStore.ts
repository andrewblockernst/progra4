/**
 * Zustand is a lightweight state management library that uses a single store pattern.
 * It provides a simple API to create and manage global state in React applications.
 *
 * Key concepts in this implementation:
 * 1. Store Creation: Using `create` function to create a store with initial state and actions
 * 2. State Interface: TypeScript interface defining the shape of our store
 * 3. Actions: Functions that modify the store state
 * 4. State Updates: Using the `set` function to update state immutably
 */

import { create } from "zustand";
import type { Mensaje } from "../types";

// Define the shape of our store state and actions
interface MessageState {
  // State properties
  messages: Mensaje[]; // Array of messages
  loading: boolean; // Loading state for async operations
  error: string | null; // Error state for error handling
  search: string; // Search query string

  // Action methods
  setSearch: (search: string) => void; // Update search query
  fetchMessages: (search?: string) => Promise<void>; // Fetch messages from API
  addMessage: (content: string) => Promise<void>; // Add new message
  likeMessage: (id: string) => Promise<void>; // Like a message
}

const BASE_URL = "http://localhost:4321/api";

let timeout: number;

// Create the store using Zustand's create function
// The create function takes a callback that receives a set function
// The set function is used to update the store state
export const useMessageStore = create<MessageState>((set, get) => ({
  // Initial state
  messages: [],
  loading: false,
  error: null,
  search: "",

  // Action: Update search query
  // Uses set to update the search state
  setSearch: (search) => {
    set({ search });
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      get().fetchMessages(search);
    }, 500);
  },

  // Action: Fetch messages from API
  // Uses set to update loading, error, and messages states
  fetchMessages: async (search = "") => {
    set({ loading: true, error: null }); // Set loading state and clear errors
    try {
      const response = await fetch(
        `${BASE_URL}/mensajes${search ? `?search=${search}` : ""}`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data: { messages: Mensaje[] } = await response.json();
      set({ messages: data.messages, loading: false }); // Update messages and loading state
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  // Action: Add new message
  // Uses set with a function to update messages state immutably
  addMessage: async (content: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to add message");
      const data: { message: Mensaje } = await response.json();
      // Use function form of set to access previous state
      set((state) => ({
        messages: [...state.messages, data.message],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  // Action: Like a message
  // Uses set with a function to update messages state immutably
  likeMessage: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "like" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to like message");
      const data: { message: Mensaje } = await response.json();
      // Use function form of set to access previous state
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? data.message : msg
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },
}));
