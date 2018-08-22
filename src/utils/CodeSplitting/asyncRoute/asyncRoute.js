import React from 'react';
import isArray from 'lodash.isarray';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {injectReducers} from './registry';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import PropTypes from 'prop-types';


const moduleDefaultExport = module => module.default || module;

function esModule(module, forceArray) {
	if (isArray(module)) {
		return module.map(moduleDefaultExport);
	}

	const defaulted = moduleDefaultExport(module);
	return forceArray ? [defaulted] : defaulted;
}

export default function asyncRoute(getComponent, getReducers) {

	class AsyncRoute extends React.Component {

		static Component = null;
		static ReducersLoaded = false;

		state = {
			Component: AsyncRoute.Component,
			ReducersLoaded: AsyncRoute.ReducersLoaded
		};

		componentWillMount() {
			const {Component, ReducersLoaded} = this.state;
			const shouldLoadReducers = !ReducersLoaded && getReducers;

			if (!Component || shouldLoadReducers) {
				this._componentWillUnmountSubject = new Subject();

				const streams = [
					Component
						? Observable.of(Component)
							.takeUntil(this._componentWillUnmountSubject)
						: Observable.fromPromise(getComponent())
							.map(esModule)
							.map(Component => {
								AsyncRoute.Component = Component;
								return Component;
							})
							.takeUntil(this._componentWillUnmountSubject)
				];

				if (shouldLoadReducers) {
					streams.push(
						Observable.fromPromise(getReducers())
							.map(module => esModule(module, true))
							.map(reducers => {
								this.context.store.dispatch(injectReducers(reducers));
								AsyncRoute.ReducersLoaded = true;
							})
							.takeUntil(this._componentWillUnmountSubject)
					);
				}

				Observable.zip(...streams)
					.takeUntil(this._componentWillUnmountSubject)
					.subscribe(([Component]) => {
						if (this._mounted) {
							this.setState({Component});
						} else {
							const state = this.state;
							state.Component = Component;
						}

						this._componentWillUnmountSubject.unsubscribe();
					});
			}
		}

		componentDidMount() {
			this._mounted = true;
		}

		componentWillUnmount() {
			if (this._componentWillUnmountSubject && !this._componentWillUnmountSubject.closed) {
				this._componentWillUnmountSubject.next();
				this._componentWillUnmountSubject.unsubscribe();
			}
		}

		render() {
			const {Component} = this.state;
			return Component ? <Component {...this.props} /> : null;
		}
	}

	AsyncRoute.contextTypes = {
		store: PropTypes.shape({
			dispatch: PropTypes.func.isRequired
		})
	};
	return AsyncRoute;
}


