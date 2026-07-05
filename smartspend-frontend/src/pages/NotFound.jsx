import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-base-950 text-center">
    <p className="text-6xl font-bold text-accent-500">404</p>
    <p className="mt-3 text-ink-300">This page doesn't exist.</p>
    <Link to="/" className="mt-6"><Button>Back to home</Button></Link>
  </div>
);

export default NotFound;
