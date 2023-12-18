import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import bodyParser from 'body-parser';
import convert from 'xml-js';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dir = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const url =
  'https://datacloud.one.network/?app_key=94db72b2-058e-2caf-94de16536c81';
const user = 'cheshireeast';
const password = 'Tkfdg58F]pjA';

app.listen(port, (error) => {
  if (!error) console.log(`Server running on port ${port}`);
  else console.log(error);
});
app.use(express.static(dir));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Item = function (obj) {
  let rec = obj.situation.situationRecord;
  this.locations = Array.isArray(rec)
    ? rec.map((e) => new Sit(e))
    : (this.locations = [new Sit(rec)]);
  this.startDate = rec.validity ? rec.validity.validityTimeSpecification.overallStartTime._text : '';
  this.endDate = rec.validity ? rec.validity.validityTimeSpecification.overallEndTime._text : '';
  //this.description = ;
  this.impact = rec.impact ? rec.impact.delays.delaysType._text : '';
  console.log(rec.situationRecordExtension);
  this.responsible = rec.situationRecordExtension ? rec.situationRecordExtension.situationRecordExtended.responsibleOrganisationName: '';
  this.url = rec.urlLink ? rec.urlLink.urlLinkAddress._text : '';

};

const Sit = function (obj) {
  this.location =
    obj.groupOfLocations.tpegPointLocation.point.name[0].descriptor.values.value._text;
};

app.get('/table', (req, res) => {
  fetch(url, {
    headers: {
      Authorization: 'Basic ' + btoa(`${user}:${password}`),
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      let works = text.split(/\n\s*\n/).slice(1);
      let last = works.pop().split(/\n/).slice(0, -3);
      works.push(last);
      let first = new Item(
        JSON.parse(convert.xml2json(works[0], { compact: true, spaces: 4 }))
      );
      let second = new Item(
        JSON.parse(convert.xml2json(works[1], { compact: true, spaces: 4 }))
      );

      console.log(first);
      console.log(second);
      works = works.map((a) =>
        JSON.parse(convert.xml2json(a, { compact: true, spaces: 4 }))
      );
      res.send(JSON.stringify(works));
    });
});
