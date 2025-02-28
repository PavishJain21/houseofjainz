import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonSkeletonText,
  IonCard,
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { locationOutline, homeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import './nearby.css';
const MotionIonCard = motion(IonCard);
const MotionDiv = motion.div;



const NearbyTemples: React.FC = () => {
  const [temples, setTemples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();


 useEffect(() => {
 
    const fetchTemples = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`https://api.olamaps.io/places/v1/nearbysearch?layers=venue&types=hindu_temple&location=${latitude},${longitude}&api_key=kQy4FdWEghifK6z5mK9DT66vO2NEO5awKDPKcGhx`, {
          headers: {
            'X-Request-Id': 'XXX'
          }
        });
        const data = await response.json();
        if (data.status === 'ok') {
          setTemples(data.predictions);
        } else {
          console.error('Error fetching temples:', data.error_message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      setIsLoading(false);
    };

    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchTemples(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    };

 const getLocation = async () =>   {
     const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
    fetchTemples(latitude,longitude)
    }
    getLocation();
    getCurrentLocation();
  }, []);

  const [loc, setLoc] = useState(null);



  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar className='profile-header'>
             <span>  Near by Temples</span>
        </IonToolbar>
      </IonHeader> */}
      <IonContent>
               <div className="mobile-header">
                  <div className="header-top">
                    <MotionDiv
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="header-greeting"
                    >
                      <div>
                        {isLoading ? (
                          <IonSkeletonText animated style={{ width: '150px', height: '24px' }} />
                        ) : (
                          <h1 className="greeting-text">Nearby Temples</h1>
                        )}
                        {/* <p className="greeting-subtext">Welcome back</p> */}
                      </div>
                    </MotionDiv>
                    
                    <MotionDiv
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="header-icons"
                    >
                    </MotionDiv>
                  </div>
                </div>
        {isLoading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Loading nearby temples...</p>
          </div>
        ) : (
          <IonList>
            {temples.map((temple, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <IonItem button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.description)}`, '_blank')}>
                  <IonIcon icon={locationOutline} slot="start" />
                  <IonLabel className='fc-white'>{temple.description}</IonLabel>
                </IonItem>
              </motion.div>
            ))}
          </IonList>
        )}
        {/* <IonButton expand="block" onClick={() => history.push('/home')}>
          <IonIcon icon={homeOutline} slot="start" />
          Back to Home
        </IonButton> */}
      </IonContent>
    </IonPage>
  );
};

export default NearbyTemples;
