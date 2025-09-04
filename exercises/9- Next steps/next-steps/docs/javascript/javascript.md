# JavaScript Fundamentals

## Introduction to JavaScript

JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It's one of the three core technologies of web development, alongside HTML (structure) and CSS (presentation). JavaScript enables interactive web pages and is an essential part of web applications.

### Learning Objectives

- Understand JavaScript syntax and fundamental concepts
- Learn about JavaScript data structures and types
- Explore the event loop and asynchronous programming
- Master DOM manipulation for interactive web pages
- Understand how to use promises and fetch API
- Gain insights into modern JavaScript features and best practices

### The Role of JavaScript in Modern Web Development

JavaScript powers the behavior layer of web applications. It:

- Adds interactivity to web pages
- Manipulates DOM elements dynamically
- Manages client-side data and state
- Communicates with servers via APIs
- Provides real-time updates without page reloads
- Enables complex applications to run in browsers

In modern web development, JavaScript has evolved from a simple scripting language to a powerful programming language that:

- Powers front-end frameworks (React, Vue, Angular)
- Runs server-side applications (Node.js)
- Creates mobile apps (React Native, Ionic)
- Builds desktop applications (Electron)
- Supports modern development paradigms like components, modules, and declarative programming

## JavaScript Basics

### What is JavaScript?

JavaScript is a dynamic, weakly-typed, prototype-based language with first-class functions. Initially created to add interactivity to web pages, it has grown into a versatile language for building applications across various platforms.

### Ways to Include JavaScript

1. Inline JavaScript:

```html
<button onclick="alert('Hello')">Click me</button>
```

2. Internal JavaScript (within `<script>` tags):

```html
<script>
  console.log("Hello, world!");
</script>
```

3. External JavaScript file:

```html
<script src="script.js"></script>
```

### JavaScript Syntax

#### Variables and Constants

```javascript
// Variables
let name = "John"; // Block-scoped, can be reassigned
var age = 30; // Function-scoped, older syntax
// Constants
const PI = 3.14159; // Block-scoped, cannot be reassigned
```

#### Operators

- Arithmetic: `+`, `-`, `*`, `/`, `%`, `**` (exponentiation)
- Assignment: `=`, `+=`, `-=`, `*=`, `/=`
- Comparison: `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
- Logical: `&&` (AND), `||` (OR), `!` (NOT)
- Ternary: `condition ? expr1 : expr2`
- Spread/Rest: `...`

#### Comments

```javascript
// Single-line comment

/* 
  Multi-line
  comment
*/
```

#### Control Flow

```javascript
// Conditionals
if (condition) {
  // code block
} else if (otherCondition) {
  // code block
} else {
  // code block
}

// Switch statement
switch (expression) {
  case value1:
    // code
    break;
  case value2:
    // code
    break;
  default:
  // code
}

// Loops
for (let i = 0; i < 5; i++) {
  // code block
}

let arr = [1, 2, 3];
for (let item of arr) {
  // iterates over values
}

let obj = { a: 1, b: 2 };
for (let key in obj) {
  // iterates over keys
}

while (condition) {
  // code block
}

do {
  // code block
} while (condition);
```

#### Functions

```javascript
// Function declaration
function add(a, b) {
  return a + b;
}

// Function expression
const subtract = function (a, b) {
  return a - b;
};

// Arrow function
const multiply = (a, b) => a * b;

// Default parameters
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

## Data Structures and Types

### Primitive Types

- **String**: Textual data

  ```javascript
  let name = "John";
  let message = `Hello, ${name}`; // Template literal
  ```

- **Number**: Integers and floating-point numbers

  ```javascript
  let age = 30;
  let price = 19.99;
  let infinity = Infinity;
  let notANumber = NaN;
  ```

- **Boolean**: true/false values

  ```javascript
  let isActive = true;
  let hasPermission = false;
  ```

- **Undefined**: Variable declared but not assigned

  ```javascript
  let something;
  console.log(something); // undefined
  ```

- **Null**: Intentional absence of any object value

  ```javascript
  let user = null;
  ```

- **Symbol**: Unique and immutable primitive

  ```javascript
  const uniqueKey = Symbol("description");
  ```

- **BigInt**: Integers with arbitrary precision
  ```javascript
  const bigNumber = 9007199254740991n;
  ```

### Reference Types

#### Objects

```javascript
// Object literal
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  greet() {
    return `Hello, I'm ${this.firstName}`;
  },
};

// Accessing properties
console.log(person.firstName); // Dot notation
console.log(person["lastName"]); // Bracket notation

