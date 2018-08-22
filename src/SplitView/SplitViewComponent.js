import React from 'react';
import PropTypes from 'prop-types';
import {withI18n, Trans} from 'lingui-react';
import ListFilter from '../ListFilter/ListFilter';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import './_splitView.scss';

/**
 * @example
 * import React from 'react';
 * import {connect} from 'react-redux';
 * import SplitViewComponent from 'components/SplitView/SplitViewComponent';
 * import {ListSorts, ListBlock, ListFilters} from '../Components';
 * import Dashboard from '../Dashboard';
 * import Form from '../Form';
 * import {RESOURCE} from '../module';
 *
 * const mapStateToProps = (state, props) => {
 *      return {
 *          ready: !state[RESOURCE].isFetching,
 *          createdEntity: state[RESOURCE].createdEntity,
 *          deletedEntity: state[RESOURCE].deletedEntity,
 *          modifiedEntity: state[RESOURCE].modifiedEntity,
 *          collection: state[RESOURCE].AuthorsTableIds,
 *          currentPageElements: state[RESOURCE].Authors
 *      }
 * };
 *
 * const mapDispatchToProps = (dispatch) => {
 *      return {
 *          fetchMethod: (arg) => dispatch(actions[AUTHOR_FETCH_TABLE_IDS](arg)),
 *          fetchEntitiesWithTableIdsMethod: (arg) => dispatch(actions[AUTHOR_FETCH_ENTITIES_WITH_TABLE_IDS](arg)),
 *          deleteMethod: (arg) => dispatch(actions.deleteEntity(arg))
 *      };
 * };
 *
 * const SplitView = (props) => (
 *      <SplitViewComponent
 *          resource="authors"
 *          actions={['create', 'modify', 'delete']}
 *          fetchMethod={props.fetchMethod}
 *          fetchEntitiesWithTableIdsMethod={props.fetchEntitiesWithTableIdsMethod}
 *          deleteMethod={props.deleteMethod}
 *          collection={props.collection}
 *          currentPageElements={props.currentPageElements}
 *          createdElement={props.createdEntity}
 *          modifiedElement={props.modifiedEntity}
 *          deletedElement={props.deletedEntity}
 *          listFilters={ListFilters}
 *          listSorts={ListSorts}
 *          listBlock={ListBlock}
 *          dashboard={Dashboard}
 *          entityForm={Form}
 *          ready={props.ready}
 *      />
 * );
 * export default connect(mapStateToProps, mapDispatchToProps)(SplitView);
 */
class SplitViewComponent extends React.Component {
	/**
	 * constructor
	 * @param {object} props
	 */
	constructor(props) {
		super(props);
		this.updateFilterValue = this.updateFilterValue.bind(this);
		this.updateSortValue = this.updateSortValue.bind(this);
		const sorts = this.initialSorts();
		const elementsPerPage = 10;
		const collection = this.props.collection;
		const currentPageElements = this.props.currentPageElements;

		/**
		 * @type {object}
		 * @property {function} fetchMethod - method for fetching list total elements ids
		 * @property {function} fetchEntitiesWithTableIdsMethod - method for fetching list collection
		 * @property {function} deleteMethod - method for deleting entity
		 * @property {boolean} startFromLast - initial focus on last element of the list
		 * @property {int} page - page number
		 * @property {int} pageTotal - total number of elements in the list
		 * @property {int} elementsPerPage - number of elements per page
		 * @property {object} collection - hydraCollection with total elements ids
		 * @property {Array} currentPageElements - elements table in current page
		 * @property {object} currentElement - current showed element
		 * @property {object} filters - list filters
		 * @property {object} sorts - list sorts
		 * @property {boolean} ready - SplitView ready
		 * @property {function} createEntity - if true show create entity form in dashboard view
		 * @property {function} modifyEntity - if true show modify entity form in dashboard view
		 * @property {Array} actions - entity actions configured
		 */
		this.state = {
			fetchMethod: this.props.fetchMethod,
			fetchEntitiesWithTableIdsMethod: this.props.fetchEntitiesWithTableIdsMethod,
			deleteMethod: this.props.deleteMethod,
			startFromLast: false,
			page: 1,
			pageTotal: this.getPageTotal(collection, elementsPerPage),
			elementsPerPage: elementsPerPage,
			collection: collection,
			currentPageElements: currentPageElements,
			currentElement: null,
			filters: this.props.listFilters,
			sorts: sorts,
			ready: this.props.ready,
			modifyEntity: false,
			createEntity: false,
			actions: this.props.actions || []
		};
	}

