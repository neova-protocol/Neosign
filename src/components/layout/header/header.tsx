'use client'

import { useSession, signOut } from 'next-auth/react'
import React from 'react'

import { CommandSearchBar } from '@/components/layout/header/command-search-bar/command-search-bar'
import CustomDropdown from '@/components/ui/CustomDropdown'
import { Button } from '@/components/ui/button'

export const Header = () => {
	const { data: session } = useSession()

	const userOptions = [
		{ id: 'profile', label: 'Profile', onClick: () => console.log('Profile') },
		{ id: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
		{ id: 'logout', label: 'Logout', onClick: () => signOut({ callbackUrl: '/login' }) },
	]

	return (
		<header className="flex items-center justify-between p-4 bg-white border-b">
			<div>
				<CommandSearchBar />
			</div>
			<div className="flex items-center space-x-4">
				{session?.user ? (
					<CustomDropdown
						trigger={
							<Button variant="ghost" className="relative w-10 h-10 rounded-full">
								<img
									className="w-10 h-10 rounded-full"
									src={
										session.user.image ||
										`https://ui-avatars.com/api/?name=${session.user.name}&background=random`
									}
									alt="User avatar"
								/>
							</Button>
						}
						items={userOptions}
					/>
				) : (
					<Button onClick={() => (window.location.href = '/login')}>Login</Button>
				)}
			</div>
		</header>
	)
}