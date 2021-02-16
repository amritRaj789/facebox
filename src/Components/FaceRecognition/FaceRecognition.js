import React from 'react';
import './FaceRecognition.css';
const FaceRecognition = ({ imageUrl, boxes }) => { //receive the boxes array and iterate over it to render multiple divs
	console.log('check', imageUrl);
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img alt='' id='inputimage' src={imageUrl} width='500px' height='auto' />
				<div>
					{
						boxes.map(box => {
							return <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
						})
					}
				</div>
			</div>
		</div>
	);
}


/*const FaceRecognition = ({ imageUrl, box }) => { //receive the boxes array and iterate over it to render multiple divs
	console.log('check', imageUrl);
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img alt='' id='inputimage' src={imageUrl} width='500px' height='auto' />
				<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
				</div>
			</div>
		</div>
	);
}
*/
export default FaceRecognition;