// Adding new properties
person.email = "john@example.com";

// Object methods
const keys = Object.keys(person);
const values = Object.values(person);
const entries = Object.entries(person);
const merged = Object.assign({}, person, { city: "New York" });
const cloned = { ...person }; // Spread operator (shallow clone)
```

#### Arrays

```javascript
// Array creation
const fruits = ["Apple", "Banana", "Cherry"];
const mixed = [1, "two", { three: 3 }, [4]];

// Accessing elements
console.log(fruits[0]); // 'Apple'

// Common array methods
fruits.push("Date"); // Add to end
fruits.pop(); // Remove from end
fruits.unshift("Apricot"); // Add to beginning
fruits.shift(); // Remove from beginning
fruits.splice(1, 1, "Blueberry"); // Remove and insert
const citrus = fruits.slice(1, 3); // Create sub-array

// Iteration methods
fruits.forEach((fruit) => console.log(fruit));
const uppercased = fruits.map((fruit) => fruit.toUpperCase());
const longFruits = fruits.filter((fruit) => fruit.length > 5);
const allLong = fruits.every((fruit) => fruit.length > 3);
const total = [1, 2, 3].reduce((sum, num) => sum + num, 0);
```

#### Date

```javascript
const now = new Date();
const specificDate = new Date("2023-01-15T12:00:00");
console.log(now.toISOString());
console.log(now.toLocaleDateString());
```

#### Map and Set

```javascript
// Map - key-value pairs with any type of key
const userRoles = new Map();
userRoles.set("john", "admin");
userRoles.set("jane", "editor");
console.log(userRoles.get("john")); // 'admin'

// Set - collection of unique values
const uniqueNumbers = new Set([1, 2, 3, 3, 4, 4]);
console.log(uniqueNumbers.size); // 4
uniqueNumbers.add(5);
console.log(uniqueNumbers.has(3)); // true
```

### Type Conversion

```javascript
// Explicit conversion
String(123); // "123"
Number("123"); // 123
Boolean(1); // true

// Implicit conversion
"5" + 2; // "52" (string concatenation)
"5" - 2; // 3 (number subtraction)
```

## The JavaScript Event Loop

### How JavaScript Executes Code

JavaScript is single-threaded, meaning it can only execute one piece of code at a time. The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.

### Components of the Event Loop

- **Call Stack**: Where function calls are tracked
- **Callback Queue**: Where completed asynchronous operations wait to be processed
- **Microtask Queue**: Higher priority queue for promises
- **Event Loop**: Continuously checks if call stack is empty, then processes queues

### Example of Event Loop Flow

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise resolved");
});

console.log("End");

// Output:
// Start
// End
// Promise resolved
// Timeout callback
```

This execution order demonstrates key event loop concepts:

1. Synchronous code executes first ('Start' and 'End')
2. Microtasks (Promises) execute before macrotasks (setTimeout)
3. The event loop processes queues only when the call stack is empty

## Asynchronous JavaScript

### Callbacks

Traditional way to handle asynchronous operations:

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: "Product" };
    callback(null, data);
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data:", data);
  }
});
```

### Promises

Modern way to handle asynchronous operations:

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: "Product" };
      // For error scenario: reject(new Error('Failed to fetch'))
      resolve(data);
    }, 1000);
  });
}

fetchData()
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Error:", error))
  .finally(() => console.log("Operation completed"));

// Chaining promises
fetchData()
  .then((data) => {
    console.log("First operation:", data);
    return processData(data);
  })
  .then((result) => console.log("Second operation:", result))
  .catch((error) => console.error("Error in chain:", error));

// Promise combinators
Promise.all([fetchUsers(), fetchProducts()]) // All promises must succeed
  .then(([users, products]) => console.log(users, products));

Promise.race([fetchFast(), fetchSlow()]) // Returns first to complete
  .then((result) => console.log("First to complete:", result));

Promise.allSettled([p1, p2, p3]) // Waits for all to complete, success or fail
  .then((results) => console.log(results));

Promise.any([p1, p2, p3]) // Returns first successful promise
  .then((result) => console.log("First success:", result));
```

### Async/Await

Syntactic sugar over promises that allows writing asynchronous code in a more synchronous style:

```javascript
async function getData() {
  try {
    const data = await fetchData(); // Pause until promise resolves
    const processed = await processData(data);
    return processed;
  } catch (error) {
    console.error("Error in async function:", error);
    throw error; // Re-throw or handle appropriately
  }
}

// Using an async function
getData()
  .then((result) => console.log("Final result:", result))
  .catch((error) => console.error("Caught in caller:", error));

// Parallel operations with async/await
async function getMultipleData() {
  const [users, products] = await Promise.all([fetchUsers(), fetchProducts()]);
  return { users, products };
}
```

