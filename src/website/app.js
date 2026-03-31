// Think Metric

const app = {

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
         // section.calculator[data-on-load=app.calculator.init]
         //    form
         //       label
         //          input[name=quantity]
         //       label
         //          select[name=units]
         //             option[value=teaspoon, data-type=volume, data-per-cup=48]
         //             option[value=lb,       data-type=weight, data-grams=453.592]
         //       label
         //          select[name=ingredient]
         //             option#input-ingredient.dna-template
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
         const byGrams =      (metric1, metric2) => metric1.grams - metric2.grams;
         const calcResults = () => ({
            qty,
            unitsLabel,
            key,
            metric: ingredients.map(toMetric).sort(byGrams),
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
         const form =     elem.closest('form');
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
         const defaultChoice = 'Almonds';
         const keys =          [...new Set(globalThis.ingredientsDB.map(item => item.key))];
         const findByKey =     (key) => globalThis.ingredientsDB.filter(item => item.key === key);
         const getWords =      (key) => findByKey(key).map(item => item.description).join(' ');
         const ingredients =   keys.map(key => ({ key: key, words: getWords(key) }));
         const options =       dna.clone('input-ingredient', ingredients);
         const defaultOption = options[keys.indexOf(defaultChoice)];
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
         // <header>
         //    <div id=article-nav>
         //       <i data-icon=circle-left>
         //       <i data-icon=circle-right>
         //       <ul>
         //          <li><a>
         // <main data-page=article-folder-name>
         //    <section>
         //       <nav><a class=external-link title=Comments>
         //       <footer>
         const container = globalThis.document.getElementById('article-nav');
         const nav =       { prev: container.children[0], next: container.children[1] };
         const articles =  [...container.querySelectorAll('ul >li >a')];
         const header =    'main >section:first-child >h2';
         const title =     globalThis.document.querySelector(header).textContent;
         const index =     articles.findIndex(article => article.textContent === title);
         const configure = (button, index, leadingText) => {
            button.setAttribute('data-href', articles[index]?.getAttribute('href'));
            button.setAttribute('title',     `${leadingText} "${articles[index]?.textContent}"`);
            button.classList.add(index > -1 && index < articles.length ? 'show' : 'hide');
            };
         configure(nav.prev, index - 1, 'View');
         configure(nav.next, index + 1, 'Press ENTER to view');
         container.classList.add('show');
         if (nav.next.classList.contains('show'))
            dna.dom.onEnterKey(() => nav.next.click());                       //jump to next article
         dna.dom.on('keyup', () => articles[0].click(), { keyFilter: '1' });  //jump to first article
         const commentsElem = globalThis.document.querySelector('main >section >nav >i[data-icon]');
         commentsElem?.classList.add('external-site');
         commentsElem?.setAttribute('title', 'Comments');
         const iconBar = globalThis.document.querySelector('section >footer');
         iconBar.setAttribute('title', 'Press ENTER to view the next article.');
         },
      init() {
         const hasArticleTitle = /\/article\/./;
         if (hasArticleTitle.test(globalThis.location.href))
            app.article.setupPage();
         },
      },

   products: {
      configureLinks() {
         // Set ecommerce links to prefer Amazon as the seller over 3rd parties.
         const productLinks =       'a[href*="www.amazon.com"]';
         const setShipperToAmazon = (link) => link.href = link.href + '?smid=ATVPDKIKX0DER';
         globalThis.document.querySelectorAll(productLinks).forEach(setShipperToAmazon);
         },
      },

   celebrateDay(elem) {
      // Hide element if the current date is not near the specified day of the year.
      // Example:
      //    <section data-day=july-4 data-days=10 data-on-load=app.celebrateDay>
      const holiday =       elem.dataset.day;           //example: 'july-4'
      const numDays =       Number(elem.dataset.days);  //length of celebration
      const currentYear =   new Date().getFullYear();
      const aYear =         new Date().setFullYear(currentYear + 1) - Date.now();
      const rawDelta =      Date.now() - new Date(holiday).setFullYear(currentYear);
      const delta =         Math.abs(((rawDelta + aYear * 3 / 2) % aYear) - aYear / 2);
      const letsCelebrate = 365 * delta / aYear < numDays / 2;
      if (!letsCelebrate && globalThis.location.hash !== '#counterculture')
         elem.remove();
      },

   addSectionLinks() {
      // On hover make the first header in a section a link to the section.
      const headings = globalThis.document.querySelectorAll('section[id] >h2:first-of-type');
      headings.forEach(elem => elem.dataset.href = '#' + elem.parentElement.id);
      headings.forEach(elem => elem.title = window.location.href.split('#')[0] + elem.dataset.href);
      },

   start() {
      console.info('Think Metric');
      console.info('🇺🇸 Americans for Metrication 🇺🇸');
      app.addSectionLinks();
      app.article.init();
      app.products.configureLinks();
      },

   };

dna.dom.onReady(app.start);
