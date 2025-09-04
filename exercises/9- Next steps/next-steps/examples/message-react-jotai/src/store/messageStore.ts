/**
 * Jotai is an atomic state management library that uses atoms as the basic unit of state.
 * It provides a more granular and composable approach to state management compared to
 * traditional store-based solutions like Zustand or Redux.
 *
 * Key concepts in this implementation:
 * 1. Atoms: Basic units of state that can be read and written to
 * 2. Derived Atoms: Atoms that depend on other atoms or perform actions
 * 3. Write-only Atoms: Atoms that only perform actions without storing state
 * 4. Atom Updates: Using the set function to update atom values immutably
 */

import { atom, createStore } from "jotai";
import type { Mensaje } from "../types";

const BASE_URL = "http://localhost:4321/api";

// State atoms - Basic units of state
// Each atom represents a single piece of state
export const messagesAtom = atom<Mensaje[]>([]); // Array of messages
export const loadingAtom = atom(false); // Loading state
export const errorAtom = atom<string | null>(null); // Error state
export const searchAtom = atom(""); // Search query
export const store = createStore(); // Store

// Derived atoms for actions
// These are write-only atoms that perform actions and update other atoms

// Fetch messages action
// This is a write-only atom (first parameter is null) that updates other atoms
export const fetchMessagesAtom = atom(
  null, // Read function is null because this is a write-only atom
  async (get, set) => {
    const search = get(searchAtom);
    // Update loading and error states
    set(loadingAtom, true);
    set(errorAtom, null);
    try {
      // Fetch messages from API
      const response = await fetch(
        `${BASE_URL}/mensajes${search ? `?search=${search}` : ""}`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data: { messages: Mensaje[] } = await response.json();
      // Update messages atom with fetched data
      set(messagesAtom, data.messages);
    } catch (error) {
      // Update error atom if fetch fails
      set(
        errorAtom,
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      // Update loading atom when operation completes
      set(loadingAtom, false);
    }
  }
);

let timeout: number;
store.sub(searchAtom, () => {
  console.log("searchAtom changed");
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    store.set(fetchMessagesAtom);
  }, 500);
});

// Add message action
// This is a write-only atom that adds a new message to the messages atom
export const addMessageAtom = atom(
  null, // Write-only atom
  async (_, set, content: string) => {
    set(loadingAtom, true);
    set(errorAtom, null);
    try {
      // Send POST request to add message
      const response = await fetch(`${BASE_URL}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to add message");
      const data: { message: Mensaje } = await response.json();
      // Update messages atom by appending new message
      set(messagesAtom, (prev) => [...prev, data.message]);
    } catch (error) {
      set(
        errorAtom,
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      set(loadingAtom, false);
    }
  }
);

// Like message action
// This is a write-only atom that updates a message's like count
export const likeMessageAtom = atom(
  null, // Write-only atom
  async (_, set, id: string) => {
    set(loadingAtom, true);
    set(errorAtom, null);
    try {
      // Send POST request to like message
      const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: "like" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to like message");
      const data: { message: Mensaje } = await response.json();
      // Update messages atom by replacing the liked message
      set(messagesAtom, (prev) =>
        prev.map((msg) => (msg.id === id ? data.message : msg))
      );
    } catch (error) {
      set(
        errorAtom,
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      set(loadingAtom, false);
    }
  }
);
