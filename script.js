let students =
JSON.parse(
localStorage.getItem("students")
) || [];

const statuses = [
    {
        text:"Present",
        icon:"✅",
        color:"#16a34a"
    },
    {
        text:"Absent",
        icon:"❌",
        color:"#dc2626"
    },
    {
        text:"Late",
        icon:"⏰",
        color:"#f59e0b"
    },
    {
        text:"Excused",
        icon:"📝",
        color:"#0284c7"
    },
    {
        text:"Cutting",
        icon:"🚶",
        color:"#7c3aed"
    }
];
function saveStudents(){

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}
function saveAttendance(){

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

}
function loadStudentList(){

    const names =
    document.getElementById("studentInput")
    .value
    .split("\n")
    .map(name=>name.trim())
    .filter(name=>name !== "");

    students = [...new Set(names)];

    saveStudents();

    renderStudents();

}
function addStudent(){

    const input =
    document.getElementById("newStudent");

    let name =
    input.value.trim();

    if(name === ""){
        return;
    }

    name = name.toUpperCase();

    if(!students.includes(name)){

        students.push(name);

        saveStudents();

        renderStudents();

    }

    input.value = "";

}
function deleteStudent(student){

    if(!confirm(
        "Delete " + student + "?"
    )){
        return;
    }

    students =
    students.filter(
        s => s !== student
    );

    delete attendance[student];

    saveStudents();

    renderStudents();

}

let attendance = {};
JSON.parse(
    localStorage.getItem("attendance")
) || {};

const today =
new Date().toISOString().split("T")[0];

document.getElementById("attendanceDate").value =
today;

function renderStudents(){

    const container =
    document.getElementById("studentList");

    const search =
    document
    .getElementById("searchStudent")
    ?.value
    .toLowerCase() || "";

    container.innerHTML = "";

    students
    .filter(student =>
        student.toLowerCase().includes(search)
    )
    .forEach(student=>{

        const date =
document.getElementById("attendanceDate").value;

const status =
attendance[date]?.[student] || "Present";


        const currentStatus =
        statuses.find(
            s => s.text === status
        );

        const wrapper =
        document.createElement("div");

        wrapper.style.display = "flex";
        wrapper.style.gap = "10px";
        wrapper.style.marginBottom = "10px";

        wrapper.innerHTML = `

        <button
            class="student-btn"
            style="
                background:${currentStatus.color};
                flex:1;
            "
            onclick="cycleStatus('${student}')">

            ${currentStatus.icon}
            ${student}

        </button>

        <button
            class="delete-btn"
            onclick="deleteStudent('${student}')">

            🗑

        </button>

        `;

        container.appendChild(wrapper);
    });

const profileSelect =
document.getElementById(
    "studentProfileSelect"
);

profileSelect.innerHTML =
'<option value="">Select Student</option>';

students.forEach(student => {

    profileSelect.innerHTML +=
    `<option value="${student}">
        ${student}
    </option>`;

});

updateSummary();
updateDashboard();

}

function cycleStatus(student){

    const date =
    document.getElementById("attendanceDate").value;

    if(!attendance[date]){
        attendance[date] = {};
    }

    const current =
    attendance[date][student] || "Present";

    const index =
    statuses.findIndex(
        s => s.text === current
    );

    const next =
    (index + 1) % statuses.length;

    attendance[date][student] =
    statuses[next].text;

    saveAttendance();

    renderStudents();

}

