import React from 'react';
import classNames from 'classnames';
import {withRouter} from 'react-router-dom';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import './ConfigurationMenu.scss';

const SubMenu = Menu.SubMenu;

class ConfigurationMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isCollapsed: true
		};
	}

	getCurrentSelectedKeys() {
		return [this.props.location.pathname];
	}

	toggleConfigurationMenu = () => {
		if(this.props.mainMenuCollapsed !== true){
			this.setState({
				isCollapsed: !this.state.isCollapsed,
			});
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.mainMenuCollapsed && !this.state.isCollapsed) {
			this.setState ({
				isCollapsed: true
			});
		}
	}

	render() {
		// const defaultSelectedKeys = this.getCurrentSelectedKeys();

		const configSubMenu = <SubMenu key="config-sub" title={<span><Icon type="setting" /><span>Configuration</span></span>}>
			<Menu.Item key="5">Festival 5</Menu.Item>
			<Menu.Item key="6">Edition</Menu.Item>
			<Menu.Item key="7">Evenement</Menu.Item>
		</SubMenu>;

		return (
			<div className={classNames('configuration-menu', {active: !this.state.isCollapsed})} onClick={this.toggleConfigurationMenu}>
				{
					this.props.mainMenuCollapsed ?
						<Menu>
							{configSubMenu}
						</Menu>
						:
						<Menu
							mode="inline"
							openKeys={this.state.isCollapsed ? [] : ['config-sub']}>
							{configSubMenu}
						</Menu>
				}

			</div>
		);
	}
}

export default  withRouter(ConfigurationMenu);