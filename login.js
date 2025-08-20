const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)

// ---- Login handler ----
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Sign in with email/password
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    // Optional: store basic info (supabase manages session automatically)
    localStorage.setItem("student_email", email);

    alert("Login successful!");
    window.location.href = "studentform.html"; // next step page
  });
});
