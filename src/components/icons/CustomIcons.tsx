import Image from "next/image";
import React from "react";

interface IconProps {
  className?: string;
}

export const DashboardIcon: React.FC<IconProps> = ({
  className = "h-5 w-5",
}) => (
  <Image
    src="/dashboardicon.svg"
    alt="Dashboard Icon"
    width={24}
    height={24}
    className={className}
  />
);

export const TemplatesIcon: React.FC<IconProps> = ({
  className = "h-5 w-5",
}) => (
  <Image
    src="/templatesicon.svg"
    alt="Templates Icon"
    width={24}
    height={24}
    className={className}
  />
);

export const ContactsIcon: React.FC<IconProps> = ({
  className = "h-5 w-5",
}) => (
  <Image
    src="/contactsicon.svg"
    alt="Contacts Icon"
    width={24}
    height={24}
    className={className}
  />
);

export const SettingsIcon: React.FC<IconProps> = ({
  className = "h-5 w-5",
}) => (
  <Image
    src="/settingsicon.svg"
    alt="Settings Icon"
    width={24}
    height={24}
    className={className}
  />
);

export const SignIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <Image
    src="/signicon.svg"
    alt="Sign Icon"
    width={92}
    height={52}
    className={className}
  />
);
