import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, ActivitiesView, HomeView, DashboardView, ConfirmView, PlanView } from '../views';
import { requireAuthentication } from '../components/AuthenticatedComponent';

export default(
    <Route path='/' component={ App }>
        <IndexRoute component={ HomeView } />
        <Route path="activities" component={ ActivitiesView } />
        <Route path="confirm" component={ requireAuthentication(ConfirmView) } />
        <Route path="dashboard" component={ requireAuthentication(DashboardView) }/>
    </Route>
);
