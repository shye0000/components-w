import React from 'react';
import './GlobalCarouselContent.scss';


class GlobalCarouselContent extends React.Component {

	render() {
		return (
			<div className="carousel-element">
				<div className="expo-logo">
					<i id="north"/>
				</div>
				<div className="expo-title">
					<span>Japan expo Paris 2017</span>
				</div>
				<div className="expo-date">
					<span>07/07/2017</span>-
					<span>08/08/2018</span>
				</div>
				<div className="expo-city">
					<span>Paris</span>
				</div>
			</div>
		);
	}
}

export default GlobalCarouselContent;