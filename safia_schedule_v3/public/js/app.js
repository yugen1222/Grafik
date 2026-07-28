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

const categories = ["Общий", "Продавец", "Официант", "Бариста", "Кассир", "Техничка", "Морозильщик", "Менеджер", "Менеджер официантской зоны", "Стажёр"];
const editableCategories = categories.filter(c => c !== "Общий");
const serviceRatedCategories = ["Продавец", "Официант"];
const daysShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const managerViews = {
  "branch1": { title: "Филиал · 1 смена", shift: "1 смена", categories: ["Менеджер", "Кассир", "Продавец", "Морозильщик", "Техничка"] },
  "service1": { title: "Обслуживание · 1 смена", shift: "1 смена", categories: ["Менеджер официантской зоны", "Бариста", "Официант"], serviceOnly: true },
  "branch2": { title: "Филиал · 2 смена", shift: "2 смена", categories: ["Менеджер", "Кассир", "Продавец", "Морозильщик", "Техничка"] },
  "service2": { title: "Обслуживание · 2 смена", shift: "2 смена", categories: ["Менеджер официантской зоны", "Бариста", "Официант"], serviceOnly: true },
  "shift3": { title: "Филиал · 3 смена", shift: "3 смена", categories: ["Менеджер", "Кассир", "Продавец", "Морозильщик", "Бариста", "Официант", "Техничка"] }
};
let managerViewKey = "branch1";
let managerSearch = "";
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
let currentPage = "managerBoard";
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
      serviceScore: serviceRatedCategories.includes(position) ? 50 : null,
      comments: [],
      fullLimitBlocked: false
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

    days.forEach((day, i) => {
      const oldItems =
        state.weeks[copyFromKey].schedule?.[oldDays[i]] || [];

      schedule[day] = oldItems
      // Выходные в новую неделю не переносим
        .filter(item => item.status !== "off")

      // Не переносим удалённых сотрудников
        .filter(item => state.employees.some(emp =>
          emp.id === item.employeeId && emp.active
        ))

      // Новая неделя начинается как обычный график
        .map(item => ({
          employeeId: item.employeeId,
          category: item.category,
          shift: item.shift,
          status: "work"
        }));
    });
  }
  else {
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
    e.comments = Array.isArray(e.comments) ? e.comments : [];
    e.fullLimitBlocked = Boolean(e.fullLimitBlocked);
    e.fullBlockReason = e.fullBlockReason || "";
    e.fullBlockStart = e.fullBlockStart || "";
    e.fullBlockEnd = e.fullBlockEnd || "";
    e.fullBlockAddedBy = e.fullBlockAddedBy || "";
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
        bySkill: Boolean(item.bySkill),
        comment: item.comment || "",
        additionalShift: Boolean(item.additionalShift),
        replacementFor: item.replacementFor || null,
        replacement: Boolean(item.replacement),
        violation: item.violation || ""
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

function normalizedEmployeeName(name){ return String(name || "").trim().replace(/\s+/g," ").toLowerCase(); }
function mergeEmployeeLists(remoteList, localList){
  const result = new Map();
  (remoteList || []).forEach(emp => { if(emp?.name) result.set(normalizedEmployeeName(emp.name), emp); });
  (localList || []).forEach(emp => { if(emp?.name && !result.has(normalizedEmployeeName(emp.name))) result.set(normalizedEmployeeName(emp.name), emp); });
  return [...result.values()];
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
    const localEmployeesBeforeSync = Array.isArray(state.employees) ? state.employees : [];
    const remoteState = migrateState(data.state) || state;
    remoteState.employees = mergeEmployeeLists(remoteState.employees, localEmployeesBeforeSync);
    state = remoteState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    ensureWeek(false);
    render({ save:false });
    isRemoteUpdate = false;
    if(state.employees.length !== (data.state.employees || []).length){
      databaseRef.set({ state, updatedAt: Date.now(), updatedBy: window.CLIENT_ID || "local" })
        .catch(err => console.error("Firebase merge save error", err));
    }
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
  const tpl = shiftInfo(item.shift); const block = staffingBlocks[blockName];
  if(!tpl || !block) return 0;
  return overlap(tpl, block);
}
function parseShiftRange(shift){
  const m=String(shift||"").match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
  if(!m) return null;
  let start=Number(m[1])+Number(m[2])/60;
  let end=Number(m[3])+Number(m[4])/60;
  if(end<=start) end+=24;
  return {start,end,hours:end-start};
}
function shiftInfo(shift){ return shiftTemplates[shift] || parseShiftRange(shift); }
function itemHours(item){ return shiftInfo(item.shift)?.hours || 0; }
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
  const newTpl = shiftInfo(newShift);
  if(!newTpl) return false;
  return dayItems(day).some(i => {
    if(!isWorkItem(i)) return false;
    if(i.employeeId !== empId) return false;
    if(ignoreItem && i === ignoreItem) return false;
    const oldTpl = shiftInfo(i.shift);
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
  const pageTitles = { managerBoard:"Рабочий график", dashboard:"Помощник", schedule:"График недели", attendance:"Посещаемость", workload:"Контроль нагрузки", dayoffs:"Выходные", employees:"Сотрудники", staffing:"Штатка", history:"История", skills:"Навыки" };
  const title = document.getElementById("pageTitle");
  if(title) title.textContent = pageTitles[currentPage] || "График недели";
  const weekTitle = document.getElementById("weekTitle");
  if(weekTitle) weekTitle.textContent = `Неделя ${weekLabel(state.currentWeek)}`;
  renderWeekSelect();
  renderManagerBoard(); renderDashboard(); renderSchedule(); renderDayoffs(); renderAttendance(); renderEmployees(); renderSkills(); renderStaffing(); renderHistory(); renderWorkloadControl();
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


function isServiceManager(emp){
  return emp && emp.position === "Менеджер" && ((emp.skills || []).includes("Официант") || emp.serviceZone === true);
}

function employeeBelongsToManagerView(emp, category, view){
  if(!emp || !emp.active) return false;
  if(category !== "Менеджер") return emp.position === category || (emp.skills || []).includes(category);
  if(view.serviceOnly) return isServiceManager(emp);
  return emp.position === "Менеджер" && !isServiceManager(emp);
}

function assignmentForManagerCell(day, empId, category, shiftName){
  return dayItems(day).find(item =>
    item.employeeId === empId && isWorkItem(item) && item.category === category && coversShift(item, shiftName) > 0
  );
}

function managerRowsForCategory(category, view){
  const days=getWeekDays(state.currentWeek).map(dateKey);
  return state.employees.filter(emp => {
    if(!employeeBelongsToManagerView(emp, category, view)) return false;
    if(managerSearch && !emp.name.toLowerCase().includes(managerSearch.toLowerCase())) return false;
    const hasWeekAssignment = days.some(day => assignmentForManagerCell(day, emp.id, category, view.shift));
    const defaultCovers = emp.position === category && coversShift({shift:emp.defaultShift}, view.shift) > 0;
    return hasWeekAssignment || defaultCovers;
  }).sort((a,b)=>{
    const aa=days.filter(day=>assignmentForManagerCell(day,a.id,category,view.shift)).length;
    const bb=days.filter(day=>assignmentForManagerCell(day,b.id,category,view.shift)).length;
    return bb-aa || a.name.localeCompare(b.name,"ru");
  });
}

function managerCell(day, emp, category, view){
  const off = isDayOff(day, emp.id);
  const item = assignmentForManagerCell(day, emp.id, category, view.shift);
  if(off){
    return `<td class="managerCell offCell" onclick="openEmployeeDrawer('${day}','${emp.id}','','')"><span>Выходной</span></td>`;
  }
  if(!item){
    return `<td class="managerCell emptyCell" onclick="openSkillPicker('${day}','${category}','${view.shift}')">+</td>`;
  }
  const changed = item.status === "changed" || item.bySkill || item.category !== emp.position || item.shift !== emp.defaultShift;
  return `<td class="managerCell ${changed?'changedCell':''}" onclick="openEmployeeDrawer('${day}','${emp.id}','${item.category}','${item.shift}')"><b>${shortName(emp.name)}</b><small>${item.shift}</small></td>`;
}

function managerCategoryTable(category, view){
  const days = getWeekDays(state.currentWeek);
  const rows = managerRowsForCategory(category, view);
  const totals=days.map(d=>coverage(dateKey(d),category,view.shift));
  const needs=days.map(d=>need(dateKey(d),category,view.shift));
  if(!rows.length) return `<details class="managerCategoryBlock"><summary class="managerCategoryTitle">${category} (0)</summary><div class="empty">Нет сотрудников</div></details>`;
  return `<div class="managerCategoryBlock"><div class="managerCategoryTitle">${category} · ${rows.length}</div><div class="managerTableWrap"><table class="managerGrid"><thead><tr><th class="employeeHead">Сотрудник</th>${days.map((d,i)=>`<th>${daysShort[i]}<small>${formatDate(d)}</small></th>`).join("")}</tr></thead><tbody>${rows.map(emp=>`<tr><th class="employeeName" onclick="openManagerBulkActions('${emp.id}')">${shortName(emp.name)}<small>${emp.defaultShift}</small></th>${days.map(d=>managerCell(dateKey(d),emp,category,view)).join("")}</tr>`).join("")}<tr class="managerTotal"><th>Итого / штатка</th>${totals.map((v,i)=>`<td class="${v<needs[i]?'low':v>needs[i]?'high':'ok'}">${v}/${needs[i]}</td>`).join("")}</tr></tbody></table></div></div>`;
}

function managerViewStats(view){
  const days=getWeekDays(state.currentWeek).map(dateKey);
  let low=0, high=0;
  days.forEach(day=>view.categories.forEach(cat=>{
    const n=need(day,cat,view.shift), a=coverage(day,cat,view.shift), diff=a-n;
    if(diff<0) low += Math.abs(diff);
    if(diff>0) high += diff;
  }));
  return {low,high};
}

function setManagerView(key){ managerViewKey=key; render(); }

function renderManagerBoard(){
  const el=document.getElementById("managerBoard");
  if(!el) return;
  const view=managerViews[managerViewKey] || managerViews.branch1;
  const stats=managerViewStats(view);
  el.innerHTML=`
    <div class="managerHero">
      <div><div class="eyebrow">SAFIA SCHEDULE</div><h2>${view.title}</h2><p>Неделя ${weekLabel(state.currentWeek)}</p></div>
      <div class="managerActions"><button class="darkBtn" onclick="exportCurrentManagerView()">Скачать текущий вид</button><button class="secondary" onclick="exportExcel()">Полный Excel</button></div>
    </div>
    <div class="managerStats"><div class="statCard lowStat"><span>Не хватает</span><b>${stats.low}</b></div><div class="statCard highStat"><span>Лишние</span><b>${stats.high}</b></div><div class="statCard"><span>Неделя</span><b>${weekLabel(state.currentWeek)}</b></div></div>
    <div class="managerViewTabs">${Object.entries(managerViews).map(([key,item])=>`<button class="tab ${key===managerViewKey?'active':''}" onclick="setManagerView('${key}')">${item.title}</button>`).join("")}</div>
    <div class="card managerSearchBar"><input placeholder="Поиск по ФИО" value="${managerSearch}" oninput="managerSearch=this.value;render()"><span class="muted">Активные сотрудники показываются сверху</span></div>
    <div class="managerSchedule">${view.categories.map(cat=>managerCategoryTable(cat,view)).join("")}</div>`;
}

function openSkillPicker(day, category, shiftName){
  const candidates=state.employees.filter(e=>e.active && canWorkCategory(e,category) && !isDayOff(day,e.id));
  const text=candidates.map((e,i)=>`${i+1}. ${shortName(e.name)} · ${e.position} · ${e.defaultShift}`).join("\n");
  const num=Number(prompt(`Выберите сотрудника для ${category}:\n\n${text}`));
  const emp=candidates[num-1]; if(!emp) return;
  const shift=prompt("Время работы (например 08:00-16:00):", shiftName==='1 смена'?'08:00-16:00':shiftName==='2 смена'?'16:00-23:00':'23:00-08:00');
  if(!shiftInfo(shift)) return toast("Неверный формат времени");
  if(hasTimeConflict(day,emp.id,shift)) return toast("Время пересекается с другой сменой");
  if(totalHoursForEmployee(day,emp.id)+shiftInfo(shift).hours>17) return toast("Нельзя больше 17 часов за день");
  removeOffForEmployee(day,emp.id);
  state.weeks[state.currentWeek].schedule[day].push({employeeId:emp.id,category,shift,status:'changed',bySkill:category!==emp.position,additionalShift:true,comment:''});
  state.weeks[state.currentWeek].history.push(`${shortName(emp.name)} добавлен через +: ${category}, ${shift}, ${day}`);
  render(); toast("Сотрудник добавлен");
}

function saveAssignmentComment(day, empId, category, shift){
  const text=document.getElementById('drawerComment')?.value.trim()||'';
  const item=dayItems(day).find(i=>i.employeeId===empId&&i.category===category&&i.shift===shift&&isWorkItem(i));
  if(item) item.comment=text;
  const emp=employee(empId);
  if(text && emp){ emp.comments=emp.comments||[]; emp.comments.push({day,text,at:new Date().toISOString(),by:state.role}); }
  state.weeks[state.currentWeek].history.push(`${shortName(emp?.name)}: комментарий ${day}: ${text||'очищен'}`);
  render(); toast('Комментарий сохранён');
}

function openManagerBulkActions(empId){
  const emp=employee(empId); if(!emp) return;
  const days=getWeekDays(state.currentWeek);
  const drawer=document.getElementById("drawer");
  drawer.innerHTML=`<div class="drawerHead"><div><h2>${shortName(emp.name)}</h2><div class="muted">${emp.position} · ${emp.defaultShift}</div></div><button class="drawerClose" onclick="closeDrawer()">✕</button></div>
  <div class="infoBox"><b>Выберите дни</b><div class="bulkDays">${days.map((d,i)=>`<label><input type="checkbox" class="managerBulkDay" value="${dateKey(d)}"> ${daysShort[i]} ${formatDate(d)}</label>`).join("")}</div></div>
  <div class="drawerActions"><button onclick="managerSetDaysOff('${empId}')">Поставить выходные</button><button class="secondary" onclick="managerSelectWholeWeek()">Выбрать всю неделю</button><button class="secondary" onclick="managerRestoreDays('${empId}')">Вернуть в график</button></div>`;
  drawer.classList.add("open");
}

function managerSelectWholeWeek(){ document.querySelectorAll('.managerBulkDay').forEach(x=>x.checked=true); }
function selectedManagerDays(){ return [...document.querySelectorAll('.managerBulkDay:checked')].map(x=>x.value); }
function managerSetDaysOff(empId){
  const days=selectedManagerDays(); if(!days.length) return toast("Выберите дни");
  days.forEach(day=>{ state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>i.employeeId!==empId); state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,status:"off"}); });
  state.weeks[state.currentWeek].history.push(`${shortName(employee(empId)?.name)}: выходные ${days.join(', ')}`); closeDrawer(); render(); toast("Выходные сохранены");
}
function managerRestoreDays(empId){
  const emp=employee(empId), days=selectedManagerDays(); if(!emp||!days.length) return toast("Выберите дни");
  days.forEach(day=>{ state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>!(i.employeeId===empId&&i.status==="off")); if(!dayItems(day).some(i=>i.employeeId===empId&&isWorkItem(i))) state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,category:emp.position,shift:emp.defaultShift,status:"work"}); });
  closeDrawer(); render(); toast("Сотрудник возвращён в график");
}

