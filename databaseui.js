
const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)

const tbody = document.getElementById('studentTableBody');

  async function loadStudents() {
    const { data, error } = await client
      .from('students')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ fetch error:', error.message);
      return;
    }

    // rows render: put id on <tr>, buttons inside last <td>
    tbody.innerHTML = data.map(st => `
      <tr data-id="${st.id}">
        <td>${st.roll_no}</td>
        <td><img src="${st.image ? 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/student-images/' + st.image : 'https://via.placeholder.com/40'}" alt="profile"></td>
        <td>${st.fullname}</td>
        <td>${st.phone}</td>
        <td>${st.cnic}</td>
        <td>${st.campus}</td>
        <td>${st.gender}</td>
        <td>${st.course}</td>
        <td>Pending</td>
        <td>
          <button type="button" class="btn btn-sm btn-info viewBtn"><i class="bi bi-eye"></i></button>
          <button type="button" class="btn btn-sm btn-warning editBtn"><i class="bi bi-pencil"></i></button>
          <button type="button" class="btn btn-sm btn-danger deleteBtn"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
  }

  // ✅ SINGLE delegated handler — works for dynamic rows
  tbody.addEventListener('click', async (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const id = tr.dataset.id;

    if (e.target.closest('.viewBtn')) {
      console.log('VIEW', id);
      const { data, error } = await client.from('students').select('*').eq('id', id).single();
      if (error) return alert('Error: ' + error.message);
      alert(`👤 ${data.fullname}\n📞 ${data.phone}\n📧 ${data.email}\n🎓 ${data.course}`);
    }

    if (e.target.closest('.editBtn')) {
      console.log('EDIT', id);
      const currentPhone = tr.children[3].textContent.trim();
      const newPhone = prompt('Enter new phone number:', currentPhone);
      if (!newPhone) return;
      const { error } = await client.from('students').update({ phone: newPhone }).eq('id', id);
      if (error) return alert('Update failed: ' + error.message);
      await loadStudents();
    }

    if (e.target.closest('.deleteBtn')) {
      console.log('DELETE', id);
      if (!confirm('Delete this student?')) return;
      const { error } = await client.from('students').delete().eq('id', id);
      if (error) return alert('Delete failed: ' + error.message);
      tr.remove(); // instant UI update
    }
  });

  // initial data
  loadStudents();
//==================================================================== 

// Edit button handler (inside tbody event listener)
document.getElementById("studentTableBody").addEventListener("click", async (e) => {
  if (e.target.closest('.editBtn')) {
    const id = e.target.closest('.editBtn').dataset.id;

    let { data, error } = await client
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return alert('Error fetching student: ' + error.message);
    }

    console.log("Student fetched:", data);
    // ab yahan modal open karke saari fields editable bana sakte ho
  }
});


// Save changes on form submit
document.getElementById('editStudentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('edit_id').value;

  const updatedData = {
    fullname: document.getElementById('edit_fullname').value,
    roll_no: document.getElementById('edit_roll_no').value,
    phone: document.getElementById('edit_phone').value,
    cnic: document.getElementById('edit_cnic').value,
    email: document.getElementById('edit_email').value,
    campus: document.getElementById('edit_campus').value,
    gender: document.getElementById('edit_gender').value,
    course: document.getElementById('edit_course').value,
  };

  const { error } = await client.from('students').update(updatedData).eq('id', id);
  if (error) {
    alert('Update failed: ' + error.message);
    return;
  }

  // Close modal & reload table
  bootstrap.Modal.getInstance(document.getElementById('editStudentModal')).hide();
  loadStudents();
});

document.getElementById("studentTableBody").addEventListener("click", async (e) => {
  if (e.target.closest(".editBtn")) {
    const id = e.target.closest(".editBtn").dataset.id;
    let { data, error } = await db.from("students").select("*").eq("id", id).single();
    console.log(data);
  }
});
//================== approved and pending ======================

async function loadStudents() {
  let { data, error } = await client.from('students').select('*');
  if (error) {
    console.error('Error fetching students:', error);
    return;
  }

  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = '';

  let total = data.length;
  let active = data.filter(s => s.status === 'Approved').length;
  let pending = data.filter(s => s.status === 'Pending').length;

  document.getElementById('totalStudents').innerText = total;
  document.getElementById('activeStudents').innerText = active;
  document.getElementById('pendingStudents').innerText = pending;

  data.forEach(student => {
    tbody.innerHTML += `
      <tr>
        <td>${student.roll_no}</td>
        <td><img src="${student.image || 'https://via.placeholder.com/40'}" alt="profile"></td>
        <td>${student.fullname}</td>
        <td>${student.phone}</td>
        <td>${student.cnic}</td>
        <td>${student.campus}</td>
        <td>${student.gender}</td>
        <td>${student.course}</td>
        <td>
          <select class="form-select form-select-sm statusDropdown" data-id="${student.id}">
            <option value="Pending" ${student.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Approved" ${student.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Rejected" ${student.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm btn-info viewBtn" data-id="${student.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning editBtn" data-id="${student.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger deleteBtn" data-id="${student.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// Event Listener for Dropdown
document.getElementById("studentTableBody").addEventListener("change", async (e) => {
  if (e.target.classList.contains("statusDropdown")) {
    const id = e.target.dataset.id;
    const newStatus = e.target.value;

    let { error } = await client
      .from("students")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Error updating status: " + error.message);
      return;
    }

    alert("Status updated to " + newStatus);
    loadStudents(); // refresh table
  }
});

// approved and pending END

//=============delete student from supabase table using ID and Roll number ====

async function deleteStudent(id) {
  const { error } = await client
    .from("students")
    .delete()
    .eq("id", id);   // "id" aapke Supabase table ka primary key column

  if (error) {
    console.error("Delete failed:", error.message);
    alert("Delete failed: " + error.message);
  } else {
    alert("Student deleted successfully!");
    loadStudents(); // dubara data reload karne ke liye
  }
}


async function deleteStudent(roll_no) {
  const { error } = await client
    .from("students")
    .delete()
    .eq("roll_no", roll_no);

  if (error) {
    console.error("Delete failed:", error.message);
  } else {
    alert("Deleted successfully!");
  }
}

//=============delete student from supabase table using ID and Roll number ====

document.addEventListener("click", async (e) => {
  if (e.target.closest(".deleteBtn")) {
    const btn = e.target.closest(".deleteBtn");
    const rowId = btn.getAttribute("data-id");

    if (!rowId) {
      alert("Row ID not found!");
      return;
    }

    if (confirm("Are you sure you want to delete this row?")) {
      const { error } = await client
        .from("students")
        .delete()
        .eq("id", rowId);

      if (error) {
        console.error("Delete failed:", error.message);
        alert("Delete failed: " + error.message);
      } else {
        alert(`Row with ID ${rowId} deleted successfully ✅`);
        btn.closest("tr").remove();
      }
    }
  }
});
//============= display image in UI ===================== 
students.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.fullname}</td>
        <td>${student.gender}</td>
        <td>${student.phone}</td>
        <td>${student.cnic}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
        <td>${student.campus}</td>
        <td>
            ${student.image 
                ? `<img src="${student.image}" alt="Profile" width="50" height="50" style="border-radius:50%;">`
                : "No Image"}
        </td>
        <td>
            <button class="btn btn-sm btn-info viewBtn" data-id="${student.id}">
                <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-warning editBtn" data-id="${student.id}">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger deleteBtn" data-id="${student.id}">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    tableBody.appendChild(row);
});



//=============== display image in UI start


// document.addEventListener("DOMContentLoaded", async () => {
//   const adminCampus = localStorage.getItem("adminCampus"); 
//   console.log("Logged in as:", adminCampus);

//   let query = supabase.from("students").select("*");

//   // agar main admin hai to pura data dikhaye
//   if (adminCampus && adminCampus !== "main") {
//     query = query.eq("campus", adminCampus);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching data:", error.message);
//     return;
//   }

//   renderTable(data);
// });

// function renderTable(students) {
//   const tbody = document.getElementById("studentTableBody");
//   tbody.innerHTML = "";

//   students.forEach(student => {
//     const row = `
//       <tr>
//         <td>${student.rollno}</td>
//         <td>${student.fullname}</td>
//         <td>${student.gender}</td>
//         <td>${student.phone}</td>
//         <td>${student.campus}</td>
//         <td>
//           <button class="btn btn-sm btn-danger deleteBtn" data-id="${student.id}">Delete</button>
//         </td>
//       </tr>
//     `;
//     tbody.innerHTML += row;
//   });
// }


document.addEventListener("DOMContentLoaded", async () => {
  const adminCampus = localStorage.getItem("adminCampus");
  console.log("Logged in as:", adminCampus);  // check karne ke liye

  let query = client.from("students").select("*");

  // Sirf "main" admin ko sab data dikhana hai
  if (adminCampus && adminCampus.toLowerCase() !== "main") {
    query = query.eq("campus", adminCampus); 
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }

  console.log("Data loaded:", data); // console me check karo filter ho raha hai ya nahi
  renderTable(data);
});

query = query.eq("campus", adminCampus);


//=============== display image in UI END
