<script setup lang="ts">
const client = useClient();
const query = useRoute().query;
const makePages = useMakePages();

// Set up some state.
const bottom = useState('bottom', () => '');
const cecilia = useState('cecilia', () => undefined);
const date = useState('date', () => undefined);
const dateEnd = useState('dateEnd', () => undefined);
const dateStart = useState('dateStart', () => undefined);
const description = useState('description', () => '');
const end = useState('end', () => undefined);
const error = useState('error', () => false);
const filteredItems = useState('filteredItems', () => []);
const h1 = useState('h1', () => '');
const h2 = useState('h2', () => '');
const intro = useState('intro', () => '');
const items = useState('items', () => []);
const pageIndex = useState('pageIndex', () => 0);
const pageSize = useState('pageSize', () => 0);
const pages = useState('pages', () => []);
const path = useState('path', () => '');
const reviewed = useState('reviewed', () => '');
const searchedItems = useState('searchedItems', () => []);

const showResultsNum = useState('showResultsNum', () => undefined);
const start = useState('start', () => undefined);
const time = useState('time', () => undefined);
const title = useState('title', () => '');
const ogImage = useState('ogImage', () => '');

const timeOptions = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

const formatTime = function (t) {
  let time = t.toLocaleTimeString('en-GB', timeOptions);
  if (time === '12:00 pm') {
    return ' 12 noon';
  } else if (time.startsWith('0')) {
    time = '12' + time.slice(1);
  }
  return ' ' + time.replace(' ', '').toLowerCase();
};

await callOnce(async () => {
  if (query.nodeId) {
    let { data, error } = await useAsyncData('data', () =>
      client.nodes.get(query.nodeId)
    );
    if (data.value) {
      path.value = data.value.path;
    } else {
      console.log('err');
    }
  }
});

if (query.entryId) {
  let { data } = await useAsyncData('data', () =>
    client.entries.get(query.entryId)
  );
  if (data.value) {
    cecilia.value = data.value.cecilia;
    description.value = data.value.description;
    h1.value = data.value.h1;
    h2.value = data.value.h2;
    intro.value = data.value.introductoryText;
    pageSize.value = data.value.pageSize;
    showResultsNum.value = data.value.showResultsNum;
    title.value = data.value.title;
    reviewed.value = new Date(data.value.dateReviewed).toLocaleDateString(
      'en-GB'
    );
    bottom.value = data.value.bottomSection;
    ogImage.value = `https://www.cheshireeast.gov.uk${data.value.previewImage.asset.sys.uri}`;
  }
} else {
  title.value = 'Page not found';
}

let { data } = await useFetch('/api/data');
let payload = JSON.parse(data.value);
if (payload.error) {
  error.value = true;
} else {
  date.value = new Date(payload.date).toLocaleDateString('en-GB');
  time.value = formatTime(new Date(payload.date));
  items.value = payload.items;
}

// Set up the initial state of the page.
items.value.forEach((item, i) => {
  item.index = i;
  try {
    item.startDate = new Date(item.startDate);
    item.endDate = new Date(item.endDate);
    item.startDateString = item.startDate.toLocaleDateString('en-GB');
    item.endDateString = item.endDate.toLocaleDateString('en-GB');
  } catch (err) {
    console.log('Invalid date');
  }
});

items.value.sort((a, b) => a.startDate - b.startDate);
searchedItems.value = [...items.value];
filteredItems.value = [...items.value];

// Set up dates.
start.value = items.value[0].startDate;
end.value = items.value.reduce((acc, item) => {
  return item.endDate > acc ? item.endDate : acc;
}, 0);
start.value.setHours(0, 0, 0, 0);
end.value.setHours(23, 59, 59, 999);
dateEnd.value = end.value.toLocaleDateString('en-CA');

// Create initial pages.
pages.value = makePages(items.value, pageSize.value);

useHead({
  title: title.value,
  meta: [
    {
      name: 'description',
      content: description.value,
    },
  ],
  link: [{ rel: 'icon', type: 'image/png', href: 'favicon.png' }],
});
useSeoMeta({
  ogImage: ogImage.value,
});
</script>

<template>
  <div class="container-fluid p-0">
    <CecHeader />
    <NuxtPage />
    <CecFooter />
  </div>
</template>
