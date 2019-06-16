import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import differenceWith from 'lodash/differenceWith';



const Count = ({ successScans, pendingScans}) => {
    return (
    <p>
        Total Requests: {pendingScans.length}
        <br />
        <br/>
        Requests in Queue= {pendingScans.length-(successScans.length)}
        <br />
        Successes: {successScans.length}
        <br />
    </p>
);
};

Count.propTypes = {
    pendingScans: PropTypes.array,
    successScans: PropTypes.array,
}

Count.defaultProps = {
    successScans: [],
    pendingScans: [],
}

const mapStateToProps = (state) => {
    return ({
        successScans: state.successScans,
        pendingScans: state.pendingScans,
})};

export default connect(mapStateToProps)(Count);
