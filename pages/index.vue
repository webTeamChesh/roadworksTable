<script setup>
const cecilia = useState('cecilia');
const description = useState('description');
const h1 = useState('h1');
const intro = useState('intro');
const bottom = useState('bottom');
const path = useState('path');
const reviewed = useState('reviewed');
const error = useState('error');
const date = useState('date');
const time = useState('time');
const title = useState('title');

useHead({
  title: title.value,
  meta: [
    {
      name: 'description',
      content: description.value,
    },
  ],
});

// Create a ref so we can scroll to this.
const el = ref(null);
const scrollTo = useState('scrollTo', () => null);

const __ElginLoaderRetroFit = function (opts) {
  const container = document.getElementById('erw-container2');
  if (container) {
    const baseUrl =
        'https://portal-gb.one.network/prd-portal-one-network/embed/?src=rw.org&options=',
      iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = baseUrl + encodeURIComponent(JSON.stringify(opts));
    container.innerHTML = '';
    container.appendChild(iframe);
  }
};

const OPTS = {
  googleAPIKey: 'AIzaSyDG00gQi_7ApZ54lG6mOu6ov-fNLl7lpOg',
  organisationID: 1451,
  embedded: true,
  data: {
    layersActive: [
      'INCIDENTS_LIVE_INCIDENT',
      'INCIDENTS_LIVE_ACCIDENT',
      'INCIDENTS_LIVE_WEATHER',
      'INCIDENTS_LIVE_LANDSLIP',
      'INCIDENTS_LIVE_FLOOD',
      'INCIDENTS_LIVE_ROADCLOSURE',
      'INCIDENTS_LIVE_LANECLOSURE',
      'INCIDENTS_LIVE_HGVCLOSURE',
      'TM_LAYER_ROADCLOSURE_LIVE',
      'TM_LAYER_DIVERSIONROUTE_LIVE',
      'TM_LAYER_HGVDIVERSIONROUTE_LIVE',
      'TM_LAYER_TEMPORARYONEWAY_LIVE',
      'TM_LAYER_BRIDGECLOSURE_LIVE',
      'TM_LAYER_LANECLOSURE_LIVE',
      'TM_LAYER_FOOTWAYCLOSURE_LIVE',
      'TM_LAYER_TEMPORARYSPEEDLIMIT_LIVE',
      'TM_LAYER_WEIGHTRESTRICTION_LIVE',
      'TM_LAYER_SUSPENSIONWEIGHTRESTRICTION_LIVE',
      'TM_LAYER_CLEARWAY_LIVE',
      'TM_LAYER_TOWAWAYZONE_LIVE',
      'TM_LAYER_TEMPPARKINGRESTRICTION_LIVE',
      'TM_LAYER_SUSPENSIONPARKINGRESTRICTION_LIVE',
      'TM_LAYER_SUSPENSION_BUSWAY_LIVE',
      'TM_LAYER_SUSPENSION_BUSWAY_TRIAL',
      'TM_LAYER_GRITTING_LIVE',
      'TM_LAYER_PREFERRED_ACCESS_V7_LIVE',
      'TM_LAYER_CLOSURE_CROSSING_LIVE',
      'TM_LAYER_ROADAHEADCLOSED_LIVE',
      'TM_LAYER_NOVEHICLEACCESS_LIVE',
      'TM_LAYER_NORIGHTTURN_LIVE',
      'TM_LAYER_NOLEFTTURN_LIVE',
      'TM_LAYER_NOUTURN_LIVE',
      'TM_LAYER_SUSPENSIONONEWAY_LIVE',
      'TM_LAYER_REVERSALONEWAY_LIVE',
      'TM_LAYER_TWOWAYSIGNALS_LIVE',
      'TM_LAYER_MULTIWAYSIGNALS_LIVE',
      'TM_LAYER_STOPANDGO_LIVE',
      'TM_LAYER_GIVEANDTAKE_LIVE',
      'TM_LAYER_PRIORITYSIGNS_LIVE',
      'TM_LAYER_CONVOYWORKING_LIVE',
      'TM_LAYER_WORKSSTOP_LIVE',
      'ROADWORKS_CURRENT',
      'TM_LAYER_ENTITY_CYCLING_LIVE',
      'TM_LAYER_ENTITY_FOOTBALL_LIVE',
      'TM_LAYER_ENTITY_HORSE_RACING_LIVE',
      'TM_LAYER_ENTITY_MOTOR_SPORT_EVENT_LIVE',
      'TM_LAYER_ENTITY_RUGBY_LIVE',
      'TM_LAYER_ENTITY_RUNNING_LIVE',
      'TM_LAYER_ENTITY_SPORT_EVENT_LIVE',
      'TM_LAYER_ENTITY_CARNIVAL_PARADE_STREET_LIVE',
      'TM_LAYER_ENTITY_POLLING_STATION_LIVE',
      'TM_LAYER_ENTITY_AGRICULTURAL_SHOW_LIVE',
      'TM_LAYER_ENTITY_AIR_SHOW_LIVE',
      'TM_LAYER_ENTITY_REMEMBRANCE_PARADE_LIVE',
      'TM_LAYER_ENTITY_CHRISTMAS_EVENT_LIVE',
      'TM_LAYER_ENTITY_ENTERTAINMENT_EVENT_LIVE',
      'TM_LAYER_ENTITY_FESTIVAL_LIVE',
      'TM_LAYER_ENTITY_MARKET_LIVE',
      'TM_LAYER_ENTITY_FUNERAL_LIVE',
      'TM_LAYER_ENTITY_OTHER_PUBLIC_EVENTS_LIVE',
    ],
  },
  embedID: 'NGIZHOPRC0',
  ui: {
    breakingNewsWidget: 660,
  },
  system: {
    delayedLoad: true,
  },
  layer: {
    hideLayers: ['TM_LAYER_ENTITY_CRUISE_SHIP_LIVE'],
  },
  map: {
    swLat: 52.83978188528856,
    swLng: -3.142559340451953,
    neLat: 53.493445532391156,
    neLng: -1.5852473287332032,
  },
  dateRange: 'today',
};

