'use client'

import { useState } from 'react'

export const useCommandSearchBar = () => {
	const [open, setOpen] = useState(false)

	return {
		open,
		setOpen,
	}
}