	/**
	 * get total number of elements in collection
	 * @param {object} collection - hydraCollection
	 * @return {int}
	 */
	getListTotal(collection) {
		return collection ? collection['hydra:totalItems'] : 0;
	}

	/**
	 * get total number of pages in collection
	 * @param {object} collection - hydraCollection
	 * @param {int} elementsPerPage - number of element per page
	 * @return {int}
	 */
	getPageTotal(collection, elementsPerPage) {
		return collection ? Math.ceil(this.getListTotal(collection) / elementsPerPage) : 0;
	}

	/**
	 * load SplitView when mounted
	 */
	componentDidMount() {
		if (!this.state.collection) {
			this.reload();
		}
	}

	/**
	 * update SplitView after receiving new props
	 * @param {object} newProps
	 */
	componentWillReceiveProps(newProps) {
		const collection = newProps.collection || this.state.collection;
		const ready = newProps.ready;
		const currentPageElements = newProps.currentPageElements;
		const modifiedElement = newProps.modifiedElement;
		const deletedElement = newProps.deletedElement;
		const createdElement = newProps.createdElement;

		let newState = {
			ready: ready,
			collection: collection,
			page: newProps.collection ? 1 : this.state.page,
			pageTotal: this.getPageTotal(collection, this.state.elementsPerPage),
			createEntity: false,
			modifyEntity: false,
			currentElement: modifiedElement
		};

		if (currentPageElements) {
			newState.currentPageElements = currentPageElements;
		}

		if (newProps.collection && newProps.collection['hydra:member']) {
			return this.setState(newState, () => {
				this.goToPage(1, false, collection);
			});
		}

		if (this.state.startFromLast && currentPageElements) {
			newState.currentElement = currentPageElements[currentPageElements.length - 1];
		} else if (!this.state.startFromLast && currentPageElements) {
			newState.currentElement = currentPageElements[0];
		}

		if (modifiedElement) {
			newState.modifiedElement = modifiedElement;
			this.goToPage(this.state.page);
		}

		if (deletedElement ) {
			this.reload();
		}

		if (createdElement) {
			this.goToPage(this.state.page);
		}
		this.setState(newState);
	}

	/**
	 * initial list sorts table with sorts definition
	 * @return {object} - formatted sorts array
	 */
	initialSorts() {
		const {i18n} = this.props;
		let sorts = {};
		Object.keys(this.props.listSorts).map((sortName) => {
			const sort = this.props.listSorts[sortName];
			sorts[sortName] = {
				value: sort.value,
				label: sortName,
				type: 'select',
				options: [
					{
						label: i18n.t`DESC`,
						value: 'DESC'
					}, {
						label: i18n.t`ASC`,
						value: 'ASC'
					}
				]
			};
		});
		return sorts;
	}

	/**
	 * update filter value and reload list when filter value change
	 * @param {string} newValue - filter new value
	 * @param {string} filterName - filter name
	 */
	updateFilterValue(newValue, filterName) {
		this.props.listFilters[filterName].value = newValue;
		this.setState({
			filters: this.props.listFilters
		});
		this.reload();
	}

	/**
	 * update sort value and reload list when sort value change
	 * @param {string} newValue - sort new value
	 * @param {string} sortName - sort name
	 */
	updateSortValue(newValue, changedSortName) {
		const {i18n} = this.props;
		let sorts = {};
		Object.keys(this.state.sorts).map((sortName) => {
			const sort = this.state.sorts[sortName];
			const sortValue = sortName === changedSortName ? newValue : sort.value;
			sorts[sortName] = {
				value: sortValue,
				label: sortName,
				type: 'select',
				options: [
					{
						label: i18n.t`DESC`,
						value: 'DESC'
					}, {
						label: i18n.t`ASC`,
						value: 'ASC'
					}
				]
			};
		});
		this.setState({sorts: sorts}, () => this.reload());
	}

