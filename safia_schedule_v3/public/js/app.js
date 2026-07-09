function shortName(fullName) {
  if (!fullName) return "";
  const parts = String(fullName).trim().split(/\s+/);
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
const serviceRatedCategories = ["Продавец", "Официант"];
const daysShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const STORAGE_KEY = "safiaScheduleV6";
const OLD_STORAGE_KEYS = ["safiaScheduleV5", "safiaScheduleV4", "safiaScheduleV3"];

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
GAPPAROV MUHAMMADRIZO SHARIF O'G'LI|Менеджер|08:00-16:00
IBODULLAYEV YODGOR OZOD O'G'LI|Менеджер|16:00-00:00
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
let dayoffFilter = { search: "", category: "Все", shift: "Все" };
let isRemoteUpdate = false;
let firebaseStarted = false;
let isRendering = false;

function parseEmployees() {
  return defaultEmployees.split("\n").map((line, index) => {
    const [name, position, shift] = line.split("|");
    return {
      id: `e${index + 1}`,
      name,
      position,
      defaultShift: shift,
      skills: [position],
      universal: false,
      active: true,
      serviceScore: serviceRatedCategories.includes(position) ? 50 : null
    };
  });
}

function weekStart(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0,0,0,0);
  return d;
}
function dateKey(d){
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(key, count){
  const d = new Date(key);
  d.setDate(d.getDate() + count);
  return dateKey(d);
}
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
      schedule[day] = (state.weeks[copyFromKey].schedule[oldDays[i]] || []).map(x => ({ ...x, day }));
    });
  } else {
    days.forEach(day => {
      state.employees.filter(e=>e.active).forEach(e => schedule[day].push({
        employeeId:e.id,
        category:e.position,
        shift:e.defaultShift,
        status:"work"
      }));
    });
  }

  const staffing = {};
  days.forEach(day => staffing[day] = blankStaffing());
  state.weeks[startKey] = { startKey, staffing, schedule, history: [`Создана неделя ${weekLabel(startKey)}`] };
}

function migrateState(s){
  if(!s || typeof s !== "object") return null;
  s.employees = Array.isArray(s.employees) ? s.employees : parseEmployees();
  s.weeks = s.weeks || {};
  s.role = s.role || "admin";
  s.currentWeek = s.currentWeek || dateKey(weekStart(new Date()));

  s.employees.forEach((e, idx) => {
    e.id = e.id || `e${idx+1}`;
    e.name = e.name || "Без имени";
    e.position = e.position || "Продавец";
    e.defaultShift = e.defaultShift || "08:00-16:00";
    e.skills = Array.isArray(e.skills) ? Array.from(new Set(e.skills.concat([e.position]))) : [e.position];
    e.universal = Boolean(e.universal);
    e.active = e.active !== false;
    if(serviceRatedCategories.includes(e.position)) {
      e.serviceScore = Number.isFinite(Number(e.serviceScore)) ? Number(e.serviceScore) : 50;
    } else {
      e.serviceScore = null;
    }
  });

  Object.keys(s.weeks).forEach(weekKey => {
    const week = s.weeks[weekKey];
    const days = getWeekDays(weekKey).map(dateKey);
    week.schedule = week.schedule || {};
    days.forEach(day => {
      week.schedule[day] = Array.isArray(week.schedule[day]) ? week.schedule[day] : [];
      week.schedule[day] = week.schedule[day].map(item => ({
        employeeId: item.employeeId,
        category: item.category || employee(item.employeeId)?.position || "Продавец",
        shift: item.shift || employee(item.employeeId)?.defaultShift || "08:00-16:00",
        status: item.status === "off" ? "off" : (item.status === "changed" ? "changed" : "work"),
        bySkill: Boolean(item.bySkill)
      }));
    });

    const oldStaffing = week.staffing || {};
    const looksDaily = days.some(day => oldStaffing[day]);
    if(!looksDaily){
      const daily = {};
      days.forEach(day => daily[day] = JSON.parse(JSON.stringify(Object.keys(oldStaffing).length ? oldStaffing : blankStaffing())));
      week.staffing = daily;
    } else {
      days.forEach(day => week.staffing[day] = week.staffing[day] || blankStaffing());
    }
    week.history = Array.isArray(week.history) ? week.history : [];
  });
  return s;
}

function loadState(){
  const keys = [STORAGE_KEY, ...OLD_STORAGE_KEYS];
  for(const key of keys){
    const saved = localStorage.getItem(key);
    if(saved){
      try {
        const migrated = migrateState(JSON.parse(saved));
        if(migrated) return migrated;
      } catch (e) {
        console.warn("Bad saved state", key, e);
      }
    }
  }
  const start = dateKey(weekStart(new Date()));
  const s = { employees: parseEmployees(), weeks: {}, currentWeek: start, role:"admin" };
  window.state = s;
  return s;
}