function exportCurrentManagerView(){
  const view=managerViews[managerViewKey] || managerViews.branch1;
  const days=getWeekDays(state.currentWeek); const dayKeys=days.map(dateKey);
  const blocks=view.categories.map(category=>{
    const rows=managerRowsForCategory(category,view);
    if(!rows.length) return "";
    return `<tr class="section"><td colspan="8">${category}</td></tr>${rows.map(emp=>`<tr><td class="name">${shortName(emp.name)}<br><small>${emp.defaultShift}</small></td>${dayKeys.map(day=>{ const off=isDayOff(day,emp.id); const item=assignmentForManagerCell(day,emp.id,category,view.shift); if(off) return '<td class="off"></td>'; if(!item) return '<td></td>'; const changed=item.status==='changed'||item.bySkill||item.category!==emp.position||item.shift!==emp.defaultShift; return `<td class="${changed?'changed':''}">${shortName(emp.name)}<br><small>${item.shift}</small></td>`; }).join('')}</tr>`).join('')}`;
  }).join('');
  const html=`<html><head><meta charset="UTF-8"><style>body{font-family:"Times New Roman",serif}table{border-collapse:collapse;width:100%}th,td{border:1px solid #333;text-align:center;padding:5px;height:30px}th,.section td{background:#92d050;font-weight:bold}.name{font-weight:bold;text-align:left}.off{background:#f00}.changed{background:#ff0}small{font-size:10px}</style></head><body><h2 style="text-align:center">${view.title} · ${weekLabel(state.currentWeek)}</h2><p style="text-align:right;font-weight:bold">Аюпов А __________</p><table><tr><th>Сотрудник</th>${days.map((d,i)=>`<th>${formatDate(d)}<br>${daysShort[i]}</th>`).join('')}</tr>${blocks}</table></body></html>`;
  const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`${view.title.replace(/\s+/g,'_')}_${weekLabel(state.currentWeek)}.xls`; link.click(); setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}

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

    const searchOk =
      e.name.toLowerCase().includes(
        dayoffFilter.search.toLowerCase()
      );

    const categoryOk =
      dayoffFilter.category === "Все" ||
      e.position === dayoffFilter.category;

    const shiftOk =
      dayoffFilter.shift === "Все" ||
      e.defaultShift === dayoffFilter.shift;

    return searchOk && categoryOk && shiftOk;
  });

  el.innerHTML = `
    <div class="card">
      <h3>Очистка выходных</h3>

      <p class="muted">
        Удаляет только выходные выбранной недели.
        Рабочие смены сотрудников не удаляются.
      </p>

      <div class="filters">
        <button
          class="danger"
          onclick="confirmClearDayoffs('Все')"
        >
          Очистить все выходные
        </button>

        ${editableCategories.map(category => `
          <button
            class="secondary"
            onclick="confirmClearDayoffs('${category}')"
          >
            Очистить: ${category}
          </button>
        `).join("")}

        <button
            class="secondary"
            onclick="cleanupDeletedEmployees()"
        >
            Очистить пустые записи
        </button>
      </div>
    </div>

    <div class="card">
      <h3>Фильтр выходных</h3>

      <div class="filters">
        <input
          placeholder="Поиск сотрудника"
          value="${dayoffFilter.search}"
          oninput="
            dayoffFilter.search = this.value;
            render();
          "
        >

        <select
          onchange="
            dayoffFilter.category = this.value;
            render();
          "
        >
          <option>Все</option>

          ${editableCategories.map(category => `
            <option
              ${dayoffFilter.category === category ? "selected" : ""}
            >
              ${category}
            </option>
          `).join("")}
        </select>

        <select
          onchange="
            dayoffFilter.shift = this.value;
            render();
          "
        >
          <option>Все</option>

          ${Object.keys(shiftTemplates).map(shift => `
            <option
              ${dayoffFilter.shift === shift ? "selected" : ""}
            >
              ${shift}
            </option>
          `).join("")}
        </select>

        <button
          class="secondary"
          onclick="selectFilteredDayoffEmployees()"
        >
          Выбрать всех
        </button>

        <button
          class="secondary"
          onclick="clearDayoffFilters()"
        >
          Сбросить
        </button>
      </div>
    </div>

    <div class="card">
      <h3>Поставить выходной</h3>

      <div class="grid grid2">
        <div>
          <b>Сотрудники (${filteredEmployees.length})</b>

          <div class="checks">
            ${filteredEmployees.map(employeeItem => `
              <label>
                <input
                  type="checkbox"
                  class="offEmp"
                  value="${employeeItem.id}"
                >

                ${shortName(employeeItem.name)}

                <span class="muted">
                  ${employeeItem.position}
                  · ${employeeItem.defaultShift}

                  ${
                    serviceRatedCategories.includes(
                      employeeItem.position
                    )
                      ? ` · рейтинг ${employeeItem.serviceScore ?? 50}`
                      : ""
                  }
                </span>
              </label>
            `).join("")}
          </div>
        </div>

        <div>
          <b>Даты</b>

          <div class="checks">
            ${days.map((day, index) => `
              <label>
                <input
                  type="checkbox"
                  class="offDay"
                  value="${dateKey(day)}"
                >

                ${daysShort[index]} ${formatDate(day)}
              </label>
            `).join("")}
          </div>
        </div>
      </div>

      <br>

      <button onclick="massDayoff()">
        Поставить выходной
      </button>
    </div>
  `;
}

function confirmClearDayoffs(category){
  const message =
    category === "Все"
      ? "Удалить все выходные на выбранной неделе?"
      : `Удалить все выходные у категории «${category}»?`;

  if(confirm(message)){
    clearDayoffs(category);
  }
}

