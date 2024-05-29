<script setup>
const fields = [
  {
    id: 'locations',
    display: 'Location',
    sort: ((a, b) => {
      return a.locations === b.locations ? 0 : a.locations < b.locations ? -1 : 1;
    })
  },
  {
    id: 'description',
    display: 'Description',
    sort: ((a, b) => {
      return a.description === b.description ? 0 : a.description < b.description ? -1 : 1;
    })
  },
  {
    id: 'startDate', display: 'Start date',
    sort: ((a, b) => {
      return a.startDate - b.startDate;
    }),
  },
  {
    id: 'endDate', display: 'End date',
    sort: ((a, b) => {
      return a.endDate - b.endDate;
    }),
  },
  {
    id: 'responsible',
    display: 'Responsibility',
    sort: ((a, b) => {
      return a.responsible === b.responsible ? 0 : a.responsible < b.responsible ? -1 : 1;
    })
  },
];

const pageIndex = useState("pageIndex");
const pages = useState('pages');


const resetIcons = () => {
  fields.forEach((obj) => {
    obj.up.style.color = 'gray';
    obj.down.style.color = 'gray';
  });
};

const setUpHeaders = (e) => {
  e.up = document.getElementById('up' + e.id);
  e.down = document.getElementById('down' + e.id);
  e.elem.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      sortByField(e);
    }
  });
};

const sortByField = (e) => {
  resetIcons();
  let temp = [...pages.value[pageIndex.value]];
  temp.sort(e.sort);
  if (temp.some((e, i) => e.index !== pages.value[pageIndex.value][i].index)) {
    pages.value[pageIndex.value] = [...temp];
    e.up.style.color = 'black';
  } else {
    pages.value[pageIndex.value] = [...temp].reverse();
    e.down.style.color = 'black';
  }
};

onMounted(() => {
  fields.forEach((e) => {
    e.elem = document.getElementById(e.id);
    setUpHeaders(e);
  });
})

</script>

<template>
  <div>
    <p class="cec-green">Click on a heading to sort by that column.</p>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table usr_TableDefault">
            <caption class="usr_CaptionHide">
              Roadworks and travel disruption
            </caption>
            <thead>
              <tr>
                <th v-for="obj in fields" tabindex="0" :key="obj.id" scope="col" @click="sortByField(obj)" :id="obj.id"
                  class="tableHead p-0 align-middle">
                  <div class="container ps-2">
                    <div class="row align-items-center">
                      <div class="col-11 pt-1">{{ obj.display }}</div>
                      <div class="col-1 p-0">
                        <span class="hmoUpIcon" :id="'up' + obj.id">&#9650;</span>
                        <span class="hmoDownIcon" :id="'down' + obj.id">&#9660;</span>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody v-for="(_, i) in pages" :key="i" v-show="i === pageIndex">
              <tr v-for="item in pages[i]" :key="item.id">
                <td>
                  <ul class="my-0">
                    <template v-for="l in item.locations.split('^#')">
                      <li v-if="l !== 'None'">
                        <RouterLink :to="item.id">{{ l }}</RouterLink>
                      </li>
                    </template>
                  </ul>
                  <p class="mt-2 mb-0 ps-1" :class="{ 'text-danger': item.severity === 'High' }">
                    Impact: {{ item.severity }}
                  </p>
                </td>
                <td>
                  <ul>
                    <li v-for="(d, i) in item.description.split('^#')" :key="i">
                      <p class="mb-0" v-if="d.length">{{ d }}</p>
                      <p class="mb-0" v-else>View map for more details</p>
                    </li>
                    <li v-if="item.extra">{{ item.extra }}</li>
                  </ul>
                </td>
                <td>{{ item.startDateString }}</td>
                <td>{{ item.endDateString }}</td>
                <td>{{ item.responsible }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
