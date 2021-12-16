import React, { useCallback } from "react";
import { Button } from './button/button';

type TabProps = {
	selected: boolean;
	index: number;
	onClick?: (index: number) => void;
	children: React.ReactNode;
}

const Tab = ({ onClick, index, selected, children }: TabProps) => {
	const handleClick = useCallback(() => {
		onClick?.(index);
	}, [onClick, index]);

	return (
		<Button selected={selected} onClick={handleClick}>
			{children}
		</Button>
	)
}

export default React.memo(Tab);
