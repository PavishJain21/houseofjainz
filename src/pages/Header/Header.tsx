import React from 'react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const Header: React.FC = () => (
  <IonHeader>
    <IonToolbar>
      <IonTitle>
      <div className="logo">House of Jain-Z</div>
      </IonTitle>
    </IonToolbar>
  </IonHeader>
);

export default Header;