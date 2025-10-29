#!/usr/bin/env node
//////////////////
// Think Metric //
//////////////////

// To run:
//    $ cd think-metric
//    $ node tools/ingredients/get-grams.js

import fs   from 'fs';
import path from 'path';
const csvFilename = 'input_food.csv';

const getGrams = () => {
   // Returns:
   //    [{ description: 'Alfredo Sauce', form: null, gramsPerCup: 195 }, ...]
   const csvPath =    path.join(import.meta.dirname, csvFilename);  //jshint ignore:line
   const toRecord =   (line) => line.slice(1, -1).split('","');
   const allRecords = fs.readFileSync(csvPath, 'utf-8').split('\n').map(toRecord);
   const header =     allRecords[0];
   const index = {
      amount:      header.indexOf('amount'),
      description: header.indexOf('sr_description'),
      grams:       header.indexOf('gram_weight'),
      portion:     header.indexOf('portion_description'),
      unit:        header.indexOf('unit'),  //'TS', 'TB', 'C', 'CP'
      };
   const ratio =    { TS: 48, TB: 16, C: 1, CP: 1, '': 1 };
   const getRatio = (record) => ratio[record[index.unit]];
   const grams =    (record) => Number(record[index.grams]);
   const amount =   (record) => Number(record[index.amount]);
   const keep =     (record) => record[index.portion]?.includes('1 cup') && !!getRatio(record);
   const records =  allRecords.filter(keep);
   const extras =   ['NFS', '(8 fl oz)', "(Includes foods for USDA's Food Distribution Program)"];
   const clean =    (str) => extras.reduce((acc, phrase) => acc.replace(phrase, ''), str);
   const cap =      (str) => str.replace(/[ \()][a-z]/g, (x) => x.toUpperCase());
   const perCup =   (record) => Math.ceil(getRatio(record) * grams(record) / amount(record));
   const getText =  (record) => record[index.description] + record[index.portion].replace('1 cup', '');
   const toKey =    (record) => cap(clean(getText(record))) + '|' + String(perCup(record));
   const pairs =    [...new Set(records.map(toKey))].sort().map(key => key.split('|'));
   const toGrams = (pair) => ({
      description: pair[0].replace(/,.*/, ''),
      form:        pair[0].replace(/^[^,]*/, '').replace(/,/g, '').trim() || null,
      gramsPerCup: Number(pair[1]),
      });
   return pairs.map(toGrams);
   };

const pad = (text, length) => (text ? `"${text}",` : 'null,').padEnd(length);

const format = (ingredient) => `   { ` +
   `description: ${pad(ingredient.description, 20)} ` +
   `form: ${pad(ingredient.form, 40)} ` +
   `gramsPerCup: ${ingredient.gramsPerCup.toString().padStart(3, ' ')} ` +
   `},`;

console.info('Get Grams');
console.info('=========');
console.info('Source:   USDA (U.S. Department of Agriculture)');
console.info('Download: https://fdc.nal.usda.gov/download-datasets.html');
console.info('File:     FNDDS CSV');
const grams = getGrams();
console.info('Count:   ', grams.length);
console.info('ingredientsDB = [');
console.info(grams.map(format).join('\n'));
console.info('];\nDone:', grams.length);