function fixOldSundayWeeks(){
  if(state.__fixedMondayWeeks) return;

  const newWeeks = {};

  Object.keys(state.weeks || {}).forEach(oldKey => {
    const oldWeek = state.weeks[oldKey];
    const oldDate = new Date(oldKey);
    const isSundayStart = oldDate.getDay() === 0;

    const newStartKey = isSundayStart ? addDays(oldKey, 1) : oldKey;

    if(!newWeeks[newStartKey]){
      const days = getWeekDays(newStartKey).map(dateKey);
      const schedule = {};
      const staffing = {};

      days.forEach(day => {
        schedule[day] = [];
        staffing[day] = blankStaffing();
      });

      newWeeks[newStartKey] = {
        ...oldWeek,
        startKey: newStartKey,
        schedule,
        staffing,
        history: oldWeek.history || []
      };
    }

    Object.keys(oldWeek.schedule || {}).forEach(day => {
      const newDay = isSundayStart ? addDays(day, 1) : day;
      if(!newWeeks[newStartKey].schedule[newDay]){
        newWeeks[newStartKey].schedule[newDay] = [];
      }
      newWeeks[newStartKey].schedule[newDay] = oldWeek.schedule[day];
    });

    Object.keys(oldWeek.staffing || {}).forEach(day => {
      const newDay = isSundayStart ? addDays(day, 1) : day;
      newWeeks[newStartKey].staffing[newDay] = oldWeek.staffing[day];
    });
  });

  if(new Date(state.currentWeek).getDay() === 0){
    state.currentWeek = addDays(state.currentWeek, 1);
  }

  state.weeks = newWeeks;
  state.__fixedMondayWeeks = true;
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if(window.db && window.SAFIA_PATH && firebaseStarted && !isRemoteUpdate && !isRendering){
    window.db.ref(window.SAFIA_PATH).set({
      state,
      updatedAt: Date.now(),
      updatedBy: window.CLIENT_ID || "local"
    }).catch(err => console.error("Firebase save error", err));
  }
}

function startFirebaseSync(){
  if(firebaseStarted || !window.db || !window.SAFIA_PATH) return;
  const databaseRef = window.db.ref(window.SAFIA_PATH);
  databaseRef.on("value", snapshot => {
    const data = snapshot.val();
    if(!data || !data.state){
      firebaseStarted = true;
      saveState();
      return;
    }
    firebaseStarted = true;
    if(data.updatedBy === window.CLIENT_ID) return;
    isRemoteUpdate = true;
    state = migrateState(data.state) || state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    ensureWeek(false);
    render({ save:false });
    isRemoteUpdate = false;
    toast("Данные обновились с другого устройства");
  });
}

function ensureWeek(shouldSave=true){
  if(!state.weeks[state.currentWeek]) createWeek(state.currentWeek);
  if(shouldSave) saveState();
}
ensureWeek();



function employee(id){ return state.employees.find(e=>e.id===id); }
function overlap(a,b){ return Math.max(0, Math.min(a.end,b.end)-Math.max(a.start,b.start)); }
function coversShift(item, blockName){
  const tpl = shiftTemplates[item.shift]; const block = staffingBlocks[blockName];
  if(!tpl || !block) return 0;
  return overlap(tpl, block);
}
function itemHours(item){ return shiftTemplates[item.shift]?.hours || 0; }
function isWorkItem(item){ return item && (item.status === "work" || item.status === "changed"); }
function dayItems(day){ return state.weeks[state.currentWeek].schedule[day] || []; }
function isDayOff(day, empId){ return dayItems(day).some(i=>i.employeeId===empId && i.status==="off"); }
function canWorkCategory(emp, category){ return emp && (emp.position === category || emp.universal || (emp.skills || []).includes(category)); }
function removeOffForEmployee(day, empId){
  state.weeks[state.currentWeek].schedule[day] = dayItems(day).filter(i => !(i.employeeId === empId && i.status === "off"));
}
function hasAnyAssignment(day, empId, ignoreItem=null){
  return dayItems(day).some(i => isWorkItem(i) && i.employeeId === empId && (!ignoreItem || i !== ignoreItem));
}
function hasTimeConflict(day, empId, newShift, ignoreItem = null){
  const newTpl = shiftTemplates[newShift];
  if(!newTpl) return false;
  return dayItems(day).some(i => {
    if(!isWorkItem(i)) return false;
    if(i.employeeId !== empId) return false;
    if(ignoreItem && i === ignoreItem) return false;
    const oldTpl = shiftTemplates[i.shift];
    if(!oldTpl) return false;
    return overlap(oldTpl, newTpl) > 0;
  });
}
function totalHoursForEmployee(day, empId, ignoreItem=null){
  return dayItems(day).filter(i => isWorkItem(i) && i.employeeId === empId && (!ignoreItem || i !== ignoreItem)).reduce((sum, i) => sum + itemHours(i), 0);
}
function coverage(day, category, shiftName){
  return dayItems(day).filter(i=>isWorkItem(i) && i.category===category && coversShift(i, shiftName)>0).length;
}
function need(day, category, shiftName){
  return state.weeks[state.currentWeek].staffing?.[day]?.[category]?.[shiftName] ?? 0;
}
function problems(){
  const list=[]; const days=getWeekDays(state.currentWeek).map(dateKey);
  days.forEach(day=>editableCategories.forEach(cat=>Object.keys(staffingBlocks).forEach(sh=>{
    const n=need(day, cat, sh), a=coverage(day,cat,sh), diff=a-n;
    if(diff!==0) list.push({day,cat,sh,n,a,diff});
  })));
  return list;
}

function dayOffSuggestions(day, category, shiftName){
  if(!serviceRatedCategories.includes(category)) return [];
  const items = dayItems(day).filter(i => isWorkItem(i) && i.category === category && coversShift(i, shiftName) > 0);
  return items.map(i => {
    const e = employee(i.employeeId);
    return { emp: e, item: i, score: Number(e?.serviceScore ?? 50) };
  }).sort((a,b) => a.score - b.score);
}

