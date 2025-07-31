export type Signatory = {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  status: string;
  documentId: string;
  userId: string | null;
  token: string;
  user?: {
    image?: string | null;
  } | null;
};

export type SignatureField = {
  id: string;
  type: "signature" | "paraphe";
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string | null | undefined;
  signatoryId: string | null;
  signatureType: string; // simple, ses, aes, qes
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
  creator: {
    name: string | null;
  };
  signatories: Signatory[];
  fields: SignatureField[];
  events: DocumentEvent[];
};
