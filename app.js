
const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)

// Modal Elements
// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const signupModal = document.getElementById("signupModal");
  const openSignup = document.getElementById("openSignup");
  const closeModal = document.getElementById("closeModal");
  const signupForm = document.getElementById("signupForm");

  // Open modal
  if (openSignup) {
    openSignup.onclick = () => {
      signupModal.style.display = "block";
    };
  }

  // Close modal
  if (closeModal) {
    closeModal.onclick = () => {
      signupModal.style.display = "none";
    };
  }

  // Close if outside clicked
  window.onclick = (event) => {
    if (event.target === signupModal) {
      signupModal.style.display = "none";
    }
  };

  // Signup form submit
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      const { data, error } = await client.auth.signUp({ email, password });

      if (error) {
        alert("Signup failed: " + error.message);
      } else {
        alert("Signup successful! Please verify your email.");
        signupModal.style.display = "none";
      }
    });
  }
});
//===========================================

 function loginAs(role) {
    localStorage.setItem("adminRole", role); // role save ho jayega
    window.location.href = "databaseui.html"; // redirect ho jaye
}