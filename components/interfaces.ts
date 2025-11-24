export interface IAIenabled {
  [type: string]: AIenabledDetail;
}

interface AIenabledDetail {
  enabled: boolean;
  last_fetched: number;
}