function overstaffMessage(day, category, shiftName){
  const diff = coverage(day, category, shiftName) - need(day, category, shiftName);
  if(diff <= 0) return "";
  const suggestions = dayOffSuggestions(day, category, shiftName).slice(0, diff);
  if(!suggestions.length) return `Превышает штатку: лишние ${diff}.`;
  return `Превышает штатку: лишние ${diff}. Можно дать выходной: ${suggestions.map(s=>`${shortName(s.emp?.name)} (${s.score})`).join(", ")}`;
}

function render(options = {}){
  const shouldSave = options.save !== false;
  isRendering = true;
  state.role = document.getElementById("roleSelect")?.value || state.role;
  document.querySelectorAll(".admin-only").forEach(el=>el.style.display = state.role==="admin" ? "block" : "none");
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const page = document.getElementById(currentPage);
  if(page) page.classList.add("active");
  document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active", n.dataset.page===currentPage));
  const pageTitles = { dashboard:"Помощник", schedule:"График недели", attendance:"Посещаемость", dayoffs:"Выходные", employees:"Сотрудники", staffing:"Штатка", history:"История", skills:"Навыки" };
  const title = document.getElementById("pageTitle");
  if(title) title.textContent = pageTitles[currentPage] || "График недели";
  const weekTitle = document.getElementById("weekTitle");
  if(weekTitle) weekTitle.textContent = `Неделя ${weekLabel(state.currentWeek)}`;
  renderWeekSelect();
  renderDashboard(); renderSchedule(); renderDayoffs(); renderAttendance(); renderEmployees(); renderSkills(); renderStaffing(); renderHistory();
  isRendering = false;
  if(shouldSave) saveState();
}

function renderWeekSelect(){
  const sel=document.getElementById("weekSelect");
  if(!sel) return;
  sel.innerHTML = Object.keys(state.weeks).sort().map(k=>`<option value="${k}" ${k===state.currentWeek?'selected':''}>${weekLabel(k)}</option>`).join("");
}
function statusClass(diff){ return diff<0?"low":diff>0?"high":"ok"; }
function statusText(diff){ return diff<0?`Не хватает ${Math.abs(diff)}`:diff>0?`Лишние ${diff}`:"Норма"; }

function renderDashboard(){
  const el = document.getElementById("dashboard");
  if(!el) return;
  const p = problems();
  const critical = p.filter(x=>x.diff<0).slice(0,8);
  const extra = p.filter(x=>x.diff>0).slice(0,12);
  const suggestions = critical.map(x=>`<div class="infoBox"><b>🔴 ${x.day} · ${x.cat} · ${x.sh}</b><br><span class="muted">Не хватает ${Math.abs(x.diff)}. Проверь сотрудников с подходящим навыком.</span></div>`).join("") || `<div class="infoBox">✅ Критичных нехваток нет</div>`;
  const extraHtml = extra.map(x => {
    const sug = dayOffSuggestions(x.day, x.cat, x.sh).slice(0, x.diff);
    return `<div class="infoBox"><b>🟡 ${x.day} · ${x.cat} · ${x.sh}</b><br><span class="muted">Лишние: ${x.diff}. Нужно ${x.n}, стоит ${x.a}</span>${sug.length ? `<br><b>Можно дать выходной:</b><br>${sug.map(s => `• ${shortName(s.emp?.name)} — рейтинг: ${s.score}`).join("<br>")}` : ""}</div>`;
  }).join("") || "<p>Лишних нет ✅</p>";
  el.innerHTML = `
    <div class="quickStats">
      <div class="stat"><small>Всего проблем</small><b>${p.length}</b></div>
      <div class="stat"><small>Нехватка</small><b>${p.filter(x=>x.diff<0).length}</b></div>
      <div class="stat"><small>Лишние</small><b>${p.filter(x=>x.diff>0).length}</b></div>
      <div class="stat"><small>Неделя</small><b style="font-size:22px">${weekLabel(state.currentWeek)}</b></div>
    </div>
    <div class="card"><h3>✨ Лента рекомендаций</h3><div class="infoGrid">${suggestions}</div></div>
    <div class="card"><h3>Лишние сотрудники</h3><div class="infoGrid">${extraHtml}</div></div>`;
}

function renderSchedule(){
  const el = document.getElementById("schedule");
  if(!el) return;
  const p=problems();
  const low=p.filter(x=>x.diff<0).length, high=p.filter(x=>x.diff>0).length;
  const activePeople = getWeekDays(state.currentWeek).map(dateKey).reduce((sum,day)=>sum+dayItems(day).filter(i=>isWorkItem(i)).length,0);
  el.innerHTML = `
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
    </div>`;
}

function renderDayColumn(day, label, display){
  const cats = currentCategory==="Общий" ? editableCategories : [currentCategory];
  const mini = cats.slice(0,4).map(cat=>{
    const actual = Object.keys(staffingBlocks).reduce((a,sh)=>a+coverage(day,cat,sh),0);
    const needed = Object.keys(staffingBlocks).reduce((a,sh)=>a+need(day, cat, sh),0);
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
    const actual=coverage(day,cat,sh), n=need(day, cat, sh), diff=actual-n;
    const items=dayItems(day).filter(i=>isWorkItem(i) && i.category===cat && coversShift(i,sh)>0);
    html += `<div class="shiftBoxTitle"><span>${cat} · ${sh}</span><span class="badge ${statusClass(diff)}">${actual}/${n}</span></div>`;
    html += items.map(i=>{
      const emp = employee(i.employeeId);
      const full = coversShift(i,sh) >= (staffingBlocks[sh].end-staffingBlocks[sh].start);
      const changedClass = i.status==='changed' || i.bySkill ? 'changed' : '';
      return `<div class="empCard ${changedClass}" draggable="true" ondragstart="dragEmp(event,'${day}','${i.employeeId}','${i.category}','${i.shift}')" onclick="openEmployeeDrawer('${day}','${i.employeeId}','${i.category}','${i.shift}')"><b>${shortName(emp?.name)}</b><div class="empMeta"><span>${i.shift}</span><span class="empSkill">${full?'полная':'часть'} ${coversShift(i,sh)}ч</span></div></div>`;
    }).join("") || `<div class="empty">Пока пусто</div>`;
    const msg = overstaffMessage(day, cat, sh);
    if(msg) html += `<div class="empty warningText">${msg}</div>`;
  });
  return `<div class="shiftBox" ondragover="event.preventDefault()" ondrop="dropEmp(event,'${day}','${sh}')">${html}</div>`;
}
function renderOff(day){
  return dayItems(day).filter(i=>i.status==="off").map(i=>`<div class="empCard dayoffCard" onclick="openEmployeeDrawer('${day}','${i.employeeId}','','')"><b>${shortName(employee(i.employeeId)?.name)}</b><div class="empMeta"><span>Выходной</span><span>🏖</span></div></div>`).join("") || `<div class="empty">Нет выходных</div>`;
}

