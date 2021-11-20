<template>
  <div class="accordion" id="accordionPanelsStayOpenExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
          Expenses
        </button>
      </h2>
      <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
        <div class="accordion-body">
          <ExpensesForm />
        </div>
      </div>
    </div>

    <div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
          Credit
        </button>
      </h2>
      <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
        <div class="accordion-body">
          <CreditForm />
        </div>
      </div>
    </div>

    <div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingThree">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
          Daily Accounting
        </button>
      </h2>
      <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
        <div class="accordion-body">
          <DailyAccountingForm />
        </div>
      </div>
    </div>

    <div class="accordion-item">
      <h2 class="accordion-header" id="panelsStayOpen-headingFour">
        <button 
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-collapseFour"
          aria-expanded="false"
          aria-controls="panelsStayOpen-collapseFour"
        >
          Stocks
        </button>
      </h2>
      <div 
        id="panelsStayOpen-collapseFour" 
        class="accordion-collapse collapse"
        aria-labelledby="panelsStayOpen-headingFour">
        <div class="accordion-body">
          <StockForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import ExpensesForm from '../components/ExpensesForm.vue';
  import DailyAccountingForm from '../components/DailyAccountingForm.vue';
  import CreditForm from '../components/CreditForm.vue';
  import StockForm from '../components/StockForm.vue';

  @Options({
    components: {
      ExpensesForm,
      DailyAccountingForm,
      CreditForm,
      StockForm
    }
  })
  export default class View extends Vue {}
</script>