function clearDayoffs(category = "Все"){
  const days = getWeekDays(state.currentWeek).map(dateKey);

  let removed = 0;

  days.forEach(day => {
    const currentItems = dayItems(day);

    state.weeks[state.currentWeek].schedule[day] =
      currentItems.filter(item => {
        if(item.status !== "off"){
          return true;
        }

        const emp = employee(item.employeeId);

        // Удаляем старые пустые записи
        if(!emp){
          removed++;
          return false;
        }

        // Очистить все выходные
        if(category === "Все"){
          removed++;
          return false;
        }

        // Очистить только выбранную категорию
        if(emp.position === category){
          removed++;
          return false;
        }

        return true;
      });
  });

  state.weeks[state.currentWeek].history =
    state.weeks[state.currentWeek].history || [];

  state.weeks[state.currentWeek].history.push(
    category === "Все"
      ? `Очищены все выходные недели: ${removed}`
      : `Очищены выходные категории ${category}: ${removed}`
  );

  render();

  toast(
    category === "Все"
      ? "Все выходные очищены"
      : `Выходные категории «${category}» очищены`
  );
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

function openEmployeeDrawer(day, empId, category = "", shift = ""){
  const emp = employee(empId);

  if(!emp) return;

  const items = dayItems(day).filter(i =>
    i.employeeId === empId
  );

  const offItem = items.find(i =>
    i.status === "off"
  );

  const workItem = items.find(i =>
    isWorkItem(i)
  );

  const currentCategory =
    workItem?.category ||
    category ||
    emp.position;

  const currentShift =
    workItem?.shift ||
    shift ||
    emp.defaultShift;

  const hours = items
    .filter(i => isWorkItem(i))
    .reduce((sum, item) =>
      sum + itemHours(item), 0
    );

  const allowedCategories =
    editableCategories.filter(cat =>
      canWorkCategory(emp, cat)
    );

  const drawer =
    document.getElementById("drawer");

  /*
    Отдельное окно для выходного.
  */
  if(offItem){
    drawer.innerHTML = `
      <div class="drawerHead">
        <div>
          <h2>${shortName(emp.name)}</h2>
          <div class="muted">
            ${emp.position} · ${emp.defaultShift}
          </div>
        </div>

        <button
          class="drawerClose"
          onclick="closeDrawer()"
        >
          ✕
        </button>
      </div>

      <div class="infoGrid">
        <div class="infoBox">
          <b>Дата</b><br>
          ${day}
        </div>

        <div class="infoBox">
          <b>Статус</b><br>
          🏖 Выходной
        </div>

        <div class="infoBox">
          <b>Действия</b><br><br>

          <button
            onclick="restoreFromDayoff('${day}','${empId}')"
          >
            Вернуть в график
          </button>
        </div>
      </div>
    `;

    drawer.classList.add("open");
    return;
  }

  /*
    Обычное окно рабочего назначения.
  */
  drawer.innerHTML = `
    <div class="drawerHead">
      <div>
        <h2>${shortName(emp.name)}</h2>
        <div class="muted">
          ${emp.position} · ${emp.defaultShift}
        </div>
      </div>

      <button
        class="drawerClose"
        onclick="closeDrawer()"
      >
        ✕
      </button>
    </div>

    <div class="infoGrid">
      <div class="infoBox">
        <b>Дата</b><br>
        ${day}
      </div>

      <div class="infoBox">
        <b>Часы за день</b><br>
        ${hours} / 17
      </div>

      <div class="infoBox">
        <b>Навыки</b><br>
        ${
          (emp.skills || [])
            .map(skill =>
              `<i class="pill">${skill}</i>`
            )
            .join("") || "Нет"
        }
      </div>

      ${
        serviceRatedCategories.includes(emp.position)
          ? `
            <div class="infoBox">
              <b>Рейтинг сервиса</b><br>
              <input
                type="number"
                min="0"
                max="100"
                value="${emp.serviceScore ?? 50}"
                onchange="
                  setServiceScore(
                    '${empId}',
                    this.value
                  )
                "
              >
            </div>
          `
          : ""
      }

      <div class="infoBox">
        <b>Комментарий</b><br><br>
        <textarea id="drawerComment" rows="4" placeholder="Причина замены, просьба сотрудника, ограничение...">${workItem?.comment || ""}</textarea><br><br>
        <button class="secondary" onclick="saveAssignmentComment('${day}','${empId}','${currentCategory}','${currentShift}')">Сохранить комментарий</button>
      </div>

      <div class="infoBox">
        <b>Действия</b><br><br>

        <label>Категория</label>

        <select id="drawerCategory">
          ${allowedCategories.map(cat => `
            <option
              ${cat === currentCategory ? "selected" : ""}
            >
              ${cat}
            </option>
          `).join("")}
        </select>

        <br><br>

        <label>Смена</label>

        <select id="drawerShift">
          ${Object.keys(shiftTemplates).map(itemShift => `
            <option
              ${itemShift === currentShift ? "selected" : ""}
            >
              ${itemShift}
            </option>
          `).join("")}
        </select>

        <br><br>
        <label>Точное время (можно изменить)</label>
        <div class="timePair"><input id="drawerStart" type="time" value="${currentShift.slice(0,5)}"><span>—</span><input id="drawerEnd" type="time" value="${currentShift.slice(-5)}"></div>

        <br><br>

        <button
          onclick="
            changeFromDrawer(
              '${day}',
              '${empId}',
              '${currentCategory}',
              '${currentShift}'
            )
          "
        >
          Изменить
        </button>

        <button class="secondary" onclick="addSecondAssignmentFromDrawer('${day}','${empId}')">+ Добавить ещё одну смену / зону</button>

        <button
          class="secondary"
          onclick="
            makeOffFromDrawer(
              '${day}',
              '${empId}'
            )
          "
        >
          Поставить выходной
        </button>

        ${
          workItem
            ? `
              <button
                class="danger"
                onclick="
                  removeAssignment(
                    '${day}',
                    '${empId}',
                    '${currentCategory}',
                    '${currentShift}'
                  )
                "
              >
                Удалить это назначение
              </button>
            `
            : `
              <button
                onclick="
                  changeFromDrawer(
                    '${day}',
                    '${empId}',
                    '',
                    ''
                  )
                "
              >
                Добавить в график
              </button>
            `
        }
      </div>
    </div>
  `;

  drawer.classList.add("open");
}
function closeDrawer(){ const d=document.getElementById('drawer'); if(d) d.classList.remove('open'); }
function changeFromDrawer(day, empId, oldCategory = "", oldShift = ""){
  const emp = employee(empId);

  if(!emp){
    return toast("Сотрудник не найден");
  }

  const startValue=document.getElementById("drawerStart")?.value;
  const endValue=document.getElementById("drawerEnd")?.value;
  const newShift = startValue && endValue ? `${startValue}-${endValue}` : (document.getElementById("drawerShift")?.value || emp.defaultShift);

  const newCategory =
    document.getElementById("drawerCategory")?.value ||
    emp.position;

  if(!canWorkCategory(emp, newCategory)){
    return toast("У сотрудника нет навыка для этой категории");
  }

  let item = dayItems(day).find(i =>
    i.employeeId === empId &&
    i.category === oldCategory &&
    i.shift === oldShift &&
    isWorkItem(i)
  );

  if(!item){
    item = dayItems(day).find(i =>
      i.employeeId === empId &&
      isWorkItem(i)
    );
  }

  /*
    Если рабочего назначения нет —
    создаём его заново.
  */
  if(!item){
    if(hasTimeConflict(day, empId, newShift)){
      return toast("Сотрудник уже работает в это время");
    }

    removeOffForEmployee(day, empId);

    state.weeks[state.currentWeek].schedule[day].push({
      employeeId: empId,
      category: newCategory,
      shift: newShift,
      status:
        newCategory !== emp.position ||
        newShift !== emp.defaultShift
          ? "changed"
          : "work",
      comment: ""
    });

    state.weeks[state.currentWeek].history.push(
      `${shortName(emp.name)} добавлен: ${newCategory}, ${newShift}, ${day}`
    );

    closeDrawer();
    render();
    toast("Сотрудник добавлен в график");
    return;
  }

  if(hasTimeConflict(day, empId, newShift, item)){
    return toast("Сотрудник уже работает в это время");
  }

  item.category = newCategory;
  item.shift = newShift;

  item.status =
    newCategory !== emp.position ||
    newShift !== emp.defaultShift
      ? "changed"
      : "work";

  removeOffForEmployee(day, empId);

  state.weeks[state.currentWeek].history.push(
    `${shortName(emp.name)}: изменено на ${newCategory}, ${newShift}`
  );

  closeDrawer();
  render();
  toast("Изменение сохранено");
}
function makeOffFromDrawer(day, empId){
  state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>i.employeeId!==empId);
  state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,status:'off'});
  state.weeks[state.currentWeek].history.push(`${shortName(employee(empId).name)}: выходной ${day}`);
  closeDrawer(); render(); toast('Выходной поставлен');
}
function restoreFromDayoff(day, empId){
  const emp = employee(empId);

  if(!emp){
    return toast("Сотрудник не найден");
  }

  /*
    Удаляем красную запись «Выходной».
  */
  state.weeks[state.currentWeek].schedule[day] =
    dayItems(day).filter(item =>
      !(
        item.employeeId === empId &&
        item.status === "off"
      )
    );

  /*
    Проверяем, нет ли уже рабочей карточки.
  */
  const alreadyWorking = dayItems(day).some(item =>
    item.employeeId === empId &&
    isWorkItem(item)
  );

  if(!alreadyWorking){
    state.weeks[state.currentWeek].schedule[day].push({
      employeeId: empId,
      category: emp.position,
      shift: emp.defaultShift,
      status: "work"
    });
  }

  state.weeks[state.currentWeek].history.push(
    `${shortName(emp.name)} возвращён из выходного в график ${day}`
  );

  closeDrawer();
  render();
  toast("Сотрудник возвращён в график");
}
function addSecondAssignmentFromDrawer(day, empId){
  const emp=employee(empId); if(!emp) return;
  const category=document.getElementById('drawerCategory')?.value||emp.position;
  const start=document.getElementById('drawerStart')?.value;
  const end=document.getElementById('drawerEnd')?.value;
  const shift=start&&end?`${start}-${end}`:(document.getElementById('drawerShift')?.value||emp.defaultShift);
  const info=shiftInfo(shift); if(!info) return toast('Неверное время');
  if(!canWorkCategory(emp,category)) return toast('Нет навыка для этой зоны');
  if(hasTimeConflict(day,empId,shift)) return toast('Время пересекается с другой сменой');
  if(totalHoursForEmployee(day,empId)+info.hours>17) return toast('Нельзя больше 17 часов за день');
  removeOffForEmployee(day,empId);
  state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,category,shift,status:'changed',bySkill:category!==emp.position,additionalShift:true,comment:''});
  state.weeks[state.currentWeek].history.push(`${shortName(emp.name)}: добавлена ещё одна зона ${category}, ${shift}, ${day}`);
  closeDrawer(); render(); toast('Дополнительная смена добавлена');
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

function clearDayoffs(category = "Все"){
  const days = getWeekDays(state.currentWeek).map(dateKey);

  let removed = 0;

  days.forEach(day => {
    const before = dayItems(day).length;

    state.weeks[state.currentWeek].schedule[day] =
      dayItems(day).filter(item => {
        if(item.status !== "off") return true;

        const emp = employee(item.employeeId);
        if(!emp) return false;

        if(category === "Все") return false;

        return emp.position !== category;
      });

    removed +=
      before -
      state.weeks[state.currentWeek].schedule[day].length;
  });

  state.weeks[state.currentWeek].history.push(
    category === "Все"
      ? `Очищены все выходные недели: ${removed}`
      : `Очищены выходные категории ${category}: ${removed}`
  );

  render();
  toast(
    category === "Все"
      ? "Все выходные недели очищены"
      : `Выходные категории «${category}» очищены`
  );
}

function confirmClearDayoffs(category){
  const text =
    category === "Все"
      ? "Удалить все выходные на выбранной неделе?"
      : `Удалить все выходные у категории «${category}»?`;

  if(confirm(text)){
    clearDayoffs(category);
  }
}

