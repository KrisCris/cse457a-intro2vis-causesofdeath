import { defineStore } from 'pinia';
import {
  stack as Stack,
  stackOrderAscending,
  scaleLinear,
} from 'd3';
import causes from '../assets/data/test.json';

const keys = [];

for (let i = 4; i < causes.meta.length; i++) {
  keys.push(i);
}

const stack = Stack()
  .keys(keys)
  .value((d, key) => d[key] / d[2])
  .order(stackOrderAscending);

const getCountries = year => Object
  .entries(causes[year])
  .filter(data => data[0] !== 'sum');

export default defineStore('stack', {
  state: () => {
    const year = 1990;
    const data = getCountries(year);
    const base = 100;

    return {
      year,
      data,
      meta: causes.meta,
      base,
      x: null,
      search: '',
      isExpand: false
    };
  },

  actions: {
    setXScale(width) {
      this.x = scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    },
    setYear(year) {
      this.year = year;
      this.updateData();
    },
    updateData() {
      this.data = getCountries(this.year);
      if (this.search) {
        this.data = this.data
        .filter(d => new RegExp(this.search, 'i').test(d[1][0]));
      }
    },
    getStackedData(data) {
      return stack([data]);
    },
    scaleColor(percent) {
      if (percent < 0.1) {
        return '#99D594';
      }
      if (percent < 0.2) {
        return '#FEE08B';
      }
      if (percent < 0.3) {
        return '#FC8D59';
      }
      return '#D53E4F';
    },
    // onSearch() {
    //   this.data = getCountries(this.year)
    //     .filter(d => new RegExp(this.search, 'i').test(d[1][0]));
    // },
    onStoryClick() {
      this.isExpand = !this.isExpand;
    }
  },
});
