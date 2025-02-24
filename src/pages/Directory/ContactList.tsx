import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
  IonChip,
  IonToggle,
  IonSkeletonText,
  IonCard,
  IonCardContent,
  IonRippleEffect
} from '@ionic/react';
import {
  locationOutline,
  personOutline,
  callOutline,
  chevronDownOutline,
  mailOutline
} from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import './ContactList.css';

interface ListItem {
  id: number;
  name: string;
  phone: string;
  city: string;
}

const IonicList: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [groupByLocation, setGroupByLocation] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://13.201.104.120:8000/api/contact-list-create/');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleRefresh = async (event: CustomEvent) => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    event.detail.complete();
  };

  // Filter and group items
  const filteredAndGroupedItems = React.useMemo(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phone.includes(searchText) ||
      item.city.toLowerCase().includes(searchText.toLowerCase())
    );

    return filtered.reduce((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = [];
      }
      acc[item.city].push(item);
      return acc;
    }, {} as Record<string, ListItem[]>);
  }, [items, searchText]);

  // Animation variants
  const listAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const itemAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 }
    })
  };

  return (
    <IonPage>
      <IonContent>
      <div className="wave-container">
          <div className="wave"></div>
        </div>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="ion-padding">
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Search contacts..."
            animated
            className="custom-searchbar"
          />

          <IonItem lines="none" className="ion-margin-vertical group-by-location">
            <IonLabel style={{ color: 'white' }}>Group by Location</IonLabel>
            <IonToggle
              checked={groupByLocation}
              onIonChange={e => setGroupByLocation(e.detail.checked)}
              slot="end"
            />
          </IonItem>

          {loading ? (
            <div className="ion-padding">
              {[...Array(3)].map((_, i) => (
                <IonCard key={i} className="skeleton-card">
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: '60%' }} />
                    <IonSkeletonText animated style={{ width: '40%' }} />
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          ) : (
            <AnimatePresence>
              {Object.entries(filteredAndGroupedItems).map(([city, cityItems]) => (
                <motion.div
                  key={city}
                  variants={listAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {groupByLocation && (
                    <IonItem
                      button
                      onClick={() => setExpandedLocation(expandedLocation === city ? '' : city)}
                      className="location-header"
                      style={{ background: 'linear-gradient(45deg, var(--primary), var(--secondary))', color: 'white' }}
                    >
                      <IonIcon icon={locationOutline} slot="start" />
                      <IonLabel>
                        <h2>{city}</h2>
                      </IonLabel>
                      <IonLabel slot="end" style={{ color: 'white' }}>
                        {cityItems.length} contacts
                      </IonLabel>
                      <IonIcon
                        icon={chevronDownOutline}
                        slot="end"
                        className={`transition-transform ${expandedLocation === city ? 'rotate-180' : ''}`}
                      />
                      <IonRippleEffect />
                    </IonItem>
                  )}

                  <AnimatePresence>
                    {(!groupByLocation || expandedLocation === city) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <IonList>
                          {cityItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              custom={index}
                              variants={itemAnimation}
                              initial="hidden"
                              animate="visible"
                            >
                              <IonItemSliding>
                                <IonItem style={{ background: 'linear-gradient(45deg, var(--primary), var(--secondary))', color: 'white' }}>
                                  <IonIcon icon={personOutline} slot="start" className="contact-icon" style={{ color: 'white', marginRight: '8px' }} />
                                  <IonLabel>
                                    <div className="contact-info">
                                      <h2 style={{ color: 'white' }}>{item.name}</h2>
                                      <IonChip color="primary" className="contact-chip">
                                        <IonIcon icon={callOutline} style={{ color: 'white' }} />
                                        <IonLabel style={{ color: 'white' }}>{item.phone}</IonLabel>
                                      </IonChip>
                                      {!groupByLocation && (
                                        <IonChip color="tertiary" className="contact-chip">
                                          <IonIcon icon={locationOutline} style={{ color: 'white' }} />
                                          <IonLabel style={{ color: 'white' }}>{item.city}</IonLabel>
                                        </IonChip>
                                      )}
                                    </div>
                                  </IonLabel>
                                </IonItem>
                                <IonItemOptions side="end">
                                  <IonItemOption color="primary" onClick={() => window.open(`tel:${item.phone}`)}>
                                    <IonIcon slot="icon-only" icon={callOutline} />
                                  </IonItemOption>
                                  <IonItemOption color="secondary" onClick={() => window.open(`mailto:${item.email}`)}>
                                    <IonIcon slot="icon-only" icon={mailOutline} />
                                  </IonItemOption>
                                </IonItemOptions>
                              </IonItemSliding>
                            </motion.div>
                          ))}
                        </IonList>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IonicList;