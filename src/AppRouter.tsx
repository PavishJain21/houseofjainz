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
import Calendar from './pages/Calender';
import SplashScreen from './pages/SplashScreen/SplashScreen';
import Menu from './pages/Menu/Menu';
import Header from './pages/Header/Header';
import FooterPage from './pages/footer/footer';
import AddContact from './pages/Directory/AddContact';
import ContactList from './pages/Directory/ContactList';

const AppRouter: React.FC = () => (
  <IonReactRouter >
    <Header />
     <Menu />
     <FooterPage/>
    <IonRouterOutlet id="main-content" className='custom-router-outlet'>
      <Route exact path="/splash">
        <SplashScreen />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route path="/login" component={LoginPage} exact={true} />
      <Route path="/signup" component={Signup} exact={true} />
      <Route path="/dashboard" component={FeedPage} exact={true} />
      <Route path="/add" component={AddContact} exact />
          <Route path="/list" component={ContactList} exact />
      <Route exact path="/">
        <Redirect to="/splash" />
      </Route>
      <Route path="/calender">
        <Calendar />
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