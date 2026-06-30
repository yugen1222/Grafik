const shiftTemplates = {
  '08:00-20:00': { hours: 12, covers: { '1': 1, '2': 0.57 } },
  '08:00-16:00': { hours: 8, covers: { '1': 1 } },
  '12:00-20:00': { hours: 8, covers: { '1': 0.5, '2': 0.57 } },
  '20:00-08:00': { hours: 12, covers: { '2': 0.43, '3': 1 } },
  '16:00-23:00': { hours: 7, covers: { '2': 1 } },
  '23:00-08:00': { hours: 9, covers: { '3': 1 } },
  '11:00-23:00': { hours: 12, covers: { '1': 0.63, '2': 1 } },
  '18:00-02:00': { hours: 8, covers: { '2': 0.71, '3': 0.33 } },
  '08:00-17:00': { hours: 9, covers: { '1': 1, '2': 0.14 } },
  '17:00-02:00': { hours: 9, covers: { '2': 0.86, '3': 0.33 } },
  '09:00-18:00': { hours: 9, covers: { '1': 0.88, '2': 0.29 } }
};
const categories = ['Продавец','Официант','Бариста','Техничка','Кассир','Морозильщик','Менеджер'];
const shifts = {'1':'1 смена 08:00-16:00','2':'2 смена 16:00-23:00','3':'3 смена 23:00-08:00'};
const seedEmployees = `ABDIYEVA SHAHINABONU SUNNATULLO QIZI|Продавец|16:00-23:00
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
function shortName(n){return n.split(' ').slice(0,2).join(' ')}
function monday(d=new Date()){const x=new Date(d); const day=(x.getDay()+6)%7; x.setDate(x.getDate()-day); x.setHours(0,0,0,0); return x}
function fmt(d){return d.toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}
function weekKey(d){return d.toISOString().slice(0,10)}
function weekDates(key){const d=new Date(key); return Array.from({length:7},(_,i)=>{const x=new Date(d);x.setDate(x.getDate()+i);return x})}
function defaultEmployees(){return seedEmployees.split('\n').map((line,i)=>{const [name,position,shift]=line.split('|');return {id:'e'+i,name,position,shift,skills:[position],active:true}})}
function makeWeek(key, employees){const dates=weekDates(key); const assignments={}; dates.forEach((_,di)=>{assignments[di]={}; employees.filter(e=>e.active).forEach(e=>assignments[di][e.id]={shift:e.shift,status:'work'});}); return {key, createdAt:new Date().toISOString(), assignments}}
function defaultStaffing(){const s={}; categories.forEach(c=>{s[c]={}; ['1','2','3'].forEach(sh=>s[c][sh]= c==='Официант'?4:c==='Продавец'?3:c==='Техничка'?2:1)}); return s}
function loadState(){const saved=localStorage.getItem('safia_schedule_v3'); if(saved) return JSON.parse(saved); const employees=defaultEmployees(); const key=weekKey(monday()); return {role:'admin',currentWeek:key,weeks:{[key]:makeWeek(key,employees)},employees,staffing:defaultStaffing(),history:[]}}
function save(){localStorage.setItem('safia_schedule_v3',JSON.stringify(state))}
function currentWeek(){return state.weeks[state.currentWeek]}
function assignment(empId, day){return currentWeek().assignments[day]?.[empId]}
function coversShift(shift, block){return shiftTemplates[shift]?.covers?.[block]||0}
function actualCount(category, block, day){return state.employees.filter(e=>e.active&&e.position===category).reduce((sum,e)=>{const a=assignment(e.id,day); if(!a||a.status==='dayoff') return sum; return sum + (coversShift(a.shift,block)>0 ? 1 : 0)},0)}
function needCount(category, block){return state.staffing[category]?.[block]||0}
function allProblems(){const arr=[]; for(let d=0;d<7;d++){categories.forEach(c=>['1','2','3'].forEach(sh=>{const need=needCount(c,sh), actual=actualCount(c,sh,d), diff=actual-need; if(diff!==0) arr.push({day:d,category:c,shift:sh,need,actual,diff})}))} return arr}
function init(){bind(); renderAll()}
function bind(){document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>showPage(b.dataset.page)); document.getElementById('roleSelect').onchange=e=>{state.role=e.target.value;save();renderAll()}; document.getElementById('newWeekBtn').onclick=createNextWeek; document.getElementById('exportBtn').onclick=exportExcel; document.getElementById('categorySelect').onchange=renderSchedule; document.getElementById('shiftViewSelect').onchange=renderSchedule; document.getElementById('daySelect').onchange=renderSchedule; document.getElementById('applyDayoffsBtn').onclick=applyDayoffs; document.getElementById('addEmployeeBtn').onclick=addEmployee; document.getElementById('saveSnapshotBtn').onclick=saveSnapshot; document.getElementById('resetBtn').onclick=()=>{if(confirm('Сбросить все данные?')){localStorage.removeItem('safia_schedule_v3');location.reload()}}; document.getElementById('weekSelect').onchange=e=>{state.currentWeek=e.target.value;save();renderAll()}; ['staffCategoryFilter','staffShiftFilter','staffDayFilter'].forEach(id=>document.getElementById(id).onchange=renderStaffing); document.getElementById('dayoffCategoryFilter').onchange=renderDayoffs; document.getElementById('showOnlyDayoffs').onchange=renderDayoffs}
function showPage(id){document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===id));document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));document.getElementById('pageTitle').textContent=document.querySelector(`[data-page="${id}"]`).textContent.trim()}
function renderAll(){document.getElementById('roleSelect').value=state.role; document.querySelectorAll('.admin-only').forEach(x=>x.style.display=state.role==='admin'?'block':'none'); renderWeekSelect(); renderFilters(); renderDashboard(); renderSchedule(); renderDayoffs(); renderEmployees(); renderStaffing(); renderHistory(); save()}
function renderWeekSelect(){const sel=document.getElementById('weekSelect'); sel.innerHTML=Object.keys(state.weeks).sort().map(k=>`<option value="${k}">${fmt(new Date(k))}–${fmt(weekDates(k)[6])}</option>`).join(''); sel.value=state.currentWeek; document.getElementById('weekLabel').textContent=`${fmt(new Date(state.currentWeek))} – ${fmt(weekDates(state.currentWeek)[6])}`}
function renderFilters(){const catOpts=categories.map(c=>`<option>${c}</option>`).join(''); document.getElementById('categorySelect').innerHTML='<option value="all">Общий просмотр</option>'+catOpts; document.getElementById('staffCategoryFilter').innerHTML=catOpts; document.getElementById('dayoffCategoryFilter').innerHTML='<option value="all">Все категории</option>'+catOpts; document.getElementById('empShift').innerHTML=Object.keys(shiftTemplates).map(s=>`<option>${s}</option>`).join(''); const dayOpts=weekDates(state.currentWeek).map((d,i)=>`<option value="${i}">${fmt(d)}</option>`).join(''); document.getElementById('daySelect').innerHTML=dayOpts; document.getElementById('staffDayFilter').innerHTML='<option value="all">Все даты</option>'+dayOpts}
function renderDashboard(){const p=allProblems(); const low=p.filter(x=>x.diff<0).length, high=p.filter(x=>x.diff>0).length; document.getElementById('summaryCards').innerHTML=`<div class="card status-ok"><small>Сотрудники</small><br><b>${state.employees.filter(e=>e.active).length}</b></div><div class="card status-low"><small>Не хватает</small><br><b>${low}</b></div><div class="card status-high"><small>Лишние</small><br><b>${high}</b></div>`; document.getElementById('problemList').innerHTML=p.length?p.slice(0,30).map(problemHtml).join(''):'<div class="problem">🟢 Всё по штатке нормально</div>'}
function problemHtml(x){return `<div class="problem ${x.diff<0?'low':'high'}"><b>${fmt(weekDates(state.currentWeek)[x.day])} · ${x.category} · ${shifts[x.shift]}</b><br>Нужно: ${x.need}, стоит: ${x.actual}. ${x.diff<0?'Не хватает '+Math.abs(x.diff):'Лишние '+x.diff}</div>`}
function visibleEmployees(){const cat=document.getElementById('categorySelect').value; return state.employees.filter(e=>e.active&&(cat==='all'||e.position===cat))}
function renderSchedule(){if(!document.getElementById('schedule').classList.contains('active')&&!document.getElementById('dashboard').classList.contains('active')){} const day=+document.getElementById('daySelect').value||0; const view=document.getElementById('shiftViewSelect').value; const blocks=view==='all'?['1','2','3']:[view]; document.getElementById('scheduleBoard').innerHTML=blocks.map(block=>`<div class="shift-column"><div class="shift-head"><h3>${shifts[block]}</h3><span class="badge">${fmt(weekDates(state.currentWeek)[day])}</span></div>${visibleEmployees().map(e=>{const a=assignment(e.id,day); if(!a) return ''; const cover=coversShift(a.shift,block); if(a.status==='dayoff'||cover<=0) return ''; return personCard(e,a,cover,day)}).join('')||'<p class="muted">Нет сотрудников</p>'}</div>`).join('')}
function personCard(e,a,cover,day){return `<div class="person ${a.status==='dayoff'?'dayoff-card':a.status==='changed'?'changed-card':''}" onclick="editAssignment('${e.id}',${day})"><div class="name">${shortName(e.name)}</div><div class="meta">${e.position} · ${a.shift} · ${cover===1?'полная смена':'частично'}</div></div>`}
function editAssignment(id,day){const e=state.employees.find(x=>x.id===id), a=assignment(id,day); const next=prompt(`Сотрудник: ${e.name}\nТекущая смена: ${a.shift}\nНапиши новую смену или ВЫХОДНОЙ`,a.shift); if(!next)return; if(next.toLowerCase().includes('выход')){a.status='dayoff';} else if(shiftTemplates[next]){a.shift=next;a.status='changed'} else {alert('Такого шаблона смены нет')} save(); renderAll()}
function renderDayoffs(){const cat=document.getElementById('dayoffCategoryFilter').value; const only=document.getElementById('showOnlyDayoffs').checked; document.getElementById('dayoffEmployees').innerHTML=state.employees.filter(e=>e.active&&(cat==='all'||e.position===cat)).filter(e=>!only||[0,1,2,3,4,5,6].some(d=>assignment(e.id,d)?.status==='dayoff')).map(e=>`<label><input type="checkbox" class="dayoffEmp" value="${e.id}"> ${shortName(e.name)} <small>${e.position}</small></label>`).join(''); document.getElementById('dayoffDates').innerHTML=weekDates(state.currentWeek).map((d,i)=>`<label><input type="checkbox" class="dayoffDate" value="${i}"> ${fmt(d)}</label>`).join('')}
function applyDayoffs(){const emps=[...document.querySelectorAll('.dayoffEmp:checked')].map(x=>x.value); const dates=[...document.querySelectorAll('.dayoffDate:checked')].map(x=>+x.value); emps.forEach(id=>dates.forEach(d=>{if(assignment(id,d)) assignment(id,d).status='dayoff'})); state.history.unshift({time:new Date().toLocaleString('ru-RU'),text:`Выходные: ${emps.length} сотрудников, ${dates.length} дат`}); save(); renderAll()}
function renderEmployees(){document.getElementById('employeeList').innerHTML=state.employees.filter(e=>e.active).map(e=>`<div class="emp-card"><h3>${shortName(e.name)}</h3><p>${e.position} · ${e.shift}</p><div class="skills">${e.skills.map(s=>`<span class="skill">${s}</span>`).join('')}<span class="skill">${shiftTemplates[e.shift]?.hours||0} ч</span></div><br><button class="danger" onclick="deleteEmployee('${e.id}')">Удалить</button></div>`).join('')}
function addEmployee(){const name=document.getElementById('empName').value.trim(); if(!name)return alert('Введите ФИО'); const position=document.getElementById('empPosition').value, shift=document.getElementById('empShift').value; const id='e'+Date.now(); state.employees.push({id,name,position,shift,skills:[position],active:true}); Object.values(state.weeks).forEach(w=>Object.keys(w.assignments).forEach(d=>w.assignments[d][id]={shift,status:'work'})); save(); renderAll()}
function deleteEmployee(id){if(confirm('Удалить сотрудника?')){state.employees.find(e=>e.id===id).active=false;save();renderAll()}}
function renderStaffing(){const c=document.getElementById('staffCategoryFilter').value||categories[0], sh=document.getElementById('staffShiftFilter').value, day=document.getElementById('staffDayFilter').value; const days=day==='all'?[0,1,2,3,4,5,6]:[+day]; const blocks=sh==='all'?['1','2','3']:[sh]; let html='<table class="table"><tr><th>Дата</th><th>Смена</th><th>Нужно</th><th>Стоит</th><th>Изменить</th></tr>'; days.forEach(d=>blocks.forEach(b=>{const need=needCount(c,b), actual=actualCount(c,b,d); html+=`<tr><td>${fmt(weekDates(state.currentWeek)[d])}</td><td>${shifts[b]}</td><td>${need}</td><td>${actual}</td><td><button onclick="changeNeed('${c}','${b}')">Изменить</button></td></tr>`})); document.getElementById('staffingTable').innerHTML=html+'</table>'}
function changeNeed(c,b){const n=Number(prompt(`Штатка: ${c}, ${shifts[b]}`,needCount(c,b))); if(!Number.isNaN(n)){state.staffing[c][b]=n;save();renderAll()}}
function createNextWeek(){const keys=Object.keys(state.weeks).sort(); const last=new Date(keys[keys.length-1]); last.setDate(last.getDate()+7); const key=weekKey(last); if(!state.weeks[key]) state.weeks[key]=JSON.parse(JSON.stringify(state.weeks[keys[keys.length-1]])); state.weeks[key].key=key; state.currentWeek=key; state.history.unshift({time:new Date().toLocaleString('ru-RU'),text:`Создана новая неделя ${fmt(last)}–${fmt(weekDates(key)[6])}`}); save(); renderAll()}
function saveSnapshot(){state.history.unshift({time:new Date().toLocaleString('ru-RU'),text:`Сохранён график недели ${fmt(new Date(state.currentWeek))}–${fmt(weekDates(state.currentWeek)[6])}`});save();renderHistory()}
function renderHistory(){document.getElementById('historyList').innerHTML=state.history.length?state.history.map(h=>`<div class="problem"><b>${h.time}</b><br>${h.text}</div>`).join(''):'История пока пустая'}
function exportExcel(){const rows=[]; const dates=weekDates(state.currentWeek); rows.push(['ФИО','Должность',...dates.map(fmt)]); state.employees.filter(e=>e.active).forEach(e=>rows.push([e.name,e.position,...dates.map((_,d)=>{const a=assignment(e.id,d); return !a||a.status==='dayoff'?'ВЫХОДНОЙ':a.shift})])); const html='<table>'+rows.map(r=>'<tr>'+r.map(c=>`<td>${String(c).replaceAll('&','&amp;')}</td>`).join('')+'</tr>').join('')+'</table>'; const blob=new Blob(['\ufeff'+html],{type:'application/vnd.ms-excel'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='safia_schedule.xls'; a.click()}
init();