function renderDayoffs(){
  const el = document.getElementById("dayoffs");
  if(!el) return;
  const days = getWeekDays(state.currentWeek);
  const filteredEmployees = state.employees.filter(e => {
    if(!e.active) return false;
    const searchOk = e.name.toLowerCase().includes(dayoffFilter.search.toLowerCase());
    const categoryOk = dayoffFilter.category === "Все" || e.position === dayoffFilter.category;
    const shiftOk = dayoffFilter.shift === "Все" || e.defaultShift === dayoffFilter.shift;
    return searchOk && categoryOk && shiftOk;
  });
  el.innerHTML = `
    <div class="card"><h3>Фильтр выходных</h3>
      <div class="filters">
        <input placeholder="Поиск сотрудника" value="${dayoffFilter.search}" oninput="dayoffFilter.search=this.value;render()">
        <select onchange="dayoffFilter.category=this.value;render()"><option>Все</option>${editableCategories.map(c=>`<option ${dayoffFilter.category===c?'selected':''}>${c}</option>`).join("")}</select>
        <select onchange="dayoffFilter.shift=this.value;render()"><option>Все</option>${Object.keys(shiftTemplates).map(sh=>`<option ${dayoffFilter.shift===sh?'selected':''}>${sh}</option>`).join("")}</select>
        <button class="secondary" onclick="selectFilteredDayoffEmployees()">Выбрать всех</button>
        <button class="secondary" onclick="clearDayoffFilters()">Сбросить</button>
      </div>
    </div>
    <div class="card"><h3>Поставить выходной</h3>
      <div class="grid grid2"><div><b>Сотрудники (${filteredEmployees.length})</b><div class="checks">${filteredEmployees.map(e=>`<label><input type="checkbox" class="offEmp" value="${e.id}"> ${shortName(e.name)} <span class="muted">${e.position} · ${e.defaultShift}${serviceRatedCategories.includes(e.position) ? ` · рейтинг ${e.serviceScore}` : ""}</span></label>`).join("")}</div></div><div><b>Даты</b><div class="checks">${days.map((d,i)=>`<label><input type="checkbox" class="offDay" value="${dateKey(d)}"> ${daysShort[i]} ${formatDate(d)}</label>`).join("")}</div></div></div><br><button onclick="massDayoff()">Поставить выходной</button></div>`;
}
function selectFilteredDayoffEmployees(){ document.querySelectorAll(".offEmp").forEach(ch=>ch.checked=true); }
function clearDayoffFilters(){ dayoffFilter = { search:"", category:"Все", shift:"Все" }; render(); }

function renderEmployees(){
  const el = document.getElementById("employees");
  if(!el) return;
  el.innerHTML = `<div class="card"><h3>Добавить сотрудника</h3><div class="filters"><input id="newName" placeholder="ФИО"><select id="newPos">${editableCategories.map(c=>`<option>${c}</option>`)}</select><select id="newShift">${Object.keys(shiftTemplates).map(s=>`<option>${s}</option>`)}</select><button onclick="addEmployee()">Добавить</button></div></div><div class="list">${state.employees.map(e=>`<div class="employeeRow"><b>${e.name}</b><span>${e.position}</span><span>${e.defaultShift}</span><span>${(e.skills||[]).map(s=>`<i class="pill">${s}</i>`).join("")}</span>${serviceRatedCategories.includes(e.position) ? `<span>Рейтинг: <input type="number" min="0" max="100" value="${e.serviceScore ?? 50}" onchange="setServiceScore('${e.id}', this.value)" style="width:70px"></span>` : `<span></span>`}<button class="danger" onclick="removeEmployee('${e.id}')">Удалить</button></div>`).join("")}</div>`;
}
function renderSkills(){
  const target = document.getElementById("skills");
  if(!target) return;
  target.innerHTML = `<div class="card"><h3>Навыки и универсальность</h3><p class="muted">Навык не добавляет сотрудника в категорию автоматически. Он только разрешает поставить его туда как замену — тогда карточка и Excel будут жёлтыми.</p><div class="list">${state.employees.map(e=>`<div class="employeeRow"><b>${shortName(e.name)}</b><span>${e.position}</span><span>${e.defaultShift}</span><span>${editableCategories.map(skill=>`<label class="pill"><input type="checkbox" ${e.skills.includes(skill)?'checked':''} onchange="toggleSkill('${e.id}','${skill}',this.checked)"> ${skill}</label>`).join("")}</span><label class="pill"><input type="checkbox" ${e.universal?'checked':''} onchange="toggleUniversal('${e.id}',this.checked)"> Универсал</label></div>`).join("")}</div></div>`;
}
function toggleSkill(empId, skill, checked){
  const e = employee(empId); if(!e) return;
  e.skills = e.skills || [];
  if(checked && !e.skills.includes(skill)) e.skills.push(skill);
  if(!checked) e.skills = e.skills.filter(s=>s!==skill);
  render(); toast("Навык сохранён");
}
function toggleUniversal(empId, checked){
  const e = employee(empId); if(!e) return;
  e.universal = checked; render(); toast("Универсальность сохранена");
}
function setServiceScore(empId, val){
  const e = employee(empId); if(!e || !serviceRatedCategories.includes(e.position)) return;
  e.serviceScore = Math.max(0, Math.min(100, Number(val) || 0));
  render(); toast("Рейтинг сохранён");
}

