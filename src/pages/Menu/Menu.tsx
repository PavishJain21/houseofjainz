import { IonContent, IonList, IonItem, IonMenu, IonHeader, IonToolbar, IonTitle } from "@ionic/react";

const Menu: React.FC = () => {
  return (
    
    <IonMenu side="start" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>House of Jainz</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <div className="wave-container">
          <div className="wave"></div>
        </div>
        <IonList style={{marginLeft: '20px',backgroundColor: 'transparent'}}>
        <div className="wave-container">
          <div className="wave"></div>
        </div>
          <IonItem  style={{backgroundColor: 'transparent'}} routerLink="/home">Home</IonItem>
          <IonItem  style={{backgroundColor: 'transparent'}} routerLink="/useredit">Profile</IonItem>
          <IonItem  style={{backgroundColor: 'transparent'}} routerLink="/contact">Contact</IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
