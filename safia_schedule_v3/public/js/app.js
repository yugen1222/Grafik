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
let currentPage = "dashboard";
let currentCategory = "Общий";
let staffFilter = { category: "Все", shift: "Все", day: "Все" };

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
  document.getElementById("pageTitle").textContent = ({dashboard:"Главная",schedule:"График",dayoffs:"Выходные",employees:"Сотрудники",staffing:"Штатка",history:"История"})[currentPage];
  document.getElementById("weekTitle").textContent = `Неделя ${weekLabel(state.currentWeek)}`;
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

function renderDashboard(){
  const p=problems();
  const low=p.filter(x=>x.diff<0).length, high=p.filter(x=>x.diff>0).length;
  document.getElementById("dashboard").innerHTML = `
    <div class="grid grid3">
      <div class="stat"><div class="muted">Проблемы</div><strong>${p.length}</strong></div>
      <div class="stat"><div class="muted">Не хватает</div><strong>${low}</strong></div>
      <div class="stat"><div class="muted">Лишние</div><strong>${high}</strong></div>
    </div>
    <div class="card"><h3>Самое важное</h3>${p.slice(0,12).map(x=>`<p><span class="badge ${statusClass(x.diff)}">${statusText(x.diff)}</span> ${x.day} / ${x.cat} / ${x.sh}: нужно ${x.n}, стоит ${x.a}</p>`).join("") || "<p>Всё закрыто ✅</p>"}</div>
  `;
}

function renderSchedule(){
  const days = getWeekDays(state.currentWeek);
  document.getElementById("schedule").innerHTML = `
    <div class="tabs">${categories.map(c=>`<button class="tab ${c===currentCategory?'active':''}" onclick="setCategory('${c}')">${c}</button>`).join("")}</div>
    <div class="scheduleBoard">${days.map((d,i)=>renderDayColumn(dateKey(d), daysShort[i], formatDate(d))).join("")}</div>
  `;
}
function renderDayColumn(day, label, display){
  const shifts = Object.keys(staffingBlocks).map(sh=>renderShift(day, sh)).join("");
  return `<div class="dayCol"><div class="dayHead"><b>${label}</b><span>${display}</span></div>${shifts}<div class="shiftBlock"><div class="shiftTitle">Выходные</div>${renderOff(day)}</div></div>`;
}
function renderShift(day, sh){
  const cats = currentCategory==="Общий" ? editableCategories : [currentCategory];
  let html="";
  cats.forEach(cat=>{
    const actual=coverage(day,cat,sh), n=need(cat,sh), diff=actual-n;
    const items=dayItems(day).filter(i=>i.status==="work" && i.category===cat && coversShift(i,sh)>0);
    html += `<div class="shiftTitle"><span>${cat} · ${sh}</span><span class="badge ${statusClass(diff)}">${actual}/${n}</span></div>`;
    html += items.map(i=>`<div class="empCard" draggable="true" ondragstart="dragEmp(event,'${day}','${i.employeeId}','${i.category}','${i.shift}')" onclick="editAssignment('${day}','${i.employeeId}','${i.category}','${i.shift}')"><b>${shortName(employee(i.employeeId)?.name)}</b><small>${i.shift} · покрывает ${coversShift(i,sh)}ч</small></div>`).join("") || `<div class="muted">Пусто</div>`;
  });
  return `<div class="shiftBlock" ondragover="event.preventDefault()" ondrop="dropEmp(event,'${day}','${sh}')">${html}</div>`;
}
function renderOff(day){
  return dayItems(day).filter(i=>i.status==="off").map(i=>`<div class="empCard dayoffCard"><b>${shortName(employee(i.employeeId)?.name)}</b><small>Выходной</small></div>`).join("") || `<div class="muted">Нет</div>`;
}
function shortName(name=""){ return name.split(" ").slice(0,2).join(" "); }

function renderDayoffs(){
  const days = getWeekDays(state.currentWeek);
  document.getElementById("dayoffs").innerHTML = `<div class="card"><h3>Поставить выходной</h3><div class="grid grid2"><div><b>Сотрудники</b><div class="checks">${state.employees.filter(e=>e.active).map(e=>`<label><input type="checkbox" class="offEmp" value="${e.id}"> ${shortName(e.name)} <span class="muted">${e.position}</span></label>`).join("")}</div></div><div><b>Даты</b><div class="checks">${days.map((d,i)=>`<label><input type="checkbox" class="offDay" value="${dateKey(d)}"> ${daysShort[i]} ${formatDate(d)}</label>`).join("")}</div></div></div><br><button onclick="massDayoff()">Поставить выходной</button></div>`;
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
  if(item){ item.shift = Object.keys(shiftTemplates).find(s=>coversShift({shift:s},sh)>=1) || item.shift; state.weeks[state.currentWeek].history.push(`Перемещение ${shortName(employee(data.empId).name)}`); render(); }
}
function createNextWeek(){
  const s=new Date(state.currentWeek); s.setDate(s.getDate()+7); const key=dateKey(s);
  if(!state.weeks[key]) createWeek(key,state.currentWeek);
  state.currentWeek=key; render();
}
function prevWeek(){ const s=new Date(state.currentWeek); s.setDate(s.getDate()-7); const key=dateKey(s); if(!state.weeks[key]) createWeek(key); state.currentWeek=key; render(); }
function exportExcel(){
  const rows=[["Дата","День","Категория","ФИО","Смена","Статус"]];
  getWeekDays(state.currentWeek).forEach((d,i)=> dayItems(dateKey(d)).forEach(it=> rows.push([dateKey(d),daysShort[i],it.category||"",employee(it.employeeId)?.name||"",it.shift||"",it.status==="off"?"Выходной":"Работает"])));
  const wb=XLSX.utils.book_new(); const ws=XLSX.utils.aoa_to_sheet(rows); XLSX.utils.book_append_sheet(wb,ws,"График"); XLSX.writeFile(wb,`grafik_${weekLabel(state.currentWeek)}.xlsx`);
}
function toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2500); }

document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>{currentPage=n.dataset.page; render();});
document.getElementById("roleSelect").value=state.role;
document.getElementById("roleSelect").onchange=e=>{state.role=e.target.value; render();};
document.getElementById("weekSelect").onchange=e=>{state.currentWeek=e.target.value; render();};
document.getElementById("nextWeekBtn").onclick=createNextWeek;
document.getElementById("prevWeekBtn").onclick=prevWeek;
document.getElementById("excelBtn").onclick=exportExcel;
render();
