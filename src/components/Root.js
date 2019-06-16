import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';

const Root = ({ simulateScan }) => {
    useEffect(() => {
        setInterval(() => simulateScan(), 1000);
    }, []);
    return (<h1>Hi</h1>)
}

const mapDispatchToProps = (dispatch) => ({
    simulateScan: () => dispatch({
        type: 'SCAN',
        data: {
            id: uuidv4(),
            scan: Math.floor(Math.random() * 10)
        },
    }),
});


export default connect(null,mapDispatchToProps)(Root);