import React, { useState } from 'react';
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: gridOutline,
      path: '/dashboard',
      description: 'Activity Overview'
    },
    {
      title: 'Phone Directory',
      icon: callOutline,
      path: '/directory',
      description: 'Contacts List'
    },
    {
      title: 'Panchang',
      icon: calendarOutline,
      path: '/panchang',
      description: 'Daily Almanac'
    },
    {
      title: 'Nearby Temples',
      icon: locationOutline,
      path: '/temples',
      description: 'Sacred Places'
    },
    {
      title: 'Contact',
      icon: peopleOutline,
      path: '/contact',
      description: 'Get in Touch'
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="text-center font-medium text-gray-700">
            My App
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="bg-gray-50">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Welcome Back to House of jainz
          </h1>
          
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              {menuItems.map((item, index) => (
                <IonCol 
                  size="12" 
                  size-md="6" 
                  size-lg="4"
                  key={index}
                  className="ion-padding"
                >
                  <div 
                    className="aspect-square"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <IonCard
                      routerLink={item.path}
                      className={`h-full m-0 rounded-xl bg-white card-animation ${hoveredCard === index ? 'hovered' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div 
                          className="rounded-full p-4 mb-4 icon-animation"
                        >
                          <IonIcon
                            icon={item.icon}
                            className="icon-size"
                          />
                        </div>
                        
                        <IonCardTitle className="text-center text-gray-700 font-medium mb-2">
                          {item.title}
                        </IonCardTitle>
                        
                        <IonText 
                          className="text-center text-sm text-gray-500"
                        >
                          {/* {item.description} */}
                        </IonText>
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