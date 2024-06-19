// import node module libraries
import { Fragment } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

export const FormSelect = (props) => {
	const { placeholder, selectedValue, options, id, name, onChange, className, disabled } = props;

	return (
		<Fragment>
			<Form.Select
				id={id}
				name={name}
				onChange={onChange}
				className={className}
				value={selectedValue}
				disabled={disabled}
			>
				{placeholder ? (
					<option value="" className="text-muted">
						{placeholder}
					</option>
				) : (
					''
				)}
				<option value="" disabled hidden>Select State</option>
				{options.map((item, index) => {
					return (

						<option key={index} value={item.value} className="text-dark"
						//selected={defaultselected==item.value}
						>
							{item.label}
						</option>
					);
				})}
			</Form.Select>
		</Fragment>
	);
};

FormSelect.propTypes = {
	placeholder: PropTypes.string.isRequired,
	defaultselected: PropTypes.string.isRequired,
	id: PropTypes.string,
	name: PropTypes.string,
	className: PropTypes.string
};

FormSelect.defaultProps = {
	placeholder: '',
	defaultselected: '',
	id: '',
	name: '',
	className: ''
};

export default FormSelect;
