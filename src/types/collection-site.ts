export enum SiteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SiteType {
  PERSONAL = 'PERSONAL',
  ORGANIZATION = 'ORGANIZATION',
}

export interface CollectionSite {
  siteId: string
  name: string
  contactName: string | undefined
  organizationName: string | undefined
  city: string
  address: string
  supportRefrigerating: boolean
  siteStatus: SiteStatus
  siteType: SiteType
  openingHoursLink: string
  phone: string
}

export interface Branch {
  _id: string
  Name_c: string
  ContactName_c?: string
  ContactFirstName_c?: string
  ContactLastName_c?: string
  WhatsappNumber_c?: string
  Settelment_c: string
  Address_c: string
  RefrigeratedMedicines_c: boolean
  Type_c: string
  OpeningHours_c: string
  Status_c: 'active' | 'inactive'
  CoordinateLat_c: number
  CoordinateLng_c: number
}
