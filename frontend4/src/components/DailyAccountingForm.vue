<template>
  <form>
    <div>
      <label for="dateInput">Date Today</label>
      <input
        type="date"
        v-model="dateInput"
        disabled
      />
    </div>

    <div>
      <label for="totalSales">Total Sales</label>
      <input
        type="number"
        @keypress="calculatePhysicalSales"
        v-model="totalSalesInput"
        ref="tsInput"
      />
    </div>

    <div>
      <label for="onlineSales">Online Sales</label>
      <input
        type="number"
        @keypress="calculatePhysicalSales"
        v-model="onlineSalesInput"
      />
    </div>

    <div>
      <label for="physicalSales">Physical Sales</label>
      <input
        type="number"
        v-model="physicalSalesInput"
        disabled
      />
    </div>
  </form>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import { Watch } from 'vue-property-decorator';

  export default class DailyAccountingForm extends Vue {
    public dateInput = '1998-02-10';
    public totalSalesInput = 0;
    public onlineSalesInput = 0;
    public physicalSalesInput = this.totalSalesInput - this.onlineSalesInput

    mounted() {
      this.dateInput = this.getDateTodayInYMD();
      console.log(new Date(this.dateInput).toString())
    }

    @Watch('tsInput')
    onTsInputChange(val: number, oldVal: number) {
      console.log(val);
      console.log(oldVal);
    }
    public calculatePhysicalSales() {
      this.physicalSalesInput = this.totalSalesInput - this.onlineSalesInput;
    }

    private getDateTodayInYMD() {
      const today = new Date();
      const date = this.addPreZero(today.getDate().toString());
      const month = this.addPreZero((today.getMonth() + 1).toString());
      const year = today.getFullYear();
      return `${year}-${month}-${date}`
    }

    private addPreZero(str: string) {
      if (str.length === 1) {
        return `0${str}`
      }
      return str;
    }
  }
</script>