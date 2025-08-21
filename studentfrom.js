
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
});

    
// =================== Form Submit Handler ===================
studentForm.addEventListener("submit", async function(e) {
  e.preventDefault(); // reload prevent

  const formData = new FormData(studentForm);
  const student = Object.fromEntries(formData.entries());

  // Roll number generate
  student.roll_no = await generateRollNo(student.campus);

  // Image name store (optional)
  if (formData.get("image") && formData.get("image").name) {
    student.image = formData.get("image").name;
  } else {
    student.image = "";
  }

    window.location.href = 'https://haider-zaidi72.github.io/New-Student-From/index.html'
});

//================= generate roll number according to campus ============ 
function getCampusPrefix(campus) {
  switch (campus) {
    case "Gulshan": return "G";
    case "Korangi": return "K";
    case "Nazimabad": return "N";
    case "Defence": return "D";
    default: return "X";
  }
}


document.addEventListener("DOMContentLoaded", () => {
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

        const prefix = getCampusPrefix(campus);

        // Last Roll No fetch
        const { data: lastRolls, error: fetchError } = await client
            .from("students")
            .select("roll_no")
            .ilike("roll_no", `${prefix}-%`)
            .order("id", { ascending: false })
            .limit(1);

        let newNumber = 1;
        if (lastRolls && lastRolls.length > 0) {
            const lastRoll = lastRolls[0].roll_no;
            const lastNum = parseInt(lastRoll.split("-")[1]);
            newNumber = lastNum + 1;
        }

        const roll_no = `${prefix}-${String(newNumber).padStart(4, "0")}`;

        const { data, error } = await client
            .from("students")
            .insert([{
                roll_no, fullname, gender, phone, cnic, email, course, campus, image
            }]);

        if (error) {
            console.error("Error inserting data:", error.message);
            alert("Data save failed!");
        } else {
            console.log("Data inserted:", data);
            alert("Data saved successfully!");
            form.reset();
            window.location = "index.html";
        }
    });

    function getCampusPrefix(campus) {
        switch (campus) {
            case "Gulshan": return "G";
            case "Korangi": return "K";
            case "Nazimabad": return "N";
            case "Defence": return "D";
            default: return "X";
        }
    }
});

//======== upload image in supabase =============

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
    const imageFile = document.getElementById("image").files[0];

    let imageUrl = null;

    // ✅ Upload Image to Supabase Storage
    if (imageFile) {
        const { data: storageData, error: storageError } = await client.storage
            .from("student-images") // ⚠️ bucket name replace karein
            .upload(`students/${Date.now()}_${imageFile.name}`, imageFile);

        if (storageError) {
            console.error("Image upload failed:", storageError.message);
            alert("Image upload failed!");
            return;
        } else {
            const { data: publicUrl } = client.storage
                .from("student-images")
                .getPublicUrl(storageData.path);

            imageUrl = publicUrl.publicUrl;
        }
    }

    // ✅ Insert Student with image URL
    const { data, error } = await client
        .from("students")
        .insert([{
            fullname, gender, phone, cnic, email, course, campus, image: imageUrl
        }]);

    if (error) {
        console.error("Error inserting data:", error.message);
        alert("Data save failed!");
    } else {
        alert("Data saved successfully!");
        form.reset();
        window.location = 'index.html';
    }
});


//=========== upload image in supabase END ================================