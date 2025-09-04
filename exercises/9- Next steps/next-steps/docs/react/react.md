# React.js Fundamentals

## Introduction to React

React is a JavaScript library for building user interfaces, particularly single-page applications. It's maintained by Meta (formerly Facebook) and a community of individual developers and companies. React allows developers to create large web applications that can change data without reloading the page.

### Learning Objectives

- Understand React's component-based architecture
- Master JSX syntax and rendering elements
- Learn state and props management in React
- Implement React Hooks for functional components
- Create and manage forms in React
- Build efficient and performant React applications
- Configure and use React Router for navigation
- Learn modern React patterns and best practices

### The Role of React in Modern Web Development

React powers the UI layer of web applications. It:

- Simplifies building interactive UIs
- Uses a declarative approach to efficiently update the DOM
- Creates reusable component-based architecture
- Maintains its own virtual DOM for performance optimization
- Integrates easily with other libraries and frameworks
- Supports server-side rendering and mobile app development

In modern web development, React has become the foundation for:

- Single-page applications (SPAs)
- Progressive web apps (PWAs)
- Component-based design systems
- Microfrontend architectures
- Headless CMS frontends
- Modern JAMstack applications

## React Basics

### What is React?

React is a library, not a framework, focusing specifically on the view layer of applications. It introduces a component-based architecture that promotes reusability, maintainability, and a unidirectional data flow that makes applications more predictable.

### Ways to Include React

1. Using Create React App:

   ```bash
   npx create-react-app my-app
   cd my-app
   npm start
   ```

2. Using Vite (modern, faster alternative):

   ```bash
   npm create vite@latest my-react-app -- --template react
   cd my-react-app
   npm install
   npm run dev
   ```

3. Adding React to an existing website:
   ```html
   <script
     crossorigin
     src="https://unpkg.com/react@18/umd/react.development.js"
   ></script>
   <script
     crossorigin
     src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
   ></script>
   ```

### JSX Syntax

JSX (JavaScript XML) allows you to write HTML-like syntax in JavaScript:

```jsx
const element = <h1>Hello, world!</h1>;

// With expressions
const name = "John";
const element = <h1>Hello, {name}!</h1>;

// With attributes
const element = <img src={user.avatarUrl} alt="Profile" />;

// With children
const element = (
  <div>
    <h1>Hello!</h1>
    <p>Good to see you</p>
  </div>
);
```

JSX is transformed to regular JavaScript by build tools:

```javascript
// JSX
const element = <h1 className="greeting">Hello, world!</h1>;

// Transformed to
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, world!"
);
```

## Components

Components are the building blocks of React applications. They encapsulate UI elements and their behavior.

### Functional Components

Modern React primarily uses functional components with hooks:

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Arrow function syntax
const Welcome = (props) => <h1>Hello, {props.name}</h1>;

// Using with JSX
<Welcome name="Sara" />;
```

### Class Components

Class components are an older approach but still supported:

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### Component Composition

Components can be composed together to build complex UIs:

```jsx
function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

## State and Props

### Props

Props (properties) are inputs to components and are passed from parent to child:

```jsx
// Parent component passing props
<UserProfile name="John" age={25} isAdmin={true} />;

// Child component receiving props
function UserProfile(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      {props.isAdmin && <p>Admin User</p>}
    </div>
  );
}

// With destructuring
function UserProfile({ name, age, isAdmin }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isAdmin && <p>Admin User</p>}
    </div>
  );
}
```

Props are:

- Read-only
- Can be of any type (strings, numbers, arrays, objects, functions)
- Can include children elements using the special `children` prop

### State

State is component-specific data that can change over time:

```jsx
// State with hooks
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

// Multiple state variables
function UserForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
    </form>
  );
}
```

State with objects:

```jsx
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <form>
      <input name="name" value={user.name} onChange={handleChange} />
      <input name="email" value={user.email} onChange={handleChange} />
    </form>
  );
}
```

## React Hooks

Hooks are functions that let you "hook into" React state and lifecycle features from function components.

### useState

Manages state in functional components:

```jsx
import { useState } from "react";

function Example() {
  // Declare a state variable "count" with initial value 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### useEffect

Handles side effects in functional components:

```jsx
import { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    document.title = `You clicked ${count} times`;

    // Clean up function (similar to componentWillUnmount)
    return () => {
      document.title = "React App";
    };
  }, [count]); // Only re-run if count changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

