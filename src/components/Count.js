import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const Count = ({ requestCount, successCount, pendingCount}) => (
    <p>
        The number of missed requests = {requestCount.length-(successCount.length-pendingCount.length)}
        <br/>
        Requests: {requestCount.length}
        <br />
        Successes: {successCount.length}
        <br />
        Pending: { pendingCount.length }
    </p>
);

Count.propTypes = {
    requestCount: PropTypes.array,
    successCount: PropTypes.array,
}

Count.defaultProps = {
    requestCount: [],
    successCount: [],
    pendingCount: [],
}

const mapStateToProps = (state) => {
    return ({
        requestCount: state.scans,
        successCount: state.successScans,
        pendingCount: state.pendingScans,
})};

export default connect(mapStateToProps)(Count);
