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
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRippleEffect,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSkeletonText,
  IonChip,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  createAnimation,
  AnimationBuilder,
} from '@ionic/react';
import { 
  locationOutline, 
  callOutline, 
  personOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons';
import './ContactList.css';

interface Contact {
  id: number;
  name: string;
  phone: string;
  city: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchText, setSearchText] = useState('');
  const [groupByCity, setGroupByCity] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [expandedCity, setExpandedCity] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  // Custom animations
  const enterAnimation: AnimationBuilder = (baseEl) => {
    const root = createAnimation()
      .addElement(baseEl)
      .duration(300)
      .easing('ease-out');

    const slideIn = createAnimation()
      .addElement(baseEl.querySelector('ion-item')!)
      .fromTo('transform', 'translateX(-100%)', 'translateX(0)')
      .fromTo('opacity', '0', '1');

    return root.addAnimation(slideIn);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact-list-create/');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    setRefreshing(true);
    await fetchContacts();
    event.detail.complete();
    setRefreshing(false);
  };

  const filteredContacts = contacts
    .filter(contact => 
      contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.phone.includes(searchText) ||
      contact.city.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => groupByCity ? a.city.localeCompare(b.city) : a.name.localeCompare(b.name));

  const groupedContacts = groupByCity 
    ? filteredContacts.reduce((acc, contact) => {
        acc[contact.city] = acc[contact.city] || [];
        acc[contact.city].push(contact);
        return acc;
      }, {} as Record<string, Contact[]>)
    : { 'All': filteredContacts };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" className="animate-header">
          <IonTitle className="ion-text-center">
            <h1 className="text-2xl font-bold">My Contacts</h1>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding contact-list-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="search-container ion-margin-bottom">
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            animated={true}
            placeholder="Search by name, phone, or city..."
            className="custom-searchbar"
          />
          
          <IonItem lines="none" className="group-toggle">
            <IonLabel>Group by City</IonLabel>
            <IonSelect 
              value={groupByCity}
              onIonChange={e => setGroupByCity(e.detail.value)}
              interface="popover"
            >
              <IonSelectOption value={false}>No Grouping</IonSelectOption>
              <IonSelectOption value={true}>Group by City</IonSelectOption>
            </IonSelect>
          </IonItem>
        </div>

        {loading ? (
          <div className="ion-padding">
            {[...Array(5)].map((_, i) => (
              <IonCard key={i} className="loading-card">
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                  <IonSkeletonText animated style={{ width: '40%' }} />
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : (
          Object.entries(groupedContacts).map(([city, cityContacts]) => (
            <div key={city} className="city-group">
              {groupByCity && (
                <IonItem
                  button
                  onClick={() => setExpandedCity(expandedCity === city ? '' : city)}
                  className="city-header"
                  detail={false}
                >
                  <IonIcon icon={locationOutline} slot="start" />
                  <IonLabel>
                    <h2>{city}</h2>
                    <p>{cityContacts.length} contacts</p>
                  </IonLabel>
                  <IonIcon 
                    icon={expandedCity === city ? chevronUpOutline : chevronDownOutline}
                    slot="end"
                  />
                  <IonRippleEffect />
                </IonItem>
              )}
              
              {(!groupByCity || expandedCity === city) && (
                <IonList>
                  {cityContacts.map((contact) => (
                    <IonItemSliding key={contact.id}>
                      <IonItem className="contact-item">
                        <IonIcon icon={personOutline} slot="start" className="contact-icon" />
                        <IonLabel>
                          <h2 className="contact-name">{contact.name}</h2>
                          <div className="contact-details" >
                            <IonChip color="primary" className='contact-phone'>
                              <IonIcon icon={callOutline} />
                              <IonLabel>{contact.phone}</IonLabel>
                            </IonChip>
                            {!groupByCity && (
                              <IonChip color="secondary" className="contact-city">
                                <IonIcon icon={locationOutline} />
                                <IonLabel>{contact.city}</IonLabel>
                              </IonChip>
                            )}
                          </div>
                        </IonLabel>
                      </IonItem>
                      <IonItemOptions side="end">
                        <IonItemOption color="primary">
                          Call
                        </IonItemOption>
                        <IonItemOption color="secondary">
                          Message
                        </IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  ))}
                </IonList>
              )}
            </div>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default ContactList;