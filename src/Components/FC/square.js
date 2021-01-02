import React from 'react';

function Square({ value, handleClick, jumpTo }) {
	return (
		<div>
			<div className="square_content" onClick={() => handleClick()}>
				{value}
			</div>
		</div>
	);
}

export default Square;
