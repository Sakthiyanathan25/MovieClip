import Cookies from 'js-cookie'
import {Route, Redirect} from 'react-router-dom'

const ProtectedAdmin = props => {
  if (Cookies.get('jwt_Admin_Token') === undefined) {
    return <Redirect to="/admin-login" />
  }
  return <Route {...props} />
}

export default ProtectedAdmin