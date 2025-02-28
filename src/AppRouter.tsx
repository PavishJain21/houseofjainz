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
import { getToken, refreshAccessToken } from './utils/tokenUtil';
import { useState, useEffect } from 'react';

const AppRouter: React.FC = () => {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        const newToken = await refreshAccessToken();
        setToken(newToken);
      }
    };
    checkToken();
  }, [token]);

  return (
    <IonReactRouter>
     
      <Menu />
      <FooterPage />
      <IonRouterOutlet id="main-content" className='custom-router-outlet mt-2rem'>
        <Route exact path="/splash">
          <SplashScreen />
        </Route>
        <Route exact path="/home">
          {token ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login" component={LoginPage} exact={true} />
        <Route path="/signup" component={Signup} exact={true} />
        <Route path="/dashboard">
          {token ? <FeedPage /> : <Redirect to="/login" />}
        </Route>
        <Route path="/add">
          {token ? <AddContact /> : <Redirect to="/login" />}
        </Route>
        <Route path="/directory">
          {token ? <ContactList /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/">
          <Redirect to="/splash" />
        </Route>
        <Route path="/panchang">
          {token ? <Calendar /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/useredit">
          {token ? <ProfileEdit /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/temples">
          {token ? <NearbyTemples /> : <Redirect to="/login" />}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default AppRouter;