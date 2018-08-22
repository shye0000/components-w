import React from 'react';
import expect from 'expect';
import SplitViewComponent from '../src/components/SplitView/SplitViewComponent';

const SplitView = shallow(<SplitViewComponent/>);

describe('SplitViewComponent', () => {

	it('SplitView renders without exploding', () => {
		expect(SplitView).toHaveLength(1);
	});

});