	/**
	 * reload SplitView list
	 */
	reload() {
		this.setState({
			ready: false
		});
		const params = this.getInitParams();
		this.state.fetchMethod(params);
	}

	/**
	 * get selected filters and sorts in json format
	 * @return {object} - selected filters and sorts in json
	 */
	getInitParams() {
		let params = {};
		params['itemsPerPage'] = this.state.elementsPerPage;
		Object.keys(this.state.filters).map((filterName) => {
			const filter = this.state.filters[filterName];
			if (filter.value) {
				params[filterName] = filter.value;
			}
		});
		Object.keys(this.state.sorts).map((sortName) => {
			let sort = this.state.sorts[sortName];
			if (sort.value) {
				params['order[' + sortName + ']'] = sort.value;
			}
		});
		return params;
	}

	/**
	 * method for changing page of the list
	 * @param {int} page - number of page
	 * @param {boolean} startFromLast - initial focus to the last element of the list
	 * @param {object} collection - hydraCollection
	 */
	goToPage(page = 1, startFromLast = false, collection = this.state.collection) {
		if (collection) {
			this.setState({
				ready: false,
				startFromLast: startFromLast
			});
			const currentPageElementsIds = collection['hydra:member'].slice(
				this.state.elementsPerPage * (page - 1),
				this.state.elementsPerPage * (page - 1) + this.state.elementsPerPage
			);
			this.state.fetchEntitiesWithTableIdsMethod(currentPageElementsIds).then(
				() => {
					this.setState({
						page: page
					});
				}
			);
		}
	}

	/**
	 * method for changing current showed element in dashboard view
	 * @param {object} element - element in hydraCollection
	 */
	showElement(element) {
		this.setState({
			currentElement: element,
			modifyEntity: false,
			createEntity: false,
			ready: true
		});
	}

	/**
	 * check if element is the current showed element in dashboard view
	 * @param {object} element - element in hydraCollection
	 * @return {boolean}
	 */
	isActive(element) {
		if (this.state.currentElement) {
			return element.id === this.state.currentElement.id;
		} else {
			return false;
		}
	}

	/**
	 * generate sorts elements
	 * @return {object}
	 */
	getListSortsComponent() {
		if (this.state.sorts) {
			return Object.keys(this.state.sorts).map((sortName, idx) => {
				const sort = this.state.sorts[sortName];
				return <ListFilter
					key={idx.toString()}
					filter={sort}
					filterName={sortName}
					updateFilterValue={this.updateSortValue}/>;
			});
		}

	}

	/**
	 * generate filters elements
	 * @return {object}
	 */
	getListFiltersComponent () {
		let components;
		if (this.state.filters) {
			components = Object.keys(this.state.filters).map((filterName, idx) => {
				return <ListFilter
					key={idx.toString()}
					filter={this.state.filters[filterName]}
					filterName={filterName}
					updateFilterValue={this.updateFilterValue}/>;
			});
		}
		return components;
	}

	/**
	 * generate list body element
	 * @return {object}
	 */
	getListBodyComponent () {
		let components = null;
		if (this.state.currentPageElements) {
			let elements = this.state.currentPageElements;
			components = elements.map((element, idx) => {
				return (
					<div className={ 'list-block ' + (this.isActive(element) ? 'active' : '') }
						key={idx.toString()} onClick={() => this.showElement(element)}>
						{
							this.props.listBlock ?
								<this.props.listBlock element={element}/> :
								<div className="default-block-inner">
									<div className="block-title">
										{element[this.props.listBlockTitle]}
									</div>
									<div className="block-subtitle">
										{element[this.props.listBlockSubTitle]}
									</div>
								</div>
						}
					</div>
				);
			});
		}
		return components;
	}