function setNeed(day,cat,sh,val){
  if(!state.weeks[state.currentWeek].staffing[day]) state.weeks[state.currentWeek].staffing[day] = blankStaffing();
  state.weeks[state.currentWeek].staffing[day][cat][sh]=Number(val);
  render();
}
function addEmployee(){
  const name =
    document.getElementById("newName").value.trim();

  const position =
    document.getElementById("newPos").value;

  const defaultShift =
    document.getElementById("newShift").value;

  if(!name){
    return toast("Введите ФИО");
  }

  const duplicate = state.employees.some(emp =>
    emp.name.trim().toLowerCase() === name.toLowerCase()
  );

  if(duplicate){
    return toast("Такой сотрудник уже существует");
  }

  const newEmployee = {
    id: "e" + Date.now(),
    name,
    position,
    defaultShift,
    skills: [position],
    universal: false,
    active: true,

    // Рейтинг нужен только этим категориям
    serviceScore:
      position === "Продавец" ||
      position === "Официант"
        ? 50
        : null
  };

  state.employees.push(newEmployee);

  // Добавляем сотрудника во все дни текущей недели
  const currentDays =
    getWeekDays(state.currentWeek).map(dateKey);

  currentDays.forEach(day => {
    if(!state.weeks[state.currentWeek].schedule[day]){
      state.weeks[state.currentWeek].schedule[day] = [];
    }

    const alreadyExists =
      state.weeks[state.currentWeek].schedule[day].some(item =>
        item.employeeId === newEmployee.id
      );

    if(!alreadyExists){
      state.weeks[state.currentWeek].schedule[day].push({
        employeeId: newEmployee.id,
        category: newEmployee.position,
        shift: newEmployee.defaultShift,
        status: "work"
      });
    }
  });

  state.weeks[state.currentWeek].history.push(
    `${shortName(newEmployee.name)} добавлен в список сотрудников и график недели`
  );

  render();
  toast("Сотрудник добавлен в текущий график");
}
function removeEmployee(id){
  const emp = employee(id);

  if(!emp){
    return toast("Сотрудник не найден");
  }

  const approved = confirm(
    `Удалить сотрудника ${shortName(emp.name)}?\n\n` +
    `Он будет удалён из:\n` +
    `• списка сотрудников;\n` +
    `• всех недельных графиков;\n` +
    `• выходных;\n` +
    `• посещаемости.`
  );

  if(!approved) return;

  // Удаляем назначения из всех недель
  Object.values(state.weeks || {}).forEach(week => {
    Object.keys(week.schedule || {}).forEach(day => {
      week.schedule[day] =
        (week.schedule[day] || []).filter(item =>
          item.employeeId !== id &&
          item.replacementFor !== id
        );
    });

    // Удаляем посещаемость сотрудника
    if(week.attendance){
      Object.keys(week.attendance).forEach(key => {
        const record = week.attendance[key];

        if(
          record?.empId === id ||
          record?.replacementFor === id
        ){
          delete week.attendance[key];
        }
      });
    }

    week.history = week.history || [];
    week.history.push(
      `${shortName(emp.name)} полностью удалён из графиков`
    );
  });

  // Удаляем сотрудника из общего списка
  state.employees =
    state.employees.filter(item => item.id !== id);

  render();
  toast("Сотрудник полностью удалён");
}
function cleanupDeletedEmployees(){
  const existingIds =
    new Set(
      state.employees
        .filter(emp => emp.active)
        .map(emp => emp.id)
    );

  let removed = 0;

  Object.values(state.weeks || {}).forEach(week => {
    Object.keys(week.schedule || {}).forEach(day => {
      const before =
        (week.schedule[day] || []).length;

      week.schedule[day] =
        (week.schedule[day] || []).filter(item =>
          existingIds.has(item.employeeId)
        );

      removed +=
        before - week.schedule[day].length;
    });
  });

  saveState();
  render();
  toast(`Удалено пустых записей: ${removed}`);
}
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

  function timeSortValue(time){
    return shiftTemplates[time]?.start ?? 99;
  }

  function employeeAssignments(emp, day){
    return dayItems(day).filter(item =>
      item.employeeId === emp.id &&
      isWorkItem(item)
    );
  }

  function hasDayOff(emp, day){
    return dayItems(day).some(item =>
      item.employeeId === emp.id &&
      item.status === "off"
    );
  }

  /*
    Создаём отдельные строки:

    1. Основная должность + основная смена.
    2. Дополнительные строки только для временных назначений.
  */
  function buildRowsForCategory(category){
    const rows = [];

    state.employees
      .filter(emp => emp.active)
      .forEach(emp => {
        const baseKey =
          `${emp.position}|||${emp.defaultShift}`;

        const variants = new Map();

        /*
          Основная строка нужна только в таблице
          основной категории сотрудника.
        */
        if(emp.position === category){
          variants.set(baseKey, {
            emp,
            category: emp.position,
            shift: emp.defaultShift,
            isBase: true
          });
        }

        /*
          Ищем временные назначения за неделю.
        */
        dayKeys.forEach(day => {
          employeeAssignments(emp, day).forEach(item => {
            if(item.category !== category) return;

            const key =
              `${item.category}|||${item.shift}`;

            if(!variants.has(key)){
              variants.set(key, {
                emp,
                category: item.category,
                shift: item.shift,
                isBase:
                  item.category === emp.position &&
                  item.shift === emp.defaultShift
              });
            }
          });
        });

        variants.forEach(row => rows.push(row));
      });

    return rows.sort((a, b) => {
      const timeDiff =
        timeSortValue(a.shift) -
        timeSortValue(b.shift);

      if(timeDiff !== 0) return timeDiff;

      return a.emp.name.localeCompare(
        b.emp.name,
        "ru"
      );
    });
  }

  function cellForRow(row, day){
    const emp = row.emp;

    /*
      Красный выходной показываем только
      в основной строке сотрудника.
    */
    if(
      row.isBase &&
      hasDayOff(emp, day)
    ){
      return `<td class="off"></td>`;
    }

    const assignments =
      employeeAssignments(emp, day);

    const exactAssignment =
      assignments.find(item =>
        item.category === row.category &&
        item.shift === row.shift
      );

    /*
      В этой строке на этот день
      сотрудник не работает.
    */
    if(!exactAssignment){
      return `<td></td>`;
    }

    const changed =
      exactAssignment.status === "changed" ||
      exactAssignment.category !== emp.position ||
      exactAssignment.shift !== emp.defaultShift;

    return `
      <td class="${changed ? "changed" : ""}">
        ${shortName(emp.name)}
      </td>
    `;
  }

  function tableBlock(category){
    const rows =
      buildRowsForCategory(category);

    return `
      <table>
        <tr class="titleRow">
          <td colspan="10">
            Филиал Сергели — ${category}
          </td>
        </tr>

        <tr class="dates">
          <th>Должность</th>
          <th>Время</th>
          <th>ФИО</th>

          ${days.map(day => `
            <th>${formatDate(day)}</th>
          `).join("")}
        </tr>

        <tr class="dates">
          <th></th>
          <th></th>
          <th></th>

          ${daysShort.map(dayName => `
            <th>${dayName}</th>
          `).join("")}
        </tr>

        ${rows.map(row => `
          <tr>
            <td class="position">
              ${row.category}
            </td>

            <td class="time">
              ${row.shift}
            </td>

            <td class="name">
              ${shortName(row.emp.name)}
            </td>

            ${dayKeys
              .map(day => cellForRow(row, day))
              .join("")}
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
        body {
          font-family: "Times New Roman", serif;
        }

        table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 24px;
          page-break-after: always;
        }

        th,
        td {
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
      <h2 style="text-align:center;">
        График ${weekLabel(state.currentWeek)}
      </h2>

      <p style="
        text-align:right;
        font-weight:bold;
      ">
        Аюпов А __________
      </p>
  `;

  editableCategories.forEach(category => {
    html += tableBlock(category);
  });

  html += `
    </body>
    </html>
  `;

  const blob = new Blob(
    [html],
    {
      type:
        "application/vnd.ms-excel;charset=utf-8"
    }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    `grafik_print_${weekLabel(state.currentWeek)}.xls`;

  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 1000);
}
function toast(msg){ const t=document.getElementById("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2500); }


// ================= SAFIA SCHEDULE V9: ПОСЕЩАЕМОСТЬ, ЗАМЕНЫ И КОНТРОЛЬ ФУЛЛОВ =================
const FULL_DAY_MIN_HOURS = 12;
const MAX_FULLS_IN_7_DAYS = 3;
const MAX_CONSECUTIVE_FULLS = 2;
let attendanceSelectedDay = "";

function isoDateToLocal(key){
  const [y,m,d] = String(key).split("-").map(Number);
  return new Date(y, (m||1)-1, d||1, 12, 0, 0, 0);
}
function dateDistance(a,b){ return Math.round((isoDateToLocal(a)-isoDateToLocal(b))/86400000); }
function allKnownWeekDays(){
  return Object.keys(state.weeks||{}).flatMap(k=>getWeekDays(k).map(dateKey)).filter((v,i,a)=>a.indexOf(v)===i).sort();
}
function assignmentsForEmployeeOnDay(empId, day){
  const week = Object.values(state.weeks||{}).find(w => Array.isArray(w.schedule?.[day]));
  return (week?.schedule?.[day]||[]).filter(i=>i.employeeId===empId && isWorkItem(i));
}
function hoursForEmployeeOnDayAnyWeek(empId, day){
  return assignmentsForEmployeeOnDay(empId,day).reduce((sum,i)=>sum+itemHours(i),0);
}
function isFullDay(empId, day){ return hoursForEmployeeOnDayAnyWeek(empId,day) >= FULL_DAY_MIN_HOURS; }
function fullDaysInWindow(empId, targetDay, span=7){
  const target=isoDateToLocal(targetDay); const out=[];
  for(let i=span-1;i>=0;i--){ const d=new Date(target); d.setDate(d.getDate()-i); const k=dateKey(d); if(isFullDay(empId,k)) out.push(k); }
  return out;
}
function consecutiveFullsBefore(empId, targetDay){
  let count=0; const d=isoDateToLocal(targetDay);
  for(let i=1;i<=7;i++){ const x=new Date(d); x.setDate(x.getDate()-i); if(isFullDay(empId,dateKey(x))) count++; else break; }
  return count;
}
function activeFullBlock(emp, day){
  if(!emp?.fullLimitBlocked) return false;
  if(emp.fullBlockStart && day < emp.fullBlockStart) return false;
  if(emp.fullBlockEnd && day > emp.fullBlockEnd) return false;
  return true;
}
function projectedHours(empId, day, shift){ return hoursForEmployeeOnDayAnyWeek(empId,day)+(shiftTemplates[shift]?.hours||0); }
function validateReplacementCandidate(emp, day, shift, category){
  if(!emp?.active) return {ok:false, reason:"Сотрудник неактивен"};
  if(!canWorkCategory(emp,category)) return {ok:false, reason:"Нет навыка для этой зоны"};
  if(hasTimeConflict(day,emp.id,shift)) return {ok:false, reason:"Время пересекается с другой сменой"};
  const projected=projectedHours(emp.id,day,shift);
  if(projected>17) return {ok:false, reason:`Получится ${projected} часов, максимум 17`};
  const willBeFull=projected>=FULL_DAY_MIN_HOURS;
  if(willBeFull && activeFullBlock(emp,day)) return {ok:false, reason:`Запрет фуллов${emp.fullBlockReason?`: ${emp.fullBlockReason}`:""}`};
  if(willBeFull && fullDaysInWindow(emp.id,day,7).length>=MAX_FULLS_IN_7_DAYS) return {ok:false, reason:`Уже ${MAX_FULLS_IN_7_DAYS} фулла за последние 7 дней`};
  if(willBeFull && consecutiveFullsBefore(emp.id,day)>=MAX_CONSECUTIVE_FULLS) return {ok:false, reason:"Нельзя ставить третий фулл подряд"};
  return {ok:true, projected, willBeFull};
}
function setAttendanceWithDetails(day,empId,shift,category,status,details={}){
  ensureAttendance();
  const key=attendanceKey(day,empId,shift,category);
  state.weeks[state.currentWeek].attendance[key]={day,empId,shift,category,status,updatedAt:new Date().toISOString(),comment:details.comment||"",replacementId:details.replacementId||null,manager:details.manager||state.role};
  state.weeks[state.currentWeek].history.push(`${shortName(employee(empId)?.name)}: ${status}${details.comment?` — ${details.comment}`:""}`);
  render(); toast("Посещаемость сохранена");
}
function attendanceCommentPrompt(){ return prompt("Комментарий (необязательно):","")||""; }
function markAttendance(day,empId,shift,category,status){ setAttendanceWithDetails(day,empId,shift,category,status,{comment:attendanceCommentPrompt()}); }
function eligibleReplacementCandidates(day,shift,category,absentId){
  return state.employees.filter(e=>e.id!==absentId).map(e=>({emp:e,check:validateReplacementCandidate(e,day,shift,category)})).filter(x=>x.check.ok).sort((a,b)=>{
    const af=fullDaysInWindow(a.emp.id,day,7).length, bf=fullDaysInWindow(b.emp.id,day,7).length;
    return af-bf || shortName(a.emp.name).localeCompare(shortName(b.emp.name),"ru");
  });
}
function openReplacementPicker(day,absentId,shift,category){
  const candidates=eligibleReplacementCandidates(day,shift,category,absentId);
  const drawer=document.getElementById("drawer");
  drawer.innerHTML=`<div class="drawerHead"><div><h2>Выбрать замену</h2><div class="muted">${day} · ${category} · ${shift}</div></div><button class="drawerClose" onclick="closeDrawer()">✕</button></div>
  <div class="infoBox"><input id="replacementSearch" placeholder="Поиск по ФИО" oninput="filterReplacementCards(this.value)"></div>
  <div id="replacementCards">${candidates.map(({emp,check})=>`<button class="replacementCard" data-name="${emp.name.toLowerCase()}" onclick="confirmReplacement('${day}','${absentId}','${shift}','${category}','${emp.id}')"><b>${shortName(emp.name)}</b><span>${emp.position} · ${emp.defaultShift}</span><small>Фуллов за 7 дней: ${fullDaysInWindow(emp.id,day,7).length} · после замены ${check.projected}ч</small></button>`).join("")||'<div class="infoBox">Нет доступных сотрудников по ограничениям.</div>'}</div>`;
  drawer.classList.add("open");
}
function filterReplacementCards(q){ document.querySelectorAll(".replacementCard").forEach(el=>el.style.display=el.dataset.name.includes(String(q).toLowerCase())?"flex":"none"); }
function confirmReplacement(day,absentId,shift,category,replId){
  const repl=employee(replId); const check=validateReplacementCandidate(repl,day,shift,category);
  if(!check.ok) return toast(check.reason);
  const comment=prompt("Комментарий к замене:",`${shortName(repl.name)} вышел вместо ${shortName(employee(absentId)?.name)}`)||"";
  ensureAttendance();
  const absentKey=attendanceKey(day,absentId,shift,category);
  state.weeks[state.currentWeek].attendance[absentKey]={day,empId:absentId,shift,category,status:"Не вышел",updatedAt:new Date().toISOString(),replacementId:replId,comment,manager:state.role};
  removeOffForEmployee(day,replId);
  state.weeks[state.currentWeek].schedule[day].push({employeeId:replId,category,shift,status:"changed",replacement:true,replacementFor:absentId,additionalShift:hoursForEmployeeOnDayAnyWeek(replId,day)>0,comment});
  state.weeks[state.currentWeek].history.push(`${shortName(repl.name)} заменил ${shortName(employee(absentId)?.name)}: ${category}, ${shift}`);
  closeDrawer(); render(); toast("Замена добавлена");
}
function weeklyEmployeeMetrics(empId){
  ensureAttendance(); const days=getWeekDays(state.currentWeek).map(dateKey); let planned=0,came=0,absent=0,early=0,replaced=0,replacements=0,fulls=0,violations=0;
  days.forEach(day=>{
    const items=dayItems(day).filter(i=>i.employeeId===empId&&isWorkItem(i)); planned+=items.length;
    if(hoursForEmployeeOnDayAnyWeek(empId,day)>=FULL_DAY_MIN_HOURS) fulls++;
    items.forEach(i=>{ const a=state.weeks[state.currentWeek].attendance[attendanceKey(day,empId,i.shift,i.category)]; if(a?.status==="Вышел") came++; if(a?.status==="Не вышел") absent++; if(a?.status==="Ушёл раньше") early++; if(a?.replacementId) replaced++; if(i.replacement) replacements++; if(i.violation) violations++; });
  });
  const marked=Math.max(1,came+absent+early); const score=Math.max(0,Math.min(100,Math.round(100-(absent*20)-(early*10)-(violations*15)+(replacements*3))));
  return {planned,came,absent,early,replaced,replacements,fulls,violations,score,marked};
}
function recommendationFor(empId){ const m=weeklyEmployeeMetrics(empId); const reasons=[]; let days=0; if(m.absent>=2){days=Math.max(days,2);reasons.push("часто не выходит");} if(m.early>=2){days=Math.max(days,1);reasons.push("часто уходит раньше");} if(m.fulls>=MAX_FULLS_IN_7_DAYS){days=Math.max(days,2);reasons.push("высокая нагрузка");} if(m.score<70){days=Math.max(days,2);reasons.push("низкое соблюдение графика");} return {days,reasons}; }
function renderAttendance(){
  const target=document.getElementById("attendance"); if(!target)return; ensureAttendance();
  const days=getWeekDays(state.currentWeek).map(dateKey); if(!attendanceSelectedDay||!days.includes(attendanceSelectedDay)) attendanceSelectedDay=days.includes(dateKey(new Date()))?dateKey(new Date()):days[0];
  const items=dayItems(attendanceSelectedDay).filter(i=>isWorkItem(i));
  const rows=items.map(i=>{ const emp=employee(i.employeeId); if(!emp)return""; const a=state.weeks[state.currentWeek].attendance[attendanceKey(attendanceSelectedDay,i.employeeId,i.shift,i.category)]; const status=a?.status||"Не отмечено"; return `<tr><td><b>${shortName(emp.name)}</b>${i.replacement?'<br><span class="badge high">Замена</span>':''}</td><td>${i.category}</td><td>${i.shift}</td><td><span class="badge ${status==="Вышел"?"ok":status==="Не вышел"?"low":status==="Ушёл раньше"?"high":""}">${status}</span>${a?.comment?`<br><small>${a.comment}</small>`:""}</td><td class="attendanceActions"><button onclick="markAttendance('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}','Вышел')">✅ Вышел</button><button class="secondary" onclick="markAttendance('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}','Ушёл раньше')">🟡 Ушёл раньше</button><button class="danger" onclick="openReplacementPicker('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}')">❌ Не вышел / замена</button></td></tr>`; }).join("");
  const report=state.employees.filter(e=>e.active).map(e=>{const m=weeklyEmployeeMetrics(e.id);const r=recommendationFor(e.id);return `<tr><td>${shortName(e.name)}</td><td>${m.planned}</td><td>${m.came}</td><td>${m.absent}</td><td>${m.early}</td><td>${m.replacements}</td><td>${m.fulls}</td><td><b>${m.score}</b></td><td>${r.days?`Рекомендуется ${r.days} выходных<br><small>${r.reasons.join(", ")}</small>`:"—"}</td></tr>`}).join("");
  target.innerHTML=`<div class="card"><div class="toolbar"><div><h3>Посещаемость</h3><p class="muted">Доступно администратору и менеджеру</p></div><select onchange="attendanceSelectedDay=this.value;render()">${days.map((d,i)=>`<option value="${d}" ${d===attendanceSelectedDay?'selected':''}>${daysShort[i]} ${d}</option>`).join("")}</select></div><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>Зона</th><th>Время</th><th>Статус</th><th>Действия</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Нет назначений</td></tr>'}</tbody></table></div></div>
  <div class="card admin-only"><h3>Рейтинг соблюдения графика за неделю</h3><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>План</th><th>Вышел</th><th>Не вышел</th><th>Ушёл раньше</th><th>Вышел на замену</th><th>Фуллы</th><th>Рейтинг</th><th>Рекомендация</th></tr></thead><tbody>${report}</tbody></table></div></div>`;
}
function setFullBlock(empId,enabled){ const e=employee(empId); if(!e)return; e.fullLimitBlocked=enabled; e.fullBlockReason=document.getElementById(`blockReason_${empId}`)?.value||e.fullBlockReason||""; e.fullBlockStart=document.getElementById(`blockStart_${empId}`)?.value||e.fullBlockStart||dateKey(new Date()); e.fullBlockEnd=document.getElementById(`blockEnd_${empId}`)?.value||e.fullBlockEnd||""; e.fullBlockAddedBy="Администратор"; saveState(); render(); toast(enabled?"Запрет фуллов установлен":"Запрет снят"); }
function renderWorkloadControl(){
  const el=document.getElementById("workload"); if(!el)return;
  const rows=state.employees.filter(e=>e.active).map(e=>{const m=weeklyEmployeeMetrics(e.id);return `<tr><td><b>${shortName(e.name)}</b><br><small>${e.position}</small></td><td>${m.fulls}</td><td>${m.score}</td><td><input id="blockStart_${e.id}" type="date" value="${e.fullBlockStart||dateKey(new Date())}"></td><td><input id="blockEnd_${e.id}" type="date" value="${e.fullBlockEnd||""}"></td><td><input id="blockReason_${e.id}" value="${e.fullBlockReason||""}" placeholder="Причина"></td><td>${e.fullLimitBlocked?`<button class="danger" onclick="setFullBlock('${e.id}',false)">Снять запрет</button>`:`<button onclick="setFullBlock('${e.id}',true)">Запретить фуллы</button>`}</td></tr>`}).join("");
  el.innerHTML=`<div class="quickStats"><div class="stat"><small>Максимум фуллов за 7 дней</small><b>${MAX_FULLS_IN_7_DAYS}</b></div><div class="stat"><small>Подряд разрешено</small><b>${MAX_CONSECUTIVE_FULLS}</b></div><div class="stat"><small>Фулл считается от</small><b>${FULL_DAY_MIN_HOURS}ч</b></div></div><div class="card"><h3>Ограничения нагрузки</h3><p class="muted">Запрет действует только на дополнительные длинные смены и замены. Обычный график не удаляется.</p><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>Фуллы</th><th>Рейтинг</th><th>Начало</th><th>Окончание</th><th>Причина</th><th>Действие</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
// Проверяем ограничения и при ручном добавлении второй смены.
const originalAddSecondAssignmentFromDrawer = typeof addSecondAssignmentFromDrawer === "function" ? addSecondAssignmentFromDrawer : null;
function addSecondAssignmentFromDrawer(day,empId){
  const emp=employee(empId); if(!emp)return toast("Сотрудник не найден");
  const category=document.getElementById("drawerCategory")?.value||emp.position;
  const start=document.getElementById("drawerStart")?.value; const end=document.getElementById("drawerEnd")?.value;
  const shift=(start&&end)?`${start}-${end}`:(document.getElementById("drawerShift")?.value||emp.defaultShift);
  ensureShiftTemplate(shift);
  const check=validateReplacementCandidate(emp,day,shift,category); if(!check.ok)return toast(check.reason);
  removeOffForEmployee(day,empId);
  state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,category,shift,status:"changed",bySkill:category!==emp.position,additionalShift:true,comment:document.getElementById("drawerComment")?.value||""});
  state.weeks[state.currentWeek].history.push(`${shortName(emp.name)}: дополнительная зона ${category}, ${shift}`);
  closeDrawer(); render(); toast(`Добавлено. Всего ${check.projected} часов`);
}

