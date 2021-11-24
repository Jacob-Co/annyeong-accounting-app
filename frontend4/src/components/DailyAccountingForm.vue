<template>
  <form>
    <div>
      <input
        type="date"
        v-model="dateInput"
        disabled
      />
    </div>

    <div class="input-group">
      <span class="input-group-text">Total</span>
      <input
        class="form-control"
        type="number"
        @keypress="calculatePhysicalSales"
        v-model="totalSalesInput"
        ref="tsInput"
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text">Online</span>
      <input
        class="form-control"
        type="number"
        @keypress="calculatePhysicalSales"
        v-model="onlineSalesInput"
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text">Physical</span>
      <input
        class="form-control"
        type="number"
        v-model="physicalSalesInput"
        disabled
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text">Expenses</span>
      <input
        class="form-control"
        type="number"
        disabled
        v-model="expenseTotal"
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text bg-info">Net Sales</span>
      <input
        class="form-control"
        type="number"
        disabled
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text">Credit</span>
      <input
        class="form-control"
        type="number"
        disabled
        v-model="creditTotal"
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text bg-success text-white">Take Home</span>
      <input
        class="form-control"
        type="number"
        disabled
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text">Register</span>
      <input
        class="form-control"
        type="number"
        placeholder="0"
      />
      <span class="input-group-text">php</span>
    </div>

    <div class="input-group">
      <span class="input-group-text">Remarks:</span>
      <input
        class="form-control"
        type="text"
      />
    </div>

    <button type="submit" class="btn btn-primary">Add</button>
  </form>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import store from '../store/index';

  @Options({
    computed: {
      expenseTotal() {
        return store.state.expenseTotal
      },
      creditTotal() {
        return store.state.creditTotal
      }
    }
  })
  export default class DailyAccountingForm extends Vue {
    public dateInput = '1998-02-10';
    public totalSalesInput = 0;
    public onlineSalesInput = 0;
    public physicalSalesInput = this.totalSalesInput - this.onlineSalesInput

    mounted() {
      this.dateInput = this.getDateTodayInYMD();
      console.log(new Date(this.dateInput).toString())
    }

    // @Watch('tsInput')
    // onTsInputChange(val: number, oldVal: number) {
    //   console.log(val);
    //   console.log(oldVal);
    // }
    // public calculatePhysicalSales() {
    //   this.physicalSalesInput = this.totalSalesInput - this.onlineSalesInput;
    // }

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