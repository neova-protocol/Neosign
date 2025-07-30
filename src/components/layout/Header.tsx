"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, LayoutGrid, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchNotifications = () => {
      console.log("NotificationBell polling...");
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          console.log("Notifications reçues :", data);
          setNotifications(data);
        });
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000000); // toutes les 1000s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((notifications) =>
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative focus:outline-none"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-semibold">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 border-b last:border-b-0 cursor-pointer ${n.read ? "bg-gray-50" : "bg-blue-50"}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="font-medium">{n.message}</div>
                <div className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { data: session, status } = useSession();
  console.log("Header status:", status, "session:", session);
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = `${today.getDate()} ${today.toLocaleDateString("en-US", { month: "long" })} ${today.getFullYear()}`;

  return (
    <header className="bg-gray-50/50 backdrop-blur-sm sticky top-0 z-50 w-full p-4">
      <div className="flex items-center justify-between">
        <div /> {/* Empty div for spacing */}
        <nav className="flex items-center justify-end space-x-6 text-sm font-medium">
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600"
            prefetch={false}
          >
            Neova Ecosystem
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600"
            prefetch={false}
          >
            <LayoutGrid className="h-5 w-5" />
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
            Connect Wallet
          </Button>
          {status !== "authenticated" && (
            <Button
              onClick={() => signIn()}
              className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg px-6"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
      {status === "authenticated" && (
        <div className="flex items-center justify-between w-full p-2 bg-white rounded-lg mt-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Type to search..."
              className="pl-10 text-sm bg-gray-50 border-gray-200"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/sign">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                New Signatures
              </Button>
            </Link>
            <div className="flex items-center gap-4 p-2 rounded-lg bg-white shadow-sm">
              <NotificationBell />
              <div>
                <p className="font-semibold text-sm text-gray-800">{day}</p>
                <p className="text-xs text-gray-500">{date}</p>
              </div>
              <Link href="/dashboard/settings/general">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    src={session.user?.image ?? "https://github.com/shadcn.png"}
                    alt="User"
                  />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
