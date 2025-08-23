
const supabaseUrl = 'https://ungcexrijowskntosbid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZ2NleHJpam93c2tudG9zYmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTczNzIsImV4cCI6MjA3MTA5MzM3Mn0.EUMfWaa8fZBvYgY89KhNo7PXSr5AAyext99pmSoAeag'
const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client)


const statsCards = [
  {
    title: "Total Students",
    id: "totalStudents",
    count: 0,
    note: "↑ 0% from last month",
    color: "bg-primary"
  },
  {
    title: "Active Students",
    id: "activeStudents",
    count: 0,
    note: "↑ 0% of total",
    color: "bg-success"
  },
  {
    title: "Pending Approval",
    id: "pendingStudents",
    count: 0,
    note: "Needs attention",
    color: "bg-warning"
  },
  {
    title: "Reject",
    id: "rejectStudents",
    count: 0,
    note: "Needs attention",
    color: "bg-warning"
  }
  
];


 const container = document.getElementById("statsContainer");

  statsCards.forEach(card => {
    container.innerHTML += `
      <div class="card text-white ${card.color}">
        <div class="card-body">
          <h5>${card.title}</h5>
          <h3 id="${card.id}">${card.count}</h3>
          <small>${card.note}</small>
        </div>
      </div>
    `;
  });

const tbody = document.getElementById('studentTableBody');

  

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
    let { data, error } = await client.from("students").select("*").eq("id", id).single();
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
  let active = data.filter(s => s.status === 'approve').length;
  let pending = data.filter(s => s.status === 'pending').length;
  let rejected = data.filter(s => s.status === 'rejected').length;

  document.getElementById('totalStudents').innerText = total;
  document.getElementById('activeStudents').innerText = active;
  document.getElementById('pendingStudents').innerText = pending;
   document.getElementById('rejectStudents').innerText = rejected;

  

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
        <td>${student.status}</td>
        <td>
          <select class="form-select form-select-sm statusDropdown" data-id="${student.id}">
          <option value="action" ${student.status === 'action' ? 'selected' : ''}>action</option>
            <option value="pending" ${student.status === 'pending' ? 'selected' : ''}>pending</option>
            <option value="approve" ${student.status === 'approve' ? 'selected' : ''}>approve</option>
            <option value="rejected" ${student.status === 'rejected' ? 'selected' : ''}>rejected</option>
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

document.addEventListener("DOMContentLoaded", async () => {
  const adminCampus = localStorage.getItem("adminCampus");
  console.log("Logged in as:", adminCampus);

  let query = client.from("students").select("*");

  if (adminCampus && adminCampus.toLowerCase() !== "main") {
    query = query.eq("campus", adminCampus); 
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }

  console.log("Data loaded:", data);
  loadStudents();   // ✅ renderTable hata diya
});

