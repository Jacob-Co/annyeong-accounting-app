import { backendString } from "@/utils/server.util";
import { getBearerToken } from "@/utils/authorization.util";
import { getBusinessEntityRes } from '../../../types/api-response-types';

export async function getBusinessDetails() {
  const bearerToken = getBearerToken();
  const response = await fetch(`${backendString}/api/businessEntities/`, {
    method: 'GET',
    headers: {
      'Authorization': bearerToken
    }
  });
  const businessDetails = await response.json() as getBusinessEntityRes;
  return businessDetails;
}