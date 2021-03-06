import { GlobalState, BreadcrumbItem } from './app.data.models';
import { ToggleRightPanelAction, ToggleLeftPanelAction, LoadCountriesSuccessAction, LoadOperatorsSuccessAction, AppThemeChangeAction, SetBreadcrumbAction } from './app.actions';
import { createReducer, on } from '@ngrx/store';

const initState: GlobalState = {
    layout: {
        rightNavOpened: false,
        leftNavOpened: false,
        appTheme: 'theme-apigate-blue',
        particleAnimation: true,
        menuBackImage: true
    },
    mccAndmnc: {
        countries: null,
        operators: []
    },
    breadcrumb: []
};

const _globalReducer = createReducer(initState,

    on(ToggleRightPanelAction, (state, { payload }) => ({
        ...state, layout : { ...state.layout, rightNavOpened: <boolean>payload }
    })),

    on(ToggleLeftPanelAction, (state, { payload }) => ({
        ...state, layout : { ...state.layout, leftNavOpened: <boolean>payload }
    })),

    on(AppThemeChangeAction, (state, { payload }) => ({
        ...state, layout: { ...state.layout, appTheme: payload }
    })),
    
    on(LoadCountriesSuccessAction, (state, { payload }) => ({
        ...state, mccAndmnc: { ...state.mccAndmnc, countries: payload }
    })),

    on(LoadOperatorsSuccessAction, (state, { payload }) => ({
        ...state, mccAndmnc: { ...state.mccAndmnc, operators: payload }
    })),

    on(SetBreadcrumbAction, (state, {payload}) => ({
        ...state, breadcrumb: payload
    }))

);

export function globalReducer(state, action) {
    return _globalReducer(state, action);
}