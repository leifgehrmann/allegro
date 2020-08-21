<template>
  <div
    class="summary-stats-container"
    v-if="stats.length > 0"
  >
    <div
      class="summary-stats"
      @click="showHours=!showHours"
    >
      <div
        v-for="(stat, index) in stats"
        :key="index"
      >
        <span v-if="showHours">
          <strong>{{stat.date}}:</strong> {{ renderHoursMinutes(stat.minutes) }}
        </span>
        <span v-else>
          <strong>{{stat.date}}:</strong> {{ stat.minutes }}m
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Worklog from '@/data/worklog';

export default Vue.extend({
  name: 'SummaryStats',
  props: {
    worklogs: {
      type: Array as () => Worklog[],
      default: (): Worklog[] => [],
    },
  },
  data: () => ({
    showHours: false,
  }),
  computed: {
    stats(): {isoDate: string, date: string, minutes: number}[] {
      const stats = {} as Record<string, {isoDate: string, date: string, minutes: number}>;
      this.worklogs.forEach((worklog) => {
        if (worklog.date === '') {
          return;
        }
        if (!(worklog.date in stats)) {
          stats[worklog.date] = {
            isoDate: worklog.date,
            date: new Date(worklog.date).toLocaleDateString(),
            minutes: 0,
          };
        }
        if (parseFloat(worklog.minutes) <= 0 || Number.isNaN(parseFloat(worklog.minutes))) {
          return;
        }
        stats[worklog.date].minutes += parseFloat(worklog.minutes ?? '0');
      });
      return Object.values(stats).sort((a, b) => (a.isoDate.localeCompare(b.isoDate)));
    },
  },
  methods: {
    renderHoursMinutes(minutes:number): string {
      const hours = Math.floor(minutes / 60);
      if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
      }
      return `${minutes}m`;
    },
  },
});
</script>

<style scoped>
.summary-stats-container {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.summary-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  user-select: none;
  border-radius: 10px;
  bottom: 10px;
  padding: 2px;
  background-color: #F7F7F7;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
  0 8px 10px 1px rgba(0, 0, 0, 0.14),
  0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.summary-stats > div {
  padding: 5px;
}

@media (prefers-color-scheme: dark) {
  .summary-stats {
    background-color: #444444;
  }
}
</style>
