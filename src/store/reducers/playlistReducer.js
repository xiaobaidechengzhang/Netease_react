const playlistReducer = (state = [], action) => {
  switch(action.type) {
    case 'add':
      let data = action.data;
      if(data instanceof Array) {
        if(action.hasOwnProperty('index')) {
          let stateData = JSON.parse(JSON.stringify(state));
          stateData.splice(index, 0, ...data);
          return stateData;
        }else {
          return [
            ...state,
            ...data
          ]
        }
      }else {
        if(action.hasOwnProperty('index')) {
          let stateData = JSON.parse(JSON.stringify(state));
          stateData.splice(index, 0, data);
        }else {
          return [
            ...state,
            data
          ]
        }
      }
    case 'delete':
      let data = action.data;
      if(data instanceof Array) {
        if(action.hasOwnProperty('index')) {
          let stateData = JSON.parse(JSON.stringify(state));
          stateData.splice(index, data.length);
          return stateData;
        }else {
          return [
            ...state,
            ...data
          ]
        }
      }else {
        if(action.hasOwnProperty('index')) {
          let stateData = JSON.parse(JSON.stringify(state));
          stateData.splice(index, 1);
        }else {
          return [
            ...state,
            data
          ]
        }
      }
      return state;
    case 'empty':
      return [];
    default:
      return state;
  }
}

export default playlistReducer;