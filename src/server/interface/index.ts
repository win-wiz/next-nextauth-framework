import { env } from "@/env";
export async function getWorkerTest () {

  const response = await fetch(`${env.REQUEST_BASE_URL}/`);

  const result = await response.json();

  return result;
}