const navButtons = document.querySelectorAll(".nav");
navButtons.forEach(n=>n.onclick=()=>{currentPage=n.dataset.page; render();});
const roleSelect = document.getElementById("roleSelect");
if(roleSelect){ roleSelect.value=state.role; roleSelect.onchange=e=>{state.role=e.target.value; if(state.role==='manager') currentPage='managerBoard'; render();}; }
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
// V9.1 helpers and final overrides
function ensureShiftTemplate(shift){
  if(shiftTemplates[shift]) return shiftTemplates[shift];
  const info=shiftInfo(shift);
  if(!info) return null;
  shiftTemplates[shift]=info;
  return info;
}
function renderManagerIdentity(){
  const box=document.getElementById('managerIdentityWrap');
  const sel=document.getElementById('managerIdentitySelect');
  if(!box||!sel)return;
  box.style.display=state.role==='manager'?'block':'none';
  const managers=state.employees.filter(e=>e.active&&(e.position==='Менеджер'||e.position==='Менеджер официантской зоны'));
  sel.innerHTML='<option value="">Выберите себя</option>'+managers.map(e=>`<option value="${e.id}" ${state.currentManagerId===e.id?'selected':''}>${shortName(e.name)} · ${e.position}</option>`).join('');
}
function currentActorName(){ return state.role==='admin'?'Администратор':(shortName(employee(state.currentManagerId)?.name)||'Менеджер'); }
function setCurrentManager(id){ state.currentManagerId=id; saveState(); render(); }

function changeEmployeePosition(empId,newPosition){
  const e=employee(empId); if(!e)return;
  const old=e.position; e.position=newPosition;
  e.skills=Array.from(new Set([...(e.skills||[]),newPosition]));
  Object.values(state.weeks||{}).forEach(w=>Object.keys(w.schedule||{}).forEach(day=>{
    (w.schedule[day]||[]).forEach(i=>{ if(i.employeeId===empId&&i.category===old&&i.status!=='off') i.category=newPosition; });
  }));
  saveState(); render(); toast('Должность изменена');
}
function changeEmployeeDefaultShift(empId,newShift){ const e=employee(empId); if(!e)return; ensureShiftTemplate(newShift); e.defaultShift=newShift; saveState(); render(); toast('Основное время изменено'); }
function renderEmployees(){
  const el=document.getElementById('employees'); if(!el)return;
  el.innerHTML=`<div class="card"><h3>Добавить сотрудника</h3><div class="filters"><input id="newName" placeholder="ФИО"><select id="newPos">${editableCategories.map(c=>`<option>${c}</option>`).join('')}</select><select id="newShift">${Object.keys(shiftTemplates).map(s=>`<option>${s}</option>`).join('')}</select><button onclick="addEmployee()">Добавить</button></div></div>
  <div class="list">${state.employees.filter(e=>e.active).map(e=>`<div class="employeeRow"><b>${e.name}</b><select onchange="changeEmployeePosition('${e.id}',this.value)">${editableCategories.map(c=>`<option ${c===e.position?'selected':''}>${c}</option>`).join('')}</select><select onchange="changeEmployeeDefaultShift('${e.id}',this.value)">${Object.keys(shiftTemplates).map(s=>`<option ${s===e.defaultShift?'selected':''}>${s}</option>`).join('')}</select><span>${(e.skills||[]).map(s=>`<i class="pill">${s}</i>`).join('')}</span>${serviceRatedCategories.includes(e.position)?`<span>Сервис: <input type="number" min="0" max="100" value="${e.serviceScore??50}" onchange="setServiceScore('${e.id}',this.value)" style="width:70px"></span>`:'<span></span>'}<button class="danger" onclick="removeEmployee('${e.id}')">Удалить</button></div>`).join('')}</div>`;
}