Common useEffect patterns:

```jsx
// Runs on every render
useEffect(() => {
  console.log("Component rendered");
});

// Runs only on mount (empty dependency array)
useEffect(() => {
  console.log("Component mounted");
}, []);

// Runs when specific dependencies change
useEffect(() => {
  console.log("Count or name changed", count, name);
}, [count, name]);

// Cleanup on unmount
useEffect(() => {
  const subscription = subscribeToData();
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### useContext

Provides a way to share values between components without passing props:

```jsx
import { createContext, useContext, useState } from "react";

// Create a context
const ThemeContext = createContext(null);

// Provider component
function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`app ${theme}`}>
        <Header />
        <Main />
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

// Consumer component
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </header>
  );
}
```

### useReducer

Provides more predictable state transitions than useState:

```jsx
import { useReducer } from "react";

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}
```

### useRef

Persists values between renders and provides a way to access DOM elements:

```jsx
import { useRef, useEffect } from "react";

function TextInputWithFocusButton() {
  // Create a ref
  const inputRef = useRef(null);

  // Focus the input element
  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

// Using ref to store mutable values
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

### useMemo and useCallback

Optimize performance by memoizing values and functions:

```jsx
import { useState, useMemo, useCallback } from "react";

function ExpensiveCalculation({ list, onItemClick }) {
  // Memoize expensive calculation
  const sortedList = useMemo(() => {
    console.log("Sorting list...");
    return [...list].sort();
  }, [list]); // Only recalculate when list changes

  // Memoize callback function
  const handleClick = useCallback(
    (item) => {
      console.log("Item clicked:", item);
      onItemClick(item);
    },
    [onItemClick]
  ); // Only recreate when onItemClick changes

  return (
    <ul>
      {sortedList.map((item) => (
        <li key={item} onClick={() => handleClick(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

### Custom Hooks

Create reusable stateful logic:

```jsx
// Custom hook for form handling
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    resetForm,
  };
}

// Using the custom hook
function SignupForm() {
  const { values, handleChange, resetForm } = useForm({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form values:", values);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={values.username} onChange={handleChange} />
      <input name="email" value={values.email} onChange={handleChange} />
      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Forms in React

### Controlled Components

Components where form data is handled by the React state:

```jsx
function ControlledForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, message });
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Uncontrolled Components

Components that use a ref to get form values directly from the DOM:

```jsx
function UncontrolledForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value,
    };
    console.log(formData);
    // Reset form
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" ref={nameRef} defaultValue="" />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" ref={emailRef} defaultValue="" />
      </div>

      <div>
        <label htmlFor="message">Message:</label>
        <textarea id="message" ref={messageRef} defaultValue="" />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Form Libraries

For complex forms, libraries like Formik or React Hook Form can be used:

```jsx
// Using React Hook Form
import { useForm } from "react-hook-form";

function HookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Creating a React Project with Vite

Vite is a build tool that provides a faster and leaner development experience for modern web projects. It's an excellent alternative to Create React App.

### Setting Up a New Project

```bash
# Using npm
npm create vite@latest my-react-app -- --template react

# Using yarn
yarn create vite my-react-app --template react

# Using pnpm
pnpm create vite my-react-app --template react

# Enter the project directory
cd my-react-app

# Install dependencies
npm install
# or
yarn
# or
pnpm install

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Available Templates

Vite offers various React templates:

```bash
# React with JavaScript
npm create vite@latest my-app -- --template react

# React with TypeScript
npm create vite@latest my-app -- --template react-ts

# React with Swc (faster JavaScript compiler)
npm create vite@latest my-app -- --template react-swc

# React with TypeScript and Swc
npm create vite@latest my-app -- --template react-swc-ts
```

### Project Structure

A typical Vite React project structure:

```
my-react-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Configuration

You can customize Vite through the `vite.config.js` file:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
});
```

### Adding Dependencies

```bash
# Adding React Router
npm install react-router-dom

# Adding styling libraries
npm install styled-components
# or
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Adding state management
npm install zustand
# or
npm install @reduxjs/toolkit react-redux
```

## Routing with React Router

React Router is the standard library for routing in React applications.

### Basic Setup

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Route Parameters

```jsx
import { useParams } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserProfile() {
  const { userId } = useParams();

  return <div>User Profile for user {userId}</div>;
}
```

### Nested Routes

```jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <header>
        <nav>{/* Navigation links */}</nav>
      </header>

      <main>
        <Outlet /> {/* Where nested routes render */}
      </main>

      <footer>{/* Footer content */}</footer>
    </div>
  );
}
```

### Navigation

```jsx
import { useNavigate, useLocation } from "react-router-dom";

function NavigationExample() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <p>Current path: {location.pathname}</p>

      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>

      <button onClick={() => navigate(-1)}>Go Back</button>

      <button
        onClick={() => navigate("/profile", { state: { from: "navigation" } })}
      >
        Go to Profile with State
      </button>
    </div>
  );
}
```

## Styling in React

### CSS Modules

CSS Modules locally scope CSS by automatically creating unique class names:

```css
/* Button.module.css */
.button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.primary {
  background-color: #2196f3;
}
```

```jsx
import styles from "./Button.module.css";

function Button({ children, variant }) {
  return (
    <button
      className={`${styles.button} ${
        variant === "primary" ? styles.primary : ""
      }`}
    >
      {children}
    </button>
  );
}
```

### Styled Components

CSS-in-JS library for component-based styling:

```jsx
import styled from "styled-components";

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  ${(props) =>
    props.primary &&
    `
    background-color: #2196F3;
  `}

  &:hover {
    opacity: 0.8;
  }
`;

function App() {
  return (
    <div>
      <Button>Normal Button</Button>
      <Button primary>Primary Button</Button>
    </div>
  );
}
```

### Tailwind CSS

Utility-first CSS framework:

```jsx
// After installing and configuring Tailwind

function Card({ title, content }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      <p className="text-gray-600">{content}</p>
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Read More
      </button>
    </div>
  );
}
```

## State Management

### Context API for Global State

```jsx
import { createContext, useContext, useState } from "react";

// Create context
const AuthContext = createContext(null);

// Context provider
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// App component with provider
function App() {
  return (
    <AuthProvider>
      <Header />
      <Main />
    </AuthProvider>
  );
}

// Component using the context
function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      {user ? (
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button>Login</button>
      )}
    </header>
  );
}
```

### Zustand (Lightweight State Management)

```jsx
import create from "zustand";

