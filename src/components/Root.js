import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

const Root = ({ simulateScan }) => {
    useEffect(() => {
        setInterval(() => simulateScan(), 1000);
    }, []);
    return (<h1>Hi</h1>)
}

const mapDispatchToProps = (dispatch) => ({
    simulateScan: () => dispatch({ type: 'HI', data: Math.floor(Math.random() * 10) }),
});


export default connect(null,mapDispatchToProps)(Root);