function managerSetDaysOff(empId){
  const days=selectedManagerDays(); if(!days.length)return toast('Выберите дни');
  const emp=employee(empId); if(!emp)return;
  const warnings=[];
  days.forEach(day=>{
    const work=dayItems(day).filter(i=>i.employeeId===empId&&isWorkItem(i));
    work.forEach(i=>{
      Object.keys(staffingBlocks).forEach(sh=>{
        if(coversShift(i,sh)>0){ const after=coverage(day,i.category,sh)-1; const n=need(day,i.category,sh); if(after<n) warnings.push(`${day}: ${i.category}, ${sh} станет ${after}/${n}`); }
      });
    });
  });
  if(warnings.length&&!confirm(`После выходного будет нехватка:\n\n${warnings.join('\n')}\n\nВсё равно поставить?`))return;
  days.forEach(day=>{ state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>i.employeeId!==empId); state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,status:'off'}); });
  state.weeks[state.currentWeek].history.push(`${currentActorName()}: ${shortName(emp.name)} — выходные ${days.join(', ')}`); closeDrawer(); render(); toast('Выходные сохранены');
}
function openSkillPicker(day,category,shiftName){
  const defaultShift=shiftName==='1 смена'?'08:00-16:00':shiftName==='2 смена'?'16:00-23:00':'23:00-08:00';
  const candidates=state.employees.filter(e=>e.active&&canWorkCategory(e,category)&&!isDayOff(day,e.id)).map(e=>({e,check:validateReplacementCandidate(e,day,defaultShift,category)})).filter(x=>x.check.ok);
  const drawer=document.getElementById('drawer');
  drawer.innerHTML=`<div class="drawerHead"><div><h2>Добавить сотрудника</h2><div class="muted">${category} · ${day}</div></div><button class="drawerClose" onclick="closeDrawer()">✕</button></div><div class="infoBox"><input placeholder="Поиск по ФИО" oninput="filterReplacementCards(this.value)"></div><div>${candidates.map(({e,check})=>`<button class="replacementCard" data-name="${e.name.toLowerCase()}" onclick="addFromSkillPicker('${day}','${category}','${defaultShift}','${e.id}')"><b>${shortName(e.name)}</b><span>${e.position} · ${e.defaultShift}</span><small>После назначения ${check.projected}ч · фуллов ${fullDaysInWindow(e.id,day,7).length}</small></button>`).join('')||'<div class="infoBox">Нет подходящих свободных сотрудников</div>'}</div>`;
  drawer.classList.add('open');
}
function addFromSkillPicker(day,category,shift,empId){ const e=employee(empId); const check=validateReplacementCandidate(e,day,shift,category); if(!check.ok)return toast(check.reason); removeOffForEmployee(day,empId); state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,category,shift,status:'changed',bySkill:category!==e.position,additionalShift:hoursForEmployeeOnDayAnyWeek(empId,day)>0,comment:''}); state.weeks[state.currentWeek].history.push(`${currentActorName()}: ${shortName(e.name)} добавлен ${category}, ${shift}`); closeDrawer(); render(); toast('Сотрудник добавлен'); }

function managerPerformanceReport(){
  ensureAttendance(); const map={};
  Object.values(state.weeks[state.currentWeek].attendance||{}).forEach(a=>{ const n=a.manager||'Менеджер'; if(!map[n])map[n]={name:n,marked:0,replacements:0,comments:0}; map[n].marked++; if(a.replacementId)map[n].replacements++; if(a.comment)map[n].comments++; });
  const planned=getWeekDays(state.currentWeek).map(dateKey).reduce((s,d)=>s+dayItems(d).filter(isWorkItem).length,0);
  return Object.values(map).map(x=>{ const score=planned?Math.min(100,Math.round((x.marked/planned)*100)):0; return `<tr><td>${x.name}</td><td>${x.marked}</td><td>${x.replacements}</td><td>${x.comments}</td><td><b>${score}%</b></td></tr>`; }).join('')||'<tr><td colspan="5">Пока менеджеры не отмечали посещаемость</td></tr>';
}
const _renderAttendanceV9=renderAttendance;
renderAttendance=function(){ _renderAttendanceV9(); const target=document.getElementById('attendance'); if(!target||state.role!=='admin')return; target.insertAdjacentHTML('beforeend',`<div class="card admin-only"><h3>Рейтинг работы менеджеров</h3><table class="table"><thead><tr><th>Менеджер</th><th>Отметок</th><th>Замен</th><th>Комментариев</th><th>Выполнение</th></tr></thead><tbody>${managerPerformanceReport()}</tbody></table></div>`); };

// Добавляем идентификацию менеджера в общий render.
const _renderV9=render;
render=function(options={}){ _renderV9(options); renderManagerIdentity(); };
render({save:false});

// ================= SAFIA SCHEDULE V10: ФИЛЬТРЫ НАГРУЗКИ И ЛИЧНАЯ ПОСЕЩАЕМОСТЬ =================
let workloadFilterV10 = { search:'', category:'Все', shift:'Все', status:'Все', from:'', to:'' };

function resetWorkloadFilterV10(){
  workloadFilterV10={search:'',category:'Все',shift:'Все',status:'Все',from:'',to:''};
  render();
}
function workloadStatusV10(emp, day=dateKey(new Date())){
  if(activeFullBlock(emp,day)) return 'Есть запрет';
  const fulls=fullDaysInWindow(emp.id,day,7).length;
  if(fulls>=MAX_FULLS_IN_7_DAYS) return 'Достиг лимита';
  if(fulls>=2) return 'Предупреждение';
  return 'Без запрета';
}
function renderWorkloadControl(){
  const el=document.getElementById('workload'); if(!el)return;
  if(state.role!=='admin'){ el.innerHTML='<div class="card"><h3>Контроль нагрузки</h3><p class="muted">Доступно только администратору.</p></div>'; return; }
  const today=dateKey(new Date());
  const rows=state.employees.filter(e=>e.active).map(e=>({e,m:weeklyEmployeeMetrics(e.id),status:workloadStatusV10(e,today)})).filter(({e,status})=>{
    if(workloadFilterV10.search&&!e.name.toLowerCase().includes(workloadFilterV10.search.toLowerCase()))return false;
    if(workloadFilterV10.category!=='Все'&&e.position!==workloadFilterV10.category)return false;
    if(workloadFilterV10.shift!=='Все'&&e.defaultShift!==workloadFilterV10.shift)return false;
    if(workloadFilterV10.status!=='Все'&&status!==workloadFilterV10.status)return false;
    if(workloadFilterV10.from&&e.fullBlockEnd&&e.fullBlockEnd<workloadFilterV10.from)return false;
    if(workloadFilterV10.to&&e.fullBlockStart&&e.fullBlockStart>workloadFilterV10.to)return false;
    return true;
  });
  el.innerHTML=`<div class="quickStats"><div class="stat"><small>Максимум фуллов за 7 дней</small><b>${MAX_FULLS_IN_7_DAYS}</b></div><div class="stat"><small>Подряд разрешено</small><b>${MAX_CONSECUTIVE_FULLS}</b></div><div class="stat"><small>Фулл считается от</small><b>${FULL_DAY_MIN_HOURS}ч</b></div></div>
  <div class="card"><h3>Фильтр контроля нагрузки</h3><div class="filters">
    <input placeholder="Поиск по ФИО" value="${workloadFilterV10.search}" oninput="workloadFilterV10.search=this.value;renderWorkloadControl()">
    <select onchange="workloadFilterV10.category=this.value;renderWorkloadControl()"><option>Все</option>${editableCategories.map(c=>`<option ${workloadFilterV10.category===c?'selected':''}>${c}</option>`).join('')}</select>
    <select onchange="workloadFilterV10.shift=this.value;renderWorkloadControl()"><option>Все</option>${Object.keys(shiftTemplates).map(s=>`<option ${workloadFilterV10.shift===s?'selected':''}>${s}</option>`).join('')}</select>
    <select onchange="workloadFilterV10.status=this.value;renderWorkloadControl()">${['Все','Есть запрет','Без запрета','Достиг лимита','Предупреждение'].map(s=>`<option ${workloadFilterV10.status===s?'selected':''}>${s}</option>`).join('')}</select>
    <input type="date" value="${workloadFilterV10.from}" onchange="workloadFilterV10.from=this.value;renderWorkloadControl()" title="Запрет с">
    <input type="date" value="${workloadFilterV10.to}" onchange="workloadFilterV10.to=this.value;renderWorkloadControl()" title="Запрет до">
    <button class="secondary" onclick="resetWorkloadFilterV10()">Сбросить</button>
  </div></div>
  <div class="card"><h3>Ограничения нагрузки (${rows.length})</h3><p class="muted">Запрет действует только на дополнительные длинные смены и замены. Обычный график не удаляется.</p><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>Должность</th><th>Смена</th><th>Фуллы</th><th>Рейтинг</th><th>Статус</th><th>Начало</th><th>Окончание</th><th>Причина</th><th>Действие</th></tr></thead><tbody>${rows.map(({e,m,status})=>`<tr><td><b>${shortName(e.name)}</b></td><td>${e.position}</td><td>${e.defaultShift}</td><td>${m.fulls}</td><td>${m.score}</td><td><span class="badge ${status==='Есть запрет'||status==='Достиг лимита'?'low':status==='Предупреждение'?'high':'ok'}">${status}</span></td><td><input id="blockStart_${e.id}" type="date" value="${e.fullBlockStart||today}"></td><td><input id="blockEnd_${e.id}" type="date" value="${e.fullBlockEnd||''}"></td><td><input id="blockReason_${e.id}" value="${e.fullBlockReason||''}" placeholder="Причина"></td><td>${e.fullLimitBlocked?`<button class="danger" onclick="setFullBlock('${e.id}',false)">Снять запрет</button>`:`<button onclick="setFullBlock('${e.id}',true)">Запретить фуллы</button>`}</td></tr>`).join('')||'<tr><td colspan="10">По фильтру сотрудников нет</td></tr>'}</tbody></table></div></div>`;
}

function managerViewForEmployeeV10(emp){
  if(!emp)return null;
  const service=emp.position==='Менеджер официантской зоны'||isServiceManager(emp);
  const sh=emp.defaultShift||'';
  if(service) return (sh.startsWith('08:')||sh.startsWith('09:'))?'service1':'service2';
  if(sh==='23:00-08:00'||sh==='20:00-08:00'||sh==='17:00-02:00')return 'branch3';
  return (sh.startsWith('08:')||sh.startsWith('09:'))?'branch1':'branch2';
}
function itemMatchesManagerV10(item,manager){
  const key=managerViewForEmployeeV10(manager); if(!key)return false;
  const view=managerViews[key]; if(!view)return false;
  return view.categories.includes(item.category)&&coversShift(item,view.shift)>0;
}
function cancelAttendanceV10(day,empId,shift,category){
  ensureAttendance(); const key=attendanceKey(day,empId,shift,category);
  if(!state.weeks[state.currentWeek].attendance[key])return toast('Отметка уже отсутствует');
  delete state.weeks[state.currentWeek].attendance[key];
  state.weeks[state.currentWeek].history.push(`${currentActorName()}: отменена посещаемость ${shortName(employee(empId)?.name)} · ${day}`);
  render(); toast('Отметка посещаемости отменена');
}
function renderAttendance(){
  const target=document.getElementById('attendance'); if(!target)return; ensureAttendance();
  const days=getWeekDays(state.currentWeek).map(dateKey);
  if(!attendanceSelectedDay||!days.includes(attendanceSelectedDay))attendanceSelectedDay=days.includes(dateKey(new Date()))?dateKey(new Date()):days[0];
  const currentManager=employee(state.currentManagerId);
  let items=dayItems(attendanceSelectedDay).filter(i=>isWorkItem(i));
  if(state.role==='manager') items=currentManager?items.filter(i=>itemMatchesManagerV10(i,currentManager)):[];
  const rows=items.map(i=>{const emp=employee(i.employeeId);if(!emp)return'';const key=attendanceKey(attendanceSelectedDay,i.employeeId,i.shift,i.category);const a=state.weeks[state.currentWeek].attendance[key];const status=a?.status||'Не отмечено';return `<tr><td><b>${shortName(emp.name)}</b>${i.replacement?'<br><span class="badge high">Замена</span>':''}</td><td>${i.category}</td><td>${i.shift}</td><td><span class="badge ${status==='Вышел'?'ok':status==='Не вышел'?'low':status==='Ушёл раньше'?'high':''}">${status}</span>${a?.comment?`<br><small>${a.comment}</small>`:''}</td><td class="attendanceActions"><button onclick="markAttendance('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}','Вышел')">✅ Вышел</button><button class="secondary" onclick="markAttendance('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}','Ушёл раньше')">🟡 Ушёл раньше</button><button class="danger" onclick="openReplacementPicker('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}')">❌ Не вышел / замена</button>${a?`<button class="secondary" onclick="cancelAttendanceV10('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}')">↩ Отменить</button>`:''}</td></tr>`;}).join('');
  const managerNotice=state.role==='manager'?`<div class="infoBox"><b>${currentManager?shortName(currentManager.name):'Менеджер не выбран'}</b><br><span class="muted">Показываются сотрудники только вашей панели. Для замены предлагаются подходящие сотрудники из любых смен.</span></div>`:'';
  const report=state.employees.filter(e=>e.active).map(e=>{const m=weeklyEmployeeMetrics(e.id),r=recommendationFor(e.id);return `<tr><td>${shortName(e.name)}</td><td>${m.planned}</td><td>${m.came}</td><td>${m.absent}</td><td>${m.early}</td><td>${m.replacements}</td><td>${m.fulls}</td><td><b>${m.score}</b></td><td>${r.days?`Рекомендуется ${r.days} выходных<br><small>${r.reasons.join(', ')}</small>`:'—'}</td></tr>`}).join('');
  target.innerHTML=`${managerNotice}<div class="card"><div class="toolbar"><div><h3>Посещаемость</h3><p class="muted">${state.role==='manager'?'Выберите себя слева в панели роли':'Полный доступ администратора'}</p></div><select onchange="attendanceSelectedDay=this.value;render()">${days.map((d,i)=>`<option value="${d}" ${d===attendanceSelectedDay?'selected':''}>${daysShort[i]} ${d}</option>`).join('')}</select></div><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>Зона</th><th>Время</th><th>Статус</th><th>Действия</th></tr></thead><tbody>${rows||`<tr><td colspan="5">${state.role==='manager'&&!currentManager?'Сначала выберите себя':'Нет назначений'}</td></tr>`}</tbody></table></div></div>${state.role==='admin'?`<div class="card admin-only"><h3>Рейтинг соблюдения графика за неделю</h3><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>План</th><th>Вышел</th><th>Не вышел</th><th>Ушёл раньше</th><th>Вышел на замену</th><th>Фуллы</th><th>Рейтинг</th><th>Рекомендация</th></tr></thead><tbody>${report}</tbody></table></div></div><div class="card admin-only"><h3>Рейтинг работы менеджеров</h3><table class="table"><thead><tr><th>Менеджер</th><th>Отметок</th><th>Замен</th><th>Комментариев</th><th>Выполнение</th></tr></thead><tbody>${managerPerformanceReport()}</tbody></table></div>`:''}`;
}

