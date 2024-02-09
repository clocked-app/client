import { http } from "../axios";
import { type Input } from "../components/RecordList.vue";
import { format } from "date-fns";

export interface Calculation {
  type: "WORK" | "ABSENT";
  value: number;
}

export interface CalculationDayRequest {
  date: Date;
  registeredInputs: Input[];
  shiftInputs: Input[];
}

const getCalculationsFromAPI = async (
  requestData: CalculationDayRequest,
): Promise<Calculation[]> => {
  const dateFormatted = format(requestData.date, "yyyy-MM-dd");
  const registeredInputs = requestData.registeredInputs;
  const shiftInputs = requestData.shiftInputs;

  const response = await http.post("/calculations/day", {
    date: dateFormatted,
    registeredRecords: [
      ...registeredInputs.map((r) => `${dateFormatted} ${r.value}`),
    ],
    shiftRecords: [...shiftInputs.map((r) => `${dateFormatted} ${r.value}`)],
  });

  return response.data;
};

export { getCalculationsFromAPI };

export default getCalculationsFromAPI;
