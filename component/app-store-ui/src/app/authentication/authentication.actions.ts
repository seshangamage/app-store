import { createAction, props } from "@ngrx/store";
import { LoginFormData, LoginResponseData, ClientRegParam, RegClientData, TokenData, TokenGenerationParam, SigUpUserParam, ResetPasswordParam } from "./authentication.models";

export const DoLoginAction = createAction('[Auth] Login', props<{payload: LoginFormData}>());
export const LoginSuccessAction = createAction('[Auth] Login Success ✓', props<{payload: LoginResponseData}>());

export const DoLogoutAction = createAction('[Auth] Logout');
export const DoLogoutSuccessAction = createAction('[Auth] Logout Success ✓');

export const SetLastAuthRequiredRouteAction = createAction('[Auth] Set Last Auth Required Route', props<{payload: string}>());
export const SetLoggedUserAction = createAction('[Auth] Set Logged User', props<{payload: string}>());

export const SignupUserAction = createAction('[Auth] Signup', props<{payload: SigUpUserParam}>());
export const SignupUserSuccessAction = createAction('[Auth] Signup Success ✓', props<{payload: any}>());

export const ChangeUserPwAction = createAction('[Auth] Change Password', props<{payload: ResetPasswordParam}>());
export const ChangeUserPwSuccessAction = createAction('[Auth] Change Password Success ✓', props<{payload: any}>());

export const ClientRegistrationAction = createAction('[Auth] Client Reg App', props<{payload: LoginFormData}>());
export const ClientRegistrationSuccessAction = createAction('[Auth] Client Reg App Success ✓', props<{payload: RegClientData}>());

export const TokenGenerationAction = createAction('[Auth] Token Generation', props<{payload: LoginFormData}>());
export const TokenGenerationSuccessAction = createAction('[Auth] Token Generation Success ✓', props<{payload: TokenData}>());

export const TokenRefreshAction = createAction('[Auth] Token Refresh');
export const TokenRefreshSuccessAction = createAction('[Auth] Token Refresh Success ✓', props<{payload: TokenData}>());