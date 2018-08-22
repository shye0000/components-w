const EntityActionsGenerator = function (options = {
	resource: '',
	otherActions: []
}) {
	// get resource name
	const resource = options.resource;
	const otherActions = options.otherActions;

	// generate constants of entity reducer types
	// todo to be completed
	// todo 'deleting delete_success delete_failure'
	// todo 'creating create_success create_failure'
	// todo 'fetching fetch_success fetch_failure'
	// todo 'modifying modify_success modify_failure'
	const CONST_ENTITY_CREATED = resource.toUpperCase() + '_CREATED';
	const CONST_ENTITY_MODIFIED = resource.toUpperCase() + '_MODIFIED';
	const CONST_ENTITY_DELETED = resource.toUpperCase() + '_DELETED';
	const CONST_REQUEST_ENTITIES = resource.toUpperCase() + '_REQUEST';
	const CONST_RECEIVE_ENTITIES = resource.toUpperCase() + '_RECEIVE';


	// methods
	function entityModified(modifiedEntity) {
		return {
			type: CONST_ENTITY_MODIFIED,
			modifiedEntity: modifiedEntity
		};
	}

	function entityCreated(createdEntity) {
		return {
			type: CONST_ENTITY_CREATED,
			createdEntity: createdEntity
		};
	}

	function entityDeleted(deletedEntity) {
		return {
			type: CONST_ENTITY_DELETED,
			deletedAt: Date.now(),
			deletedEntity: deletedEntity
		};
	}

	function requestEntities() {
		return {
			type: CONST_REQUEST_ENTITIES
		};
	}

	function receiveEntities(response) {
		return {
			type: CONST_RECEIVE_ENTITIES,
			collection: response.json
		};
	}

	function createEntity(formValues) {
		return function (dispatch) {
			dispatch(requestEntities());
			// todo
			// return apiClient.fetch(resource, {
			// 	method: 'POST',
			// 	body: JSON.stringify(formValues)
			// }).then((response) => {
			// 	const createdEntity = response.json;
			// 	dispatch(entityCreated(createdEntity));
			// });
		};
	}

	function deleteEntity(entity) {
		return function (dispatch) {
			let r = confirm('Delete this?');
			if (r === true) {
				// todo
				// return apiClient.fetch(entity['@id'], {
				// 	method: 'DELETE'
				// }).then(null, (result) => {
				// 	const response = result.response;
				// 	if (response.ok) {
				// 		dispatch(entityDeleted(entity));
				// 	} else {
				// 		alert('Cannot be deleted!');
				// 	}
				// });
			}
		};
	}

	function modifyEntity(entity, formValues) {
		return function (dispatch) {
			dispatch(requestEntities());
			// todo
			// return apiClient.fetch(entity['@id'], {
			// 	method: 'PUT',
			// 	body: JSON.stringify(formValues)
			// }).then((response) => {
			// 	const modifiedEntity = response.json;
			// 	dispatch(entityModified(modifiedEntity));
			// });
		};
	}

	function fetchEntities(params = {}) {
		return function (dispatch) {
			dispatch(requestEntities());
			// todo
			// return apiClient.fetch(resource, {
			// 	params: params
			// }).then((response) => {
			// 	dispatch(receiveEntities(response));
			// });
		};
	}

	let actions = {
		resource: resource,
		CONST_REQUEST_ENTITIES: CONST_REQUEST_ENTITIES,
		CONST_RECEIVE_ENTITIES: CONST_RECEIVE_ENTITIES,
		CONST_ENTITY_MODIFIED: CONST_ENTITY_MODIFIED,
		CONST_ENTITY_CREATED: CONST_ENTITY_CREATED,
		CONST_ENTITY_DELETED: CONST_ENTITY_DELETED,
		modifyEntity: modifyEntity,
		createEntity: createEntity,
		deleteEntity: deleteEntity,
		fetchEntities: fetchEntities,
		otherActions: otherActions
	};

	if (otherActions) {
		for (let [key, value] of Object.entries(otherActions)) {
			actions[key] = value.action;
		}
	}

	return actions;
};
export default EntityActionsGenerator;
