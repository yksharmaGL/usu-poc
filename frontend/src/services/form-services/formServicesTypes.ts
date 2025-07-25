export interface GetFormByIdParams {
  signal: AbortSignal;
  selectedFormId: string | null;
}

export interface AddFormDataParams {
  data: Record<string, any>; 
}