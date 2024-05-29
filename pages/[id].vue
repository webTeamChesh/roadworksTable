<script setup>
// Get the items and path from the state.
const items = useState('items');
const reviewed = useState('reviewed');
const path = useState('path');
const route = useRoute();
const truePath = route.path === '/' ? path.value : path.value + route.path;
const id = useRoute().params.id;

// Get item id from route.

// Set item using the route param.
const item = items.value.find((e) => e.id === id);
const title = `Roadworks map: ${id}`;
const description = `${item.description}: ${item.locations.replace('^#', ' ')}. ${item.startDateString} to ${item.endDateString}.`;

const mapUrl =
  'https://portal-gb.one.network/prd-portal-one-network/embed/?' +
  item.url.split('?')[1] +
  '&src=rw.org&options={"googleAPIKey"%3A"AIzaSyDG00gQi_7ApZ54lG6mOu6ov-fNLl7lpOg"%2C"organisationID"%3A1451%2C"embedded"%3Atrue}';

// Set the metadata for this page.
useHead({
  title: title,
  meta: [
    {
      name: 'description',
      content: description,
    },
  ],
});
</script>

<template>
  <div>
    <CecBreadcrumb :path="truePath" />
    <div class="container mt-4">
      <h1 class="hidden">Map</h1>
      <div class="loc-map" id="app">
        <RouterLink to="/" type="button" class="cec-button"
          >Back to table</RouterLink
        >
        <div
          title="One Networkd"
          class="ElginRoadworksWidget"
          style="width: 100%; height: 800px"
        >
          <iframe
            title="One Network Map"
            style="width: 100%; height: 800px; border: medium"
            :src="mapUrl"
          ></iframe>
        </div>
      </div>
    </div>
    <CecFeedback :title="title" :path="truePath" :reviewed="reviewed" />

    <Chatbot />
  </div>
</template>
