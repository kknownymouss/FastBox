import {Switch, Route, BrowserRouter} from 'react-router-dom'
import BoxHome from '../Dashboard/BoxHome'
import Home from '../Landing/Home'
import ShareUrlRedirect from '../Redirects/ShareUrlRedirect'
import PrivateRoute from '../Routes/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/share/url/:shareUrl" exact component={ShareUrlRedirect} />
          <PrivateRoute path="/:boxCode" exact component={BoxHome} />
      </Switch>
    </BrowserRouter>
  )
}

export default App