
// ===============================
// LOGIN SYSTEM
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let username =
            document.getElementById("username").value;

        let password =
            document.getElementById("password").value;

        if (
            username === "admin" &&
            password === "123456"
        ) {

            localStorage.setItem("loggedIn", "true");

            window.location.href = "dashboard.html";

        } else {

            document.getElementById("error").innerText =
                "Wrong username or password";
        }
    });
}


// ===============================
// LOGOUT
// ===============================

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";
}

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        document.getElementById("error").innerText = error.message;
    } else {
        window.location.href = "dashboard.html";
    }
}


// ===============================
// MEMBERS MODULE
// ===============================

let members =
    JSON.parse(localStorage.getItem("members")) || [];

let sermons =
    JSON.parse(localStorage.getItem("sermons")) || [];

let gallery =
    JSON.parse(localStorage.getItem("gallery")) || [];

let announcements =
    JSON.parse(localStorage.getItem("announcements")) || [];

async function addMember() {

    const name = document.getElementById("memberName").value;
    const phone = document.getElementById("memberPhone").value;
    const email = document.getElementById("memberEmail").value;

    const { data, error } = await supabaseClient
        .from("members")
        .insert([
            { name, phone, email }
        ]);

    if (error) {
        alert(error.message);
    } else {
        alert("Member added successfully");
        loadMembers();
    }
}

function saveMembers() {
    localStorage.setItem("members", JSON.stringify(members));
}

function exportMembersCSV() {
    if (members.length === 0) {
        alert("No members to export");
        return;
    }

    let csv = "Name,Phone,Email\n";

    members.forEach(m => {
        csv += `${m.name},${m.phone},${m.email}\n`;
    });

    downloadCSV(csv, "members.csv");
}

function downloadCSV(csv, filename) {
    let blob = new Blob([csv], {
        type: "text/csv"
    });

    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}

async function loadMembers() {

    let { data, error } =
        await supabaseClient
            .from("members")
            .select("*");

    if (error) {
        console.log(error);
        return;
    }

    members = data;

    displayMembers();
}

