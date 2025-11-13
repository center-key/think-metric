// think-metric
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { EOL } from 'node:os';
import { revWebAssets } from 'rev-web-assets';
import fs from 'fs';

////////////////////////////////////////////////////////////////////////////////
describe('The "docs" folder', () => {

   it('contains the correct files', () => {
      const actual = revWebAssets.readJustFiles('docs');
      const expected = [
         'CNAME',
         'app.js',
         'index.html',
         'logo.html',
         'robots.txt',
         'style.css',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('contains the correct "CNAME" file', () => {
      const actual =   fs.readFileSync('docs/CNAME', 'utf-8');
      const expected = 'think-metric.org' + EOL;
      assertDeepStrictEqual(actual, expected);
      });

   it('contains the correct "robots.txt" file', () => {
      const actual =   fs.readFileSync('docs/robots.txt', 'utf-8');
      const expected = '# Allow bots' + EOL;
      assertDeepStrictEqual(actual, expected);
      });

   });
