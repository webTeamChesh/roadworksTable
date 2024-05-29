<script lang="ts" setup>
const mySearch = useMySearch();
const makePages = useMakePages();

const pageIndex = useState('pageIndex');
const pageSize = useState('pageSize');
const pages = useState('pages');
const searchTerm = useState('searchTerm', () => '');
const searchedItems = useState('searchedItems');
const filteredItems = useState('filteredItems');
const searchFields = ['description', 'responsible', 'locations'];

const resetSearch = () => {
  searchTerm.value = '';
  pages.value = makePages(filteredItems.value, pageSize.value);
  pageIndex.value = 0;
  searchedItems.value = [...filteredItems.value];
};

const doSearch = () => {
  searchedItems.value = mySearch(
    filteredItems.value,
    searchTerm.value,
    searchFields
  );
  pages.value = makePages(searchedItems.value, pageSize.value);
  pageIndex.value = 0;
};
</script>

<template>
  <div class="row gx-2 mt-3">
    <div class="col-10 mb-3 content-type-search">
      <input
        @input="doSearch"
        autocomplete="off"
        type="text"
        class="form-control"
        placeholder="Type here to filter results"
        v-model="searchTerm"
        aria-label="Search term"
        id="contentTypeSearchInput"
      />
      <label for="searchInput" class="hidden">Search term</label>
    </div>
    <div class="col">
      <button
        v-if="searchTerm.length"
        class="btn btn-outline-secondary"
        type="button"
        @click="resetSearch"
      >
        Clear Search
      </button>
    </div>
  </div>
</template>