function updateSummary(){

    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let cutting = 0;

    students.forEach(student=>{

        const date =
document.getElementById("attendanceDate").value;

const status =
attendance[date]?.[student] || "Present";

        if(status==="Present") present++;
        if(status==="Absent") absent++;
        if(status==="Late") late++;
        if(status==="Excused") excused++;
        if(status==="Cutting") cutting++;

    });

    document.getElementById("presentCount").textContent = present;
    document.getElementById("absentCount").textContent = absent;
    document.getElementById("lateCount").textContent = late;
    document.getElementById("excusedCount").textContent = excused;
    document.getElementById("cuttingCount").textContent = cutting;
}
function generateMonthlyReport(){

    const selectedDate =
    document.getElementById("attendanceDate").value;

    const month =
    selectedDate.substring(0,7);

    let html = `
    <table>
        <tr>
            <th>Student</th>
            <th>P</th>
            <th>A</th>
            <th>L</th>
            <th>E</th>
            <th>C</th>
        </tr>
    `;

    students.forEach(student => {

        let present = 0;
        let absent = 0;
        let late = 0;
        let excused = 0;
        let cutting = 0;

        Object.keys(attendance).forEach(date => {

            if(date.startsWith(month)){

                const status =
                attendance[date]?.[student]
                || "Present";

                if(status === "Present") present++;
                if(status === "Absent") absent++;
                if(status === "Late") late++;
                if(status === "Excused") excused++;
                if(status === "Cutting") cutting++;

            }

        });

        html += `
        <tr>
            <td>${student}</td>
            <td>${present}</td>
            <td>${absent}</td>
            <td>${late}</td>
            <td>${excused}</td>
            <td>${cutting}</td>
        </tr>
        `;

    });

    html += "</table>";

    document.getElementById("monthlyReport")
    .innerHTML = html;

}
function printMonthlyReport(){

    const report =
    document.getElementById(
        "monthlyReport"
    ).innerHTML;

    const school =
    document.getElementById(
        "schoolName"
    ).value;

    const section =
    document.getElementById(
        "section"
    ).value;

    const date =
    document.getElementById(
        "attendanceDate"
    ).value;

    const printWindow =
    window.open(
        "",
        "_blank"
    );

    printWindow.document.write(`
        <html>

        <head>

            <title>
                Monthly Attendance Report
            </title>

            <style>

                body{
                    font-family:Arial;
                    padding:20px;
                }

                h1,h2{
                    text-align:center;
                }

                table{
                    width:100%;
                    border-collapse:collapse;
                    margin-top:20px;
                }

                th,td{
                    border:1px solid black;
                    padding:8px;
                    text-align:center;
                }

                th{
                    background:#e5e7eb;
                }

            </style>

        </head>

        <body>

            <h1>${school}</h1>

            <h2>
                Monthly Attendance Report
            </h2>

            <p>
                <strong>Section:</strong>
                ${section}
            </p>

            <p>
                <strong>Date:</strong>
                ${date}
            </p>

            ${report}

        </body>

        </html>
    `);

    printWindow.document.close();

    printWindow.print();

}
function backupData(){

    const backup = {

        students: students,

        attendance: attendance,

        schoolName:
        document.getElementById("schoolName").value,

        section:
        document.getElementById("section").value

    };

    const blob =
    new Blob(
        [
            JSON.stringify(
                backup,
                null,
                2
            )
        ],
        {
            type:"application/json"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "AttendanceBackup.json";

    a.click();

    URL.revokeObjectURL(url);

}
function restoreData(event){

    const file =
    event.target.files[0];

    if(!file){
        return;
    }

    const reader =
    new FileReader();

    reader.onload =
    function(e){

        const backup =
        JSON.parse(
            e.target.result
        );

        students =
        backup.students || [];

        attendance =
        backup.attendance || {};

        document
        .getElementById("schoolName")
        .value =
        backup.schoolName || "";

        document
        .getElementById("section")
        .value =
        backup.section || "";

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        localStorage.setItem(
            "attendance",
            JSON.stringify(attendance)
        );

        document
        .getElementById("studentInput")
        .value =
        students.join("\n");

        renderStudents();
        updateDashboard();

        alert(
            "Backup restored successfully!"
        );

    };

    reader.readAsText(file);

}

function exportExcelReport(){

    const selectedDate =
    document.getElementById(
        "attendanceDate"
    ).value;

    const month =
    selectedDate.substring(0,7);

    let csv =
    "Student,Present,Absent,Late,Excused,Cutting\n";

    students.forEach(student => {

        let present = 0;
        let absent = 0;
        let late = 0;
        let excused = 0;
        let cutting = 0;

        Object.keys(attendance).forEach(date => {

            if(date.startsWith(month)){

                const status =
                attendance[date]?.[student]
                || "Present";

                if(status === "Present") present++;
                if(status === "Absent") absent++;
                if(status === "Late") late++;
                if(status === "Excused") excused++;
                if(status === "Cutting") cutting++;

            }

        });

        csv +=
        `"${student}",${present},${absent},${late},${excused},${cutting}\n`;

    });

    const blob =
    new Blob(
        [csv],
        {type:"text/csv"}
    );

    const url =
    window.URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    `MonthlyAttendance-${month}.csv`;

    a.click();

    window.URL.revokeObjectURL(url);

}
function generateInterventionList(){

    let html = "";

    students.forEach(student => {

        let absent = 0;
        let late = 0;
        let cutting = 0;

        Object.keys(attendance).forEach(date => {

            const status =
            attendance[date]?.[student];

            if(status === "Absent") absent++;
            if(status === "Late") late++;
            if(status === "Cutting") cutting++;

        });

        let riskLevel = "";
        let actionList = "";

        if(absent >= 5 || cutting >= 2){

            riskLevel = "🔴 HIGH RISK";

            actionList = `
            <ul>
                <li>Parent Conference</li>
                <li>Counseling Referral</li>
                <li>Home Visitation</li>
            </ul>
            `;

        }
        else if(late >= 5 || absent >= 3){

            riskLevel = "🟡 MONITOR";

            actionList = `
            <ul>
                <li>Attendance Monitoring</li>
                <li>Warning Letter</li>
            </ul>
            `;

        }

        if(riskLevel !== ""){

            html += `
            <div class="alert-card">

                <h4>${riskLevel}</h4>

                <strong>${student}</strong><br><br>

                Absent: ${absent}<br>
                Late: ${late}<br>
                Cutting: ${cutting}<br><br>

                <strong>Recommended Action:</strong>

                ${actionList}

            </div>
            `;
        }

    });

    if(html === ""){

        html = `
        <div class="alert-card">

            ✅ No students currently require intervention.

        </div>
        `;
    }

    document.getElementById(
        "interventionList"
    ).innerHTML = html;
}
function generateStudentProfile(){

    const student =
    document.getElementById(
        "studentProfileSelect"
    ).value;

    if(!student){
        return;
    }

    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let cutting = 0;

    Object.keys(attendance).forEach(date => {

        const status =
        attendance[date]?.[student];

        if(status === "Present") present++;
        if(status === "Absent") absent++;
        if(status === "Late") late++;
        if(status === "Excused") excused++;
        if(status === "Cutting") cutting++;

    });

    const attended =
present + late + excused;

const total =
present + absent + late + excused + cutting;

const rate =
total > 0
? ((attended / total) * 100).toFixed(2)
: 0;

let risk = "✅ Normal";

if(absent >= 5 || cutting >= 2){

    risk = "🔴 High Risk";

}
else if(absent >= 3 || late >= 5){

    risk = "🟡 Monitor";

}
    document.getElementById(
        "studentProfile"
    ).innerHTML = `

        <h3>${student}</h3>

        <p>✅ Present: ${present}</p>
        <p>❌ Absent: ${absent}</p>
        <p>⏰ Late: ${late}</p>
        <p>📝 Excused: ${excused}</p>
        <p>🚶 Cutting: ${cutting}</p>

        <hr>

        <p>
    Attendance Rate:
    ${rate}%
</p>

<p>
    Risk Level:
    ${risk}
</p>

    `;
}

function updateDashboard(){

    const today =
    document.getElementById("attendanceDate").value;

    const month =
    today.substring(0,7);

    let present = 0;
    let absent = 0;
    let late = 0;

    let monthAbsent = 0;
    let monthLate = 0;
    let monthCutting = 0;

    let highRisk = 0;
    let monitor = 0;

    let maxAbsent = 0;
    let maxLate = 0;
    let maxCutting = 0;

    let topAbsent = "None";
    let topLate = "None";
    let topCutting = "None";


    students.forEach(student => {

        const todayStatus =
        attendance[today]?.[student] || "Present";

        if(todayStatus === "Present") present++;
        if(todayStatus === "Absent") absent++;
        if(todayStatus === "Late") late++;

        let studentAbsent = 0;
        let studentLate = 0;
        let studentCutting = 0;

        Object.keys(attendance).forEach(date => {

            if(date.startsWith(month)){

                const status =
                attendance[date]?.[student];

                if(status === "Absent"){
                    monthAbsent++;
                    studentAbsent++;
                }

                if(status === "Late"){
                    monthLate++;
                    studentLate++;
                }

                if(status === "Cutting"){
                    monthCutting++;
                    studentCutting++;
                }

            }

        });
if(studentAbsent > maxAbsent){

    maxAbsent = studentAbsent;
    topAbsent =
    `${student} (${studentAbsent})`;

}

if(studentLate > maxLate){

    maxLate = studentLate;
    topLate =
    `${student} (${studentLate})`;

}

if(studentCutting > maxCutting){

    maxCutting = studentCutting;
    topCutting =
    `${student} (${studentCutting})`;

}
        if(studentAbsent >= 5 || studentCutting >= 2){
            highRisk++;
        }
        else if(studentAbsent >= 3 || studentLate >= 5){
            monitor++;
        }
const totalStudents =
students.length;

let attendanceRate = 0;

if(totalStudents > 0){

    attendanceRate =
    (present / totalStudents) * 100;

}
    });
// Calculate attendance rate
const totalStudents =
students.length;

let attendanceRate = 0;

if(totalStudents > 0){

    attendanceRate =
    (present / totalStudents) * 100;

}

// Dashboard values

    document.getElementById("dashPresent").textContent = present;
    document.getElementById("dashAbsent").textContent = absent;
    document.getElementById("dashLate").textContent = late;

    document.getElementById("dashMonthAbsent").textContent = monthAbsent;
    document.getElementById("dashMonthLate").textContent = monthLate;
    document.getElementById("dashMonthCutting").textContent = monthCutting;

    document.getElementById("dashHighRisk").textContent = highRisk;
    document.getElementById("dashMonitor").textContent = monitor;
    document.getElementById("attendanceRate").textContent = attendanceRate.toFixed(2) + "%";
    document.getElementById("totalStudents").textContent = totalStudents;
    document.getElementById("topAbsent").textContent = topAbsent;
    document.getElementById("topLate").textContent = topLate;
    document.getElementById( "topCutting").textContent = topCutting;
}

function markAllPresent(){

    const date =
    document.getElementById("attendanceDate").value;

    if(!attendance[date]){
        attendance[date] = {};
    }

    students.forEach(student => {

        attendance[date][student] = "Present";

    });

    saveAttendance();

    renderStudents();

}

document
.getElementById("loadBtn")
.addEventListener(
    "click",
    loadStudentList
);
document
.getElementById("addStudentBtn")
.addEventListener(
    "click",
    addStudent
);
document
.getElementById("clearBtn")
.addEventListener(
    "click",
    ()=>{

        if(confirm(
            "Clear all students?"
        )){

            students=[];

            saveStudents();

            renderStudents();

        }

    }
);

document
.getElementById("searchStudent")
.addEventListener(
    "input",
    renderStudents
);
document
.getElementById("generateReportBtn")
.addEventListener(
    "click",
    generateMonthlyReport
);
document
.getElementById("markAllPresentBtn")
.addEventListener(
    "click",
    markAllPresent
);
document.getElementById("studentInput").value =
students.join("\n");

document
.getElementById("newStudent")
.addEventListener(
    "keypress",
    function(event){

        if(event.key === "Enter"){

            addStudent();

        }

    }
);
document
.getElementById("attendanceDate")
.addEventListener(
    "change",
    renderStudents
);
document
.getElementById("generateInterventionBtn")
.addEventListener(
    "click",
    generateInterventionList
);
document
.getElementById("printReportBtn")
.addEventListener(
    "click",
    printMonthlyReport
);
document
.getElementById("exportExcelBtn")
.addEventListener(
    "click",
    exportExcelReport
);
document
.getElementById("backupBtn")
.addEventListener(
    "click",
    backupData
);
document
.getElementById("restoreBtn")
.addEventListener(
    "click",
    function(){

        document
        .getElementById("restoreFile")
        .click();

    }
);

document
.getElementById("restoreFile")
.addEventListener(
    "change",
    restoreData
);
document
.getElementById(
    "studentProfileSelect"
)
.addEventListener(
    "change",
    generateStudentProfile
);
renderStudents();
updateDashboard();
