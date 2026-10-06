import { CustomerItem, SalesOrderItem } from "@/store/services/snd/types";

export type Customer = CustomerItem;
export type SalesOrder = SalesOrderItem;

export interface SndVisit {
  id: string;
  customer_name: string;
  thana: string;
  time: string;
  battery: string;
  gps_accuracy: string;
  status: string;
  statusColor: string;
  remarks: string;
}

export interface SndProductItem {
  id: string;
  name: string;
  sku: string;
  packSize: string;
  price: number;
}

export const SND_PRODUCTS: SndProductItem[] = [
  {
    id: "prod-1",
    name: "Formula G 5W-40 Synthetic",
    sku: "SYN-5W40-1L",
    packSize: "1L",
    price: 950,
  },
  {
    id: "prod-2",
    name: "Supreme 20W-50 Premium",
    sku: "PRM-20W50-4L",
    packSize: "4L",
    price: 2500,
  },
  {
    id: "prod-3",
    name: "Super Fleet Special 15W-40",
    sku: "FLT-15W40-5L",
    packSize: "5L",
    price: 3100,
  },
  {
    id: "prod-4",
    name: "Industrial EP Gear Oil 320",
    sku: "IND-EP320-20L",
    packSize: "20L Drum",
    price: 13000,
  },
];
