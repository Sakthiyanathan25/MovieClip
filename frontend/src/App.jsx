import { Route, Switch, Redirect } from 'react-router-dom';
import ScrollToTop from "./scrollToTop";
import UserLoginForm from './Components/LoginPage';
import UserRegisterForm from "./Components/Register";
import Home from "./Components/Home";
import NotFound from './Components/Notfound';
import Protected from './Components/ProtectedRoute';
import EachMovies from './Components/EachMovies';
import Search from './Components/search';
import Popular from './Components/Popular';
import Profile from './Components/Profile'
import AdminLoginForm from './AdimComponents/AdminLogin';
import ProtectedAdmin from './AdimComponents/ProtectedAdmin';
import AdminSite from "./AdimComponents/Adminsite"
import AdminRegister from "./AdimComponents/AdminRegister"
import AddMovie from './AdimComponents/AddMovie';

function App() {
  return (
    <>
     <ScrollToTop />
     <Switch>
      
      <Route exact path="/login" component={UserLoginForm} />
      <Route exact path="/register" component={UserRegisterForm} />
      <Protected exact path="/" component={Home} />
      <Protected exact path="/movies/:id" component={EachMovies}/>
      <Protected exact path="/search" component={Search}/>
      <Protected exact path="/popular" component={Popular}/>
      <Protected exact path="/profile" component={Profile}/>
      <Route exact path="/admin-login" component={AdminLoginForm}/>
      <ProtectedAdmin exact path="/admin-site" component={AdminSite}/>
      <ProtectedAdmin exact path="/admin-register" component={AdminRegister}/>
      <ProtectedAdmin exact path="/add-movie" component={AddMovie}/>
      <Route  path="/not-found" component={NotFound} />
      <Redirect to="/not-found " />
    </Switch>
    </>
   
  );
}

export default App;