function displayMembers() {

    let list = document.getElementById("memberList");

    if (!list) return;

    list.innerHTML = "";

    members.forEach((member, index) => {

        list.innerHTML += `
        <tr>
            <td>${member.name}</td>
            <td>${member.phone}</td>
            <td>${member.email}</td>
            <td>
                <button onclick="editMember(${index})">Edit</button>
                <button onclick="deleteMember(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function deleteMember(index) {

    members.splice(index, 1);

    saveMembers();
    displayMembers();
    updateDashboard();
}

function editMember(index) {

    let member = members[index];

    let newName = prompt("Edit Name", member.name);
    let newPhone = prompt("Edit Phone", member.phone);
    let newEmail = prompt("Edit Email", member.email);

    if (newName && newPhone && newEmail) {

        members[index] = {
            name: newName,
            phone: newPhone,
            email: newEmail
        };

        saveMembers();
        displayMembers();
    }
}

function searchMember() {

    let filter =
        document.getElementById("searchMember").value.toLowerCase();

    let rows =
        document.querySelectorAll("#memberList tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(filter)
                ? ""
                : "none";
    });
}


// ===============================
// EVENTS MODULE
// ===============================

let events =
    JSON.parse(localStorage.getItem("events")) || [];

async function addEvent() {

    let name = document.getElementById("eventName").value;
    let date = document.getElementById("eventDate").value;
    let time = document.getElementById("eventTime").value;
    let desc = document.getElementById("eventDesc").value;

    if (!name || !date || !time) {
        alert("Fill required fields");
        return;
    }

    const { error } = await supabaseClient
        .from("events")
        .insert([
            {
                name,
                date,
                time,
                description: desc
            }
        ]);

    if (error) {
        alert(error.message);
    } else {
        loadEvents();
    }
}

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
}

async function loadEvents() {

    let { data, error } = await supabaseClient
        .from("events")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    let list = document.getElementById("eventList");

    if (!list) return;

    list.innerHTML = "";

    data.forEach(event => {

        list.innerHTML += `
        <tr>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.description}</td>
            <td>
                <button onclick="deleteEvent('${event.id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

function displayEvents() {

    let list = document.getElementById("eventList");

    if (!list) return;

    list.innerHTML = "";

    events.forEach((event, index) => {

        list.innerHTML += `
        <tr>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.desc}</td>
            <td>
                <button onclick="deleteEvent(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function deleteEvent(index) {

    events.splice(index, 1);

    saveEvents();
    displayEvents();
    updateDashboard();
}


// ===============================
// DASHBOARD COUNTERS
// ===============================

async function updateDashboard() {

    let { data: members } = await supabaseClient
        .from("members")
        .select("*");

    let { data: events } = await supabaseClient
        .from("events")
        .select("*");

    let memberCount = document.getElementById("memberCount");
    let eventCount = document.getElementById("eventCount");

    if (memberCount) {
        memberCount.innerText = members.length;
    }

    if (eventCount) {
        eventCount.innerText = events.length;
    }
}


// ===============================
// PAGE LOAD
// ===============================

window.onload = function () {

    loadMembers();
    loadEvents();
    updateDashboard();
};
function addSermon() {

    let title =
        document.getElementById("sermonTitle").value;

    let preacher =
        document.getElementById("preacher").value;

    let verse =
        document.getElementById("bibleVerse").value;

    let link =
        document.getElementById("sermonLink").value;

    if (!title || !preacher) {
        alert("Fill required fields");
        return;
    }

    sermons.push({
        title,
        preacher,
        verse,
        link
    });

    saveSermons();
    displaySermons();

    document.getElementById("sermonTitle").value = "";
    document.getElementById("preacher").value = "";
    document.getElementById("bibleVerse").value = "";
    document.getElementById("sermonLink").value = "";
}
function saveSermons() {
    localStorage.setItem("sermons", JSON.stringify(sermons));
}
function displaySermons() {

    let list = document.getElementById("sermonList");

    if (!list) return;

    list.innerHTML = "";

    sermons.forEach((sermon, index) => {

        list.innerHTML += `
        <tr>
            <td>${sermon.title}</td>
            <td>${sermon.preacher}</td>
            <td>${sermon.verse}</td>
            <td>
                <a href="${sermon.link}" target="_blank">
                    Open
                </a>
            </td>
            <td>
                <button onclick="deleteSermon(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}
function deleteSermon(index) {

    sermons.splice(index, 1);

    saveSermons();
    displaySermons();
}
window.onload = function () {

    displayMembers();
    displayEvents();
    displaySermons();
    updateDashboard();
};
let sermonCount = document.getElementById("sermonCount");

if (sermonCount) {
    sermonCount.innerText = sermons.length;
}
function addImage() {

    let input =
        document.getElementById("imageInput");

    let file = input.files[0];

    if (!file) {
        alert("Select an image");
        return;
    }

    let reader = new FileReader();

    reader.onload = function (e) {

        gallery.push(e.target.result);

        saveGallery();
        displayGallery();
    };

    reader.readAsDataURL(file);
} function saveGallery() {
    localStorage.setItem("gallery", JSON.stringify(gallery));
}
function displayGallery() {

    let grid = document.getElementById("galleryGrid");

    if (!grid) return;

    grid.innerHTML = "";

    gallery.forEach((img, index) => {

        grid.innerHTML += `
        <div class="image-box">
            <img src="${img}">
            <button onclick="deleteImage(${index})">X</button>
        </div>
        `;
    });
}
function deleteImage(index) {

    gallery.splice(index, 1);

    saveGallery();
    displayGallery();
}
window.onload = function () {

    displayMembers();
    displayEvents();
    displaySermons();
    displayGallery();
    updateDashboard();
};
function addAnnouncement() {

    let title =
        document.getElementById("announcementTitle").value;

    let message =
        document.getElementById("announcementMessage").value;

    if (!title || !message) {
        alert("Fill all fields");
        return;
    }

    announcements.push({
        title,
        message
    });

    saveAnnouncements();
    displayAnnouncements();

    document.getElementById("announcementTitle").value = "";
    document.getElementById("announcementMessage").value = "";
}
function saveAnnouncements() {
    localStorage.setItem("announcements", JSON.stringify(announcements));
}
function displayAnnouncements() {

    let list = document.getElementById("announcementList");

    if (!list) return;

    list.innerHTML = "";

    announcements.forEach((ann, index) => {

        list.innerHTML += `
        <tr>
            <td>${ann.title}</td>
            <td>${ann.message}</td>
            <td>
                <button onclick="deleteAnnouncement(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}
function deleteAnnouncement(index) {

    announcements.splice(index, 1);

    saveAnnouncements();
    displayAnnouncements();
}
let annCount = document.getElementById("announcementCount");

if (annCount) {
    annCount.innerText = announcements.length;
}
window.onload = function () {

    displayMembers();
    displayEvents();
    displaySermons();
    displayGallery();
    displayAnnouncements();

    updateDashboard();
};
function exportEventsCSV() {

    if (events.length === 0) {
        alert("No events to export");
        return;
    }

    let csv =
        "Event Name,Date,Time,Description\n";

    events.forEach(e => {
        csv +=
            `${e.name},${e.date},${e.time},${e.desc}\n`;
    });

    downloadCSV(csv, "events.csv");
}
function loadCharts() {

    let memberCtx =
        document.getElementById("membersChart");

    let eventCtx =
        document.getElementById("eventsChart");

    if (!memberCtx || !eventCtx) return;

    // MEMBERS CHART
    new Chart(memberCtx, {
        type: "bar",
        data: {
            labels: ["Members"],
            datasets: [{
                label: "Total Members",
                data: [members.length],
                backgroundColor: "#3b82f6"
            }]
        }
    });

    // EVENTS CHART
    new Chart(eventCtx, {
        type: "pie",
        data: {
            labels: ["Events"],
            datasets: [{
                label: "Events",
                data: [events.length],
                backgroundColor: ["#10b981"]
            }]
        }
    });
}
window.onload = function () {

    displayMembers();
    displayEvents();
    displaySermons();
    displayGallery();
    displayAnnouncements();

    updateDashboard();
    loadCharts();
};