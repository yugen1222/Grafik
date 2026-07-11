SAFIA SCHEDULE — обновление Excel по сменам

1. Замените файл:
   public/js/app.js

2. В public/index.html найдите кнопку:
   <button id="excelBtn" class="darkBtn">Excel</button>

3. Сразу после неё добавьте:

   <button id="excelShift1Btn" class="darkBtn">1 смена</button>
   <button id="excelShift2Btn" class="darkBtn">2 смена</button>
   <button id="excelShift3Btn" class="darkBtn">3 смена</button>

Что работает:
- полный Excel по категориям остаётся;
- отдельный Excel для 1, 2 и 3 смены;
- внутри каждой смены порядок: Менеджер, Продавец, Официант, Бариста, Кассир, Техничка, Морозильщик;
- 08:00–20:00 попадает в 1 и 2 смену;
- 20:00–08:00 попадает во 2 и 3 смену;
- изменение только одного дня выделяется жёлтым только в этом дне;
- выходной выделяется красным.
