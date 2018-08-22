import React from 'react';
import {withI18n} from 'lingui-react';


class ListFilter extends React.Component {

	constructor(props) {
		super(props);
		this.filterValueChange = this.filterValueChange.bind(this);
		this.getFilterComponent = this.getFilterComponent.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.state = {
			ready: !this.props.filter.resource
		};
	}

	componentDidMount() {
		if (this.props.filter.resource && this.props.filter.fetchMethod) {
			this.props.filter.fetchMethod(this.props.filter.resource).then(function (response) {
				this.props.filter.options = response.json['hydra:member'].map((element) => {
					return {
						label: element[this.props.filter.labelProperty],
						value: element[this.props.filter.valueProperty]
					};
				});
				this.setState({
					ready: true
				});
			}.bind(this));
		}
	}

	filterValueChange(ev) {
		this.props.filter.value = ev.target.value;
		this.setState({
			filter: this.props.filter
		});

	}

	getFilterComponent() {
		const { i18n } = this.props;
		const filterType = this.props.filter.type;
		let filterComponent = null;
		switch (filterType) {
			case 'text':
				filterComponent = (
					<label htmlFor={this.props.filterName}>
						<div>{this.props.filter.label}</div>
						<input placeholder={this.props.filter.label ? this.props.filter.label : this.props.filterName}
							type={this.props.filter.type ? this.props.filter.type : 'text'}
							value={this.props.filter.value} onChange={(ev) => this.filterValueChange(ev)}
							onBlur={(ev) => this.props.updateFilterValue(ev.target.value, this.props.filterName)}/>
					</label>
				);
				break;
			case 'select':
				filterComponent = (
					<label htmlFor={this.props.filterName}>
						<div>{this.props.filter.label}</div>
						<select name={this.props.filterName} value={this.props.filter.value}
							onChange={(ev) => this.props.updateFilterValue(ev.target.value, this.props.filterName)}>
							<option value="">{this.props.filter.label ? i18n.t`None` : this.props.filterName}</option>
							{
								this.state.ready && this.props.filter.options ?
									this.props.filter.options.map(function (option, idx) {
										return (
											<option key={idx.toString()} value={option.value}>
												{option.label}
											</option>
										);
									}) : null
							}
						</select>
					</label>
				);
				break;
			case 'multiSelect':
				break;
			case 'radio':
				break;
		}
		return filterComponent;
	}

	render() {
		return <div className="list-filter">
			{this.getFilterComponent()}
		</div>;
	}
}

export default withI18n()(ListFilter);


