import { useEffect } from "react";
import "./ComingSoon.css";
import { Link } from "react-router-dom";

function ComingSoon() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <h1 className="coming-soon-title">Coming Soon...</h1>
        <p className="coming-soon-description">
          We're working hard to bring you something amazing. Stay tuned for
          updates!
        </p>
        <Link to="/" className="home-link">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default ComingSoon;
