"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession, signOut } from 'next-auth/react'
import CustomDropdown from '@/components/ui/CustomDropdown'

export default function Header() {
  const { data: session } = useSession();

  const userOptions = [
    { id: 'profile', label: 'Profile', onClick: () => console.log('Profile') },
    { id: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
    { id: 'logout', label: 'Logout', onClick: () => signOut({ callbackUrl: '/login' }) }
  ];

  const handleSelect = (id: string) => {
    const selectedOption = userOptions.find(option => option.id === id);
    if (selectedOption?.onClick) {
      selectedOption.onClick();
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div>
        <Input placeholder="Search documents..." className="w-96" />
        </div>
      <div className="flex items-center space-x-4">
        {session?.user ? (
            <CustomDropdown 
              trigger={
              <Button variant="ghost" className="relative w-10 h-10 rounded-full">
                <img
                  className="w-10 h-10 rounded-full"
                  src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`}
                  alt="User avatar"
                />
                </Button>
              }
            items={userOptions}
            onSelect={handleSelect}
            />
        ) : (
          <Button onClick={() => window.location.href = '/login'}>Login</Button>
        )}
      </div>
    </header>
  )
} 