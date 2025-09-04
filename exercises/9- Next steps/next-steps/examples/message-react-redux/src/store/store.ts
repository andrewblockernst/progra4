import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./messageSlice";

// Redux follows the Flux architecture pattern, which is a unidirectional data flow:
// 1. Actions: Events that describe what happened (e.g., user clicked a button)
// 2. Reducers: Pure functions that specify how the state changes in response to actions
// 3. Store: The central state container that holds the application state
// 4. View: Components that read from the store and dispatch actions

// The store is configured with reducers, which are functions that:
// - Take the current state and an action as arguments
// - Return a new state based on the action
// - Must be pure functions (same input always produces same output)
// - Should not modify the existing state, but return a new state object

export const store = configureStore({
  reducer: {
    // Each key in the reducer object represents a "slice" of the state
    // The messageReducer will handle all actions related to messages
    // and maintain its own piece of the state tree
    messages: messageReducer,
  },
});

// Types just to make it easier to use the store in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
