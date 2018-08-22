import React from 'react';
import classNames from 'classnames';
import Icon from 'antd/lib/icon';
import GlobalCarousel from './GlobalCarousel';
import './GlobalEntertainmentFilter.scss';

class GlobalEntertainmentFilter extends React.Component {
	state = {
		globalFilterOpened: false,
	}

	toggleGlobalFilter() {
		this.setState({globalFilterOpened : !this.state.globalFilterOpened});
	}

	render() {
		const {globalFilterOpened} = this.state;
		return (
			<div>
				<div className="expo-global-filter" onClick={() => this.toggleGlobalFilter()}>
					<span>japan Expo Paris 2018</span>
					<Icon type="down" />
				</div>
				<div className={classNames('global-entertainment-filter', {
					opened: globalFilterOpened
				})}>
					<GlobalCarousel />
				</div>
			</div>

		);
	}

}

export default GlobalEntertainmentFilter;