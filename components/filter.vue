<script setup>

const mySearch = useMySearch();
const dateEnd = useState('dateEnd');
const makePages = useMakePages();
const dateStart = useState('dateStart');
const items = useState('items');
const pageIndex = useState('pageIndex');
const pageSize = useState('pageSize');
const pages = useState('pages');
const searchTerm = useState('searchTerm', () => '');
const searchedItems = useState('searchedItems');
const filteredItems = useState('filteredItems');
const searchFields = ['description', 'responsible', 'locations'];
const end = useState('end', () => undefined);
const start = useState('start', () => undefined);

const filter = () => {
  let st = dateStart.value ? getUTCDate(new Date(dateStart.value + 'T00:00')) : start.value;
  let end = getUTCDate(new Date(dateEnd.value + 'T23:59:59'));
  filteredItems.value = items.value.filter(
    (e) =>
      getUTCDate(e.startDate) >= st &&
      getUTCDate(e.endDate) <= end,
  );
  searchedItems.value = mySearch(filteredItems.value, searchTerm.value, searchFields);
  pages.value = makePages(searchedItems.value, pageSize.value);
  pageIndex.value = 0;
}



const reset = () => {
  dateStart.value = undefined;
  dateEnd.value = end.value.toLocaleDateString('en-CA');
  searchedItems.value = mySearch(items.value, searchTerm.value, searchFields);
  filteredItems.value = [...items.value];
  pages.value = makePages(searchedItems.value, pageSize.value);
  pageIndex.value = 0;
}

const getUTCDate = (date) => {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
};
</script>

<template>
  <div class="row g-flex date align-items-end">
    <h2 class="fs-5">Filter by date</h2>
    <div class="col-md-auto m-0">
      <div class="col-md-auto w-auto pe-2 d-inline-block">
        <h3 class="fs-6">Start</h3>
        <label for="start-date" class="d-none">Start date</label>
        <input id="start-date" v-model="dateStart" type="date" />
      </div>
      <div class="col-md-auto mt-2 pe-2 w-auto d-inline-block">
        <h3 class="fs-6">End</h3>
        <label for="end-date" class="d-none">End date</label>
        <input id="end-date" v-model="dateEnd" type="date" />
      </div>
    </div>
    <div class="col-md-6 mx-0 mt-3">
      <ol class="pagination mb-0">
        <li class="page-item pe-2">
          <button @click="filter" class="page-link rounded me-0 mb-0" type="button">
            Filter
          </button>
        </li>
        <li class="page-item">
          <button @click="reset" class="page-link rounded me-0 mb-0" type="button">
            Reset
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>
