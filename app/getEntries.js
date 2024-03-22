'use strict'

import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { processArr, prettyDate, makePages } from './helpers.js';
import { breadcrumb, appInner, appOuter } from './ejsTemplates.js';
import { doFetch } from './doFetch.js';
import listTemplate from './listTemplate.js';
import {
  includes,
  reachdeck,
  header,
  footer,
  cookies,
  site_search,
  feedback,
} from 'cec-block-templates';
import ejs from 'ejs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../public');
const ROOT_URL = `https://cms-chesheast.cloud.contensis.com/`;
const PROJECT = 'website';
const pageSize = 20;

async function getEntries(req, res, password, user, url) {
  const queries = req.url.split(/\?|&/);
  let entryId = queries.find((k) => k.startsWith('entryId'));
  // Abort if no entryID.
  if (!entryId) {
    res.sendFile(path.join(dir, 'index.html'));
    return;
  } else {
    entryId = entryId.slice(8);
  }

  // Get the entry from the query string.
  const resp = await fetch(
    `${ROOT_URL}/api/delivery/projects/${PROJECT}/entries/${entryId}/?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I`,
    { method: 'get' },
  );

  // Abort if no data from the CMS.
  if (resp.status !== 200) {
    res.sendFile(path.join(dir, 'index.html'));
    return;
  }

  let item = await resp.json();
  const title = item.entryTitle || '';
  const description = item.entryDescription || '';
  const h1 = item.h1 || '';
  let item_path = item.sys.uri;
  let published = prettyDate(new Date(item.sys.version.published));
  let myFeedback = ejs.render(feedback, { published, item_path, title });
  let hrefs = item_path.split('/').map((e) => (e = `/${e}`));
  let links = item_path.replace(/[-_]/g, ' ').split('/');
  links[0] = 'home';
  let classic = hrefs.map((e) => e.replace(/-/g, '_'));
  links = links.map(
    (e) => (e = e ? `${e[0].toUpperCase()}${e.slice(1).toLowerCase()}` : e),
  );
  let bc_inner = links.reduce((acc, l, i) => {
    acc =
      i === links.length - 1
        ? `${acc}<li class="breadcrumb-item">${l}</li>`
        : `${acc}<li class="breadcrumb-item"><a href="${classic
            .slice(0, i + 1)
            .join('')}">${l}</a></li>`;
    return acc;
  }, '');
  let bc = ejs.render(breadcrumb, { bc_inner });

  // get the XML
  let payload = await doFetch(user, password, url);
  let items = processArr(payload.items);
  items.sort((a, b) => a.startDate - b.startDate)
  
  let date = payload.date;
  const { btns, pages } = makePages([...items], pageSize);

  // Create the app body by injecting the template.
  const appBody = ejs.render(appInner, { template: listTemplate });

  // Use this to create script tags to be added in the head element.
  let head_end = ejs.render(appOuter, {
    appBody,
    btns,
    items,
    date,
    pageSize,
    pages,
  });

  // Create a function with the app body.
  const createListApp = new Function(
    'date, items, pages, btns, pageSize, createSSRApp',
    appBody,
  );

  // Make an instance of that function, with the data we need.
  const app = createListApp(date, items, pages, btns, pageSize, createSSRApp);

  // Render and send to client.
  renderToString(app).then((html) => {
    res.render('index', {
      breadcrumb: bc,
      cookies,
      description,
      feedback: myFeedback,
      footer,
      h1,
      head_end,
      header,
      html,
      includes,
      reachdeck,
      site_search,
      title,
    });
  });
}

export default getEntries;
