<template>
  <div :class="['shares-table', { 'dark-theme': darkTheme }]">
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
          <td v-if="showNameField">
            <a @click.prevent="goToCryptoDetail(row)">{{ row.name }}</a>
          </td>
          <td v-for="header in relevantHeaders.slice(showNameField ? 1 : 0)" :key="header.key">{{ row[header.key] }}</td>
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
    darkTheme: Boolean, // Accept darkTheme as a prop
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
      return this.headers.filter((header) => {
        if (header.key === 'name') {
          return !this.isTopTen;
        }
        return this.additionalFields.includes(header.label);
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
    showNameField() {
      return this.relevantHeaders.some((header) => header.key === 'name');
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
    goToCryptoDetail(crypto) {
      localStorage.setItem('selectedCrypto', JSON.stringify(crypto));
      this.$router.push(`/crypto/${crypto.code}`);
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

/* Dark theme styles */
.shares-table.dark-theme th,
.shares-table.dark-theme td {
  background-color: #161b22;
  color: #BFC3C6;
  border-bottom: 1px solid #30363d;
}

.shares-table.dark-theme th {
  background-color: #21262d;
  color: #BFC3C6;
  border-bottom: 1px solid #30363d;
  border-top: 1px solid #30363d;
}

.shares-table.dark-theme th
.side-panel.dark-theme th  {
  background-color: #21262d;
}
</style>
