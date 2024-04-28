// Think Metric

const app = {
   restoreChecklist(listElem) {
      // Set checklist task items according to previously saved values.
      const checklist = JSON.parse(globalThis.localStorage.getItem('checklist'));
      const setCheckbox = (li) =>
         li.querySelector('input[type=checkbox]').checked = checklist[li.id];
      if (checklist)
         [...listElem.children].forEach(setCheckbox);
      },
   saveChecklist(checklistElem) {
      // Record current status of checklist tasks to Local Storage.
      const tasks =     [...checklistElem.querySelectorAll('li')];
      const isChecked = (li) => li.querySelector('input[type=checkbox]').checked;
      const checklist = Object.fromEntries(tasks.map(li => [li.id, isChecked(li)]));
      globalThis.localStorage.setItem('checklist', JSON.stringify(checklist));
      },
   setupArticlePage() {
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
   start() {
      console.log('Think Metric');
      console.log('🇺🇸 Americans for Metrication 🇺🇸');
      if (globalThis.location.href.includes('/article/'))
         app.setupArticlePage();
      const checklistElem = globalThis.document.querySelector('ol.to-do-checklist');
      if (checklistElem)
         app.restoreChecklist(checklistElem);
      },
   };

dna.dom.onReady(app.start);
