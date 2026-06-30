function shortName(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts.slice(0, 2).join(" ");
}
const shiftTemplates = {
  "08:00-16:00": { start: 8, end: 16, hours: 8 },
  "16:00-23:00": { start: 16, end: 23, hours: 7 },
  "23:00-08:00": { start: 23, end: 32, hours: 9 },
  "08:00-20:00": { start: 8, end: 20, hours: 12 },
  "20:00-08:00": { start: 20, end: 32, hours: 12 },
  "18:00-02:00": { start: 18, end: 26, hours: 8 },
  "12:00-20:00": { start: 12, end: 20, hours: 8 },
  "11:00-23:00": { start: 11, end: 23, hours: 12 },
  "09:00-18:00": { start: 9, end: 18, hours: 9 },
  "08:00-17:00": { start: 8, end: 17, hours: 9 },
  "17:00-02:00": { start: 17, end: 26, hours: 9 }
};

const staffingBlocks = {
  "1 смена": { start: 8, end: 16 },
  "2 смена": { start: 16, end: 23 },
  "3 смена": { start: 23, end: 32 }
};

const categories = ["Общий", "Продавец", "Официант", "Бариста", "Кассир", "Техничка", "Морозильщик", "Менеджер"];
const editableCategories = categories.filter(c => c !== "Общий");
const daysShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const defaultEmployees = `ABDIYEVA SHAHINABONU SUNNATULLO QIZI|Продавец|16:00-23:00
ABDUKARIMOV UMIDJON ILXOM O'G'LI|Продавец|23:00-08:00
ABDULLAYEVA SEVINCHOY AHMADJON QIZI|Официант|16:00-23:00
ABDUNABIYEVA GULSANAM ABDUG'ANI QIZI|Официант|16:00-23:00
ABDUSALIMOV FAXRIDDIN IMOMALI O'G'LI|Официант|16:00-23:00
AGZAMOV RAMZIDDIN SHUHRAT O'G'LI|Кассир|20:00-08:00
AKBAROVA GULCHEXRA MAXMUDJONOVNA|Техничка|08:00-16:00
ANORBOYEV ABDULATIF NURIDDIN O'G'LI|Морозильщик|20:00-08:00
AXMEDJANOVA BIBIXOJAR OYBEK QIZI|Официант|08:00-16:00
AXMEDOVA NIGORAXON ULUGBEK QIZI|Менеджер|23:00-08:00
BEKNAZAROVA MAHLIYO G'ULOMJON QIZI|Продавец|08:00-16:00
DADABOYEVA AZIZAXON DILSHOD QIZI|Официант|08:00-16:00
ERGASHEVA DILAFRUZ MURODJON QIZI|Продавец|16:00-23:00
ERGASHOVA AZIZA XOLIYOR QIZI|Техничка|16:00-23:00
FOZILOVA KOMILA KAMOLITDINOVNA|Техничка|20:00-08:00
G'OFUROV ABDULATIF AKMAL O'G'LI|Бариста|16:00-23:00
GAFUROVA SURAYYO ABDUNABIYEVNA|Техничка|16:00-23:00
GAPPAROV MUHAMMADRIZO SHARIF O'G'LI|Менеджер|08:00-17:00
IBODULLAYEV YODGOR OZOD O'G'LI|Менеджер|17:00-02:00
IKROMOV ZAFARBEK MURODBEK O'G'LI|Официант|18:00-02:00
ISAXOVA VENERA ANSATBAY QIZI|Официант|18:00-02:00
ISMATILLAYEVA MALIKA MARDON QIZI|Бариста|16:00-23:00
ISMOILOVA KRISTINA TAXIROVNA|Техничка|16:00-23:00
JALILOV ABDURAHMON RAVSHAN O'G'LI|Морозильщик|08:00-20:00
JANGIROVA IRODAXON BAHODIR QIZI|Официант|08:00-16:00
JO'RAYEVA HUSNORA BOZAROVNA|Техничка|08:00-20:00
KADIROVA MAPURA TAXIROVNA|Продавец|08:00-16:00
KARIMJONOV AVAZBEK MURODJON O'G'LI|Бариста|23:00-08:00
KRIVOROTOVA SVETLANA VITALEVNA|Менеджер|09:00-18:00
KUSHSHAYEV ISLOMBEK KAXRAMON O'G'LI|Официант|08:00-16:00
MANSUROV DAVRONBEK AZIZBEKOVICH|Официант|16:00-23:00
MAXMUDOVA E'ZOZAXON ABDUSAMAD QIZI|Продавец|16:00-23:00
MUXAMEDOVA SHAXNOZA KAMILOVNA|Техничка|08:00-16:00
NASRULLOVA MALIKA BAXTIYOROVNA|Продавец|16:00-23:00
NISHONBOYEVA NOZIMA JAMSHID QIZI|Бариста|08:00-16:00
NIZAMATDINOV BEKZOD KOSIM -TALGAT O'G'LI|Бариста|16:00-23:00
OLIMBOYEV AFZALBEK ALISHER O'G'LI|Официант|18:00-02:00
ORIPOVA SARVINOZ DILMUROD QIZI|Кассир|08:00-20:00
PARDABOYEVA RUSHANA MIRZOXIDOVNA|Официант|08:00-16:00
PATXITDINOV RASULJON TO'YCHI O'G'LI|Официант|16:00-23:00
RAHMATOVA E'ZOZA AKBAR QIZI|Менеджер|16:00-23:00
RAIMBOYEV G'IYOSJON ERKINBOY O'G'LI|Официант|16:00-23:00
RASULOVA RUXSHONA RUSTAM QIZI|Официант|16:00-23:00
RAXMONBERDIYEVA ZUHRA RAXIMBERDI QIZI|Техничка|08:00-20:00
SAIDALIYEV SAIDMUXAMMAD SAIDIVALI O'G'LI|Официант|23:00-08:00
SAIDAZIMOV FAZLIDDIN FAXRIDDINOVICH|Официант|16:00-23:00
SALYAMOVA ZAVXARON FURQAT QIZI|Продавец|16:00-23:00
SAYDULLAYEV AZIZBEK DILSHODJON O'G'LI|Официант|16:00-23:00
SHAMSHIDDINOVA MUXLISA DILSHOD QIZI|Продавец|16:00-23:00
TOG'AYBEKOVA NIGORA QUANISH QIZI|Бариста|08:00-16:00
TOIROV HASANBOY OTABEK O'G'LI|Официант|23:00-08:00
TOJIBOYEVA MARJONA ILXOMBOY QIZI|Официант|08:00-16:00
TURSUNALIYEV OZODBEK ALISHER O'G'LI|Морозильщик|20:00-08:00
UMARALIYEV SHAHZOD SHERZOD O'GLI|Официант|08:00-16:00
UMIROVA GULASAL ABDIXALIL QIZI|Официант|08:00-16:00
USMANOVA GULNOZA AZIZ QIZI|Менеджер|08:00-16:00
USMONOV FARRUX USMON O'G'LI|Официант|08:00-16:00
USMONQULOVA GULCHEHRA KARIMOVNA|Продавец|08:00-16:00
VOHIDOVA NASIBA ALIYEVNA|Техничка|08:00-16:00
XASHIMOVA SEVARA TAXIROVNA|Продавец|08:00-16:00
ZARIPOVA MAFTUNA ZAFAR QIZI|Продавец|16:00-23:00
ZOKIRJONOVA ZARINA G'AYRAT QIZI|Бариста|08:00-16:00
ZOKIROV ABDULVORIS ABDUQAHHOR O'G'LI|Кассир|08:00-16:00`;

