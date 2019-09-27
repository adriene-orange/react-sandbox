import React from 'react';
import { connect } from 'react-redux';

const TODO = 'To do';
const COMPLETED = 'Completed';
const INPROGRESS = 'In progress'

const StatusSelect = ({
    value,
    id,
    onChange,
}) => {
    return (
        <select name={id} id={id} defaultValue={value} onChange={onChange}>
            <option value={TODO}>{TODO}</option>
            <option value={COMPLETED}>{COMPLETED}</option>
            <option value={INPROGRESS}>{INPROGRESS}</option>
        </select>
    )
}

// export default connect()(StatusSelect);
export default StatusSelect;
