import { withRouter } from "react-router";
import { createBrowserHistory, createHashHistory } from 'history'

const customHistory = createBrowserHistory();
const customHashHistory = createHashHistory();

const Tools = {}

Tools.push = (path) => {
  console.log('导航路径')
  console.log(path);
  console.log(customHistory)
  console.log(customHashHistory)
  // customHistory.push(path)
  customHashHistory.push(path)
}

export default withRouter(Tools);