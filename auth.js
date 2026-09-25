/* ==========================================================================
   PLANWISE AUTHENTICATION ENGINE
   Supports: Real/Simulated Google OAuth, Ban Status Verification, Admin Logic
   ========================================================================== */

const PlanWiseAuth = {
  // Current active user state
  currentUser: JSON.parse(localStorage.getItem('pw_user')) || null,

  // Check if current user is banned
  isBanned() {
    const bannedUsers = JSON.parse(localStorage.getItem('pw_banned_list')) || [];
    if (this.currentUser && bannedUsers.includes(this.currentUser.email)) {
      return true;
    }
    return false;
  },

  // Google Sign-In Trigger
  async loginWithGoogle() {
    try {
      // Direct simulation / integration layer for Google Auth
      const mockGoogleUser = {
        uid: "g_" + Math.random().toString(36).substr(2, 9),
        displayName: "Student Explorer",
        email: "student." + Math.floor(Math.random() * 8999 + 1000) + "@gmail.com",
        photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=" + Math.random(),
        role: "student",
        joinedAt: new Date().toLocaleDateString()
      };

      // Set session
      this.currentUser = mockGoogleUser;
      localStorage.setItem('pw_user', JSON.stringify(mockGoogleUser));

      // Register into global user database for Operator/Admin monitoring
      let allUsers = JSON.parse(localStorage.getItem('pw_all_users')) || [];
      if (!allUsers.find(u => u.email === mockGoogleUser.email)) {
        allUsers.push({ ...mockGoogleUser, status: 'Active', reports: 0 });
        localStorage.setItem('pw_all_users', JSON.stringify(allUsers));
      }

      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Authentication Failed: " + err.message);
    }
  },

  // Admin / Maker Login Check
  loginAsAdmin(passcode) {
    if (passcode === "admin123" || passcode === "maker2026") {
      const adminUser = {
        uid: "admin_master",
        displayName: "Platform Maker (Operator)",
        email: "operator@planwise.io",
        role: "admin",
        photoURL: "https://api.dicebear.com/7.x/identicon/svg?seed=admin"
      };
      this.currentUser = adminUser;
      localStorage.setItem('pw_user', JSON.stringify(adminUser));
      window.location.href = "admin.html";
    } else {
      alert("Incorrect Operator Passcode!");
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('pw_user');
    window.location.href = "login.html";
  },

  // Page Guard Protect
  checkGuard() {
    if (this.isBanned()) {
      document.body.innerHTML = `
        <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: #000; color: #ff4757; font-family: sans-serif;">
          <h1 style="font-size: 3rem; margin-bottom: 20px;">🚫 ACCOUNT SUSPENDED</h1>
          <p style="font-size: 1.2rem; color: #aaa; max-width: 500px;">Your account has been restricted by the platform operator due to unethical content or policy violations.</p>
          <button onclick="PlanWiseAuth.logout()" style="margin-top: 30px; padding: 12px 24px; background: #ff4757; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Return to Login</button>
        </div>
      `;
      return false;
    }
    return true;
  }
};

// Automatic execution on page load
document.addEventListener('DOMContentLoaded', () => {
  PlanWiseAuth.checkGuard();
});
