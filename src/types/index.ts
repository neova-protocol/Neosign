export type Signatory = {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  status: string;
  userId: string | null;
  user?: {
    name: string | null;
    email: string | null;
  } | null;
};

export type SignatureField = {
  id: string;
  type: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string | null | undefined;
  signatoryId: string | null;
};

export type DocumentEvent = {
  id: string;
  type: string;
  date: string | Date;
  userName: string;
  userId: string | null;
};

export type Document = {
  id: string;
  name: string;
  fileUrl: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  creatorId: string;
  signatories: Signatory[];
  fields: SignatureField[];
  events: DocumentEvent[];
}; 