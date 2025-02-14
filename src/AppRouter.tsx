import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Signup from './pages/Signup';
import PanchangCalendar from './pages/Calender';
import LoginPage from './pages/login';
import FeedPage from './pages/Feeds/feed';
import ProfileEdit from './pages/profile-edit/ProfileEdit';
import NearbyTemples from './pages/Nearby/nearby';

const AppRouter: React.FC = () => (
  <IonReactRouter>
    <IonRouterOutlet className='custom-router-outlet'>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route path="/login" component={LoginPage} exact={true} />
      <Route path="/signup" component={Signup} exact={true} />
      <Route path="/dashboard" component={FeedPage} exact={true} />
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route exact path="/calender">
        <PanchangCalendar />
      </Route>
      <Route exact path="/useredit">
        <ProfileEdit />
      </Route>
      <Route exact path="/nearby">
        <NearbyTemples />
      </Route>
    </IonRouterOutlet>
  </IonReactRouter>
);

export default AppRouter;