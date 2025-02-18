export default interface ICertificate {
  id: string
  html: string
  previewUrl: string
}

export interface ICertificateParticipant {
  id: string
  idEvent: string
  nrUuidParticipant: string
  certificateUrl: string
  previewUrl: string
}
