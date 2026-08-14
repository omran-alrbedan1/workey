export interface InformationRequest {
  id: string | number
  job_application_id: string | number
  title: string
  description: string
  status: 'pending' | 'responded' | 'cancelled'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface InformationRequestInput {
  title: string
  description: string
  due_date?: string
}

export interface InformationRequestUpdateInput {
  title?: string
  description?: string
  due_date?: string
}

export interface InformationRequestResponse {
  id: string | number
  information_request_id: string | number
  response_text: string
  attachments?: string[]
  responded_at: string
}

export interface InformationRequestResponseInput {
  response_text: string
  attachments?: File[]
}
