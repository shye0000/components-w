const EntityReducersGenerator = function (EntityActions = {
	resource: '',
	CONST_REQUEST_ENTITIES: '',
	CONST_RECEIVE_ENTITIES: '',
	CONST_ENTITY_MODIFIED: '',
	CONST_ENTITY_CREATED: '',
	CONST_ENTITY_DELETED: '',
	modifyEntity: null,
	createEntity: null,
	fetchEntities: null,
	otherActions: {}
}) {
	const entityOtherActions = EntityActions.otherActions;
	const rd = (state = [], action) => {
		switch (action.type) {
			// todo to be completed
			// todo 'deleting delete_success delete_failure'
			// todo 'creating create_success create_failure'
			// todo 'fetching fetch_success fetch_failure'
			// todo 'modifying modify_success modify_failure'
			case EntityActions.CONST_ENTITY_MODIFIED: {
				return {
					'isFetching': false,
					'didInvalidate': false,
					'modifiedEntity': action.modifiedEntity
				};
			}

			case EntityActions.CONST_ENTITY_CREATED: {
				return {
					'isFetching': false,
					'didInvalidate': false,
					'createdEntity': action.createdEntity
				};
			}

			case EntityActions.CONST_ENTITY_DELETED: {
				return {
					'isFetching': false,
					'didInvalidate': false,
					'deletedEntity': action.deletedEntity
				};
			}

			case EntityActions.CONST_REQUEST_ENTITIES: {
				return {
					'isFetching': true,
					'collection': null,
					'didInvalidate': false
				};
			}

			case EntityActions.CONST_RECEIVE_ENTITIES: {
				return {
					'isFetching': false,
					'didInvalidate': false,
					'collection': action.collection,
				};
			}

			default: {
				let reducer = {};
				if (entityOtherActions && entityOtherActions[action.type]) {
					reducer = entityOtherActions[action.type].reducer(action, state);
					return reducer;
				} else {
					return state;
				}
			}
		}
	};
	rd.reducer = EntityActions.resource;
	return rd;
};
export default EntityReducersGenerator;
