import React, { useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './SplashScreen.css';
import { useHistory } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/home');
    }, 3000); // Display splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <IonPage>
      <IonContent className="splash-screen">
        <div className="splash-logo">
        <div className="wave-container">
          <div className="wave"></div>
        </div>
        <div>
          <img src="./logo.png" alt="House of Jain-Z" />  
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen;
