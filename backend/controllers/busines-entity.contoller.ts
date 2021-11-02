import { createBusinessEntity } from "../data-access/business-entity.data-acess";
import { businessEntityCollection } from "../services/database.service";
import { BusinessEntity } from "../user-defined-types";

//create

export async function createNewBusinessEntity(businessEntityDetails: BusinessEntity) {
  return await createBusinessEntity(businessEntityDetails);
}

//update name
//update incomeShare
//update capitalShare
//update current capital