// Финальный render V10: сохраняет текущую логику и новые панели.
const _renderBeforeV10=render;
render=function(options={}){ _renderBeforeV10(options); renderManagerIdentity(); if(currentPage==='workload')renderWorkloadControl(); if(currentPage==='attendance')renderAttendance(); };
render({save:false});

// ================= SAFIA SCHEDULE V11: ПАНЕЛИ, ПЕРИОДЫ И КОНТРОЛЬ ШТАТКИ =================
const MANAGER_PANEL_KEYS_V11 = ["branch1", "service1", "branch2", "service2", "shift3"];

function managerPanelKeyV11(emp){
  if(!emp) return null;
  if(emp.managerPanel && managerViews[emp.managerPanel]) return emp.managerPanel;

  const isService = emp.position === "Менеджер официантской зоны" || isServiceManager(emp);
  const shift = String(emp.defaultShift || "");

  if(isService){
    return (shift.startsWith("08:") || shift.startsWith("09:")) ? "service1" : "service2";
  }

  if(["23:00-08:00", "20:00-08:00", "17:00-02:00"].includes(shift)){
    return "shift3";
  }

  return (shift.startsWith("08:") || shift.startsWith("09:")) ? "branch1" : "branch2";
}

function itemMatchesManagerV11(item, manager){
  const key = managerPanelKeyV11(manager);
  const view = key ? managerViews[key] : null;
  if(!view || !item || !isWorkItem(item)) return false;
  return view.categories.includes(item.category) && coversShift(item, view.shift) > 0;
}

function setManagerPanelV11(managerId, panelKey){
  const emp = employee(managerId);
  if(!emp || !managerViews[panelKey]) return;
  emp.managerPanel = panelKey;
  state.weeks[state.currentWeek].history = state.weeks[state.currentWeek].history || [];
  state.weeks[state.currentWeek].history.push(`${currentActorName()}: ${shortName(emp.name)} закреплён за панелью «${managerViews[panelKey].title}»`);
  saveState();
  render();
  toast("Панель менеджера сохранена");
}

function ensureStaffingAlertV11(){
  let el = document.getElementById("staffingAlertV11");
  if(el) return el;
  el = document.createElement("div");
  el.id = "staffingAlertV11";
  el.className = "staffingAlertV11";
  el.innerHTML = `<button onclick="hideStaffingAlertV11()">✕</button><div id="staffingAlertTextV11"></div>`;
  document.body.appendChild(el);
  return el;
}

function showStaffingAlertV11(lines, type="danger"){
  if(!Array.isArray(lines)) lines = [String(lines || "")];
  const el = ensureStaffingAlertV11();
  el.className = `staffingAlertV11 show ${type}`;
  const text = document.getElementById("staffingAlertTextV11");
  if(text) text.innerHTML = `<b>Проверка штатки</b>${lines.map(line=>`<div>${line}</div>`).join("")}`;
  clearTimeout(window.__staffingAlertTimerV11);
  window.__staffingAlertTimerV11 = setTimeout(()=>hideStaffingAlertV11(), 9000);
}

function hideStaffingAlertV11(){
  document.getElementById("staffingAlertV11")?.classList.remove("show");
}

function affectedSlotsForEmployeeV11(empId, days){
  const emp = employee(empId);
  const slots = [];
  days.forEach(day=>{
    const items = dayItems(day).filter(i=>i.employeeId===empId && isWorkItem(i));
    if(items.length){
      items.forEach(item=>{
        Object.keys(staffingBlocks).forEach(sh=>{
          if(coversShift(item, sh)>0) slots.push({day, category:item.category, shift:sh});
        });
      });
    } else if(emp){
      Object.keys(staffingBlocks).forEach(sh=>{
        if(coversShift({shift:emp.defaultShift}, sh)>0) slots.push({day, category:emp.position, shift:sh});
      });
    }
  });
  return slots.filter((slot,index,arr)=>arr.findIndex(x=>x.day===slot.day&&x.category===slot.category&&x.shift===slot.shift)===index);
}

function staffingMessagesForSlotsV11(slots){
  const lines=[];
  slots.forEach(({day,category,shift})=>{
    const actual=coverage(day,category,shift);
    const required=need(day,category,shift);
    if(actual<required){
      lines.push(`🔴 ${day} · ${category} · ${shift}: не хватает ${required-actual} (стоит ${actual}, нужно ${required}). Выходных поставлено слишком много.`);
    } else if(actual>required){
      lines.push(`🔴 ${day} · ${category} · ${shift}: лишние ${actual-required} (стоит ${actual}, нужно ${required}). Выходных поставлено слишком мало.`);
    }
  });
  return lines;
}

function checkAndNotifyStaffingV11(slots){
  const lines=staffingMessagesForSlotsV11(slots);
  if(lines.length) showStaffingAlertV11(lines,"danger");
  else showStaffingAlertV11(["✅ Штатка соблюдена по выбранным дням."],"success");
  return lines;
}

function openManagerBulkActions(empId){
  const emp=employee(empId); if(!emp) return;
  const days=getWeekDays(state.currentWeek);
  const drawer=document.getElementById("drawer");
  drawer.innerHTML=`<div class="drawerHead"><div><h2>${shortName(emp.name)}</h2><div class="muted">${emp.position} · ${emp.defaultShift}</div></div><button class="drawerClose" onclick="closeDrawer()">✕</button></div>
  <div class="infoBox"><b>Выберите дни или период</b><div class="bulkDays">${days.map((d,i)=>`<label><input type="checkbox" class="managerBulkDay" value="${dateKey(d)}"> ${daysShort[i]} ${formatDate(d)}</label>`).join("")}</div></div>
  <div class="drawerActions">
    <button onclick="managerSetDaysOff('${empId}')">Поставить выходные</button>
    <button class="danger" onclick="managerUnassignDaysV11('${empId}')">Не назначать на выбранные дни</button>
    <button class="secondary" onclick="managerSelectWholeWeek()">Выбрать всю неделю</button>
    <button class="secondary" onclick="managerRestoreDays('${empId}')">Вернуть в график</button>
  </div>
  <div class="infoBox muted">«Не назначать» убирает смену только на выбранные дни, но не ставит статус «Выходной». В остальных днях график не меняется.</div>`;
  drawer.classList.add("open");
}

function managerSetDaysOff(empId){
  const days=selectedManagerDays();
  if(!days.length) return toast("Выберите дни");
  const slots=affectedSlotsForEmployeeV11(empId,days);

  days.forEach(day=>{
    state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>i.employeeId!==empId);
    state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,status:"off",setBy:currentActorName(),setAt:new Date().toISOString()});
  });

  state.weeks[state.currentWeek].history.push(`${currentActorName()}: ${shortName(employee(empId)?.name)} — выходные ${days.join(', ')}`);
  closeDrawer();
  render();
  const issues=checkAndNotifyStaffingV11(slots);
  toast(issues.length ? "Выходные сохранены, проверьте красное предупреждение" : "Выходные сохранены");
}

function managerUnassignDaysV11(empId){
  const days=selectedManagerDays();
  if(!days.length) return toast("Выберите дни");
  const slots=affectedSlotsForEmployeeV11(empId,days);

  days.forEach(day=>{
    state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>!(i.employeeId===empId && isWorkItem(i)));
  });

  state.weeks[state.currentWeek].history.push(`${currentActorName()}: ${shortName(employee(empId)?.name)} не назначен на ${days.join(', ')}`);
  closeDrawer();
  render();
  const issues=checkAndNotifyStaffingV11(slots);
  toast(issues.length ? "Назначения убраны, проверьте штатку" : "Назначения убраны");
}

function managerRestoreDays(empId){
  const emp=employee(empId), days=selectedManagerDays();
  if(!emp||!days.length) return toast("Выберите дни");
  const slots=affectedSlotsForEmployeeV11(empId,days);

  days.forEach(day=>{
    state.weeks[state.currentWeek].schedule[day]=dayItems(day).filter(i=>!(i.employeeId===empId&&i.status==="off"));
    if(!dayItems(day).some(i=>i.employeeId===empId&&isWorkItem(i))){
      state.weeks[state.currentWeek].schedule[day].push({employeeId:empId,category:emp.position,shift:emp.defaultShift,status:"work",restoredBy:currentActorName()});
    }
  });

  state.weeks[state.currentWeek].history.push(`${currentActorName()}: ${shortName(emp.name)} возвращён в график ${days.join(', ')}`);
  closeDrawer();
  render();
  checkAndNotifyStaffingV11(slots);
  toast("Сотрудник возвращён в график");
}

function currentViewStaffingWarningsV11(view){
  const days=getWeekDays(state.currentWeek).map(dateKey);
  const lines=[];
  days.forEach(day=>view.categories.forEach(category=>{
    const actual=coverage(day,category,view.shift);
    const required=need(day,category,view.shift);
    if(actual<required) lines.push(`${day}: ${category} — не хватает ${required-actual}`);
    if(actual>required) lines.push(`${day}: ${category} — лишние ${actual-required}`);
  }));
  return lines;
}

const renderManagerBoardBeforeV11 = renderManagerBoard;
renderManagerBoard = function(){
  renderManagerBoardBeforeV11();
  const el=document.getElementById("managerBoard");
  if(!el) return;
  const view=managerViews[managerViewKey]||managerViews.branch1;
  const warnings=currentViewStaffingWarningsV11(view);
  if(warnings.length){
    const banner=document.createElement("div");
    banner.className="staffingInlineWarningV11";
    banner.innerHTML=`<b>⚠ Нарушение штатки</b><span>${warnings.slice(0,8).join(" · ")}${warnings.length>8?` · ещё ${warnings.length-8}`:""}</span>`;
    const schedule=el.querySelector(".managerSchedule");
    if(schedule) el.insertBefore(banner,schedule);
  }
};

