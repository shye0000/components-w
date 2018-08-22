import React from 'react';
import './IconSvg.scss';

const IconSvg = ({svg, size, className}) => {
	const Svg = svg;
	const defaultClassNames = 'anticon icon-svg';
	const classNames = className ? (className + ' ' + defaultClassNames) : defaultClassNames;
	if (!size) {
		size = 20;
	}
	return <i className={classNames} >
		{Svg ? <Svg width={size} height={size} /> : null}
	</i>;
};

export default IconSvg;