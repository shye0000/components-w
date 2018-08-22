import React from 'react';
import Icon from 'antd/lib/icon';
import GlobalCarouselContent from './GlobalCarouselContent';
import './GlobalCarousel.scss';

class GlobalCarousel extends React.Component {

	changeScrollValue (direction) {
		let position = this.scrollBody.scrollLeft;
		if (direction === 'left'){
			this.scrollBody.scrollLeft = position - 175;
		}
		else {
			this.scrollBody.scrollLeft = position + 175;
		}
	}

	render() {
		return (
			<div className="global-carousel">
				<div className="carousel-content">
					<div className="carousel-arrow left" onClick={() => this.changeScrollValue('left')}>
						<Icon type="left"/>
					</div>
					<div
						ref={(elem) => { this.scrollBody = elem; }}
						className="carousel-filters">
						<GlobalCarouselContent />
						<GlobalCarouselContent />
						<GlobalCarouselContent />
						<GlobalCarouselContent />
						<GlobalCarouselContent />
						<GlobalCarouselContent />
						<GlobalCarouselContent />
						<GlobalCarouselContent />
					</div>
					<div className="carousel-arrow right" onClick={() => this.changeScrollValue('right')}>
						<Icon type="right"/>
					</div>
				</div>
			</div>
		);
	}
}

export default GlobalCarousel;