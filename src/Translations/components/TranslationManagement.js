import React from 'react';
import {connect} from 'react-redux';
import Spin from 'antd/lib/spin';
import {translationMessagesModified} from '../redux/actions';
import TranslationMessagesTable from './TranslationMessagesTable';
import './TranslationManagement.scss';

const mapStateToProps = (state) => {
	return {
		modifiedTranslationMessages: state.trans.modifiedTranslationMessages
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleTranslationMessagesModified: (modifiedTranslationMessages) => {
			dispatch(translationMessagesModified(modifiedTranslationMessages));
		}
	};
};

class TranslationManagement extends React.Component {

	state={
		translationMessages: this.props.translationMessages
	}

	componentWillReceiveProps = (nextProps) => {
		let translationMessages = {};
		for (let lang of Object.keys(AppConfig.AppLanguages)) {
			translationMessages[lang] = {
				...(nextProps.translationMessages ? nextProps.translationMessages[lang] : {}),
				...(this.state.translationMessages ? this.state.translationMessages[lang] : {}),
				...(nextProps.modifiedTranslationMessages ? nextProps.modifiedTranslationMessages[lang] : {})
			};
		}
		this.setState({translationMessages});
	}

	onTranslationEditCellChange = (newValue, lang, translationKey) => {
		return new Promise((resolve, reject) => {
			fetch('/api/translations',{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					[lang] : {
						[translationKey]: newValue
					}
				})
			}).then(
				() => {
					let translationMessages = {
						...this.state.translationMessages
					};
					translationMessages[lang][translationKey] = newValue;
					this.props.handleTranslationMessagesModified(translationMessages);
				},
				() => {
					reject();
				}
			);
		});
	}

	render() {
		const {loading} = this.props;
		const {translationMessages} = this.state;
		return (!loading && translationMessages  ?
			<div className="translation-management-wrapper">
				<TranslationMessagesTable
					loading={loading}
					translationMessages={translationMessages}
					onTranslationEditCellChangeCallBack={this.onTranslationEditCellChange}
				/>
			</div> : <Spin />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TranslationManagement);
