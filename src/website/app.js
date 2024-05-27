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
      convertToGrams(elem) {
         const calculatorForm = elem.closest('form');
         const elemMap = {
            quantity:   calculatorForm.querySelector('input[name=quantity]'),
            units:      calculatorForm.querySelector('select[name=units]'),
            ingredient: calculatorForm.querySelector('select[name=ingredient]'),
            };
         const qtyClean =     elemMap.quantity.value.replace(/\s+/g, ' ').trim();                        //ex: '1 3/4'
         const qtyParts =     qtyClean.replace(/[^0-9.\/\s]/g, '').split(' ');                           //ex: ['1', '3/4']
         const toDecimal =    (fraction) => Number(fraction[0]) / Number(fraction[1]);                   //ex: ['3', '4'] -> 0.75
         const toNum =        (part) => part.includes('/') ? toDecimal(part.split('/')) : Number(part);  //ex: '3/4' -> 0.75
         const qty =          qtyParts.map(toNum).reduce((sum, num) => sum + num, 0);                    //ex: 1.75
         const qtyValid =     !isNaN(qty) && qty > 0 && qty < 100000;
         const unitsOption =  elemMap.units.options[elemMap.units.selectedIndex];                        //ex: <option value=teaspoon data-type=volume data-per-cup=48>Teaspoons</option>
         const unitsLabel =   unitsOption.textContent.replace(/\(.*/, '').trim().toLowerCase();          //ex: 'cups'
         const isVolume =     unitsOption.dataset.type === 'volume';                                     //check if 'volume' or 'weight'
         const unitsPerCup =  Number(unitsOption.dataset.perCup);                                        //ex: <option value=teaspoon data-type=volume data-per-cup=48>
         const gramsPerUnit = Number(unitsOption.dataset.grams);                                         //ex: <option value=lb data-type=weight data-grams=453.592>
         const key =          elemMap.ingredient.value;                                                  //ex: 'Almonds'
         const ingredients =  globalThis.ingredientsDB.filter(ingredient => ingredient.key === key);     //ex: [{ key: 'Almonds', ...
         const byVolume =     (ingredient) => qty * ingredient.gramsPerCup / unitsPerCup;
         const toGrams =      (ingredient) => isVolume ? byVolume(ingredient) : qty * gramsPerUnit;
         const toMetric =     (ingredient) => ({ ingredient: ingredient, grams: toGrams(ingredient)});
         const calcResults =  () => ({ quantity: qty, unitsLabel, name: key, metric: ingredients.map(toMetric) });

         console.log({ calculatorForm, elemMap, qty, qtyValid, unitsOption, unitsLabel, isVolume, unitsPerCup, gramsPerUnit, name: key, ingredients });

         if (qtyValid)
            dna.clone('calculator-result', calcResults(), { empty: true });
         },
      updateTemperature(elem) {
         const tempF =     Number(elem.value);
         const output =    elem.closest('section').querySelector('output');
         const toCelsius = () => Math.round((tempF - 32) * 5 / 9);
         output.textContent = isNaN(tempF) ? 'N/A' : dna.util.round(toCelsius(), 2);
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
         globalThis.document.activeElement.select();  //highlight the "Quantity" field value
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
