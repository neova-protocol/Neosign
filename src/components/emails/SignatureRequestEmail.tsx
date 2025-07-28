import * as React from "react";

interface SignatureRequestEmailProps {
  documentName: string;
  senderName: string;
  actionUrl: string;
}

export const SignatureRequestEmail: React.FC<
  Readonly<SignatureRequestEmailProps>
> = ({ documentName, senderName, actionUrl }) => (
  <div>
    <h1>Signature Request for {documentName}</h1>
    <p>Hello,</p>
    <p>
      {senderName} has requested your signature on the document:{" "}
      <strong>{documentName}</strong>.
    </p>
    <p>Please click the button below to review and sign the document.</p>
    <a href={actionUrl} target="_blank" rel="noopener noreferrer">
      View and Sign Document
    </a>
    <p>
      If you did not expect to receive this, you can safely ignore this email.
    </p>
    <p>
      Thank you,
      <br />
      The Neosign Team
    </p>
  </div>
);
