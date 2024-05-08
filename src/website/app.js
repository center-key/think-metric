// Think Metric

const app = {

   checklist: {
      restore(checklistSection) {
         // Set checklist task items according to previously saved values.
         const listElem =    checklistSection.querySelector('ol.to-do-checklist');
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
      ingredients: [
         { name: 'Almonds', form: 'Sliced',  gramsPerCup: 110 },
         { name: 'Almonds', form: 'Raw',     gramsPerCup: 130 },
         { name: 'Almonds', form: 'Roasted', gramsPerCup: 120 },
         { name: 'Butter',  form: null,      gramsPerCup: 227 },
         { name: 'Honey',   form: null,      gramsPerCup: 340 },
         ],
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
         const ingredients =    app.calculator.ingredients.filter(ingredient => ingredient.name === ingredientName);
         ingredients.forEach(ingredient =>
            ingredient.grams = quantity * (unitType === 'volume' ?
               ingredient.gramsPerCup / unitsPerCup : unitsGrams)
            );
         if (!isNaN(quantity))
            dna.clone('metric-ingredient', ingredients, {empty: true});
         },
      init() {
         const allNames =        app.calculator.ingredients.map(ingredient => ingredient.name);
         const ingredientNames = [...new Set(allNames)];
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
      console.log('Think Metric');
      console.log('🇺🇸 Americans for Metrication 🇺🇸');
      app.article.init();
      },

   };

dna.dom.onReady(app.start);
