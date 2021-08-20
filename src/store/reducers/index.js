import { combineReducers } from 'redux';
import playlistReducer from './playlistReducer';
const indexReducer = combineReducers({
  playlistReducer
})

export default indexReducer;