let showMainMap = false;
const toggleTabs = () => {
  showMainMap = !showMainMap;
  if (showMainMap) {
    setTimeout(() => {
      let Elgin = { loader: { load: __ElginLoaderRetroFit } };
      Elgin.loader.load(OPTS);
    }, 0);
  }
};

onMounted(() => {
  scrollTo.value = el.value;
});
</script>

<template>
  <div>
    <CecBreadcrumb />
    <div class="container mt-4">
      <main>
        <div class="row g-0" id="app">
          <h1>{{ h1 }}</h1>
          <div v-html="intro"></div>
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
                Open map view
              </button>
            </li>
          </ul>
          <div id="myTabContent" class="tab-content">
            <div v-if="error">
              <p>Nothing to display at present. Try again in a few minutes.</p>
            </div>
            <div
              v-else
              id="table"
              class="mt-3 tab-pane fade show active"
              role="tabpanel"
              aria-labelledby="table-tab"
            >
              <p v-if="!error">
                This information was last updated on {{ date }} at {{ time }}.
              </p>
              <Filter />
              <Search /><span ref="el"></span>
              <Pagination />
              <Table />
              <Pagination />
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
                  <strong>planned</strong> roadworks, road closures and other
                  traffic disruptions in Cheshire East on this map.
                </p>

                <div class="col-md-8">
                  <p class="sr-only">
                    The following checkboxes are used for accordion drop-downs.
                    When selected, they show content that was visually hidden
                  </p>
                  <section class="access-acc-container">
                    <input id="acc" type="checkbox" />
                    <label for="acc">How to use the map</label>
                    <article>
                      <p>
                        You can search by street name and view any planned
                        roadworks within the next 12 months.
                      </p>
                      <p>Zoom into the map to see the detail.</p>
                      <p>
                        You can register for an account to set up email alerts
                        for a specific area.
                      </p>
                      <p>
                        Click on &lsquo;data layers&rsquo; to change filters for
                        information such as live traffic, road closures and
                        diversions. You can see roadworks planned for a future
                        date by selecting up to twelve months ahead using the
                        options box on the map.
                      </p>
                    </article>
                  </section>
                </div>
              </div>
              <div class="col-12">
                <div
                  title="One Networkd"
                  id="erw-container2"
                  class="ElginRoadworksWidget"
                  style="width: 100%; height: 800px"
                ></div>
              </div>
            </div>
          </div>
          <div class="mt-3" v-html="bottom"></div>
        </div>
      </main>
    </div>
    <CecFeedback :title="title" :path="path" :reviewed="reviewed" />

    <Chatbot v-if="cecilia" />
  </div>
</template>
