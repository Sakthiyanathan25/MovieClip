import Cookies from 'js-cookie'
import {Route, Redirect} from 'react-router-dom'

const Protected = props => {
  if (Cookies.get('jwt_Token') === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default Protected