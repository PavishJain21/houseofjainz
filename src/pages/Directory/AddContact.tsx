import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonToast,
  IonSpinner,
  IonList,
  IonItemGroup,
  IonText,
  IonRippleEffect,
  useIonViewDidEnter,
  AnimationBuilder
} from '@ionic/react';
import { personOutline, callOutline, locationOutline, checkmarkCircle, alertCircle } from 'ionicons/icons';
import { CreateAnimation } from '@ionic/react';

const AddContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  const [focused, setFocused] = useState<string | null>(null);

  // Animation configuration
  const enterAnimation: AnimationBuilder = (baseEl) => {
    const root = baseEl.shadowRoot;
    
    if (!root) return;

    const animations = [
      {
        offset: 0,
        transform: 'translateY(20px)',
        opacity: '0'
      },
      {
        offset: 1,
        transform: 'translateY(0)',
        opacity: '1'
      }
    ];

    const cardAnimation = root.animate(animations, {
      duration: 500,
      easing: 'ease-out',
      fill: 'forwards'
    });

    return cardAnimation;
  };

  const handleChange = (field: string, value: string | null | undefined) => {
    if (value !== null && value !== undefined) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://13.201.104.120:8000/api/contact-list-create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({ name: '', phone: '', city: '' });
        setToastColor('success');
        setToastMessage('Contact added successfully!');
      } else {
        setToastColor('danger');
        setToastMessage('Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      setToastColor('danger');
      setToastMessage('Error adding contact');
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Add Contact</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <CreateAnimation
          duration={1000}
          iterations={1}
          fromTo={[
            { property: 'transform', fromValue: 'translateY(50px)', toValue: 'translateY(0)' },
            { property: 'opacity', fromValue: '0', toValue: '1' }
          ]}
        >
          <IonCard>
            <IonCardContent>
              <IonList>
                <IonItemGroup>
                  <IonItem 
                    className={`ion-no-padding ${focused === 'name' ? 'ion-focused' : ''}`}
                    lines="full"
                  >
                    <IonIcon icon={personOutline} slot="start" color="primary" />
                    <IonInput
                      label="Name"
                      labelPlacement="floating"
                      value={formData.name}
                      onIonInput={e => handleChange('name', e.detail.value)}
                      onIonFocus={() => setFocused('name')}
                      onIonBlur={() => setFocused(null)}
                      className="ion-margin-top"
                    />
                  </IonItem>

                  <IonItem 
                    className={`ion-no-padding ${focused === 'phone' ? 'ion-focused' : ''}`}
                    lines="full"
                  >
                    <IonIcon icon={callOutline} slot="start" color="primary" />
                    <IonInput
                      label="Phone Number"
                      labelPlacement="floating"
                      type="tel"
                      value={formData.phone}
                      onIonInput={e => handleChange('phone', e.detail.value)}
                      onIonFocus={() => setFocused('phone')}
                      onIonBlur={() => setFocused(null)}
                      className="ion-margin-top"
                    />
                  </IonItem>

                  <IonItem 
                    className={`ion-no-padding ${focused === 'city' ? 'ion-focused' : ''}`}
                    lines="full"
                  >
                    <IonIcon icon={locationOutline} slot="start" color="primary" />
                    <IonInput
                      label="City"
                      labelPlacement="floating"
                      value={formData.city}
                      onIonInput={e => handleChange('city', e.detail.value)}
                      onIonFocus={() => setFocused('city')}
                      onIonBlur={() => setFocused(null)}
                      className="ion-margin-top"
                    />
                  </IonItem>
                </IonItemGroup>

                <div className="ion-padding-top">
                  <IonButton
                    expand="block"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="ion-margin-top"
                  >
                    {loading ? (
                      <IonSpinner name="crescent" />
                    ) : (
                      <>
                        <IonIcon icon={checkmarkCircle} slot="start" />
                        Save Contact
                      </>
                    )}
                  </IonButton>
                </div>
              </IonList>
            </IonCardContent>
          </IonCard>
        </CreateAnimation>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default AddContact;