let state = loadState();
let currentPage = "schedule";
let currentCategory = "Общий";
let staffFilter = { category: "Все", shift: "Все", day: "Все" };
let dayoffFilter = { category: "Все", shift: "Все", search: "" };

function parseEmployees() {
  return defaultEmployees.split("\n").map((line, index) => {
    const [name, position, shift] = line.split("|");
    return { id: `e${index+1}`, name, position, defaultShift: shift, skills: [position], universal: false, active: true };
  });
}

function weekStart(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0,0,0,0);
  return d;
}
function dateKey(d){ return d.toISOString().slice(0,10); }
function formatDate(d){ return d.toLocaleDateString("ru-RU", { day:"2-digit", month:"2-digit" }); }
function getWeekDays(startKey){ const s = new Date(startKey); return [...Array(7)].map((_,i)=>{const d=new Date(s); d.setDate(s.getDate()+i); return d;}); }
function weekLabel(startKey){ const days=getWeekDays(startKey); return `${formatDate(days[0])}–${formatDate(days[6])}`; }

function blankStaffing(){
  const obj = {};
  editableCategories.forEach(cat => { obj[cat]={}; Object.keys(staffingBlocks).forEach(sh => obj[cat][sh]=1); });
  obj["Продавец"]["1 смена"] = 4; obj["Продавец"]["2 смена"] = 4;
  obj["Официант"]["1 смена"] = 6; obj["Официант"]["2 смена"] = 6;
  obj["Бариста"]["1 смена"] = 2; obj["Бариста"]["2 смена"] = 2;
  obj["Кассир"]["1 смена"] = 1; obj["Кассир"]["2 смена"] = 1; obj["Кассир"]["3 смена"] = 1;
  return obj;
}

