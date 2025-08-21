
const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)

const form = document.getElementById("studentForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value;
    const cnic = document.getElementById("cnic").value;
    const email = document.getElementById("email").value;
    const course = document.getElementById("course").value;
    const campus = document.getElementById("campus").value;
    const image = document.getElementById("image").value;
    // const roll_no = document.getElementById("roll_no").value;
 

    const { data, error } = await client
        .from("students")
        .insert([{
            fullname, gender, phone, cnic, email, course, campus, image
        }]);

    if (error) {
        console.error("Error inserting data:", error.message);
        alert("Data save failed!");
    } else {
        console.log("Data inserted:", data);
        alert("Data saved successfully!");
        form.reset();
    }
    window.location.href = 'https://haider-zaidi72.github.io/New-Student-From/index.html'
});

