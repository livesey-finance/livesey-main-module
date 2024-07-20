<template>
  <div class="shares-table">
    <table>
      <thead>
        <tr>
          <th
            v-for="header in relevantHeaders"
            :key="header.key"
            :class="{ sortable: header.sortable }"
            @click="header.sortable && sort(header.key)"
          >
            {{ header.label }}
            <span v-if="header.sortable">
              <span v-if="sortedKey === header.key">
                <span v-if="sortedDirection === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sortedData" :key="row.code">
          <td v-for="header in relevantHeaders" :key="header.key">{{ row[header.key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    additionalFields: Array,
    isTopTen: Boolean,
  },
  data() {
    return {
      sortedKey: null,
      sortedDirection: 'asc',
      headers: [
        { label: 'Name', key: 'name', sortable: false },
        { label: 'Code', key: 'code', sortable: !this.isTopTen },
        { label: 'Last', key: 'last', sortable: !this.isTopTen },
        { label: 'price', key: 'last', sortable: !this.isTopTen },
        { label: 'Change[1h]', key: 'changePercent', sortable: !this.isTopTen },
        { label: 'Change[24h]', key: 'changePercent', sortable: !this.isTopTen },
        { label: 'Change[7d]', key: 'changePercent', sortable: !this.isTopTen },
        { label: 'Time', key: 'time', sortable: false },
      ],
    };
  },
  computed: {
    relevantHeaders() {
      return this.headers.filter(header => {
        return header.key === 'code' || this.additionalFields.includes(header.label);
      });
    },
    sortedData() {
      if (!this.sortedKey) return this.data;

      return [...this.data].sort((a, b) => {
        if (a[this.sortedKey] < b[this.sortedKey]) return this.sortedDirection === 'asc' ? -1 : 1;
        if (a[this.sortedKey] > b[this.sortedKey]) return this.sortedDirection === 'asc' ? 1 : -1;
        return 0;
      });
    },
  },
  methods: {
    sort(key) {
      if (this.sortedKey === key) {
        this.sortedDirection = this.sortedDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortedKey = key;
        this.sortedDirection = 'asc';
      }
    },
  },
};
</script>

<style scoped>
.shares-table {
  width: 100%;
}

.shares-table table {
  width: 100%;
  border-collapse: collapse;
}

.shares-table th,
.shares-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.shares-table th {
  background-color: #f0f0f0;
  position: relative;
}

.shares-table th.sortable {
  cursor: pointer;
}

.shares-table th span {
  margin-left: 5px;
}
</style>