function createWeek(startKey, copyFromKey=null){
  const days = getWeekDays(startKey).map(dateKey);
  const schedule = {};
  days.forEach(day => schedule[day] = []);
  if(copyFromKey && state.weeks[copyFromKey]){
    const oldDays = getWeekDays(copyFromKey).map(dateKey);
    days.forEach((day,i)=>{
      schedule[day] = (state.weeks[copyFromKey].schedule[oldDays[i]] || []).map(x=>({...x, day}));
    });
  } else {
    days.forEach(day => {
      state.employees.filter(e=>e.active).forEach(e => schedule[day].push({ employeeId:e.id, category:e.position, shift:e.defaultShift, status:"work" }));
    });
  }
  state.weeks[startKey] = { startKey, staffing: blankStaffing(), schedule, history: [`Создана неделя ${weekLabel(startKey)}`] };
}

function loadState(){
  const saved = localStorage.getItem("safiaScheduleV3");
  if(saved) return JSON.parse(saved);
  const start = dateKey(weekStart(new Date()));
  const s = { employees: parseEmployees(), weeks: {}, currentWeek: start, role:"admin" };
  window.state = s;
  return s;
}
function saveState(){ localStorage.setItem("safiaScheduleV3", JSON.stringify(state)); }
function ensureWeek(){ if(!state.weeks[state.currentWeek]) createWeek(state.currentWeek); saveState(); }
ensureWeek();

function employee(id){ return state.employees.find(e=>e.id===id); }
function overlap(a,b){ return Math.max(0, Math.min(a.end,b.end)-Math.max(a.start,b.start)); }
function coversShift(item, blockName){
  const tpl = shiftTemplates[item.shift]; const block = staffingBlocks[blockName];
  if(!tpl || !block) return 0;
  return overlap(tpl, block);
}
function itemHours(item){ return shiftTemplates[item.shift]?.hours || 0; }
function dayItems(day){ return state.weeks[state.currentWeek].schedule[day] || []; }
function isDayOff(day, empId){ return dayItems(day).some(i=>i.employeeId===empId && i.status==="off"); }
function coverage(day, category, shiftName){
  return dayItems(day).filter(i=>i.status==="work" && i.category===category && coversShift(i, shiftName)>0).length;
}
function need(category, shiftName){ return state.weeks[state.currentWeek].staffing[category]?.[shiftName] ?? 0; }
function problems(){
  const list=[]; const days=getWeekDays(state.currentWeek).map(dateKey);
  days.forEach(day=>editableCategories.forEach(cat=>Object.keys(staffingBlocks).forEach(sh=>{
    const n=need(cat,sh), a=coverage(day,cat,sh), diff=a-n;
    if(diff!==0) list.push({day,cat,sh,n,a,diff});
  })));
  return list;
}

function render(){
  state.role = document.getElementById("roleSelect")?.value || state.role;
  document.querySelectorAll(".admin-only").forEach(el=>el.style.display = state.role==="admin" ? "block" : "none");
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(currentPage).classList.add("active");
  document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active", n.dataset.page===currentPage));
  document.getElementById("pageTitle").textContent = ({
    dashboard:"Помощник",
    schedule:"График недели",
    dayoffs:"Выходные",
    employees:"Сотрудники",
    skills:"Навыки",
    staffing:"Штатка",
    history:"История"
  })[currentPage];
  document.getElementById("weekTitle").textContent = `Неделя ${weekLabel(state.currentWeek)}`;
  renderSkills();
  renderWeekSelect();
  renderDashboard(); renderSchedule(); renderDayoffs(); renderEmployees(); renderStaffing(); renderHistory();
  saveState();
}

function renderWeekSelect(){
  const sel=document.getElementById("weekSelect");
  sel.innerHTML = Object.keys(state.weeks).sort().map(k=>`<option value="${k}" ${k===state.currentWeek?'selected':''}>${weekLabel(k)}</option>`).join("");
}
function statusClass(diff){ return diff<0?"low":diff>0?"high":"ok"; }
function statusText(diff){ return diff<0?`Не хватает ${Math.abs(diff)}`:diff>0?`Лишние ${diff}`:"Норма"; }

