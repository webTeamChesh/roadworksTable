const listTemplate = `
<div>
<ul id="myTab" class="nav nav-tabs" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        id="table-tab"
        class="nav-link active"
        role="tab"
        aria-controls="table"
        aria-selected="true"
        type="button"
        data-bs-toggle="tab"
        data-bs-target="#table"
        @click="toggleTabs"
      >
        Table
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        id="map-tab"
        class="nav-link"
        role="tab"
        aria-controls="contact"
        aria-selected="false"
        type="button"
        data-bs-toggle="tab"
        data-bs-target="#map"
        @click="toggleTabs"
      >
        Map
      </button>
    </li>
  </ul>
  <div id="myTabContent" class="tab-content">
    <div v-if="error">
      <p>Nothing to display at present. Try again in a few minutes.</p>
    </div>
    <div
      id="table"
      class="mt-3 tab-pane fade show active"
      role="tabpanel"
      aria-labelledby="table-tab"
    >
      <div v-if="table">
        <div v-else>
          <div v-if="!error">
            <p>This information was last updated on {{date}} at {{time}}.</p>

              <div class="row">
                <div class="input-group mb-3 content-type-search">
                  <label for="contentTypeSearchInput" class="sr-only"
                    >Filter results</label
                  >
                  <input
                    @input="search"
                    autocomplete="off"
                    type="text"
                    class="form-control"
                    placeholder="Type here to filter results"
                    v-model="searchTerm"
                    aria-label="Search term"
                    id="contentTypeSearchInput"
                  />
                  <label for="contentTypeSearchInput" class="hidden"
                    >Search term</label
                  >
                  <div class="input-group-append">
                    <button
                      v-if="searchTerm.length > 0"
                      class="ms-2 btn btn-outline-secondary"
                      type="button"
                      v-on:click="resetSearch"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              </div>
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
                  <ul class="pagination mb-0">
                    <li class="page-item pe-2">
                      <button
                        @click="filter"
                        class="page-link rounded me-0 mb-0"
                        type="button"
                      >
                        Filter
                      </button>
                    </li>
                    <li class="page-item">
                      <button
                        @click="reset"
                        class="page-link rounded me-0 mb-0"
                        type="button"
                      >
                        Reset
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="api-results-info mt-3">
                <p class="mb-1">
                  Total results: <strong>{{totalCount }}</strong>
                </p>
                <p class="mb-1" v-if="pageCount > 1">
                  Page {{pageIndex + 1}} of {{pageCount}}
                </p>
              </div>
              <nav
                v-if="pageCount > 1"
                role="navigation"
                aria-label="Results data navigation"
              >
                <ul class="pagination d-flex flex-wrap mb-2 ms-0">
                  <li
                    class="page-item"
                    v-bind:class="{disabled: pageIndex===0}"
                  >
                    <button
                      class="page-link rounded"
                      type="button"
                      v-on:click="goToPage(pageIndex - 1)"
                    >
                      Previous
                    </button>
                  </li>
                  <li
                    class="page-item"
                    v-bind:class="{disabled: pageIndex + 1 >=pageCount}"
                  >
                    <button
                      class="page-link rounded"
                      type="button"
                      v-on:click="goToPage(pageIndex + 1)"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
              <p>Clicking on a location will display a map.</p>
              <div class="table-responsive">
                <table class="usr_TableDefault">
                  <caption class="d-none">
                    Roadworks
                  </caption>
                  <thead>
                    <tr>
                      <th
                        v-for="obj in fields"
                        tabindex="0"
                        scope="col"
                        @click="sortByField(obj)"
                        class="tableHead p-0 align-middle"
                        :id="obj.id"
                      >
                        <div class="row g-0">
                          <div class="arrows col-1 p-0">
                            <span class="entryUpIcon" :id="'up' + obj.id"
                              >&#9650;</span
                            >
                            <span class="entryDownIcon" :id="'down'+obj.id"
                              >&#9660;</span
                            >
                          </div>
                          <div class="col-11 pt-1 ps-2">{{obj.display}}</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in items" :key="item.index">
                      <td>
                        <span @click="showMap(item)">
                          <ul class="my-0">
                            <template v-for="l in item.locations.split('^#')">
                              <li v-if="l !== 'None'">
                                <span class="fakeLink">{{l}}</span>
                              </li>
                            </template>
                          </ul>
                        </span>
                        <p
                          class="mt-2 mb-0 ps-1"
                          :class="{'text-danger':  item.severity === 'High'}"
                        >
                          Impact: {{item.severity}}
                        </p>
                      </td>
                      <td>
                        <ul>
                          <li v-for="(d, i) in makeDesc(item.description)" :key="i">
                            <p class="mb-0" v-if="d.length">{{d}}</p>
                            <p class="mb-0" v-else>View map for more details</p>
                          </li>
                          <li v-if="item.extra">{{item.extra}}</li>
                        </ul>
                      </td>
                      <td>{{item.startDateString}}</td>
                      <td>{{item.endDateString}}</td>
                      <td>{{item.responsible}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>
        </div>
      </div>
      <div v-if="!table" class="loc-map">
        <button class="cec-button" type="button" @click="showTable">
          Back to table
        </button>
        <div
          title="One Networkd"
          class="ElginRoadworksWidget"
          :id="mapId"
          style="width: 100%; height: 800px"
        >
          <iframe
            style="width: 100%; height: 800px; border: medium"
            :src="mapUrl"
          ></iframe>
        </div>
      </div>
    </div>
    <div
      id="map"
      class="mt-3 tab-pane fade row"
      role="tabpanel"
      aria-labelledby="map-tab"
    >
      <div class="col-12">
        <p>
          You can view current and upcoming
          <strong>planned</strong> roadworks, road closures and other traffic
          disruptions in Cheshire East on this map.
        </p>

        <div class="col-md-8">
          <p class="sr-only">
            The following checkboxes are used for accordion drop-downs. When
            selected, they show content that was visually hidden
          </p>
          <section class="access-acc-container">
            <input id="acc" type="checkbox" />
            <label for="acc">How to use the map</label>
            <article>
              <p>
                You can search by street name and view any planned roadworks
                within the next 12 months.
              </p>
              <p>Zoom into the map to see the detail.</p>
              <p>
                You can register for an account to set up email alerts for a
                specific area.
              </p>
              <p>
                Click on &lsquo;data layers&rsquo; to change filters for
                information such as live traffic, road closures and diversions.
                You can see roadworks planned for a future date by selecting up
                to twelve months ahead using the options box on the map.
              </p>
            </article>
          </section>
        </div>
      </div>
      <div v-if="showMainMap" class="col-12">
        <div
          title="One Networkd"
          id="erw-container2"
          class="ElginRoadworksWidget"
          style="width: 100%; height: 800px"
        ></div>
      </div>
    </div>
  </div>
</div>
  `;

export default listTemplate;
