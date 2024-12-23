import { magic } from "./magic";
import { useEffect, useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      await magic.auth.loginWithEmailOTP({ email });
      setEmail("");
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

  const handleToggleMfa = async () => {
    try {
      if (user.isMfaEnabled) {
        await magic.user.disableMFA({ showUI: true});
      } else{
        await magic.user.enableMFA({ showUI: true});
      }
      getUserMetadata();
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
        <div className="button-container">
          <button onClick={handleToggleMfa}>{ user.isMfaEnabled ? "Disable MFA" : "Enable MFA" }</button>
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
        <h3>Email OTP + MFA + No New Device Registration</h3>
        <h4>
          User submits email, receives emailed
          6 digit OTP, submits it and logs in.
          OTP prevents phishing attacks via magic link.
        </h4>
        <h4>
          User can enable MFA after logging in.
          Subsequent logins will require MFA.
        </h4>
      </div>
    </main>
  );
}