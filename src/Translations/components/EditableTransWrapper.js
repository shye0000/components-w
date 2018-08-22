import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Trans} from 'lingui-react';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import {translationMessagesModified} from '../redux/actions';
import './EditableTransWrapper.scss';

const mapStateToProps = (state) => {
	return {
		editTranslationsInlineActive: state.trans.activeEditTranslationInline
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleTranslationMessagesModified: (modifiedTranslationMessages) => {
			dispatch(translationMessagesModified(modifiedTranslationMessages));
		}
	};
};

class EditableTransWrapper extends React.Component {

	state = {
		showEditModal: false,
		loading: false,
		translations: null,
		saving: false
	};

	openEditModal = (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		this.setState({
			showEditModal: true,
			loading: true
		}, () => this.loadTranslations());
	}

	loadTranslations() {
		fetch('/api/translations/getTransByKey',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: this.props.children.props.id,
				languages: AppConfig.AppLanguages
			})
		}).then(response => response.json())
			.catch(error => console.log(error))
			.then(body => {
				this.setState({
					translations: body,
					loading: false
				});
			});
	}

	getTranslationValues = () => {
		let values = {};
		for(let lang of Object.keys(AppConfig.AppLanguages)) {
			values[lang] = {
				[this.props.children.props.id]: this[lang].props.value
			};
		}
		return values;
	}

	handleSave = () => {
		this.setState({ saving: true });
		const translationValues = this.getTranslationValues();
		return new Promise((resolve, reject) => {
			fetch('/api/translations',{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(translationValues)
			}).then(
				() => {
					this.setState({
						saving: false,
						showEditModal: false
					});
					this.props.handleTranslationMessagesModified(translationValues);
				},
				() => {
					reject();
				}
			);
		});

	}

	handleTranslationFieldChange = (ev, lang) => {
		this.setState({
			translations: {
				...this.state.translations,
				[lang]: ev.target.value
			}
		});
	}

	handleCancel = () => {
		this.setState({showEditModal: false});
	}

	getTranslationFields = () => {
		const {translations} = this.state;
		if (translations) {
			return Object.keys(AppConfig.AppLanguages).map((lang) => {
				return <div key={lang} className="translation-field">
					<div className="translation-field-label">{AppConfig.AppLanguages[lang]}</div>
					<Input
						ref={node => this[lang] = node}
						value={translations[lang]}
						onChange={(ev) => this.handleTranslationFieldChange(ev, lang)}/>
				</div>;
			});
		}
		return <Spin className="spin-translation-fields"/>;
	}

	stop = e => e.stopPropagation()

	render() {
		return (
			<span className={classNames('editable-trans-wrapper', {
				'edit-active': this.props.editTranslationsInlineActive
			})}>
				{this.props.children}
				{
					this.props.editTranslationsInlineActive ?
						<Icon
							type="edit" className="open-edit-modal-trigger"
							onClick={(ev) => this.openEditModal(ev)}
						/> : null
				}
				{
					this.state.showEditModal ?
						<div
							onClick={this.stop}
							onContextMenu={this.stop}
							onDoubleClick={this.stop}
							onDrag={this.stop}
							onDragEnd={this.stop}
							onDragEnter={this.stop}
							onDragExit={this.stop}
							onDragLeave={this.stop}
							onDragOver={this.stop}
							onDragStart={this.stop}
							onDrop={this.stop}
							onMouseDown={this.stop}
							onMouseEnter={this.stop}
							onMouseLeave={this.stop}
							onMouseMove={this.stop}
							onMouseOver={this.stop}
							onMouseOut={this.stop}
							onMouseUp={this.stop}
							onKeyDown={this.stop}
							onKeyPress={this.stop}
							onKeyUp={this.stop}
							onFocus={this.stop}
							onBlur={this.stop}
							onChange={this.stop}
							onInput={this.stop}
							onInvalid={this.stop}
							onSubmit={this.stop}>
							<Modal
								onClick={ev => ev.stopPropagation()}
								visible={true}
								title={
									<div>
										<Trans>Edit translation</Trans> :
										<div>{this.props.children.props.id}</div>
									</div>
								}
								onOk={this.handleSave}
								onCancel={this.handleCancel}
								footer={[
									<Button
										key="back" size="large"
										onClick={this.handleCancel}>
										<Trans>Cancel</Trans>
									</Button>,
									<Button
										loading={this.state.saving}
										key="submit" type="primary" size="large"
										onClick={this.handleSave}>
										<Trans>Save</Trans>
									</Button>
								]}>
								{this.getTranslationFields()}
							</Modal>
						</div>
						: null
				}
			</span>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditableTransWrapper);