import { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import logo from '../CCDLOGO-clean.png';

function App() {
  useEffect(() => {
    import('../js/app.js').catch((error) => {
      console.error('Failed to load legacy app script:', error);
    });
  }, []);

  return (
    <>
      <section id="login" className="login-shell">
        <div className="login-card">
          <div className="brand">
            <div className="logo" aria-hidden="true">
              <img src={logo} alt="" />
            </div>
            <div>
              <h1>City College of Davao Library</h1>
              <p className="brand-tagline">Committed to Excellence</p>
            </div>
          </div>
          <div className="login-panel">
            <h2>Sign in to your account</h2>
            <p className="subtle">Access circulation, inventory, reports, and library services.</p>
            <div id="loginError" className="error">Invalid email or password. Please try again.</div>
            <form id="loginForm">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" defaultValue="admin@library.edu" autoComplete="username" />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" defaultValue="admin123" autoComplete="current-password" />
              </div>
              <button className="primary" type="submit">
                Sign In
              </button>
            </form>
            <form id="signupForm" className="signup-form" hidden>
              <div className="field">
                <label htmlFor="signupName">Full Name</label>
                <input id="signupName" name="name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="signupEmail">Email</label>
                <input id="signupEmail" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="signupPassword">Password</label>
                <input id="signupPassword" name="password" type="password" autoComplete="new-password" minLength={6} required />
              </div>
              <button className="primary" type="submit">
                Request Account
              </button>
            </form>
            <button id="toggleSignup" className="link-btn" type="button">
              Don't have an account? Sign up
            </button>
            <div className="demo">
              <div className="demo-title">DEMO ACCOUNTS</div>
              <div className="demo-grid">
                <button className="demo-btn admin" data-login="admin@library.edu|admin123" type="button">
                  <span>Admin Account</span>
                  <span>Full Access</span>
                </button>
                <button className="demo-btn librarian" data-login="librarian@library.edu|lib123" type="button">
                  <span>Librarian Account</span>
                  <span>Standard</span>
                </button>
              </div>
              <p className="subtle" style={{ marginTop: 12, fontSize: 13 }}>
                Click a demo account button to sign in immediately and explore the app.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="app" className="app">
        <aside className="sidebar">
          <div className="side-head">
            <div className="mini-logo" aria-hidden="true">
              <img src={logo} alt="" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, lineHeight: 1.15 }}>City College of Davao Library</h2>
              <p className="subtle" style={{ fontSize: 12, color: '#94a3b8' }}>
                Management System
              </p>
            </div>
          </div>
          <nav id="nav" className="nav"></nav>
          <div className="side-user">
            <div className="user-row">
              <div id="avatar" className="avatar">
                A
              </div>
              <div style={{ minWidth: 0 }}>
                <div id="userName" style={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Admin User
                </div>
                <span id="roleBadge" className="badge red">
                  Admin
                </span>
              </div>
              <button id="logoutBtn" className="logout" type="button" title="Logout" aria-label="Logout" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>
        <main id="main"></main>
      </section>

      <div id="bookModal" className="modal"></div>
      <div id="viewModal" className="modal"></div>
      <div id="systemModal" className="modal"></div>
    </>
  );
}

export default App;
