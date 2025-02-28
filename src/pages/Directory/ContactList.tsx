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
  IonRippleEffect,
  IonFab,
  IonFabButton,
  IonFabList,
  IonAvatar,
  IonButton,
  IonBackButton,
  IonButtons,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonRow,
  IonCol,
  IonGrid,
  IonLoading
} from '@ionic/react';
import {
  locationOutline,
  personOutline,
  callOutline,
  chevronDownOutline,
  mailOutline,
  addOutline,
  filterOutline,
  closeCircleOutline,
  arrowBackOutline,
  settingsOutline,
  searchOutline
} from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import './ContactList.css';

interface ListItem {
  id: number;
  name: string;
  phone: string;
  city: string;
}

const ContactListMobile: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [groupByLocation, setGroupByLocation] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://houseofjainz.com/api/contact-list-create/');
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
  }, [items, searchText, viewMode]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get random pastel color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'rgba(240, 128, 128, 0.8)',  // light coral
      'rgba(135, 206, 250, 0.8)',  // light sky blue
      'rgba(152, 251, 152, 0.8)',  // pale green
      'rgba(221, 160, 221, 0.8)',  // plum
      'rgba(255, 222, 173, 0.8)',  // navajo white
      'rgba(176, 196, 222, 0.8)'   // light steel blue
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

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
      transition: { delay: i * 0.05 }
    })
  };

  const cityCount = Object.keys(filteredAndGroupedItems).length;
  const totalContacts = Object.values(filteredAndGroupedItems).reduce(
    (sum, contacts) => sum + contacts.length, 0
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {!showSearchbar ? (
            <>
              <IonTitle>Contacts</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowSearchbar(true)}>
                  <IonIcon slot="icon-only" icon={searchOutline} />
                </IonButton>
                <IonButton onClick={() => setShowFilterOptions(!showFilterOptions)}>
                  <IonIcon slot="icon-only" icon={filterOutline} />
                </IonButton>
              </IonButtons>
            </>
          ) : (
            <>
              <IonButtons slot="start">
                <IonButton onClick={() => {
                  setShowSearchbar(false);
                  setSearchText('');
                }}>
                  <IonIcon slot="icon-only" icon={arrowBackOutline} />
                </IonButton>
              </IonButtons>
              <IonSearchbar
                value={searchText}
                onIonChange={e => setSearchText(e.detail.value!)}
                placeholder="Search contacts..."
                animated
                showCancelButton="never"
                className="mobile-searchbar"
                debounce={300}
                autoFocus
              />
              {searchText && (
                <IonButtons slot="end">
                  <IonButton onClick={() => setSearchText('')}>
                    <IonIcon slot="icon-only" icon={closeCircleOutline} />
                  </IonButton>
                </IonButtons>
              )}
            </>
          )}
        </IonToolbar>

        {showFilterOptions && (
          <IonToolbar className="filter-toolbar">
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonItem lines="none" className="filter-toggle">
                    <IonLabel>Group by Location</IonLabel>
                    <IonToggle
                      checked={groupByLocation}
                      onIonChange={e => setGroupByLocation(e.detail.checked)}
                      slot="end"
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="6">
                  <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as any)}>
                    <IonSegmentButton value="all">
                      <IonLabel>All</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="favorites">
                      <IonLabel>Favorites</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        )}
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {!loading && totalContacts > 0 && (
          <div className="stats-container ion-padding">
            <IonText color="medium">
              <p>{totalContacts} contacts in {cityCount} {cityCount === 1 ? 'city' : 'cities'}</p>
            </IonText>
          </div>
        )}

        {loading ? (
          <div className="ion-padding">
            {[...Array(5)].map((_, i) => (
              <IonCard key={i} className="skeleton-card">
                <IonCardContent className="skeleton-content">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-details">
                    <IonSkeletonText animated style={{ width: '70%', height: '16px' }} />
                    <IonSkeletonText animated style={{ width: '50%', height: '14px' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : (
          <>
            {totalContacts === 0 ? (
              <div className="empty-state ion-padding ion-text-center">
                <IonIcon icon={searchOutline} className="empty-icon" />
                <h3>No results found</h3>
                <p>Try a different search term or clear filters</p>
                {searchText && (
                  <IonButton fill="clear" onClick={() => setSearchText('')}>
                    Clear Search
                  </IonButton>
                )}
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
                      >
                        <IonIcon icon={locationOutline} slot="start" color="primary" />
                        <IonLabel>
                          <h2>{city}</h2>
                        </IonLabel>
                        <IonBadge color="primary" slot="end">
                          {cityItems.length}
                        </IonBadge>
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
                          transition={{ duration: 0.2 }}
                        >
                          <IonList className="contact-list">
                            {cityItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                custom={index}
                                variants={itemAnimation}
                                initial="hidden"
                                animate="visible"
                              >
                                <IonItemSliding>
                                  <IonItem className="contact-item" detail={false}>
                                    <IonAvatar slot="start" className="contact-avatar">
                                      <div 
                                        className="vatar-placeholder" 
                                        style={{ backgroundColor: getAvatarColor(item.name),width: '80px' }}
                                      >
                                        {item.name}
                                      </div>
                                    </IonAvatar>
                                    <IonLabel>
                                      <h2 className="contact-name">{item.name}</h2>
                                      <p className="contact-details">
                                        <IonIcon icon={callOutline} className="detail-icon" />
                                        {item.phone}
                                      </p>
                                      {!groupByLocation && (
                                        <p className="contact-details">
                                          <IonIcon icon={locationOutline} className="detail-icon" />
                                          {item.city}
                                        </p>
                                      )}
                                    </IonLabel>
                                    <IonButton fill="clear" slot="end" onClick={() => window.open(`tel:${item.phone}`)}>
                                      <IonIcon slot="icon-only" icon={callOutline} color="success" />
                                    </IonButton>
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
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={addOutline} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton color="primary">
              <IonIcon icon={personOutline} />
            </IonFabButton>
            <IonFabButton color="secondary">
              <IonIcon icon={callOutline} />
            </IonFabButton>
          </IonFabList>
        </IonFab>

        <IonLoading isOpen={refreshing} message="Refreshing..." />
      </IonContent>
    </IonPage>
  );
};

export default ContactListMobile;