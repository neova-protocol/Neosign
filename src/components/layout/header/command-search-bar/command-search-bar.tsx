'use client'

import {
	CommandDialog,
	CommandInput,
	CommandList,
} from '@/components/ui/command'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCommandSearchBar } from './command-search-bar.logic'

export const CommandSearchBar = () => {
	const logic = useCommandSearchBar()

	return (
		<div>
			<div
				className="flex items-center rounded-md border px-2 cursor-pointer bg-card"
				onClick={() => logic.setOpen(true)}
			>
				<Input
					placeholder="Search"
					className="min-w-60 border-none text-sm focus-visible:ring-0 shadow-none"
				/>
				<Badge className="hidden lg:flex" variant="secondary">
					<span className="text-xs text-muted-foreground">K</span>
				</Badge>
			</div>
			<CommandDialog
				open={logic.open}
				onOpenChange={(isOpen: boolean) => logic.setOpen(isOpen)}
			>
				<DialogTitle className="hidden">Search</DialogTitle>
				<DialogDescription className="hidden">Search</DialogDescription>
				<CommandInput placeholder="Search" />
				<CommandList className="h-full max-h-[800px]"></CommandList>
			</CommandDialog>
		</div>
	)
}