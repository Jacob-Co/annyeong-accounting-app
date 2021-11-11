import * as dotenv from 'dotenv';
dotenv.config();

export function backendString() {
  return process.env.BACKEND_SERVER;
}
