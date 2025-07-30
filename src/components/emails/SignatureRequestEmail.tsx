import * as React from "react";

interface SignatureRequestEmailProps {
  documentName: string;
  senderName: string;
  actionUrl: string;
  isReminder?: boolean;
}

export const SignatureRequestEmail: React.FC<
  Readonly<SignatureRequestEmailProps>
> = ({ documentName, senderName, actionUrl, isReminder }) => (
  <div>
    <h1>
      {isReminder
        ? "Rappel de demande de signature"
        : "Demande de signature"}
    </h1>
    <p>Bonjour,</p>
    <p>
      {senderName} vous a {isReminder ? "renvoyé" : "envoyé"} une demande pour signer le document :{" "}
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