function renderAttendance(){
  const target=document.getElementById('attendance'); if(!target)return; ensureAttendance();
  const days=getWeekDays(state.currentWeek).map(dateKey);
  if(!attendanceSelectedDay||!days.includes(attendanceSelectedDay)) attendanceSelectedDay=days.includes(dateKey(new Date()))?dateKey(new Date()):days[0];

  const currentManager=employee(state.currentManagerId);
  const panelKey=managerPanelKeyV11(currentManager);
  const panel=panelKey?managerViews[panelKey]:null;
  let items=dayItems(attendanceSelectedDay).filter(i=>isWorkItem(i));
  if(state.role==='manager') items=currentManager?items.filter(i=>itemMatchesManagerV11(i,currentManager)):[];

  const rows=items.map(i=>{
    const emp=employee(i.employeeId); if(!emp)return'';
    const key=attendanceKey(attendanceSelectedDay,i.employeeId,i.shift,i.category);
    const a=state.weeks[state.currentWeek].attendance[key];
    const status=a?.status||'Не отмечено';
    return `<tr><td><b>${shortName(emp.name)}</b>${i.replacement?'<br><span class="badge high">Замена</span>':''}</td><td>${i.category}</td><td>${i.shift}</td><td><span class="badge ${status==='Вышел'?'ok':status==='Не вышел'?'low':status==='Ушёл раньше'?'high':''}">${status}</span>${a?.comment?`<br><small>${a.comment}</small>`:''}</td><td class="attendanceActions"><button onclick="markAttendance('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}','Вышел')">✅ Вышел</button><button class="secondary" onclick="markAttendance('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}','Ушёл раньше')">🟡 Ушёл раньше</button><button class="danger" onclick="openReplacementPicker('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}')">❌ Не вышел / замена</button>${a?`<button class="secondary" onclick="cancelAttendanceV10('${attendanceSelectedDay}','${i.employeeId}','${i.shift}','${i.category}')">↩ Отменить</button>`:''}</td></tr>`;
  }).join('');

  const managerNotice=state.role==='manager'?`<div class="infoBox"><b>${currentManager?shortName(currentManager.name):'Менеджер не выбран'}</b><br><span class="muted">${panel?`Ваша панель: ${panel.title}.`:''} Показываются сотрудники только вашей панели. Для замены предлагаются подходящие сотрудники из любых смен.</span></div>`:'';

  const panelControl=state.role==='admin'&&currentManager?`<div class="card"><h3>Закрепление панели менеджера</h3><div class="filters"><select onchange="setManagerPanelV11('${currentManager.id}',this.value)">${MANAGER_PANEL_KEYS_V11.map(key=>`<option value="${key}" ${key===panelKey?'selected':''}>${managerViews[key].title}</option>`).join('')}</select><span class="muted">Используйте это, если менеджер отображает не тех сотрудников.</span></div></div>`:'';

  const report=state.employees.filter(e=>e.active).map(e=>{const m=weeklyEmployeeMetrics(e.id),r=recommendationFor(e.id);return `<tr><td>${shortName(e.name)}</td><td>${m.planned}</td><td>${m.came}</td><td>${m.absent}</td><td>${m.early}</td><td>${m.replacements}</td><td>${m.fulls}</td><td><b>${m.score}</b></td><td>${r.days?`Рекомендуется ${r.days} выходных<br><small>${r.reasons.join(', ')}</small>`:'—'}</td></tr>`}).join('');

  target.innerHTML=`${managerNotice}${panelControl}<div class="card"><div class="toolbar"><div><h3>Посещаемость</h3><p class="muted">${state.role==='manager'?'Выберите себя слева в панели роли':'Полный доступ администратора'}</p></div><select onchange="attendanceSelectedDay=this.value;render()">${days.map((d,i)=>`<option value="${d}" ${d===attendanceSelectedDay?'selected':''}>${daysShort[i]} ${d}</option>`).join('')}</select></div><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>Зона</th><th>Время</th><th>Статус</th><th>Действия</th></tr></thead><tbody>${rows||`<tr><td colspan="5">${state.role==='manager'&&!currentManager?'Сначала выберите себя':'Нет назначений в этой панели на выбранную дату'}</td></tr>`}</tbody></table></div></div>${state.role==='admin'?`<div class="card admin-only"><h3>Рейтинг соблюдения графика за неделю</h3><div class="tableScroll"><table class="table"><thead><tr><th>Сотрудник</th><th>План</th><th>Вышел</th><th>Не вышел</th><th>Ушёл раньше</th><th>Вышел на замену</th><th>Фуллы</th><th>Рейтинг</th><th>Рекомендация</th></tr></thead><tbody>${report}</tbody></table></div></div><div class="card admin-only"><h3>Рейтинг работы менеджеров</h3><table class="table"><thead><tr><th>Менеджер</th><th>Отметок</th><th>Замен</th><th>Комментариев</th><th>Выполнение</th></tr></thead><tbody>${managerPerformanceReport()}</tbody></table></div>`:''}`;
}

const renderBeforeV11 = render;
render = function(options={}){
  renderBeforeV11(options);
  if(currentPage==='managerBoard') renderManagerBoard();
  if(currentPage==='attendance') renderAttendance();
};

render({save:false});

// ================= SAFIA SCHEDULE V11.1: ТОЧНЫЕ ПАНЕЛИ И ВЫБОР ПЕРИОДА =================
const MANAGER_PANEL_BY_NAME_V111 = {
  "axmedova nigoraxon ulugbek qizi": "shift3",
  "rahmatova e'zoza akbar qizi": "branch2",
  "usmanova gulnoza aziz qizi": "branch1",
  "gapparov muhammadrizo sharif o'g'li": "branch1",
  "ibodullayev yodgor ozod o'g'li": "branch2"
};

function normalizeNameV111(name){
  return String(name || "").trim().replace(/\s+/g," ").toLowerCase();
}

function inferredManagerPanelV111(emp){
  if(!emp) return null;
  const exact = MANAGER_PANEL_BY_NAME_V111[normalizeNameV111(emp.name)];
  if(exact) return exact;

  const service = emp.position === "Менеджер официантской зоны" || emp.serviceZone === true ||
    (emp.position === "Менеджер" && (emp.skills || []).includes("Официант"));
  const shift = String(emp.defaultShift || "");

  if(service){
    return (shift.startsWith("08:") || shift.startsWith("09:")) ? "service1" : "service2";
  }
  if(["23:00-08:00","20:00-08:00","17:00-02:00","18:00-02:00"].includes(shift)) return "shift3";
  return (shift.startsWith("08:") || shift.startsWith("09:")) ? "branch1" : "branch2";
}

function ensureManagerPanelsV111(){
  (state.employees || []).forEach(emp => {
    if(emp.position === "Менеджер" || emp.position === "Менеджер официантской зоны"){
      if(!emp.managerPanel || !managerViews[emp.managerPanel]){
        emp.managerPanel = inferredManagerPanelV111(emp);
      }
    }
  });
}

managerPanelKeyV11 = function(emp){
  if(!emp) return null;
  if(emp.managerPanel && managerViews[emp.managerPanel]) return emp.managerPanel;
  return inferredManagerPanelV111(emp);
};

itemMatchesManagerV11 = function(item, manager){
  if(!item || !isWorkItem(item) || !manager) return false;
  const key = managerPanelKeyV11(manager);
  const view = key ? managerViews[key] : null;
  if(!view) return false;
  return view.categories.includes(item.category) && coversShift(item, view.shift) > 0;
};

function managerPanelSelectHtmlV111(emp){
  if(!emp || !["Менеджер","Менеджер официантской зоны"].includes(emp.position)) return "<span>—</span>";
  const current = managerPanelKeyV11(emp) || "branch1";
  return `<select onchange="setManagerPanelV11('${emp.id}',this.value)">${MANAGER_PANEL_KEYS_V11.map(key=>`<option value="${key}" ${key===current?'selected':''}>${managerViews[key].title}</option>`).join('')}</select>`;
}

const renderEmployeesBeforeV111 = renderEmployees;
renderEmployees = function(){
  const el=document.getElementById('employees');
  if(!el) return;
  ensureManagerPanelsV111();
  el.innerHTML=`<div class="card"><h3>Добавить сотрудника</h3><div class="filters"><input id="newName" placeholder="ФИО"><select id="newPos">${editableCategories.map(c=>`<option>${c}</option>`).join('')}</select><select id="newShift">${Object.keys(shiftTemplates).map(s=>`<option>${s}</option>`).join('')}</select><button onclick="addEmployee()">Добавить</button></div></div>
  <div class="card"><h3>Сотрудники</h3><p class="muted">Для менеджеров обязательно проверьте закреплённую панель. Это исправляет пустую или неправильную посещаемость.</p></div>
  <div class="list">${state.employees.filter(e=>e.active).map(e=>`<div class="employeeRow employeeRowV111"><b>${e.name}</b><select onchange="changeEmployeePosition('${e.id}',this.value)">${editableCategories.map(c=>`<option ${c===e.position?'selected':''}>${c}</option>`).join('')}</select><select onchange="changeEmployeeDefaultShift('${e.id}',this.value)">${Object.keys(shiftTemplates).map(s=>`<option ${s===e.defaultShift?'selected':''}>${s}</option>`).join('')}</select><div>${managerPanelSelectHtmlV111(e)}</div><span>${(e.skills||[]).map(s=>`<i class="pill">${s}</i>`).join('')}</span>${serviceRatedCategories.includes(e.position)?`<span>Сервис: <input type="number" min="0" max="100" value="${e.serviceScore??50}" onchange="setServiceScore('${e.id}',this.value)" style="width:70px"></span>`:'<span></span>'}<button class="danger" onclick="removeEmployee('${e.id}')">Удалить</button></div>`).join('')}</div>`;
};

function selectBulkPeriodV111(){
  const from = document.getElementById('bulkPeriodFromV111')?.value;
  const to = document.getElementById('bulkPeriodToV111')?.value;
  if(!from || !to) return toast('Выберите начало и окончание периода');
  if(from > to) return toast('Дата начала позже даты окончания');
  document.querySelectorAll('.managerBulkDay').forEach(box => {
    box.checked = box.value >= from && box.value <= to;
  });
  toast('Период выбран');
}

openManagerBulkActions = function(empId){
  const emp=employee(empId); if(!emp) return;
  const days=getWeekDays(state.currentWeek);
  const first=dateKey(days[0]);
  const last=dateKey(days[days.length-1]);
  const drawer=document.getElementById("drawer");
  drawer.innerHTML=`<div class="drawerHead"><div><h2>${shortName(emp.name)}</h2><div class="muted">${emp.position} · ${emp.defaultShift}</div></div><button class="drawerClose" onclick="closeDrawer()">✕</button></div>
  <div class="infoBox"><b>Выберите отдельные дни</b><div class="bulkDays">${days.map((d,i)=>`<label><input type="checkbox" class="managerBulkDay" value="${dateKey(d)}"> ${daysShort[i]} ${formatDate(d)}</label>`).join("")}</div></div>
  <div class="infoBox"><b>Или выберите период</b><div class="periodRowV111"><label>С<input id="bulkPeriodFromV111" type="date" min="${first}" max="${last}" value="${first}"></label><label>По<input id="bulkPeriodToV111" type="date" min="${first}" max="${last}" value="${last}"></label><button class="secondary" onclick="selectBulkPeriodV111()">Выбрать период</button></div></div>
  <div class="drawerActions">
    <button onclick="managerSetDaysOff('${empId}')">Поставить выходные</button>
    <button class="danger" onclick="managerUnassignDaysV11('${empId}')">Не назначать на выбранные дни</button>
    <button class="secondary" onclick="managerSelectWholeWeek()">Выбрать всю неделю</button>
    <button class="secondary" onclick="managerRestoreDays('${empId}')">Вернуть в график</button>
  </div>
  <div class="infoBox muted">«Не назначать» убирает смену только на выбранные даты. Остальные дни и сам сотрудник не удаляются. После действия сайт проверит штатку и покажет красное уведомление, если выходных слишком много или мало.</div>`;
  drawer.classList.add("open");
};

function selectedManagerPanelLabelV111(){
  const emp=employee(state.currentManagerId);
  const key=managerPanelKeyV11(emp);
  return key && managerViews[key] ? managerViews[key].title : '';
}

const renderManagerIdentityBeforeV111 = renderManagerIdentity;
renderManagerIdentity = function(){
  const box=document.getElementById('managerIdentityWrap');
  const sel=document.getElementById('managerIdentitySelect');
  if(!box||!sel)return;
  ensureManagerPanelsV111();
  box.style.display=state.role==='manager'?'block':'none';
  const managers=state.employees.filter(e=>e.active&&(e.position==='Менеджер'||e.position==='Менеджер официантской зоны'));
  sel.innerHTML='<option value="">Выберите себя</option>'+managers.map(e=>{
    const key=managerPanelKeyV11(e);
    const panel=key&&managerViews[key]?managerViews[key].title:'Панель не назначена';
    return `<option value="${e.id}" ${state.currentManagerId===e.id?'selected':''}>${shortName(e.name)} · ${panel}</option>`;
  }).join('');
};

const renderBeforeV111 = render;
render = function(options={}){
  ensureManagerPanelsV111();
  renderBeforeV111(options);
  renderManagerIdentity();
};

ensureManagerPanelsV111();
render({save:false});
