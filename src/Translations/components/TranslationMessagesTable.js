import React from 'react';
import Table from 'antd/lib/table';
import TranslationEditableCell from './TranslationEditableCell';
import SearchField from './SearchField';
import {Trans} from 'lingui-react';
import './TranslationMessagesTable.scss';

class TranslationMessagesTable extends React.Component {
	state = {
		originalData: [],
		data: [],
		sorter: null,
		generalSearch: '',
		pagination: {
			pageSize: 20,
			current: 1,
			showSizeChanger: true,
			pageSizeOptions: ['10', '20', '50', '100'],
			showTotal: (total) => <div>
				<Trans>Total:</Trans> {total}
			</div>
		},
	}

	formatTranslationMessagesForTable = (translationMessages) => {
		let formattedMessages = [];
		const t = translationMessages[Object.keys(translationMessages)[0]];
		for (let key of Object.keys(t)) {
			let d = {
				key: key
			};
			formattedMessages.push(d);
			for (let lang of Object.keys(AppConfig.AppLanguages)) {
				d[lang] = translationMessages[lang][key];
			}
		}
		return formattedMessages;
	}

	getColumns = () => {
		const columns = [];
		for (let [lang, v] of Object.entries(AppConfig.AppLanguages)) {
			columns.push({
				title: v,
				dataIndex: lang,
				key: lang,
				sorter: (a, b) => this.compareByAlph(a[lang], b[lang]),
				render: (text, record) => {
					return (
						<TranslationEditableCell
							value={record[lang]}
							lang={lang}
							translationKey={record.key}
							onChange={this.props.onTranslationEditCellChangeCallBack}
						/>
					);
				},
				width: 150
			});
		}
		return columns;
	}

	handleTableChange = (pagination, filters, sorter) => {
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;
		pager.pageSize = pagination.pageSize;
		this.setState({
			pagination: pager,
			sorter: sorter
		});
	}

	compareByAlph = (a, b) => {
		if (a > b) { return 1; }
		if (a < b) { return -1; }
		return 0;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			originalData: nextProps.translationMessages
		}, () => {
			this.filterData();
		});
	}
	componentDidMount() {
		this.setState({
			originalData: this.props.translationMessages,
		}, () => {
			this.filterData();
		});
	}

	filterData = () => {
		const { generalSearch, originalData } = this.state;
		this.setState({
			data: this.formatTranslationMessagesForTable(originalData).map((record) => {
				const reg = new RegExp(generalSearch ? generalSearch : '', 'gi');
				let match = record.key.match(reg);
				if (!match) {
					const langKeys = Object.keys(AppConfig.AppLanguages);
					for (let i = 0; i < langKeys.length; i++) {
						const lang = langKeys[i];
						match = record[lang].match(reg);
						if (match) {
							break;
						}
					}
				}

				if (!match) {
					return null;
				}
				return record;
			}).filter(record => !!record),
		});
	}

	generalSearchChange = (newSearchValue) => {
		const {generalSearch, pagination} = this.state;
		if (newSearchValue !== generalSearch) {
			this.setState({
				generalSearch: newSearchValue,
				pagination: {
					...pagination,
					current: 1,
				}
			}, () => {
				this.filterData();
				// this.fetch();
			});
		}
	}

	render() {
		let columns = [
			{
				title: <Trans>Language</Trans>,
				dataIndex: 'key',
				key: 'key',
				defaultSortOrder: 'ascend',
				sorter: (a, b) => this.compareByAlph(a.key, b.key),
				width: 150
			},
			...this.getColumns()
		];

		const {generalSearch} = this.state;


		return (
			<div className="translation-massages-table">

				<div className="table-head">
					<div className="title">
						<Trans>Translations management</Trans>
					</div>
					<div className="right">
						<SearchField
							value={generalSearch}
							onSearchHandler={this.generalSearchChange}/>
					</div>
				</div>

				<Table
					bordered
					pagination={this.state.pagination}
					className="orders-list"
					dataSource={this.state.data}
					loading={this.state.loading}
					columns={columns}
					onChange={this.handleTableChange}
				/>
			</div>
		);
	}
}

export default TranslationMessagesTable;