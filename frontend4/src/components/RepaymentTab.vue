<template>
  <div>
    <select
      class="form-select d-block" 
      aria-label="Default select example"
      v-model="creditorInput"
      @change="handleCreditorSelect"
    >
      <option selected disabled value="">Creditor Name</option>
      <option 
        v-for="creditor in creditors" 
        :key="creditor._id"
        :value="creditor._id.toString()"
      >
        {{creditor.wholeName}} 
      </option>
    </select>

    <div class="accordion" v-show="isCreditorChosen">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
            Unsettled
          </button>
        </h2>
        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
          <div class="accordion-body">
            <ul class="list-group">
              <li
                v-for="credit in unsettledCredits"
                :key="credit._id"
                class="list-group-item"
                aria-label="test"
              >
                <details>
                  <summary>
                    {{credit.amount}} ({{ getDateInYMDWrapper(credit.date) }})
                    <button
                      class="btn text-white bg-success d-inline"
                      @click="deleteCreditButton($event, credit._id)"
                    >
                    pay
                    </button>
                  </summary>
                  {{credit.remarks || 'No remarks'}}
                </details>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
            Settled
          </button>
        </h2>
        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
          <div class="accordion-body">
            <ul class="list-group">
              <li
                v-for="credit in settledCredits"
                :key="credit._id"
                class="list-group-item"
                aria-label="test"
              >
                <details>
                  <summary>
                    {{credit.amount}}
                    <span v-if="credit.isPaid" class="text-success">
                      paid
                    </span>
                    <span v-if="!credit.isPaid" class="text-danger">
                      not paid
                    </span>
                    <!-- <button
                      class="btn text-white bg-sucess d-inline"
                      @click="deleteCreditButton($event, credit._id)"
                    >
                    $
                    </button> -->
                  </summary>
                  {{credit.remarks || 'No remarks'}}
                </details>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Options} from 'vue-class-component'
  import { getBearerToken } from '../utils/authorization.util'
  import { backendString } from '../utils/server.util'
  import { getDateInYMD } from '../utils/date.util'

  @Options({
    computed: {
      isCreditorChosen() {
        return this.creditorInput !== '' || false;
      } 
    }
  })
  export default class RepaymentTab extends Vue {
    public creditors = [];
    public creditorInput = '';
    public unsettledCredits: any[] = [];
    public settledCredits: any[] = [];

    mounted() {
      this.getCreditors().then(res => this.creditors = res);
    }

    public getDateInYMDWrapper(dateString: string) {
      const targetDate = new Date(dateString);
      return getDateInYMD(targetDate)
    }

    public async handleCreditorSelect() {
      this.unsettledCredits = [];
      this.settledCredits = [];

      const result = await fetch(`${backendString}/api/credits/all/${this.creditorInput}`, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken()
        }
      })

      const credits = await result.json();

      credits.forEach((credit: any) => {
        if (credit.isPaid) {
          this.settledCredits.push(credit);
        } else {
          this.unsettledCredits.push(credit);
        }
      })
    }

    private async getCreditors() {
      const result = await fetch(`${backendString}/api/creditors/all`, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken() 
        },
      })
      return await result.json();
    }
  }
</script>

<style scoped>
</style>