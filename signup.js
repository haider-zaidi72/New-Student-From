const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)

// Handle signup
// signup.js

// Signup form ko select karo
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        // jab user verification email pe click karega, ye URL open hoga
        emailRedirectTo: "http://127.0.0.1:3000/login.html"
      }
    });

    if (error) {
      console.error("Signup Error:", error.message);
      alert("Signup failed: " + error.message);
    } else {
      console.log("Signup Success:", data);
      alert("Signup successful! Please check your email inbox and verify your account.");
      signupForm.reset();
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
    alert("Something went wrong, please try again.");
  }
});
