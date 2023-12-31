import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import bodyParser from 'body-parser';
import convert from 'xml-js';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dir = path.join(__dirname, '../public');
const port = process.env.PORT || 3001;
const url =
  'https://datacloud.one.network/?app_key=94db72b2-058e-2caf-94de16536c81';
const user = 'cheshireeast';
const password = 'Tkfdg58F]pjA';

app.listen(port, (error) => {
  if (!error) console.log(`Server running on port ${port}`);
  else console.log(error);
});
//app.use(express.static(dir));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const dedup = (arr) => {
  return arr.reduce((acc, e) => {
    e.forEach((l) => {
      l = l.replace(', Cheshire East', '');
      if (l.split(' ').length === 1 && acc.some((e) => e.includes(l))) {
        return acc;
      }
      if (l.length && !acc.includes(l) && !l.includes('Ward')) {
        acc.push(l);
      }
    });
    return acc;
  }, []);
};

const Item = function (obj) {
  let rec = obj.situation.situationRecord;
  if (Array.isArray(rec)) {
    this.locations = rec.map((e) => loc(e));
    this.locations = dedup(this.locations).join("^#");
    //console.log(this.locations);
    this.startDate =
      rec[0].validity.validityTimeSpecification.overallStartTime._text;
    this.endDate =
      rec[0].validity.validityTimeSpecification.overallEndTime._text;
    this.description = rec[0].generalPublicComment.comment.values.value
      .map((e) => e._text)
      .join('^#');
    this.impact = rec[0].impact.delays.delaysType._text;
    this.responsible =
      rec[0].situationRecordExtension.situationRecordExtended.responsibleOrganisation.responsibleOrganisationName._text;
    this.url = rec[0].urlLink.urlLinkAddress._text;
  } else {
    this.locations = loc(rec);
    if (this.locations.length === 2 && this.locations[1].includes('Ward')) {
      this.locations = 
        `${this.locations[0].replace(
          ', Cheshire East',
          ''
        )} (${this.locations[1].replace(', Cheshire East', '')})`
      ;
    }
    //console.log(this.locations);
    this.startDate =
      rec.validity.validityTimeSpecification.overallStartTime._text;
    this.endDate = rec.validity.validityTimeSpecification.overallEndTime._text;
    this.description = rec.generalPublicComment.comment.values.value
      .map((e) => e._text)
      .join('^#');
    this.impact = rec.impact.delays.delaysType._text;
    this.responsible =
      rec.situationRecordExtension.situationRecordExtended.responsibleOrganisation.responsibleOrganisationName._text;
    this.url = rec.urlLink.urlLinkAddress._text;
  }
};

const loc = function (obj) {
  try {
    return obj.groupOfLocations.tpegPointLocation.point.name.reduce(
      (acc, e) => {
        let temp = e.descriptor.values.value._text.trim();
        if (temp === 'Cheshire East') {
          return acc;
        }
        if (acc[0] && temp.startsWith(acc[0])) {
          return [temp];
        }
        acc = [...acc, temp];
        return acc;
      },
      []
    );
  } catch (err) {
    return [];
  }
};




app.get('/*', (req, res) => {
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
      let date = text.split(/\n\s*\n/)[0].split("<publicationTime>")[1].split("</publicationTime>")[0];
      let works = text.split(/\n\s*\n/).slice(1);
      let last = works.pop().split(/\n/).slice(0, -3);
      works.push(last);
      works = works.map(
        (a) =>
          new Item(
            JSON.parse(convert.xml2json(a, { compact: true, spaces: 4 }))
          )
      );
      res.send(JSON.stringify({date: date, items: works}));
    });
});