function renderStaffing(){
  const el = document.getElementById("staffing");
  if(!el) return;
  const days = getWeekDays(state.currentWeek).map(dateKey);
  const rows=[];
  days.forEach(day=>editableCategories.forEach(cat=>Object.keys(staffingBlocks).forEach(sh=>{
    if((staffFilter.category==="Все"||staffFilter.category===cat)&&(staffFilter.shift==="Все"||staffFilter.shift===sh)&&(staffFilter.day==="Все"||staffFilter.day===day)){
      const n=need(day, cat, sh), a=coverage(day,cat,sh), diff=a-n;
      rows.push(`<tr><td>${day}</td><td>${cat}</td><td>${sh}</td><td><input type="number" value="${n}" min="0" onchange="setNeed('${day}','${cat}','${sh}',this.value)"></td><td>${a}</td><td><span class="badge ${statusClass(diff)}">${statusText(diff)}</span></td></tr>`);
    }
  })));
  el.innerHTML = `<div class="card"><h3>Фильтр штатки</h3><div class="filters"><select onchange="staffFilter.category=this.value;render()"><option>Все</option>${editableCategories.map(c=>`<option ${staffFilter.category===c?'selected':''}>${c}</option>`).join("")}</select><select onchange="staffFilter.shift=this.value;render()"><option>Все</option>${Object.keys(staffingBlocks).map(s=>`<option ${staffFilter.shift===s?'selected':''}>${s}</option>`).join("")}</select><select onchange="staffFilter.day=this.value;render()"><option>Все</option>${days.map(d=>`<option ${staffFilter.day===d?'selected':''} value="${d}">${d}</option>`).join("")}</select></div></div><div class="card"><table class="table"><thead><tr><th>Дата</th><th>Категория</th><th>Смена</th><th>Нужно</th><th>Стоит</th><th>Статус</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

function ensureAttendance(){
  const week = state.weeks[state.currentWeek];
  if(!week.attendance) week.attendance = {};
}

function attendanceKey(day, empId, shift, category){
  return `${day}_${empId}_${shift}_${category}`;
}

function setAttendance(day, empId, shift, category, status){
  ensureAttendance();

  const key = attendanceKey(day, empId, shift, category);

  state.weeks[state.currentWeek].attendance[key] = {
    day,
    empId,
    shift,
    category,
    status,
    updatedAt: new Date().toISOString()
  };

  state.weeks[state.currentWeek].history.push(
    `${shortName(employee(empId)?.name)}: посещаемость — ${status}`
  );

  render();
  toast("Посещаемость сохранена");
}

function replaceAbsent(day, empId, shift, category){
  const search = prompt("Введите имя сотрудника на замену:");
  if(!search) return;

  const found = state.employees.filter(e =>
    e.active &&
    e.name.toLowerCase().includes(search.toLowerCase()) &&
    canWorkCategory(e, category)
  );

  if(!found.length) return toast("Подходящий сотрудник не найден");

  let text = "Кого поставить на замену?\n\n";
  found.slice(0,10).forEach((e,i)=>{
    text += `${i+1}. ${shortName(e.name)} — ${e.position} — ${e.defaultShift}\n`;
  });

  const num = Number(prompt(text));
  const repl = found[num - 1];

  if(!repl) return toast("Неверный выбор");

  if(hasTimeConflict(day, repl.id, shift)){
    return toast("Этот сотрудник уже работает в это время");
  }

  setAttendance(day, empId, shift, category, "Не вышел");

  removeOffForEmployee(day, repl.id);

  state.weeks[state.currentWeek].schedule[day].push({
    employeeId: repl.id,
    category,
    shift,
    status: "changed",
    replacementFor: empId
  });

  state.weeks[state.currentWeek].history.push(
    `${shortName(repl.name)} заменил ${shortName(employee(empId)?.name)}`
  );

  render();
  toast("Замена поставлена");
}

function renderAttendance(){
  const target = document.getElementById("attendance");
  if(!target) return;

  ensureAttendance();

  const today = dateKey(new Date());
  const days = getWeekDays(state.currentWeek).map(dateKey);
  const selectedDay = days.includes(today) ? today : days[0];

  const items = dayItems(selectedDay).filter(i => isWorkItem(i));

  const rows = items.map(i => {
    const emp = employee(i.employeeId);
    const key = attendanceKey(selectedDay, i.employeeId, i.shift, i.category);
    const att = state.weeks[state.currentWeek].attendance[key];
    const status = att?.status || "Не отмечено";

    return `
      <tr>
        <td>${shortName(emp?.name)}</td>
        <td>${i.category}</td>
        <td>${i.shift}</td>
        <td><span class="badge ${status === "Вышел" ? "ok" : status === "Не вышел" ? "low" : status === "Ушёл раньше" ? "high" : ""}">${status}</span></td>
        <td>
          <button onclick="setAttendance('${selectedDay}','${i.employeeId}','${i.shift}','${i.category}','Вышел')">✅ Вышел</button>
          <button class="secondary" onclick="setAttendance('${selectedDay}','${i.employeeId}','${i.shift}','${i.category}','Ушёл раньше')">🟡 Ушёл раньше</button>
          <button class="danger" onclick="replaceAbsent('${selectedDay}','${i.employeeId}','${i.shift}','${i.category}')">❌ Не вышел / заменить</button>
        </td>
      </tr>
    `;
  }).join("");

  const report = weeklyAttendanceReport();

  target.innerHTML = `
    <div class="card">
      <h3>Посещаемость за сегодня</h3>
      <p class="muted">Показывает сотрудников, которые должны работать сегодня.</p>

      <table class="table">
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Категория</th>
            <th>Смена</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="5">На сегодня смен нет</td></tr>`}</tbody>
      </table>
    </div>

    <div class="card">
      <h3>Отчёт за неделю</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Вышел</th>
            <th>Не вышел</th>
            <th>Ушёл раньше</th>
            <th>Замены</th>
          </tr>
        </thead>
        <tbody>${report}</tbody>
      </table>
    </div>
  `;
}

