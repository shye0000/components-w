import React from 'react';
import Input from 'antd/lib/input';
import classNames from 'classnames';
import Icon from 'antd/lib/icon';
import {Trans} from 'lingui-react';
import './TranslationEditableCell.scss';

export default class TranslationEditableCell extends React.Component {

	state = {
		initValue: '',
		value: '',
		editable: false,
	}

	handleChange = (e) => {
		const value = e.target.value;
		this.setState({ value });
	}

	confirm = () => {
		this.setState({
			editable: false
		});
		if (this.props.onChange && this.state.value !== this.state.initValue) {
			this.props.onChange(this.state.value, this.props.lang, this.props.translationKey).then(
				() => {
					this.setState({
						initValue: this.state.value
					});
				},
				() => {
					this.setState({
						value: this.state.initValue
					});
				}
			);
		}
	}

	cancel = () => {
		this.setState({
			editable: false,
			value: this.state.initValue
		});
	}

	edit = () => {
		this.setState({ editable: true }, () => this.editInput.focus());
	}

	moveCaretAtEnd(e) {
		const temp_value = e.target.value;
		e.target.value = '';
		e.target.value = temp_value;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			initValue: nextProps.value,
			value: nextProps.value
		});
	}

	componentDidMount() {
		this.setState({
			initValue: this.props.value,
			value: this.props.value
		});
	}

	render() {
		const { value, editable } = this.state;
		return (
			<div className="translation-editable-cell">
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<Input
								ref={node => {this.editInput = node;}}
								onFocus={this.moveCaretAtEnd}
								value={value}
								onChange={this.handleChange}
								onPressEnter={this.confirm}
								onKeyUp={(ev) => {
									if (ev.key === 'Escape') {
										this.cancel();
									}
								}}
							/>
							<Icon
								type="check"
								className="editable-cell-icon-check"
								onClick={this.confirm}
							/>
							<Icon
								type="close"
								className="editable-cell-icon-close"
								onClick={this.cancel}
							/>
						</div>
						:
						<div className="editable-cell-text-wrapper">
							<span onClick={this.edit} className={classNames('editable-cell-text', {'no-value': !value})}>
								{value || <Trans>undefined</Trans>}
							</span>
							<Icon
								type="edit"
								className="editable-cell-icon"
								onClick={this.edit}
							/>
						</div>
				}
			</div>
		);
	}

}