function renderSkills(){
  const skills = editableCategories;

  document.getElementById("skills").innerHTML = `
    <div class="card">
      <h3>Навыки и универсальность</h3>
      <p class="muted">Здесь можно отметить, кто может работать в другой категории.</p>

      <div class="list">
        ${state.employees.map(e => `
          <div class="employeeRow">
            <b>${shortName(e.name)}</b>
            <span>${e.position}</span>
            <span>${e.defaultShift}</span>

            <span>
              ${skills.map(skill => `
                <label class="pill">
                  <input 
                    type="checkbox" 
                    ${e.skills.includes(skill) ? "checked" : ""}
                    onchange="toggleSkill('${e.id}','${skill}',this.checked)"
                  >
                  ${skill}
                </label>
              `).join("")}
            </span>

            <label class="pill">
              <input 
                type="checkbox" 
                ${e.universal ? "checked" : ""}
                onchange="toggleUniversal('${e.id}',this.checked)"
              >
              Универсал
            </label>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function toggleSkill(empId, skill, checked){
  const e = employee(empId);
  if(!e) return;

  if(checked && !e.skills.includes(skill)){
    e.skills.push(skill);
  }

  if(!checked){
    e.skills = e.skills.filter(s => s !== skill);
  }

  saveState();
  render();
}

function toggleUniversal(empId, checked){
  const e = employee(empId);
  if(!e) return;

  e.universal = checked;
  saveState();
  render();
}

function renderDashboard(){
  const p=problems();
  const critical=p.filter(x=>x.diff<0).slice(0,8);
  const extra=p.filter(x=>x.diff>0).slice(0,8);
  const suggestions = critical.map(x=>`<div class="infoBox"><b>🔴 ${x.day} · ${x.cat} · ${x.sh}</b><br><span class="muted">Не хватает ${Math.abs(x.diff)}. Проверь универсалов или сотрудников с частичным покрытием смены.</span></div>`).join("") || `<div class="infoBox">✅ Критичных нехваток нет</div>`;
  document.getElementById("dashboard").innerHTML = `
    <div class="quickStats">
      <div class="stat"><small>Всего проблем</small><b>${p.length}</b></div>
      <div class="stat"><small>Нехватка</small><b>${p.filter(x=>x.diff<0).length}</b></div>
      <div class="stat"><small>Лишние</small><b>${p.filter(x=>x.diff>0).length}</b></div>
      <div class="stat"><small>Неделя</small><b style="font-size:22px">${weekLabel(state.currentWeek)}</b></div>
    </div>
    <div class="card"><h3>✨ Лента рекомендаций</h3><div class="infoGrid">${suggestions}</div></div>
    <div class="card"><h3>Лишние сотрудники</h3>${extra.map(x=>`<p><span class="badge high">Лишние ${x.diff}</span> ${x.day} · ${x.cat} · ${x.sh}: нужно ${x.n}, стоит ${x.a}</p>`).join("") || "<p>Лишних нет ✅</p>"}</div>
  `;
}
function renderSchedule(){
  const p=problems();
  const low=p.filter(x=>x.diff<0).length, high=p.filter(x=>x.diff>0).length;
  const activePeople = getWeekDays(state.currentWeek).map(dateKey).reduce((sum,day)=>sum+dayItems(day).filter(i=>i.status==="work").length,0);
  document.getElementById("schedule").innerHTML = `
    <div class="quickStats">
      <div class="stat"><small>Проблемы недели</small><b>${p.length}</b></div>
      <div class="stat"><small>Не хватает</small><b>${low}</b></div>
      <div class="stat"><small>Лишние</small><b>${high}</b></div>
      <div class="stat"><small>Назначений</small><b>${activePeople}</b></div>
    </div>
    <div class="card">
      <div class="toolbar">
        <div class="tabs">${categories.map(c=>`<button class="tab ${c===currentCategory?'active':''}" onclick="setCategory('${c}')">${c}</button>`).join("")}</div>
        <button class="secondary" onclick="currentPage='dashboard';render()">✨ Помощник</button>
      </div>
      <div class="board">${getWeekDays(state.currentWeek).map((d,i)=>renderDayColumn(dateKey(d), daysShort[i], formatDate(d))).join("")}</div>
    </div>
  `;
}
function renderDayColumn(day, label, display){
  const cats = currentCategory==="Общий" ? editableCategories : [currentCategory];
  const mini = cats.slice(0,4).map(cat=>{
    const actual = Object.keys(staffingBlocks).reduce((a,sh)=>a+coverage(day,cat,sh),0);
    const needed = Object.keys(staffingBlocks).reduce((a,sh)=>a+need(cat,sh),0);
    const diff = actual-needed;
    return `<div class="miniLine"><span>${cat}</span><b class="${statusClass(diff)} badge">${actual}/${needed}</b></div>`;
  }).join("");
  const shifts = Object.keys(staffingBlocks).map(sh=>renderShift(day, sh)).join("");
  return `<div class="dayCol"><div class="dayHead"><div class="dayHeadTop"><div><div class="dayName">${label}</div><div class="dayDate">${display}</div></div><button class="secondary" onclick="quickAdd('${day}')">+</button></div><div class="miniStatus">${mini}</div></div>${shifts}<div class="shiftBox"><div class="shiftBoxTitle">🏖 Выходные</div>${renderOff(day)}</div></div>`;
}
function renderShift(day, sh){
  const cats = currentCategory==="Общий" ? editableCategories : [currentCategory];
  let html="";
  cats.forEach(cat=>{
    const actual=coverage(day,cat,sh), n=need(cat,sh), diff=actual-n;
    const items=dayItems(day).filter(i=>i.status==="work" && i.category===cat && coversShift(i,sh)>0);
    html += `<div class="shiftBoxTitle"><span>${cat} · ${sh}</span><span class="badge ${statusClass(diff)}">${actual}/${n}</span></div>`;
    html += items.map(i=>{
      const emp = employee(i.employeeId);
      const full = coversShift(i,sh) >= (staffingBlocks[sh].end-staffingBlocks[sh].start);
      return `<div class="empCard ${i.status==='changed'?'changed':''}" draggable="true" ondragstart="dragEmp(event,'${day}','${i.employeeId}','${i.category}','${i.shift}')" onclick="openEmployeeDrawer('${day}','${i.employeeId}','${i.category}','${i.shift}')"><b>${shortName(emp?.name)}</b><div class="empMeta"><span>${i.shift}</span><span class="empSkill">${full?'полная':'часть'} ${coversShift(i,sh)}ч</span></div></div>`;
    }).join("") || `<div class="empty">Пока пусто</div>`;
  });
  return `<div class="shiftBox" ondragover="event.preventDefault()" ondrop="dropEmp(event,'${day}','${sh}')">${html}</div>`;
}
function renderOff(day){
  return dayItems(day).filter(i=>i.status==="off").map(i=>`<div class="empCard dayoffCard" onclick="openEmployeeDrawer('${day}','${i.employeeId}','','')"><b>${shortName(employee(i.employeeId)?.name)}</b><div class="empMeta"><span>Выходной</span><span>🏖</span></div></div>`).join("") || `<div class="empty">Нет выходных</div>`;
}
function renderDayoffs(){
  const days = getWeekDays(state.currentWeek);
  const filteredEmployees = state.employees.filter(e => {
    const byCategory = dayoffFilter.category === "Все" || e.position === dayoffFilter.category;
    const byShift = dayoffFilter.shift === "Все" || e.defaultShift === dayoffFilter.shift;
    const bySearch = !dayoffFilter.search || e.name.toLowerCase().includes(dayoffFilter.search.toLowerCase());
    return e.active && byCategory && byShift && bySearch;
  });

  document.getElementById("dayoffs").innerHTML = `
    <div class="card">
      <h3>Фильтр выходных</h3>

      <div class="filters">
        <select onchange="dayoffFilter.category=this.value; render()">
          <option>Все</option>
          ${editableCategories.map(c=>`<option ${dayoffFilter.category===c?'selected':''}>${c}</option>`).join("")}
        </select>

        <select onchange="dayoffFilter.shift=this.value; render()">
          <option>Все</option>
          ${Object.keys(shiftTemplates).map(s=>`<option ${dayoffFilter.shift===s?'selected':''}>${s}</option>`).join("")}
        </select>

        <input 
          placeholder="Поиск сотрудника..." 
          value="${dayoffFilter.search}" 
          oninput="dayoffFilter.search=this.value; render()"
        >

        <button class="secondary" onclick="selectFilteredEmployeesForDayoff()">Выбрать всех</button>
        <button class="secondary" onclick="clearDayoffEmployeeSelection()">Очистить</button>
      </div>
    </div>

    <div class="card">
      <h3>Поставить выходной</h3>

      <div class="grid grid2">
        <div>
          <b>Сотрудники (${filteredEmployees.length})</b>
          <div class="checks">
            ${filteredEmployees.map(e=>`
              <label>
                <input type="checkbox" class="offEmp" value="${e.id}">
                ${shortName(e.name)}
                <span class="muted">${e.position} · ${e.defaultShift}</span>
              </label>
            `).join("") || `<p class="muted">Сотрудники не найдены</p>`}
          </div>
        </div>

        <div>
          <b>Даты</b>
          <div class="checks">
            ${days.map((d,i)=>`
              <label>
                <input type="checkbox" class="offDay" value="${dateKey(d)}">
                ${daysShort[i]} ${formatDate(d)}
              </label>
            `).join("")}
          </div>
        </div>
      </div>

      <br>
      <button onclick="massDayoff()">Поставить выходной</button>
    </div>
  `;
}
function renderEmployees(){
  document.getElementById("employees").innerHTML = `<div class="card"><h3>Добавить сотрудника</h3><div class="filters"><input id="newName" placeholder="ФИО"><select id="newPos">${editableCategories.map(c=>`<option>${c}</option>`)}</select><select id="newShift">${Object.keys(shiftTemplates).map(s=>`<option>${s}</option>`)}</select><button onclick="addEmployee()">Добавить</button></div></div><div class="list">${state.employees.map(e=>`<div class="employeeRow"><b>${e.name}</b><span>${e.position}</span><span>${e.defaultShift}</span><span>${e.skills.map(s=>`<i class="pill">${s}</i>`).join("")}</span><button class="danger" onclick="removeEmployee('${e.id}')">Удалить</button></div>`).join("")}</div>`;
}
function renderStaffing(){
  const days = getWeekDays(state.currentWeek).map(dateKey);
  const rows=[];
  days.forEach(day=>editableCategories.forEach(cat=>Object.keys(staffingBlocks).forEach(sh=>{
    if((staffFilter.category==="Все"||staffFilter.category===cat)&&(staffFilter.shift==="Все"||staffFilter.shift===sh)&&(staffFilter.day==="Все"||staffFilter.day===day)){
      const n=need(cat,sh), a=coverage(day,cat,sh), diff=a-n;
      rows.push(`<tr><td>${day}</td><td>${cat}</td><td>${sh}</td><td><input type="number" value="${n}" min="0" onchange="setNeed('${cat}','${sh}',this.value)"></td><td>${a}</td><td><span class="badge ${statusClass(diff)}">${statusText(diff)}</span></td></tr>`);
    }
  })));
  document.getElementById("staffing").innerHTML = `<div class="card"><h3>Фильтр штатки</h3><div class="filters"><select onchange="staffFilter.category=this.value;render()"><option>Все</option>${editableCategories.map(c=>`<option ${staffFilter.category===c?'selected':''}>${c}</option>`)}</select><select onchange="staffFilter.shift=this.value;render()"><option>Все</option>${Object.keys(staffingBlocks).map(s=>`<option ${staffFilter.shift===s?'selected':''}>${s}</option>`)}</select><select onchange="staffFilter.day=this.value;render()"><option>Все</option>${days.map(d=>`<option ${staffFilter.day===d?'selected':''} value="${d}">${d}</option>`)}</select></div></div><div class="card"><table class="table"><thead><tr><th>Дата</th><th>Категория</th><th>Смена</th><th>Нужно</th><th>Стоит</th><th>Статус</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}
function renderHistory(){
  const week=state.weeks[state.currentWeek];
  document.getElementById("history").innerHTML = `<div class="card"><h3>История недели</h3>${week.history.map(h=>`<p>${h}</p>`).join("")}</div>`;
}

function openEmployeeDrawer(day, empId, category='', shift=''){
  const emp = employee(empId);
  if(!emp) return;
  const items = dayItems(day).filter(i=>i.employeeId===empId);
  const hours = items.filter(i=>i.status==='work').reduce((a,i)=>a+itemHours(i),0);
  const drawer=document.getElementById('drawer');
  drawer.innerHTML = `
    <div class="drawerHead"><div><h2>${shortName(emp.name)}</h2><div class="muted">${emp.position} · ${emp.defaultShift}</div></div><button class="drawerClose" onclick="closeDrawer()">✕</button></div>
    <div class="infoGrid">
      <div class="infoBox"><b>Дата</b><br>${day}</div>
      <div class="infoBox"><b>Часы за день</b><br>${hours} / 17</div>
      <div class="infoBox"><b>Навыки</b><br>${emp.skills.map(s=>`<i class="pill">${s}</i>`).join('') || 'Нет'}</div>
      <div class="infoBox"><b>Действия</b><br><br>
        <select id="drawerShift">${Object.keys(shiftTemplates).map(s=>`<option ${s===shift?'selected':''}>${s}</option>`).join('')}</select><br><br>
        <button onclick="changeFromDrawer('${day}','${empId}','${category}','${shift}')">Изменить смену</button>
        <button class="secondary" onclick="makeOffFromDrawer('${day}','${empId}')">Поставить выходной</button>
      </div>
    </div>`;
  drawer.classList.add('open');
}
function closeDrawer(){document.getElementById('drawer').classList.remove('open')}
function changeFromDrawer(day, empId, category, oldShift){
  const newShift=document.getElementById('drawerShift').value;
  const item=dayItems(day).find(i=>i.employeeId===empId && i.category===category && i.shift===oldShift && i.status==='work') || dayItems(day).find(i=>i.employeeId===empId && i.status==='work');
  if(item){item.shift=newShift; item.status='changed'; state.weeks[state.currentWeek].history.push(`${shortName(employee(empId).name)}: смена ${newShift}`); closeDrawer(); render(); toast('Смена изменена');}
}
function makeOffFromDrawer(day, empId){
  state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>i.employeeId!==empId);
  state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,status:'off'});
  state.weeks[state.currentWeek].history.push(`${shortName(employee(empId).name)}: выходной ${day}`);
  closeDrawer(); render(); toast('Выходной поставлен');
}
function quickAdd(day){
  const name=prompt('Введите часть имени сотрудника:'); if(!name) return;
  const emp=state.employees.find(e=>e.name.toLowerCase().includes(name.toLowerCase()));
  if(!emp) return toast('Сотрудник не найден');
  state.weeks[state.currentWeek].schedule[day].push({employeeId:emp.id,category:emp.position,shift:emp.defaultShift,status:'work'});
  render(); toast('Добавлено');
}
function setCategory(c){ currentCategory=c; render(); }
function massDayoff(){
  const emps=[...document.querySelectorAll(".offEmp:checked")].map(x=>x.value);
  const days=[...document.querySelectorAll(".offDay:checked")].map(x=>x.value);
  if(!emps.length||!days.length) return toast("Выберите сотрудников и даты");
  days.forEach(day=>emps.forEach(empId=>{
    state.weeks[state.currentWeek].schedule[day] = dayItems(day).filter(i=>i.employeeId!==empId);
    state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,status:"off"});
  }));
  state.weeks[state.currentWeek].history.push(`Поставлены выходные: ${emps.length} сотрудников, ${days.length} дат`);
  render(); toast("Выходные поставлены");
}
function setNeed(cat,sh,val){ state.weeks[state.currentWeek].staffing[cat][sh]=Number(val); render(); }
function addEmployee(){
  const name=document.getElementById("newName").value.trim(); const position=document.getElementById("newPos").value; const defaultShift=document.getElementById("newShift").value;
  if(!name) return toast("Введите ФИО");
  state.employees.push({id:"e"+Date.now(),name,position,defaultShift,skills:[position],universal:false,active:true});
  render(); toast("Сотрудник добавлен");
}
function removeEmployee(id){ if(confirm("Удалить сотрудника?")){ state.employees = state.employees.filter(e=>e.id!==id); render(); } }
function editAssignment(day, empId, category, shift){
  const newShift = prompt("Смена:", shift); if(!newShift || !shiftTemplates[newShift]) return;
  const item = dayItems(day).find(i=>i.employeeId===empId && i.category===category && i.shift===shift);
  if(item){ item.shift=newShift; state.weeks[state.currentWeek].history.push(`${shortName(employee(empId).name)}: смена изменена на ${newShift}`); render(); }
}
function dragEmp(e, day, empId, category, shift){ e.dataTransfer.setData("text/plain", JSON.stringify({day,empId,category,shift})); }
function dropEmp(e, day, sh){
  const data=JSON.parse(e.dataTransfer.getData("text/plain"));
  const item=dayItems(data.day).find(i=>i.employeeId===data.empId && i.category===data.category && i.shift===data.shift);
  if(item){ item.shift = Object.keys(shiftTemplates).find(s=>coversShift({shift:s},sh)>=1) || item.shift; item.status='changed'; state.weeks[state.currentWeek].history.push(`Перемещение ${shortName(employee(data.empId).name)}`); render(); }
}
function createNextWeek(){
  const s=new Date(state.currentWeek); s.setDate(s.getDate()+7); const key=dateKey(s);
  if(!state.weeks[key]) createWeek(key,state.currentWeek);
  state.currentWeek=key; render();
}
function prevWeek(){ const s=new Date(state.currentWeek); s.setDate(s.getDate()-7); const key=dateKey(s); if(!state.weeks[key]) createWeek(key); state.currentWeek=key; render(); }
function exportExcel(){
  const days = getWeekDays(state.currentWeek);
  const dayKeys = days.map(dateKey);

  function timeSortValue(time){
    return shiftTemplates[time]?.start ?? 99;
  }

  function getWorkForCategory(emp, day, cat){
    return dayItems(day).filter(i =>
      i.employeeId === emp.id &&
      i.status === "work" &&
      i.category === cat
    );
  }

  function hasAssignmentInCategory(emp, cat){
    return dayKeys.some(day =>
      dayItems(day).some(i =>
        i.employeeId === emp.id &&
        i.status === "work" &&
        i.category === cat
      )
    );
  }

  function cellFor(emp, day, cat){
    const items = dayItems(day).filter(i => i.employeeId === emp.id);
    const off = items.find(i => i.status === "off");

    if(off) return `<td class="off"></td>`;

    const works = getWorkForCategory(emp, day, cat);

    if(!works.length) return `<td></td>`;

    const changed = works.some(i =>
      i.status === "changed" ||
      i.category !== emp.position ||
      i.shift !== emp.defaultShift
    );

    return `
      <td class="${changed ? "changed" : ""}">
        ${shortName(emp.name)}
      </td>
    `;
  }

  function rowTime(emp, cat){
    const assigned = dayKeys
      .flatMap(day => getWorkForCategory(emp, day, cat))
      .find(i => i.shift);

    return assigned?.shift || emp.defaultShift;
  }

  function tableBlock(cat){
    const rows = state.employees
      .filter(emp =>
        emp.active &&
        (
          emp.position === cat ||
          hasAssignmentInCategory(emp, cat)
        )
      )
      .sort((a,b) => {
        const t = timeSortValue(rowTime(a, cat)) - timeSortValue(rowTime(b, cat));
        if(t !== 0) return t;
        return a.name.localeCompare(b.name, "ru");
      });

    return `
      <table>
        <tr class="titleRow">
          <td colspan="10">Филиал Сергели — ${cat}</td>
        </tr>

        <tr class="dates">
          <th>Должность</th>
          <th>Время</th>
          <th>ФИО</th>
          ${days.map(d => `<th>${formatDate(d)}</th>`).join("")}
        </tr>

        <tr class="dates">
          <th></th>
          <th></th>
          <th></th>
          ${daysShort.map(d => `<th>${d}</th>`).join("")}
        </tr>

        ${rows.map(emp => `
          <tr>
            <td class="position">${cat}</td>
            <td class="time">${rowTime(emp, cat)}</td>
            <td class="name">${shortName(emp.name)}</td>
            ${dayKeys.map(day => cellFor(emp, day, cat)).join("")}
          </tr>
        `).join("")}
      </table>
      <br>
    `;
  }

  let html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: "Times New Roman", serif; }

        table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 24px;
          page-break-after: always;
        }

        th, td {
          border: 1px solid #333;
          text-align: center;
          vertical-align: middle;
          height: 28px;
          font-size: 12px;
          padding: 4px;
        }

        .titleRow td {
          height: 46px;
          font-size: 18px;
          font-weight: bold;
          background: #ffffff;
        }

        .dates th {
          background: #92d050;
          font-weight: bold;
        }

        .position {
          background: #92d050;
          font-weight: bold;
          width: 120px;
        }

        .time {
          background: #e2f0d9;
          font-weight: bold;
          width: 95px;
        }

        .name {
          width: 170px;
          font-weight: bold;
        }

        .off {
          background: #ff0000;
          color: #ff0000;
        }

        .changed {
          background: #ffff00;
          color: #000000;
          font-weight: bold;
        }
      </style>
    </head>

    <body>
      <h2 style="text-align:center;">График ${weekLabel(state.currentWeek)}</h2>
      <p style="text-align:right;font-weight:bold;">Аюпов А __________</p>
  `;

  editableCategories.forEach(cat => {
    html += tableBlock(cat);
  });

  html += `</body></html>`;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `grafik_print_${weekLabel(state.currentWeek)}.xls`;
  link.click();
}
function toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2500); }

function selectFilteredEmployeesForDayoff(){
  document.querySelectorAll(".offEmp").forEach(x => x.checked = true);
}

function clearDayoffEmployeeSelection(){
  document.querySelectorAll(".offEmp").forEach(x => x.checked = false);
}
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>{currentPage=n.dataset.page; render();});
document.getElementById("roleSelect").value=state.role;
document.getElementById("roleSelect").onchange=e=>{state.role=e.target.value; render();};
document.getElementById("weekSelect").onchange=e=>{state.currentWeek=e.target.value; render();};
document.getElementById("nextWeekBtn").onclick=createNextWeek;
document.getElementById("prevWeekBtn").onclick=prevWeek;
document.getElementById("excelBtn").onclick=exportExcel;
render();
