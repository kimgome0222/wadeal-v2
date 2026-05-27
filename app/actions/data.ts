"use server";

import {
  createParticipation,
  createPriceAlert,
} from "@/lib/data";
import type {
  CreateParticipationInput,
  CreatePriceAlertInput,
} from "@/lib/database/types";

export async function submitPriceAlertAction(input: CreatePriceAlertInput) {
  return createPriceAlert(input);
}

export async function submitParticipationAction(input: CreateParticipationInput) {
  return createParticipation(input);
}
