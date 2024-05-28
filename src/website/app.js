// Think Metric

const app = {

   checklist: {
      restore(checklistSection) {
         // Set checklist task items according to previously saved values.
         const listElem =    checklistSection.querySelector('ol.metrication-checklist');
         const checklist =   JSON.parse(globalThis.localStorage.getItem('checklist'));
         const getCheckbox = (li) => li.querySelector('input[type=checkbox]');
         const setCheckbox = (li) => getCheckbox(li).checked = checklist[li.id];
         if (checklist)
            [...listElem.children].forEach(setCheckbox);
         },
      save(checklistElem) {
         // Record current status of checklist tasks to Local Storage.
         const tasks =     [...checklistElem.querySelectorAll('li')];
         const isChecked = (li) => li.querySelector('input[type=checkbox]').checked;
         const checklist = Object.fromEntries(tasks.map(li => [li.id, isChecked(li)]));
         globalThis.localStorage.setItem('checklist', JSON.stringify(checklist));
         },
      },

   calculator: {
      fractionToFloat(str) {
         // Example:
         //    fractionToFloat('1 3/4') -> 1.75
         const qtyClean =  str.replace(/\s+/g, ' ').trim();                                           //ex: '1 3/4'
         const qtyParts =  qtyClean.replace(/[^0-9.\/\s]/g, '').split(' ');                           //ex: ['1', '3/4']
         const toDecimal = (fraction) => Number(fraction[0]) / Number(fraction[1]);                   //ex: ['3', '4'] -> 0.75
         const toNum =     (part) => part.includes('/') ? toDecimal(part.split('/')) : Number(part);  //ex: '3/4' -> 0.75
         const qty =       qtyParts.map(toNum).reduce((sum, num) => sum + num, 0);                    //ex: 1.75
         const qtyValid =  !isNaN(qty) && qty > 0 && qty < 100000;
         return qtyValid ? qty : null;
         },
      convertToGrams(elem) {
         // <section class=calculator data-on-load=app.calculator.init>
         //    <form>
         //       <label>
         //          <input name=quantity>
         //       <label>
         //          <select name=units>
         //             <option value=teaspoon data-type=volume data-per-cup=48>
         //             <option value=lb       data-type=weight data-grams=453.592>
         //       <label>
         //          <select name=ingredient>
         //             <option id=input-ingredient class=dna-template>~~name~~</option>
         const form = elem.closest('form');
         const elemMap = {
            quantity:   form.querySelector('input[name=quantity]'),
            units:      form.querySelector('select[name=units]'),
            ingredient: form.querySelector('select[name=ingredient]'),
            };
         const qty =          app.calculator.fractionToFloat(elemMap.quantity.value);
         const unitsOption =  elemMap.units.options[elemMap.units.selectedIndex];                        //ex: <option value=teaspoon data-type=volume data-per-cup=48>Teaspoons</option>
         const unitsLabel =   unitsOption.textContent.replace(/\(.*/, '').trim().toLowerCase();          //ex: 'cups'
         const isVolume =     unitsOption.dataset.type === 'volume';                                     //check if 'volume' or 'weight'
         const unitsPerCup =  Number(unitsOption.dataset.perCup);                                        //ex: <option value=teaspoon data-type=volume data-per-cup=48>
         const gramsPerUnit = Number(unitsOption.dataset.grams);                                         //ex: <option value=lb data-type=weight data-grams=453.592>
         const key =          elemMap.ingredient.value;                                                  //ex: 'Almonds'
         const ingredients =  globalThis.ingredientsDB.filter(ingredient => ingredient.key === key);     //ex: [{ key: 'Almonds', ...
         const byVolume =     (ingredient) => qty * ingredient.gramsPerCup / unitsPerCup;
         const round5 =       (grams) => Math.round(dna.util.round(grams, 2) / 5) * 5;
         const round =        (grams) => grams < 10 ? Math.ceil(grams) : round5(grams);
         const toGrams =      (ingredient) => round((isVolume ? byVolume(ingredient) : qty * gramsPerUnit));
         const toMetric =     (ingredient) => ({ ingredient: ingredient, grams: toGrams(ingredient)});
         const calcResults = () => ({
            qty,
            unitsLabel,
            key,
            metric: ingredients.map(toMetric),
            packed: ingredients.some(ingredient => ingredient.packed),
            });
         if (qty)
            dna.clone('grams-calculator-result', calcResults(), { empty: true });
         },
      convertToCelsius(elem) {
         const tempF =     Number(elem.value);
         const output =    elem.closest('section').querySelector('output');
         const toCelsius = () => Math.round((tempF - 32) * 5 / 9);
         output.textContent = isNaN(tempF) ? 'N/A' : dna.util.round(toCelsius(), 2);
         },
      convertToMilliliters(elem) {
         // <option data-type=volume data-per-cup=16>Tablespoons</option>
         const mlPerCup = 236.588;
         const form = elem.closest('form');
         const elemMap = {
            quantity: form.querySelector('input[name=quantity]'),
            units:    form.querySelector('select[name=units]'),
            };
         const qty =         app.calculator.fractionToFloat(elemMap.quantity.value);
         const unitsOption = elemMap.units.options[elemMap.units.selectedIndex];
         const unitsPerCup = Number(unitsOption.dataset.perCup);
         const toMl =        () => Math.round(mlPerCup * qty / unitsPerCup);
         const format =      (ml) => dna.format.getNumberFormatter('#')(dna.util.round(ml, 2));
         const output =      form.closest('section').querySelector('output');
         output.textContent = qty ? format(toMl()) : 'N/A';
         },
      populateIngredientDropDown() {
         const defaultIngredient = 'Almonds';
         const keys = [...new Set(globalThis.ingredientsDB.map(ingredient => ingredient.key))];
         const ingredients = keys.map(key => ({
            key:   key,
            words: globalThis.ingredientsDB.filter(item => item.key === key).map(item => item.description).join(' '),
            }));
         const options = dna.clone('input-ingredient', ingredients);
         const defaultOption = options[keys.indexOf(defaultIngredient)];
         defaultOption.selected = true;
         app.calculator.convertToGrams(defaultOption);
         },
      init() {
         app.calculator.populateIngredientDropDown();
         const highlightInputField = () => globalThis.document.activeElement.select();
         globalThis.requestAnimationFrame(highlightInputField);
         },
      },

   article: {
      setupPage() {
         // <div id=article-nav>
         //    <i data-icon=circle-left></i>
         //    <i data-icon=circle-right></i>
         //    <ul><li><a href=../../article/go-metric>Go Metric<a><li>...
         // </div>
         const container = globalThis.document.getElementById('article-nav');
         const articles = [...container.querySelectorAll('ul >li >a')];
         const header =   'main >section:first-child >h2';
         const title =    globalThis.document.querySelector(header).textContent;
         const index =    articles.findIndex(article => article.textContent === title);
         const configure = (button, index) => {
            button.setAttribute('data-href', articles[index]?.getAttribute('href'));
            button.setAttribute('title',     articles[index]?.textContent);
            button.classList.add(index > -1 && index < articles.length ? 'show' : 'hide');
            };
         configure(container.children[0], index - 1);  //previous article
         configure(container.children[1], index + 1);  //next article
         container.classList.add('show');
         },
      init() {
         if (globalThis.location.href.includes('/article/'))
            app.article.setupPage();
         },
      },

   start() {
      globalThis.document.querySelectorAll('form:not([action])').forEach(
         form => form.onsubmit = () => false);  //disable submitting form on enter key
      console.log('Think Metric');
      console.log('🇺🇸 Americans for Metrication 🇺🇸');
      app.article.init();
      },

   };

dna.dom.onReady(app.start);