## DOM Manipulation

### What is the DOM?

The Document Object Model (DOM) is a programming interface for web documents. It represents the page as a tree of objects that can be manipulated with JavaScript.

### Selecting Elements

```javascript
// By ID
const header = document.getElementById("header");

// By CSS selector (returns first match)
const container = document.querySelector(".container");

// By CSS selector (returns all matches)
const paragraphs = document.querySelectorAll("p");

// By class name
const buttons = document.getElementsByClassName("btn");

// By tag name
const divs = document.getElementsByTagName("div");
```

### Modifying Elements

```javascript
// Changing content
element.textContent = "New text content";
element.innerHTML = "<span>HTML content</span>";

// Changing attributes
element.setAttribute("class", "new-class");
element.id = "new-id";
element.href = "https://example.com";

// Working with classes
element.classList.add("active");
element.classList.remove("disabled");
element.classList.toggle("visible");
element.classList.replace("old", "new");
const hasClass = element.classList.contains("active");

// Changing styles
element.style.color = "blue";
element.style.fontSize = "16px";
element.style.display = "flex";
```

### Creating and Removing Elements

```javascript
// Creating elements
const newDiv = document.createElement("div");
newDiv.textContent = "New element";
newDiv.classList.add("container");

// Adding elements to the DOM
parentElement.appendChild(newDiv);
parentElement.insertBefore(newDiv, referenceElement);
parentElement.insertAdjacentElement("beforeend", newDiv);

// Removing elements
element.remove();
parentElement.removeChild(childElement);
```

### Event Handling

```javascript
// Adding event listeners
element.addEventListener("click", function (event) {
  console.log("Element clicked!", event);
});

// With arrow function
element.addEventListener("mouseover", (event) => {
  console.log("Mouse over!");
});

// Removing event listeners
function handleClick(event) {
  console.log("Clicked");
}
element.addEventListener("click", handleClick);
element.removeEventListener("click", handleClick);

// Event delegation (handling events for multiple elements)
document.getElementById("list").addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log("List item clicked:", event.target.textContent);
  }
});

// Common events
// - Mouse: click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout
// - Keyboard: keydown, keyup, keypress
// - Form: submit, change, input, focus, blur
// - Document: DOMContentLoaded, load, resize, scroll
```

### Traversing the DOM

```javascript
// Parent
const parent = element.parentNode; // or parentElement

// Children
const children = element.children;
const firstChild = element.firstElementChild;
const lastChild = element.lastElementChild;

// Siblings
const next = element.nextElementSibling;
const previous = element.previousElementSibling;
```

## Working with Fetch API

### What is Fetch?

The Fetch API provides a modern interface for making HTTP requests in the browser. It returns Promises, making it easier to handle asynchronous operations.

### Basic Usage

```javascript
fetch("https://api.example.com/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse JSON response
  })
  .then((data) => console.log("Data:", data))
  .catch((error) => console.error("Fetch error:", error));
```

### Request Configuration

```javascript
fetch("https://api.example.com/users", {
  method: "POST", // GET, POST, PUT, DELETE, etc.
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log("User created:", data));
```

### Using with Async/Await

```javascript
async function fetchUsers() {
  try {
    const response = await fetch("https://api.example.com/users");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
```

### Working with Different Response Types

```javascript
// JSON response
fetch("api/data").then((res) => res.json());

// Text response
fetch("api/text").then((res) => res.text());

// Blob (binary data)
fetch("image.jpg")
  .then((res) => res.blob())
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("image").src = url;
  });

// FormData
fetch("api/form")
  .then((res) => res.formData())
  .then((formData) => {
    // Work with form data
  });
```

### Aborting Fetch Requests

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch("https://api.example.com/large-data", { signal })
  .then((response) => response.json())
  .then((data) => console.log("Data received"))
  .catch((error) => {
    if (error.name === "AbortError") {
      console.log("Fetch was aborted");
    } else {
      console.error("Fetch error:", error);
    }
  });

// Abort the fetch after 5 seconds
setTimeout(() => {
  controller.abort();
  console.log("Fetch aborted after timeout");
}, 5000);
```

## Modern JavaScript Features

### ES6+ Features

#### Destructuring

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age, country = "Unknown" } = person;

// Function parameter destructuring
function printUser({ name, age }) {
  console.log(`${name} is ${age} years old`);
}
```

