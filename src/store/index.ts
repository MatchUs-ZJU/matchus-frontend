import {applyMiddleware, compose, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {IUserState} from "@/reducers/user";
import {IGlobalState} from "@/reducers/global";
import {IActivityState} from "@/reducers/activity";
import {IHomeState} from "@/reducers/home";
import {IResourceState} from "@/reducers/resource";
import {IMatchState} from "@/reducers/match";
import {IChooseState} from "@/reducers/choose";
import rootReducer from '../reducers'

interface IState {
  user: IUserState,
  global: IGlobalState,
  activity: IActivityState,
  home: IHomeState
  resource: IResourceState
  match: IMatchState
  choose: IChooseState
}

declare module "react-redux" {
  interface DefaultRootState extends IState {}
}

const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const middlewares = [
  thunkMiddleware
]

if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV !== 'quickapp') {
  middlewares.push(require('redux-logger').createLogger())
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
)

function configStore() {
  return createStore(rootReducer, enhancer)
}

export const store = configStore()

