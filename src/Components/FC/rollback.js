import React from 'react';

function Rollback({ value, jumpTo, stepNumber }) {
	return (
		<button onClick={() => jumpTo()} className="history_button">
			{value}
		</button>
	);
}

export default Rollback;