#### Spread Operator

```javascript
// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Spread in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3, b: 3 }; // { a: 1, b: 3, c: 3 }
```

#### Template Literals

```javascript
const name = "John";
const greeting = `Hello, ${name}!`;

// Multi-line strings
const multiLine = `This is
a multi-line
string`;
```

#### Modules

```javascript
// Exporting
export const PI = 3.14159;
export function square(x) {
  return x * x;
}
export default class Calculator {
  /* ... */
}

// Importing
import Calculator, { PI, square } from "./math.js";
import * as math from "./math.js";
```

#### Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static createAnonymous() {
    return new Person("Anonymous", 0);
  }
}

// Inheritance
class Employee extends Person {
  constructor(name, age, position) {
    super(name, age);
    this.position = position;
  }

  work() {
    return `${this.name} is working as ${this.position}`;
  }
}
```

#### Optional Chaining

```javascript
// Instead of user && user.address && user.address.city
const city = user?.address?.city;

// With function calls
const result = object.method?.();
```

#### Nullish Coalescing

```javascript
// Only falls back to default if value is null or undefined
const value = input ?? "default";

// Different from logical OR which also treats '' and 0 as falsy
const orValue = input || "default";
```

## Node.js

### What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows JavaScript to be executed outside the browser, enabling server-side scripting and the creation of command-line tools.

### Key Concepts

#### Module System

```javascript
// CommonJS (traditional Node.js)
const fs = require("fs");
const { promisify } = require("util");
const myModule = require("./my-module");

module.exports = { function1, function2 };

// ES Modules (newer syntax, requires .mjs extension or "type": "module" in package.json)
import fs from "fs";
import { promisify } from "util";
import myModule from "./my-module.js";

export { function1, function2 };
```

#### Core Modules

- **fs**: File system operations
- **path**: Path manipulation
- **http/https**: Create HTTP servers and make requests
- **events**: Event-driven programming
- **stream**: Streaming data handling
- **util**: Utility functions
- **crypto**: Cryptographic functionality

#### NPM (Node Package Manager)

```bash
# Initialize a project
npm init

# Install packages
npm install express
npm install --save-dev jest

# Run scripts defined in package.json
npm run test
```

#### Example: Simple HTTP Server

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(3000, "localhost", () => {
  console.log("Server running at http://localhost:3000/");
});
```

#### Example: File System Operations

```javascript
const fs = require("fs");
const { promisify } = require("util");

// Callback-based
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log(data);
});

// Promise-based
const readFileAsync = promisify(fs.readFile);

async function readFileContent() {
  try {
    const data = await readFileAsync("file.txt", "utf8");
    console.log(data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

// Modern Promises API (Node.js 10+)
const { promises: fsPromises } = require("fs");

async function writeAndRead() {
  try {
    await fsPromises.writeFile("data.json", JSON.stringify({ key: "value" }));
    const content = await fsPromises.readFile("data.json", "utf8");
    console.log(JSON.parse(content));
  } catch (err) {
    console.error("File operation failed:", err);
  }
}
```

### Popular Node.js Frameworks and Libraries

- **Express**: Minimal web framework
- **Astro.js**: Modern static site builder and backend framework
- **Nest.js**: Progressive Node.js framework for building server-side applications
- **Koa**: Next-generation web framework by Express team
- **Fastify**: Fast and low overhead web framework
- **Mongoose**: MongoDB object modeling
- **Sequelize**: ORM for SQL databases
- **Socket.io**: Real-time bidirectional event-based communication
- **PM2**: Production process manager

### Node.js Best Practices

1. Use async/await for asynchronous operations
2. Implement proper error handling
3. Structure your application with modular design
4. Use environment variables for configuration
5. Implement logging for troubleshooting
6. Write tests for your code
7. Use security best practices (validate input, use HTTPS, etc.)
8. Optimize for performance when needed

## JavaScript Best Practices

1. Use strict mode: `'use strict';`
2. Prefer const over let, and let over var
3. Use meaningful variable and function names
4. Handle errors properly with try/catch
5. Avoid global variables
6. Use modern JavaScript features when appropriate
7. Write modular, reusable code
8. Follow a consistent code style
9. Comment your code when necessary
10. Test your code thoroughly

### Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for in-depth JavaScript documentation
- [JavaScript.info](https://javascript.info/) for modern JavaScript tutorials
- [Node.js Documentation](https://nodejs.org/en/docs/) for Node.js reference
- [V8 JavaScript Engine Blog](https://v8.dev/blog) for JavaScript performance insights