	/**
	 * generate pagination element
	 * @return {object}
	 */
	getPaginationComponent () {
		let paginationComponent;
		if (this.state.collection && this.state.collection['hydra:view']) {
			paginationComponent = <div className="pagination">
				<div className="list-total">
					<div> {this.state.page} / {this.state.pageTotal} </div>
					<div>( Total: {this.getListTotal(this.state.collection)} )</div>
				</div>
				<div onClick={() => {
					if (this.state.page !== 1) this.goToPage(1);
				}}> First </div>
				<div onClick={() => {
					if (this.state.page > 1) this.goToPage(this.state.page - 1);
				}}> previous </div>
				<div onClick={() => {
					if (this.state.page < this.state.pageTotal) this.goToPage(this.state.page + 1);
				}}> next </div>
				<div onClick={() => {
					if (this.state.page !== this.state.pageTotal) this.goToPage(this.state.pageTotal);
				}}> Last </div>
			</div>;
		}
		return paginationComponent;
	}

	/**
	 * toggle entity form
	 */
	toggleEntityForm(showForm, type) {
		if (showForm && this.props.entityForm) {
			switch(type){
				case 'create': {
					this.setState({
						modifyEntity: false,
						createEntity: true
					});
					break;
				}
				case 'modify': {
					this.setState({
						modifyEntity: true,
						createEntity: false
					});
					break;
				}
			}
		} else {
			this.setState({
				modifyEntity: false,
				createEntity: false
			});
		}
	}

	/**
	 * delete current selected element
	 */
	deleteEntity() {
		if (this.state.deleteMethod) {
			this.state.deleteMethod(this.state.currentElement);
		}
	}

	/**
	 * generate dashboard details view element
	 * @return {object}
	 */
	getDashboardViewComponent() {
		let component;
		let entityFormName;
		if (this.state.createEntity) {
			entityFormName =  this.props.resource + '-create-form';
			component = <div>
				<button onClick={() => this.toggleEntityForm(false)}>Cancel</button>
				<this.props.entityForm key={entityFormName} form={{
					name: entityFormName,
					id: entityFormName}}
				/>
			</div>;
		} else if (this.state.modifyEntity) {
			entityFormName =  this.props.resource + '-modify-form';
			component = <div>
				<button onClick={() => this.toggleEntityForm(false)}>Cancel</button>
				<this.props.entityForm key={entityFormName} entityId={this.state.currentElement['@id']} form={{
					name: entityFormName,
					id: entityFormName}}
				/>
			</div>;
		} else if (this.state.currentElement) {
			component = <div>
				{ this.getDashboardToolbarActions() }
				<div className="dashboard-body">
					<this.props.dashboard
						key={JSON.stringify(this.state.currentElement)}
						element={this.state.currentElement}/>
				</div>
			</div>;
		} else {
			component = <div><Trans>Please click an element in the list to show more details.</Trans></div>;
		}
		return component;
	}

	/**
	 * generate dashboard toolbars action elements (buttons: modify, delete)
	 * @return {object}
	 */
	getDashboardToolbarActions() {
		return <div className="dashboard-toolbar">
			<div className="left">
				{
					this.state.actions.indexOf('modify') > -1 ?
						<button className="action" onClick={() => this.toggleEntityForm(true, 'modify')}>
							Modify
						</button>
						: null
				}
				{
					this.state.actions.indexOf('delete') > -1 ?
						<button className="action" onClick={(ev) => this.deleteEntity(ev)}>Delete</button>
						: null
				}
			</div>
			<div className="nav-tools">
				<div className="info">
					{this.getCurrentElementNumber()} of {this.getListTotal(this.state.collection)}
				</div>
				<div className="action prev" onClick={ (ev) => this.showPrevElement(ev) } />
				<div className="action next" onClick={ (ev) => this.showNextElement(ev) } />
			</div>
		</div>;
	}

	/**
	 * get current selected element index in current page
	 * @return {int}
	 */
	getCurrentElementIdx() {
		if (this.state.currentPageElements) {
			return this.state.currentPageElements.findIndex(element => element.id === this.state.currentElement.id);
		}
	}

