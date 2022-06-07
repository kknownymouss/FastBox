import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from '../HelperMethods/Auth';

const PrivateRoute = ({component: Component, ...rest}) => {
    return (

        // Show the component only when the user logs into the box
        // Otherwise, redirect to land
        <Route {...rest} render={props => (
            isAuth() ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;