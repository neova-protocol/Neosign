import {
  ContactsClientPage,
  Contact,
} from "@/components/contacts/ContactsClientPage";
import { FC } from "react";
import { getContacts } from "./actions";

const ContactsPage: FC = async () => {
  const contacts: Contact[] = await getContacts();
  return <ContactsClientPage initialContacts={contacts} />;
};

export default ContactsPage;
