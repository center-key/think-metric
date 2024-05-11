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
      // <form class=calculator>
      //    <label>
      //       <input name=quantity>
      //    <label>
      //       <select name=units>
      //          <option value=teaspoon data-type=volume data-per-cup=48>
      //          <option value=lb       data-type=weight data-grams=453.592>
      //    <label>
      //       <select name=ingredient>
      //          <option id=input-ingredient class=dna-template>~~name~~</option>
      //    <output>
      //       <span id=metric-ingredient class=dna-template>
      //          <b>~~grams~~</b> grams <b>~~form~~</b> <b>~~name~~</b>
      convertToGrams(elem) {
         const calculatorForm = elem.closest('form');
         const elemMap = {
            quantity:   calculatorForm.querySelector('input[name=quantity]'),
            units:      calculatorForm.querySelector('select[name=units]'),
            ingredient: calculatorForm.querySelector('select[name=ingredient]'),
            };
         const quantityText =   elemMap.quantity.value.trim().replace(/[^0-9.\/\s]/g, '').replace(/\s+/g, ' ');
         const quantity =       Number(quantityText);
         const unitsOption =    elemMap.units.options[elemMap.units.selectedIndex];
         const unitType =       unitsOption.dataset.type;
         const unitsPerCup =    Number(unitsOption.dataset.perCup);
         const unitsGrams =     Number(unitsOption.dataset.grams);
         const ingredientName = elemMap.ingredient.value;
         const ingredients =    globalThis.ingredientsDB.filter(ingredient => ingredient.name === ingredientName);
         const toGrams = (ingredient) => quantity * (unitType === 'volume' ?
            ingredient.gramsPerCup / unitsPerCup : unitsGrams);
         const toMetric = (ingredient) => ({ ingredient: ingredient, grams: toGrams(ingredient)});
         const calculatorResult = () => ({
            imperial: {
               quantity: quantity,
               units:    unitsOption.textContent.replace(/\(.*/, '').trim().toLowerCase(),
               name:     elemMap.ingredient.value,
               },
            metric: ingredients.map(toMetric),
            });
         if (!isNaN(quantity) && quantity > 0 && elemMap.ingredient.selectedIndex > 0)
            dna.clone('calculator-result', calculatorResult(), { empty: true });
         },
      updateTemperature(elem) {
         const tempF =     Number(elem.value);
         const output =    elem.closest('section').querySelector('output');
         const toCelsius = () => Math.round((tempF - 32) * 5 / 9);
         output.textContent = isNaN(tempF) ? 'N/A' : dna.util.round(toCelsius(), 2);
         },
      init() {
         const allNames =        globalThis.ingredientsDB.map(ingredient => ingredient.name);
         const ingredientNames = [...new Set(allNames)];
         const ingredientPlaceholder = dna.clone('input-ingredient', 'Select...');
         ingredientPlaceholder.selected = true;
         ingredientPlaceholder.disabled = true;
         dna.clone('input-ingredient', ingredientNames);
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
