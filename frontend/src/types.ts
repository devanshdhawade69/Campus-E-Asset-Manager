// Types shared across the frontend
export interface Item {
  _id?: string;
  deviceType: string;
  serialNumber: string;
  condition: string;
  disposalMethod: string;
  additionalNotes?: string;
  location?: string;
  responsibleDept?: string;
}
