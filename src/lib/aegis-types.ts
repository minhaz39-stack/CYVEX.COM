export type CheckState = 'pass' | 'warn' | 'fail'

export type HeaderCheck = {
  name: string
  value: string
  state: CheckState
  detail: string
}

export type CertificateNode = {
  id: string
  subject: string
  issuer: string
  fingerprint: string
  algorithm: string
  validTo: string
  state: CheckState
  note: string
}

export type ScanResults = {
  finalUrl: string
  redirects: string[]
  headers: HeaderCheck[]
  certificates: CertificateNode[]
  phishing: {
    score: number
    signals: string[]
    forms: Array<{ action: string; method: string; hasPassword: boolean; external: boolean }>
    domExcerpt: string
    suspectedBrand: string
  }
  tls: {
    protocol: string
    cipher: string
    weakCipher: boolean
    ctCompliant: boolean
    ocspStatus: string
    crlStatus: string
    keyFindings: string[]
  }
  intelligence: Array<{ source: string; status: string; detail: string }>
}
