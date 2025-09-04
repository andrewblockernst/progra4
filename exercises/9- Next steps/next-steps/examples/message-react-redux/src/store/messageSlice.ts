import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Mensaje } from "../types";

const BASE_URL = "http://localhost:4321/api";

// Define the shape of our message state
// This includes the messages array, loading state for async operations,
// and error state for handling failures
interface MessageState {
  messages: Mensaje[];
  loading: boolean;
  error: string | null;
}

// Initial state for our message slice
// This is the starting point before any actions are dispatched
const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

// Async Thunks are special Redux actions that can handle asynchronous operations
// They are created using createAsyncThunk and automatically generate three action types:
// - pending: when the async operation starts
// - fulfilled: when the operation succeeds
// - rejected: when the operation fails

// Thunk for fetching messages with optional search parameter
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages", // Action type prefix
  async (search: string) => {
    const response = await fetch(`${BASE_URL}/mensajes?search=${search}`);
    const data: { messages: Mensaje[] } = await response.json();
    return data.messages;
  }
);

// Thunk for adding a new message
export const addMessage = createAsyncThunk(
  "messages/addMessage",
  async (content: string) => {
    const response = await fetch(`${BASE_URL}/mensajes`, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: { message: Mensaje } = await response.json();
    return data.message;
  }
);

// Thunk for liking a message
export const likeMessage = createAsyncThunk(
  "messages/likeMessage",
  async (id: string) => {
    const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "like" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: { mensaje: Mensaje } = await response.json();
    return data.mensaje;
  }
);

// Thunk for deleting a message
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (id: string) => {
    const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "delete" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: { mensaje: Mensaje } = await response.json();
    return data.mensaje;
  }
);

// Create the message slice using createSlice
// This combines our reducers and actions in one place
const messageSlice = createSlice({
  name: "messages", // Name of the slice, used as prefix for action types
  initialState, // Initial state defined above
  reducers: {}, // No synchronous reducers in this slice
  extraReducers: (builder) => {
    builder
      // Handle fetch messages lifecycle
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })
      // Handle add message success
      .addCase(addMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      // Handle like message success
      .addCase(likeMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(
          (msg) => msg.id === action.payload.id
        );
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      // Handle delete message success
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (msg) => msg.id !== action.payload.id
        );
      });
  },
});

export default messageSlice.reducer;
