export interface LocalizedValue {
  key: string
  value: string
}

export interface CompanyInvitationCompany {
  id: string | number
  name: string
  logo_url?: string | null
  cover_image_url?: string | null
}

export interface CompanyInvitationDetails {
  company: CompanyInvitationCompany
  email: string
  company_role: LocalizedValue
  expires_at: string | null
  requires_registration: boolean
}

export interface AcceptCompanyInvitationInput {
  name?: string
  password?: string
  password_confirmation?: string
}
