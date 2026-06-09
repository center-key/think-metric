<img src=src/website/assets/think-metric-logo.png width=100 alt=logo>

# Think Metric
### 🇺🇸 Americans for Metrication 🇺🇸

[![License:MIT](https://img.shields.io/badge/License-CC0-blue.svg)](https://github.com/center-key/think-metric/blob/main/LICENSE.txt)
[![Build](https://github.com/center-key/think-metric/actions/workflows/run-spec-on-push.yaml/badge.svg)](https://github.com/center-key/think-metric/actions/workflows/run-spec-on-push.yaml)
[![Publish Website](https://github.com/center-key/think-metric/actions/workflows/publish-website.yaml/badge.svg)](https://github.com/center-key/think-metric/actions/workflows/publish-website.yaml)

This project manages the website:<br>
https://think-metric.org

The logo is built using:<br>
https://think-metric.org/logo.html

## Practical Ways to Go Metric

We promote metric units for casual everyday use in America.
Our goal is to speed up metrication to boost America's economic competitiveness and generate more good manufacturing jobs.

This project and the content we publish are free to reuse under a permissive Creative Commons license.

## Contributor Notes
```shell
$ cd think-metric
$ npm install
$ npm run interactive
```
As you make edits to files in the **src/website** folder, your browser will automatically refresh to display the new changes.

To publish merges to the live website:<br>
GitHub project page &#10132; _Actions_ &#10132; _Publish Website_ &#10132; _Run workflow_

Pull requests welcome.
You can help by contributing anything from minor typo fixes to writing new articles.

<br>

---
[CC0 License](LICENSE.txt)

See the `runScriptsConfig` section of [`package.json`](package.json) for a clean way to organize build tasks:
   - 🎋 [`add-dist-header`](https://github.com/center-key/add-dist-header) &mdash;&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [`copy-file-util`](https://github.com/center-key/copy-file-util) &mdash;&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [`copy-folder-util`](https://github.com/center-key/copy-folder-util) &mdash;&nbsp; _Recursively copy files from one folder to another folder_
   - 🪺 [`recursive-exec`](https://github.com/center-key/recursive-exec) &mdash;&nbsp; _Run a command on each file in a folder and its subfolders_
   - 🔍 [`replacer-util`](https://github.com/center-key/replacer-util) &mdash;&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [`rev-web-assets`](https://github.com/center-key/rev-web-assets) &mdash;&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [`run-scripts-util`](https://github.com/center-key/run-scripts-util) &mdash;&nbsp; _Organize npm package.json scripts into groups of easy-to-manage commands_
   - 🚦 [`w3c-html-validator`](https://github.com/center-key/w3c-html-validator) &mdash;&nbsp; _Check the markup validity of HTML files using the W3C validator_
