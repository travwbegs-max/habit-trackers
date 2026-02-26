let data = JSON.parse(localStorage.getItem("habitRPG")) || {
  habits: [],
  xp: 0,
  level: 1,
  gold: 0,
  bossHP: 100,
  avatar: "🧙",
  achievements: [],
  weekly: Array(7).fill(0),
  leaderboard: []
};

function save() {
  localStorage.setItem("habitRPG", JSON.stringify(data));
  render();
}

function addHabit() {
  const name = prompt("Habit name?");
  if (!name) return;
  data.habits.push({ name, streak: 0 });
  save();
}

function completeHabit(i) {
  data.habits[i].streak++;
  data.xp += 20;
  data.gold += 10;
  data.bossHP -= 10;
  data.weekly[new Date().getDay()]++;
  levelCheck();
  achievementCheck();
  save();
}

function levelCheck() {
  const xpNeeded = data.level * 100;
  if (data.xp >= xpNeeded) {
    data.xp -= xpNeeded;
    data.level++;
    data.bossHP = 100;
  }
}

function achievementCheck() {
  if (data.level === 5 && !data.achievements.includes("Level 5")) {
    data.achievements.push("Reached Level 5!");
  }
}

function changeAvatar() {
  const avatars = ["🧙","🦸","🥷","🐉","👑"];
  const choice = prompt("Pick number 0-4");
  if (avatars[choice]) {
    data.avatar = avatars[choice];
    save();
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(data)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "habitRPGsave.json";
  a.click();
}

function importData(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function() {
    data = JSON.parse(reader.result);
    save();
  };
  reader.readAsText(file);
}

function renderCalendar() {
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  data.weekly.forEach(v => {
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = v + "✔";
    cal.appendChild(div);
  });
}

function renderBoss() {
  const boss = document.getElementById("boss");
  boss.innerHTML = `
    <div class="boss">
      Boss HP: ${data.bossHP}
      <div class="progress-bar">
        <div style="width:${data.bossHP}%; background:red; height:20px;"></div>
      </div>
    </div>
  `;
}

function renderLeaderboard() {
  data.leaderboard = [...data.leaderboard, data.level]
    .sort((a,b)=>b-a)
    .slice(0,5);

  const board = document.getElementById("leaderboard");
  board.innerHTML = data.leaderboard
    .map((lvl,i)=>`#${i+1} - Level ${lvl}`)
    .join("<br>");
}

function renderChart() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  data.weekly.forEach((v,i)=>{
    ctx.fillRect(i*40+10,150 - v*10,30,v*10);
  });
}

function render() {
  document.getElementById("level").textContent = data.level;
  document.getElementById("xp").textContent = data.xp;
  document.getElementById("xpNeeded").textContent = data.level * 100;
  document.getElementById("gold").textContent = data.gold;
  document.getElementById("avatar").textContent = data.avatar;

  document.getElementById("xpBar").style.width =
    (data.xp/(data.level*100))*100 + "%";

  const habitsEl = document.getElementById("habits");
  habitsEl.innerHTML = "";
  data.habits.forEach((h,i)=>{
    habitsEl.innerHTML += `
      <div class="habit">
        ${h.name} (Streak ${h.streak})
        <button onclick="completeHabit(${i})">Attack Boss ⚔️</button>
      </div>
    `;
  });

  document.getElementById("achievements").innerHTML =
    data.achievements.join("<br>");

  renderBoss();
  renderCalendar();
  renderLeaderboard();
  renderChart();
}

render();