// Create store
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Component using the store
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## Performance Optimization

### React.memo

Prevents unnecessary re-renders of functional components:

```jsx
import { memo } from "react";

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  console.log("Rendering expensive component");

  return (
    <div>
      <h2>Expensive Calculation</h2>
      <p>{data.result}</p>
    </div>
  );
});

// Will only re-render when data.result changes
```

### Code Splitting

Split code into smaller chunks that load on demand:

```jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Virtualization for Long Lists

Use libraries like `react-window` or `react-virtualized` for large lists:

```jsx
import { FixedSizeList } from "react-window";

function List({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>Item {items[index]}</div>
  );

  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}
```

## Testing React Applications

### Jest and React Testing Library

```jsx
// Button.jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

// Button.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

test("renders button with correct text", () => {
  render(<Button>Click me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});

test("calls onClick when clicked", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText(/click me/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Hooks

```jsx
// useCounter.js
import { useState } from "react";

function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialCount);

  return { count, increment, decrement, reset };
}

// useCounter.test.js
import { renderHook, act } from "@testing-library/react-hooks";
import useCounter from "./useCounter";

test("should increment counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## React Best Practices

1. Use functional components with hooks instead of class components
2. Keep components small and focused on a single responsibility
3. Use prop destructuring for clarity
4. Use React.memo() for expensive computations
5. Avoid unnecessary re-renders with useMemo and useCallback
6. Implement proper error boundaries
7. Use keys correctly in lists
8. Lift state up when needed, but keep it as close as possible to where it's used
9. Follow consistent naming conventions
10. Extract reusable logic into custom hooks

### Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Using the error boundary
function App() {
  return (
    <ErrorBoundary fallback={<p>Could not load application.</p>}>
      <Main />
    </ErrorBoundary>
  );
}
```

### Component Composition

```jsx
// Instead of prop drilling
function Layout({ children, sidebar }) {
  return (
    <div className="layout">
      <aside className="sidebar">{sidebar}</aside>
      <main className="content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Layout sidebar={<Navigation />}>
      <Dashboard />
    </Layout>
  );
}
```

### Additional Resources

- [React Official Documentation](https://react.dev/) for comprehensive React guides
- [React Hooks Documentation](https://react.dev/reference/react) for hooks reference
- [Vite Documentation](https://vitejs.dev/guide/) for Vite features and plugins
- [React Router Documentation](https://reactrouter.com/en/main) for routing guides
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/) for testing guidance

## Advanced State Management and Data Fetching

### State Management vs. Data Fetching Libraries

In modern React applications, we use two distinct categories of libraries to manage data:

1. **State Management Libraries** (Redux, Zustand, Jotai, etc.) focus on managing UI state, application state, and business logic. They provide ways to store, update, and access state across your application with predictable patterns.

2. **Data Fetching Libraries** (SWR, TanStack Query, etc.) focus specifically on fetching, caching, synchronizing, and updating server state. They handle the complex lifecycle of remote data including loading states, caching, background refreshing, and error handling.

The key difference is that state management libraries primarily handle client-side state, while data fetching libraries manage server-side state and provide robust patterns for handling asynchronous data operations.

### State Management Libraries

#### Redux

Redux is a predictable state container for JavaScript applications, commonly used with React. It follows a unidirectional data flow pattern with a single source of truth.

```jsx
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

// Create a slice
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

// Create store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Extract actions
const { increment, decrement } = counterSlice.actions;

// Component using Redux
function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

// Provide store to React app
function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

Key features of Redux:

- Centralized state management
- Immutable updates using reducers
- Middleware for side effects
- Time-travel debugging
- Rich ecosystem and developer tools

#### Zustand

Zustand is a small, fast, and scalable state management solution that uses hooks.

```jsx
import { create } from "zustand";

// Create a store
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Component using Zustand
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

Key features of Zustand:

- Minimal API with hooks-based approach
- No providers required
- Supports middleware
- Avoids unnecessary re-renders
- TypeScript friendly
- Can be used outside of React

#### Jotai

Jotai is an atomic state management library for React that focuses on primitive state atoms.

```jsx
import { atom, useAtom } from "jotai";

// Create atoms
const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Component using Jotai
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubleCount] = useAtom(doubleCountAtom);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double Count: {doubleCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

// No providers needed for basic usage
function App() {
  return <Counter />;
}
```

Key features of Jotai:

- Atomic model inspired by Recoil
- Bottom-up composition of state
- No boilerplate compared to Redux
- Built for React with Suspense support
- Small bundle size
- Can replace useState and useContext

### Data Fetching Libraries

#### SWR

SWR (stale-while-revalidate) is a React Hooks library for data fetching that implements a smart caching strategy.

```jsx
import useSWR from "swr";

// Fetch function
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function UserProfile({ userId }) {
  const { data, error, isLoading } = useSWR(`/api/users/${userId}`, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Email: {data.email}</p>
    </div>
  );
}
```

Key features of SWR:

- Automatic revalidation on window focus, network recovery, etc.
- Deduplication of multiple same requests
- Built-in pagination, infinite scrolling support
- Lightweight and focused API
- Real-time data updates
- Local mutation for optimistic UI

#### TanStack Query (React Query)

TanStack Query is a powerful data synchronization library for fetching, caching, and updating asynchronous data.

```jsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function UserProfile({ userId }) {
  // Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: (newUserData) =>
      fetch(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(newUserData),
      }).then((res) => res.json()),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button
        onClick={() => mutation.mutate({ ...data, name: "New Name" })}
        disabled={mutation.isPending}
      >
        Update Name
      </button>
    </div>
  );
}

// Provide client to application
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProfile userId="123" />
    </QueryClientProvider>
  );
}
```

Key features of TanStack Query:

- Powerful caching and automatic garbage collection
- Parallel queries, dependent queries, and paginated/infinite queries
- Mutations with optimistic updates and rollbacks
- Request deduplication and retry logic
- Prefetching capabilities
- DevTools for debugging and visualization
- Server-side rendering support

### Choosing the Right Library

When selecting libraries for your React application:

1. **For client state**: Choose Redux for large, complex applications with shared state; Zustand for simpler state needs with minimal boilerplate; or Jotai for fine-grained atomic state control.

2. **For server state**: Use SWR for simple data fetching with automatic revalidation, or TanStack Query for more complex data synchronization needs including mutations and advanced caching.

Many applications use a combination: a state management library for UI/application state and a data fetching library specifically for API interactions.

```

```