	/**
	 * get the number of current element in the list
	 * @return {int}
	 */
	getCurrentElementNumber() {
		if (this.state.currentPageElements) {
			const idx = this.getCurrentElementIdx();
			return (this.state.page - 1) * this.state.elementsPerPage + idx + 1;
		}
	}

	/**
	 * show previews element in the list change page if necessary
	 */
	showPrevElement() {
		if (this.state.currentPageElements) {
			const currentElementIdx = this.state.currentPageElements.findIndex(
				element => element.id === this.state.currentElement.id
			);
			if (currentElementIdx > -1 && currentElementIdx > 0) {
				this.setState({ready: false});
				this.showElement(this.state.currentPageElements[currentElementIdx - 1]);
			} else if (this.state.page > 1) {
				this.goToPage(this.state.page - 1, true);
			}
		}
	}

	/**
	 * show next element in the list change page if necessary
	 */
	showNextElement() {
		if (this.state.currentPageElements) {
			const currentElementIdx = this.state.currentPageElements.findIndex(
				element => element.id === this.state.currentElement.id
			);
			if (currentElementIdx > -1 && currentElementIdx < this.state.currentPageElements.length - 1) {
				this.setState({ready: false});
				this.showElement(this.state.currentPageElements[currentElementIdx + 1]);
			} else if (this.state.page < this.state.pageTotal) {
				this.goToPage(this.state.page + 1);
			}
		}
	}

	/**
	 * render
	 * @return {object}
	 */
	render() {
		return <div className="split-view">
			<div className="split-view-head">
				<button className="action" onClick={(ev) => this.reload(ev)}>Reload</button>
				{
					this.state.actions.indexOf('create') > -1 ?
						<button className="action" onClick={() => this.toggleEntityForm(true, 'create')}>
							Create
						</button>
						: null
				}
			</div>
			<div className="split-view-body">
				<div className="list">
					<div className="list-header">
						<div className="list-filters">
							<div className="label">Filters:</div>
							{ this.getListFiltersComponent() }
						</div>
						<div className="list-sorts">
							<div className="label">Sorts:</div>
							{ this.getListSortsComponent() }
						</div>
					</div>
					<div className="list-body">
						<ReactPlaceholder customPlaceholder={
							<div>
								<div className="list-block list-block-placeholder">
									{this.props.listBlockPlaceholder}
								</div>
								<div className="list-block list-block-placeholder">
									{this.props.listBlockPlaceholder}
								</div>
							</div>
						} showLoadingAnimation type='text' rows={3} ready={this.state.ready}>
							<div>
								{ this.getListBodyComponent() }
							</div>
						</ReactPlaceholder>
					</div>
					<div className="list-footer">
						{ this.getPaginationComponent() }
					</div>
				</div>
				<div className="dashboard">
					<ReactPlaceholder customPlaceholder={
						this.props.dashboardPlaceholder
					} showLoadingAnimation type='text' rows={3} ready={this.state.ready}>
						{ this.getDashboardViewComponent() }
					</ReactPlaceholder>
				</div>
			</div>
		</div>;
	}
}

SplitViewComponent.propTypes = {
	resource: PropTypes.string.isRequired,
	actions: PropTypes.array,
	fetchMethod: PropTypes.func.isRequired,
	fetchEntitiesWithTableIdsMethod: PropTypes.func.isRequired,
	deleteMethod: PropTypes.func.isRequired,
	collection: PropTypes.object,
	currentPageElements: PropTypes.array,
	createdElement: PropTypes.object,
	modifiedElement: PropTypes.object,
	deletedElement: PropTypes.object,
	listFilters: PropTypes.object,
	listSorts: PropTypes.object,
	listBlock: PropTypes.func,
	listBlockTitle: PropTypes.string,
	listBlockSubTitle: PropTypes.string,
	listBlockPlaceholder: PropTypes.element,
	dashboardPlaceholder: PropTypes.element,
	entityForm: PropTypes.func,
	ready: PropTypes.bool
};

export default withI18n()(SplitViewComponent);