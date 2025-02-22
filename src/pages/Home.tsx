import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
} from '@ionic/react';
import {
  gridOutline,
  callOutline,
  calendarOutline,
  locationOutline,
  peopleOutline,
} from 'ionicons/icons';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const menuItems = [
    {
      title: t('dashboard'),
      icon: gridOutline,
      path: '/dashboard',
      description: t('activity_overview')
    },
    {
      title: t('phone_directory'),
      icon: callOutline,
      path: '/directory',
      description: t('contacts_list')
    },
    {
      title: t('panchang'),
      icon: calendarOutline,
      path: '/panchang',
      description: t('daily_almanac')
    },
    {
      title: t('nearby_temples'),
      icon: locationOutline,
      path: '/temples',
      description: t('sacred_places')
    },
    {
      title: t('contact'),
      icon: peopleOutline,
      path: '/contact',
      description: t('get_in_touch')
    }
  ];

  return (
    <IonPage>
      <IonContent className="bg-gray-50">
      <div className="wave-container">
          <div className="wave"></div>
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            {t('welcome')}
          </h1>
          
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              {menuItems.map((item, index) => (
                <IonCol 
                  size="6" 
                  size-md="6" 
                  size-lg="6" // Change size-lg to 6 to fit two cards per row
                  key={index}
                  className="ion-padding"
                >
                  <div 
                    className="aspect-square square-box" // Add square-box class
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <IonCard
                      routerLink={item.path}
                      className={`h-full m-0 rounded-xl bg-white card-animation ${hoveredCard === index ? 'hovered' : ''}`}
                      style={{ background: 'linear-gradient(75deg, var(--primary), var(--secondary))', color: 'white' }}
                    >
                      <div className="flex items-center justify-center h-full p-4" style={{ marginTop: '60px' ,marginLeft: '20px'}}>
                        <IonIcon
                          icon={item.icon}
                          className="icon-size"
                          style={{ color: 'white', marginLeft: '40px' }}
                        />
                        <IonCardTitle className="text-center text-gray-700 fs-30" style={{ color: 'white', marginLeft: '30px' }}>
                          {item.title}
                        </IonCardTitle>
                      </div>
                    </IonCard>
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;