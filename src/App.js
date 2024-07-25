import { magic } from "./magic";
import { useEffect, useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      await magic.auth.loginWithEmailOTP({ email });
      getUserMetadata();
    } catch (err) {
      console.log(err);
    }
  };

  const getUserMetadata = async () => {
    try {
      const data = await magic.user.getInfo();
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      magic.user.logout();
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserMetadata();
  }, []);

  return (
    <main>
      <h1>{user ? user.email : "Not logged in"}</h1>
      {user ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      <div className="description">
        <h3>Email OTP + No New Device Registration</h3>
        <h4>
          User submits email, then receives emailed
          6 digit OTP. User gets it from email inbox and returns to submit OTP. 
          This protects users from phishing.
        </h4>
      </div>
    </main>
  );
}