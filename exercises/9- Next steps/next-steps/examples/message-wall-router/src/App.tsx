import "./App.css";
import { Link, Outlet } from "@tanstack/react-router";

export function App() {
  return (
    <>
      <h1>Hello World</h1>
      <Outlet />
      <footer>
        <Link to="/">Home</Link>
        <Link to="/user/hola">User Profile</Link>
      </footer>
    </>
  );
}