function weeklyAttendanceReport(){
  ensureAttendance();

  const stats = {};

  Object.values(state.weeks[state.currentWeek].attendance || {}).forEach(a => {
    const emp = employee(a.empId);
    if(!emp) return;

    if(!stats[a.empId]){
      stats[a.empId] = {
        name: shortName(emp.name),
        came: 0,
        absent: 0,
        early: 0,
        replace: 0
      };
    }

    if(a.status === "Вышел") stats[a.empId].came++;
    if(a.status === "Не вышел") stats[a.empId].absent++;
    if(a.status === "Ушёл раньше") stats[a.empId].early++;
  });

  getWeekDays(state.currentWeek).map(dateKey).forEach(day => {
    dayItems(day).forEach(i => {
      if(i.replacementFor){
        if(!stats[i.employeeId]){
          const emp = employee(i.employeeId);
          stats[i.employeeId] = {
            name: shortName(emp?.name),
            came: 0,
            absent: 0,
            early: 0,
            replace: 0
          };
        }
        stats[i.employeeId].replace++;
      }
    });
  });

  return Object.values(stats).map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.came}</td>
      <td>${s.absent}</td>
      <td>${s.early}</td>
      <td>${s.replace}</td>
    </tr>
  `).join("") || `<tr><td colspan="5">Пока данных нет</td></tr>`;
}

function renderHistory(){
  const el = document.getElementById("history");
  if(!el) return;
  const week=state.weeks[state.currentWeek];
  el.innerHTML = `<div class="card"><h3>История недели</h3>${week.history.map(h=>`<p>${h}</p>`).join("")}</div>`;
}

function openEmployeeDrawer(day, empId, category='', shift=''){
  const emp = employee(empId);
  if(!emp) return;
  const items = dayItems(day).filter(i=>i.employeeId===empId);
  const hours = items.filter(i=>isWorkItem(i)).reduce((a,i)=>a+itemHours(i),0);
  const allowedCategories = editableCategories.filter(c => canWorkCategory(emp, c));
  const drawer=document.getElementById('drawer');
  if(!drawer) return;
  drawer.innerHTML = `
    <div class="drawerHead"><div><h2>${shortName(emp.name)}</h2><div class="muted">${emp.position} · ${emp.defaultShift}</div></div><button class="drawerClose" onclick="closeDrawer()">✕</button></div>
    <div class="infoGrid">
      <div class="infoBox"><b>Дата</b><br>${day}</div>
      <div class="infoBox"><b>Часы за день</b><br>${hours} / 17</div>
      <div class="infoBox"><b>Навыки</b><br>${(emp.skills||[]).map(s=>`<i class="pill">${s}</i>`).join('') || 'Нет'}${emp.universal ? '<br><i class="pill">Универсал</i>' : ''}</div>
      ${serviceRatedCategories.includes(emp.position) ? `<div class="infoBox"><b>Рейтинг сервиса</b><br><input type="number" min="0" max="100" value="${emp.serviceScore ?? 50}" onchange="setServiceScore('${emp.id}', this.value)"></div>` : ""}
      <div class="infoBox"><b>Действия</b><br><br>
        <label>Категория</label>
        <select id="drawerCategory">${allowedCategories.map(c=>`<option ${c===category?'selected':''}>${c}</option>`).join('')}</select><br><br>
        <label>Смена</label>
        <select id="drawerShift">${Object.keys(shiftTemplates).map(s=>`<option ${s===shift?'selected':''}>${s}</option>`).join('')}</select><br><br>
        <button onclick="changeFromDrawer('${day}','${empId}','${category}','${shift}')">Изменить</button>
        <button class="secondary" onclick="makeOffFromDrawer('${day}','${empId}')">Поставить выходной</button>
        <button class="danger" onclick="removeAssignment('${day}','${empId}','${category}','${shift}')">Удалить это назначение</button>
      </div>
    </div>`;
  drawer.classList.add('open');
}
function closeDrawer(){ const d=document.getElementById('drawer'); if(d) d.classList.remove('open'); }
function changeFromDrawer(day, empId, category, oldShift){
  const emp = employee(empId);
  const newShift=document.getElementById('drawerShift').value;
  const newCategory=document.getElementById('drawerCategory').value;
  if(!canWorkCategory(emp, newCategory)) return toast("У сотрудника нет такого навыка");
  const item=dayItems(day).find(i=>i.employeeId===empId && i.category===category && i.shift===oldShift && isWorkItem(i)) || dayItems(day).find(i=>i.employeeId===empId && isWorkItem(i));
  if(!item) return toast("Назначение не найдено");
  if(hasTimeConflict(day, empId, newShift, item)) return toast("Нельзя: сотрудник уже работает в это время");
  const futureHours = totalHoursForEmployee(day, empId, item) + (shiftTemplates[newShift]?.hours || 0);
  if(futureHours > 17) return toast(`Нельзя: получится ${futureHours} часов. Максимум 17.`);
  item.shift=newShift;
  item.category=newCategory;
  item.bySkill = newCategory !== emp.position;
  item.status = (newShift !== emp.defaultShift || newCategory !== emp.position) ? 'changed' : 'work';
  removeOffForEmployee(day, empId);
  state.weeks[state.currentWeek].history.push(`${shortName(emp.name)}: изменено на ${newCategory}, ${newShift}`);
  closeDrawer(); render(); toast('Изменение сохранено');
  const msg = overstaffMessage(day, newCategory, Object.keys(staffingBlocks).find(sh => coversShift(item, sh) > 0) || "1 смена");
  if(msg) toast(msg);
}
function makeOffFromDrawer(day, empId){
  state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>i.employeeId!==empId);
  state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,status:'off'});
  state.weeks[state.currentWeek].history.push(`${shortName(employee(empId).name)}: выходной ${day}`);
  closeDrawer(); render(); toast('Выходной поставлен');
}
function quickAdd(day){
  const text = prompt("Введите часть имени сотрудника:");
  if(!text) return;
  const found = state.employees.filter(e => e.active && e.name.toLowerCase().includes(text.toLowerCase()));
  if(!found.length) return toast("Сотрудник не найден");
  let message = "Найдены сотрудники:\n\n";
  found.slice(0,10).forEach((e,i)=>{ message += `${i+1}. ${shortName(e.name)} — ${e.position} — ${e.defaultShift}\n`; });
  const num = Number(prompt(message + "\nВведите номер сотрудника:"));
  const emp = found[num - 1];
  if(!emp) return toast("Неверный выбор");
  const category = prompt(`Категория для ${shortName(emp.name)}:`, emp.position) || emp.position;
  if(!editableCategories.includes(category)) return toast("Такой категории нет");
  if(!canWorkCategory(emp, category)) return toast("У сотрудника нет такого навыка");
  const shift = prompt(`Смена для ${shortName(emp.name)}:`, emp.defaultShift) || emp.defaultShift;
  if(!shiftTemplates[shift]) return toast("Такой смены нет");
  if(hasTimeConflict(day, emp.id, shift)) return toast("Этот сотрудник уже работает в это время");
  const futureHours = totalHoursForEmployee(day, emp.id) + (shiftTemplates[shift]?.hours || 0);
  if(futureHours > 17) return toast(`Нельзя: получится ${futureHours} часов. Максимум 17.`);
  removeOffForEmployee(day, emp.id);
  const bySkill = category !== emp.position;
  state.weeks[state.currentWeek].schedule[day].push({
    employeeId: emp.id,
    category,
    shift,
    status: (shift !== emp.defaultShift || bySkill) ? "changed" : "work",
    bySkill
  });
  state.weeks[state.currentWeek].history.push(`${shortName(emp.name)}: добавлен ${day} · ${category} · ${shift}`);
  render();
  toast(`Добавлен: ${shortName(emp.name)} — ${category}`);
  const firstBlock = Object.keys(staffingBlocks).find(sh => coversShift({shift}, sh) > 0) || "1 смена";
  const msg = overstaffMessage(day, category, firstBlock);
  if(msg) setTimeout(() => toast(msg), 400);
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
function setNeed(day,cat,sh,val){
  if(!state.weeks[state.currentWeek].staffing[day]) state.weeks[state.currentWeek].staffing[day] = blankStaffing();
  state.weeks[state.currentWeek].staffing[day][cat][sh]=Number(val);
  render();
}
function addEmployee(){
  const name=document.getElementById("newName").value.trim(); const position=document.getElementById("newPos").value; const defaultShift=document.getElementById("newShift").value;
  if(!name) return toast("Введите ФИО");
  state.employees.push({id:"e"+Date.now(),name,position,defaultShift,skills:[position],universal:false,active:true,serviceScore:serviceRatedCategories.includes(position)?50:null});
  render(); toast("Сотрудник добавлен");
}
function removeEmployee(id){ if(confirm("Удалить сотрудника?")){ state.employees = state.employees.filter(e=>e.id!==id); render(); } }
function removeAssignment(day, empId, category, shift){
  const before = dayItems(day).length;
  state.weeks[state.currentWeek].schedule[day] = dayItems(day).filter(i => !(i.employeeId === empId && i.category === category && i.shift === shift && isWorkItem(i)));
  if(dayItems(day).length !== before){
    state.weeks[state.currentWeek].history.push(`${shortName(employee(empId)?.name)}: удалено назначение ${day}`);
    closeDrawer(); render(); toast("Назначение удалено");
  }
}
function dragEmp(e, day, empId, category, shift){ e.dataTransfer.setData("text/plain", JSON.stringify({day,empId,category,shift})); }
function dropEmp(e, day, sh){
  const data=JSON.parse(e.dataTransfer.getData("text/plain"));
  const item=dayItems(data.day).find(i=>i.employeeId===data.empId && i.category===data.category && i.shift===data.shift && isWorkItem(i));
  if(!item) return;
  const newShift = Object.keys(shiftTemplates).find(s=>coversShift({shift:s},sh)>=1) || item.shift;
  if(hasTimeConflict(day, data.empId, newShift, item)) return toast("Нельзя: сотрудник уже работает в это время");
  const futureHours = totalHoursForEmployee(day, data.empId, item) + (shiftTemplates[newShift]?.hours || 0);
  if(futureHours > 17) return toast(`Нельзя: получится ${futureHours} часов. Максимум 17.`);
  if(data.day !== day){
    state.weeks[state.currentWeek].schedule[data.day] = dayItems(data.day).filter(i => i !== item);
    removeOffForEmployee(day, data.empId);
    state.weeks[state.currentWeek].schedule[day].push(item);
  }
  item.shift = newShift;
  item.status='changed';
  state.weeks[state.currentWeek].history.push(`Перемещение ${shortName(employee(data.empId).name)}`);
  render();
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
  function timeSortValue(time){ return shiftTemplates[time]?.start ?? 99; }
  function getWorkForCategory(emp, day, cat){ return dayItems(day).filter(i=>i.employeeId===emp.id && isWorkItem(i) && i.category===cat); }
  function hasAssignmentInCategory(emp, cat){ return dayKeys.some(day=>dayItems(day).some(i=>i.employeeId===emp.id && isWorkItem(i) && i.category===cat)); }
  function rowTime(emp, cat){ const assigned = dayKeys.flatMap(day=>getWorkForCategory(emp, day, cat)).find(i=>i.shift); return assigned?.shift || emp.defaultShift; }
  function cellFor(emp, day, cat){
    const items = dayItems(day).filter(i=>i.employeeId===emp.id);
    if(items.find(i=>i.status==='off')) return `<td class="off"></td>`;
    const works = getWorkForCategory(emp, day, cat);
    if(!works.length) return `<td></td>`;
    const changed = works.some(i=>i.status==='changed' || i.bySkill || i.category !== emp.position || i.shift !== emp.defaultShift);
    return `<td class="${changed?'changed':''}">${shortName(emp.name)}</td>`;
  }
  function tableBlock(cat){
    const rows = state.employees.filter(emp=>emp.active && (emp.position===cat || hasAssignmentInCategory(emp, cat))).sort((a,b)=>{
      const t = timeSortValue(rowTime(a,cat))-timeSortValue(rowTime(b,cat));
      if(t!==0) return t;
      return a.name.localeCompare(b.name, 'ru');
    });
    return `<table><tr class="titleRow"><td colspan="10">Филиал Сергели — ${cat}</td></tr><tr class="dates"><th>Должность</th><th>Время</th><th>ФИО</th>${days.map(d=>`<th>${formatDate(d)}</th>`).join('')}</tr><tr class="dates"><th></th><th></th><th></th>${daysShort.map(d=>`<th>${d}</th>`).join('')}</tr>${rows.map(emp=>`<tr><td class="position">${cat}</td><td class="time">${rowTime(emp,cat)}</td><td class="name">${shortName(emp.name)}</td>${dayKeys.map(day=>cellFor(emp,day,cat)).join('')}</tr>`).join('')}</table><br>`;
  }
  let html = `<html><head><meta charset="UTF-8"><style>body{font-family:"Times New Roman",serif}table{border-collapse:collapse;width:100%;margin-bottom:24px;page-break-after:always}th,td{border:1px solid #333;text-align:center;vertical-align:middle;height:28px;font-size:12px;padding:4px}.titleRow td{height:46px;font-size:18px;font-weight:bold;background:#fff}.dates th{background:#92d050;font-weight:bold}.position{background:#92d050;font-weight:bold;width:120px}.time{background:#e2f0d9;font-weight:bold;width:95px}.name{width:170px;font-weight:bold}.off{background:#ff0000;color:#ff0000}.changed{background:#ffff00;color:#000;font-weight:bold}</style></head><body><h2 style="text-align:center;">График ${weekLabel(state.currentWeek)}</h2><p style="text-align:right;font-weight:bold;">Аюпов А __________</p>`;
  editableCategories.forEach(cat=>{ html += tableBlock(cat); });
  html += `</body></html>`;
  const blob = new Blob([html], { type:'application/vnd.ms-excel;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `grafik_print_${weekLabel(state.currentWeek)}.xls`;
  link.click();
}
function toast(msg){ const t=document.getElementById("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2500); }

const navButtons = document.querySelectorAll(".nav");
navButtons.forEach(n=>n.onclick=()=>{currentPage=n.dataset.page; render();});
const roleSelect = document.getElementById("roleSelect");
if(roleSelect){ roleSelect.value=state.role; roleSelect.onchange=e=>{state.role=e.target.value; render();}; }
const weekSelect = document.getElementById("weekSelect");
if(weekSelect){ weekSelect.onchange=e=>{state.currentWeek=e.target.value; fixOldSundayWeeks(); ensureWeek(); render();}; }
const nextWeekBtn = document.getElementById("nextWeekBtn");
if(nextWeekBtn) nextWeekBtn.onclick=createNextWeek;
const prevWeekBtn = document.getElementById("prevWeekBtn");
if(prevWeekBtn) prevWeekBtn.onclick=prevWeek;
const excelBtn = document.getElementById("excelBtn");
if(excelBtn) excelBtn.onclick=exportExcel;

render({ save:false });
setTimeout(startFirebaseSync, 200);
