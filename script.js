function clickSound() {
  document.getElementById("clickSound").play();
}

/* === Show / Hide Grading Scale === */
function toggleGradingScale() {
  const scale = document.getElementById("gradingScale");
  const btn = document.getElementById("scaleBtn");
  clickSound();
  scale.classList.toggle("show");
  btn.textContent = scale.classList.contains("show")
    ? "📕 Hide Grading Scale"
    : "📘 Show Grading Scale";
}

/* === Grade Conversion === */
function getGradeAndGP(marks) {
  if (marks >= 95) return ["A+", 4.00];
  if (marks >= 86) return ["A", 4.00];
  if (marks >= 80) return ["A-", 3.70];
  if (marks >= 76) return ["B+", 3.30];
  if (marks >= 72) return ["B", 3.00];
  if (marks >= 68) return ["B-", 2.70];
  if (marks >= 64) return ["C+", 2.30];
  if (marks >= 60) return ["C", 2.00];
  if (marks >= 57) return ["C-", 1.70];
  if (marks >= 54) return ["D+", 1.30];
  if (marks >= 50) return ["D", 1.00];
  return ["F", 0.00];
}

/* === CGPA Calculation === */
function calculateCGPA() {
  const name = document.getElementById("studentName").value.trim();
  const rows = document.querySelectorAll("#gradesTable tr:not(:first-child)");
  let totalWeightedGP = 0, totalCredits = 0;

  rows.forEach(row => {
    const marks = parseFloat(row.querySelector(".marks")?.value);
    const credits = parseFloat(row.querySelector(".credits")?.value);
    const gradeCell = row.querySelector(".grade");
    const gpCell = row.querySelector(".gp");

    if (!isNaN(marks) && !isNaN(credits)) {
      const [grade, gp] = getGradeAndGP(marks);
      gradeCell.textContent = grade;
      gpCell.textContent = gp.toFixed(2);
      totalWeightedGP += gp * credits;
      totalCredits += credits;
    } else {
      gradeCell.textContent = "";
      gpCell.textContent = "";
    }
  });

  const cgpa = (totalCredits > 0) ? (totalWeightedGP / totalCredits).toFixed(2) : "0.00";
  document.getElementById("progressValue").textContent = cgpa;
  animateProgress(cgpa);
  document.getElementById("result").textContent = name
    ? `${name}, your CGPA is: ${cgpa}`
    : `Your CGPA is: ${cgpa}`;
}

/* === Circle Animation === */
function animateProgress(value) {
  const circle = document.getElementById("progressCircle");
  const degree = (value / 4) * 360;
  let color = "#ff0000";
  if (value >= 3.5) color = "#00ff88";
  else if (value >= 2.5) color = "#f7b500";
  else if (value >= 1.5) color = "#ff6600";
  circle.style.background = `conic-gradient(${color} ${degree}deg, #333 ${degree}deg)`;
  circle.style.boxShadow = `0 0 35px ${color}`;
}

/* === Add / Remove Subject === */
function addSubject() {
  const table = document.getElementById("gradesTable");
  const newRow = table.insertRow(-1);
  newRow.innerHTML = `
    <td><input type="text" class="subject" placeholder="Enter Subject" /></td>
    <td><input type="number" min="0" max="100" class="marks" /></td>
    <td><input type="number" min="1" max="5" class="credits" /></td>
    <td class="grade"></td>
    <td class="gp"></td>
  `;
  clickSound();
}

function removeSubject() {
  const table = document.getElementById("gradesTable");
  const totalRows = table.rows.length;

  // Ensure header row stays
  if (totalRows > 2) {
    table.deleteRow(-1);
  } else if (totalRows === 2) {
    // Clear data if only one subject left
    const row = table.rows[1];
    row.querySelectorAll("input").forEach(input => input.value = "");
    row.querySelector(".grade").textContent = "";
    row.querySelector(".gp").textContent = "";
  }

  // Clear CGPA display and circle
  document.getElementById("progressValue").textContent = "0.00";
  document.getElementById("result").textContent = "";
  document.getElementById("progressCircle").style.background =
    "conic-gradient(#00b4d8 0deg, #333 0deg)";
  document.getElementById("progressCircle").style.boxShadow = "none";

  clickSound();
}

/* === Dark / Light Mode === */
function toggleMode() {
  const body = document.body;
  body.classList.toggle("light");
  const btn = document.querySelector(".mode-toggle");
  btn.textContent = body.classList.contains("light") ? "🌞 Light" : "🌙 Dark";
  initParticles();
}

/* === Background Animation === */
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let width, height, particles = [];

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  initParticles();
}

function initParticles() {
  particles = Array.from({ length: 40 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3 + 2,
    dx: (Math.random() - 0.5) * 1.5,
    dy: (Math.random() - 0.5) * 1.5,
    color: document.body.classList.contains("light")
      ? `hsla(${Math.random() * 360}, 70%, 60%, 0.5)`
      : `hsla(${Math.random() * 360}, 80%, 70%, 0.9)`
  }));
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    ctx.beginPath();
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > width) p.dx *= -1;
    if (p.y < 0 || p.y > height) p.dy *= -1;
  });
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
animate();
