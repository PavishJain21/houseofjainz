import React, { useState, useEffect, useRef } from 'react';
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
  IonAvatar,
  IonButton,
  IonButtons,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonRow,
  IonCol,
  IonGrid,
  IonLoading,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  IonToast,
  IonNote,
  IonInput,
  IonFooter,
  IonRadioGroup,
  IonRadio,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonRouterOutlet,
  useIonActionSheet,
  useIonViewWillEnter,
  IonSpinner,
  IonPopover,
  RefresherEventDetail
} from '@ionic/react';
import {
  callOutline,
  locationOutline,
  personOutline,
  chevronDownOutline,
  mailOutline,
  addOutline,
  filterOutline,
  closeCircleOutline,
  arrowBackOutline,
  searchOutline,
  ellipsisVertical,
  peopleOutline,
  swapVerticalOutline,
  downloadOutline,
  shareOutline,
  trashOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import './ContactList.css';
import authMiddleware from '../../middleware/authMiddleware';

interface Contact {
  id: number;
  name: string;
  phone: string;
  city: string;
  email?: string;
  avatar?: string;
}

const ContactListPage: React.FC = () => {
  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [groupByLocation, setGroupByLocation] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [sortOption, setSortOption] = useState<'name' | 'city'>('name');
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showActionSheet, dismissActionSheet] = useIonActionSheet();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreContacts, setHasMoreContacts] = useState(true);
  const filterPopoverRef = useRef<HTMLIonPopoverElement>(null);
  const contactListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLIonSearchbarElement>(null);

  // Load contacts
  useEffect(() => {
    fetchContacts();
  }, [sortOption]);

  const fetchContacts = async (refresh = false) => {
    if (refresh) {
      setPageNumber(1);
      setContacts([]);
    }

    setLoading(true);
    
    try {
      // Replace with your actual API endpoint
      const response = await authMiddleware(`/contact-list-create/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (refresh) {
        setContacts(data);
      } else {
        setContacts(prev => [...prev, ...data]);
      }
      
      setHasMoreContacts(data.length === 20); // Assuming 20 items per page
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setToastMessage('Failed to load contacts. Please try again.');
      setShowToast(true);
    }
    
    setLoading(false);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchContacts(true);
    event.detail.complete();
  };

  const loadMoreContacts = async (event: CustomEvent<void>) => {
    setPageNumber(prev => prev + 1);
    await fetchContacts();
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

  // Filter and group contacts
  const filteredAndGroupedContacts = React.useMemo(() => {
    // Filter contacts based on search text
    const filtered = contacts.filter(contact => {
      const matchesSearch = 
        !searchText || 
        contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.phone.includes(searchText) ||
        contact.city.toLowerCase().includes(searchText.toLowerCase()) ||
        (contact.email && contact.email.toLowerCase().includes(searchText.toLowerCase()));
        
      return matchesSearch;
    });

    // Sort contacts
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.city.localeCompare(b.city);
      }
    });

    // Group by city if needed
    if (groupByLocation) {
      return sorted.reduce((acc, contact) => {
        if (!acc[contact.city]) {
          acc[contact.city] = [];
        }
        acc[contact.city].push(contact);
        return acc;
      }, {} as Record<string, Contact[]>);
    } else {
      // If not grouping, use a single group with empty key
      return { '': sorted };
    }
  }, [contacts, searchText, sortOption, groupByLocation]);

  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarBgColor = (name: string) => {
    const colors = [
      '#4F46E5', // indigo
      '#7C3AED', // violet
      '#EC4899', // pink
      '#10B981', // emerald
      '#F59E0B', // amber
      '#3B82F6', // blue
      '#EF4444', // red
      '#06B6D4'  // cyan
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const showContactActions = (contact: Contact) => {
    showActionSheet({
      header: contact.name,
      buttons: [
        {
          text: 'Call',
          icon: callOutline,
          handler: () => {
            window.open(`tel:${contact.phone}`);
          }
        },
        {
          text: 'Email',
          icon: mailOutline,
          handler: () => {
            if (contact.email) {
              window.open(`mailto:${contact.email}`);
            } else {
              setToastMessage('No email available');
              setShowToast(true);
            }
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: trashOutline,
          handler: () => {
            setToastMessage(`${contact.name} would be deleted (demo only)`);
            setShowToast(true);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
  };

  const viewContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactDetail(true);
  };

  const clearSearch = () => {
    setSearchText('');
    setShowSearchbar(false);
  };

  const totalContactsFiltered = Object.values(filteredAndGroupedContacts).flat().length;
  const totalCities = Object.keys(filteredAndGroupedContacts).filter(city => city !== '').length;

  // Animation variants
  const listAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03, duration: 0.2 }
    })
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar className='contact-header-title'>
          {!showSearchbar ? (
            <>
              <IonTitle>Contacts</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowSearchbar(true)}>
                  <IonIcon slot="icon-only" icon={searchOutline} />
                </IonButton>
                <IonButton onClick={() => setShowFilterPopover(true)} id="filter-popover-button">
                  <IonIcon slot="icon-only" icon={filterOutline} />
                </IonButton>
              </IonButtons>
            </>
          ) : (
            <>
              <IonButtons slot="start">
                <IonButton onClick={clearSearch}>
                  <IonIcon slot="icon-only" icon={arrowBackOutline} />
                </IonButton>
              </IonButtons>
              <IonSearchbar
                ref={searchInputRef}
                value={searchText}
                onIonChange={e => setSearchText(e.detail.value!)}
                placeholder="Search name, phone, city..."
                animated
                showCancelButton="never"
                debounce={300}
                autoFocus
                className="contact-searchbar"
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
      </IonHeader>

      <IonPopover 
        ref={filterPopoverRef}
        isOpen={showFilterPopover} 
        onDidDismiss={() => setShowFilterPopover(false)}
        trigger="filter-popover-button"
        side="bottom"
        alignment="end"
        className="filter-popover"
      >
        <IonList lines="full">
          <IonItem>
            <IonLabel>Group by City</IonLabel>
            <IonToggle
              checked={groupByLocation}
              onIonChange={e => setGroupByLocation(e.detail.checked)}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Sort by</IonLabel>
          </IonItem>
          <IonRadioGroup value={sortOption} onIonChange={e => setSortOption(e.detail.value)}>
            <IonItem>
              <IonLabel>Name</IonLabel>
              <IonRadio slot="end" value="name" />
            </IonItem>
            <IonItem>
              <IonLabel>City</IonLabel>
              <IonRadio slot="end" value="city" />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      </IonPopover>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {!loading && totalContactsFiltered > 0 && (
          <div className="stats-container">
            <IonText color="medium" className="stats-text">
              {groupByLocation 
                ? `${totalContactsFiltered} contacts in ${totalCities} ${totalCities === 1 ? 'city' : 'cities'}`
                : `${totalContactsFiltered} contacts`}
            </IonText>
          </div>
        )}

        {loading && contacts.length === 0 ? (
          <div className="skeleton-container">
            {[...Array(8)].map((_, i) => (
              <IonCard key={i} className="contact-card skeleton-card">
                <IonCardContent className="contact-card-content">
                  <div className="contact-avatar-skeleton"></div>
                  <div className="contact-details-skeleton">
                    <IonSkeletonText animated style={{ width: '70%', height: '18px' }} />
                    <IonSkeletonText animated style={{ width: '50%', height: '14px' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : (
          <>
            {totalContactsFiltered === 0 ? (
              <div className="empty-state">
                <IonIcon icon={searchText ? searchOutline : peopleOutline} className="empty-icon" />
                <h3>No contacts found</h3>
                <p>
                  {searchText 
                    ? "Try a different search term or clear filters" 
                    : "Add contacts to get started"}
                </p>
                {searchText && (
                  <IonButton fill="outline" onClick={() => setSearchText('')}>
                    Clear Search
                  </IonButton>
                )}
              </div>
            ) : (
              <div className="contact-list-container" ref={contactListRef}>
                <AnimatePresence>
                  {Object.entries(filteredAndGroupedContacts).map(([city, cityContacts]) => (
                    <React.Fragment key={city || 'all-contacts'}>
                      {groupByLocation && city && (
                        <IonItem 
                          button
                          onClick={() => setExpandedLocation(expandedLocation === city ? null : city)}
                          className="city-header"
                          detail={false}
                        >
                          <IonIcon icon={locationOutline} slot="start" color="primary" />
                          <IonLabel>
                            <h2>{city}</h2>
                          </IonLabel>
                          <IonBadge color="primary" slot="end">
                            {cityContacts.length}
                          </IonBadge>
                          <IonIcon
                            icon={chevronDownOutline}
                            slot="end"
                            className={`transition-transform ${expandedLocation === city ? 'rotate-180' : ''}`}
                          />
                        </IonItem>
                      )}

                      {(!groupByLocation || expandedLocation === city || !city) && (
                        <motion.div
                          variants={listAnimation}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="contacts-group"
                        >
                          {cityContacts.map((contact, index) => (
                            <motion.div
                              key={contact.id}
                              custom={index}
                              variants={itemAnimation}
                              initial="hidden"
                              animate="visible"
                            >
                              <IonItemSliding>
                                <IonItem 
                                  button 
                                  detail={false} 
                                  className="contact-item"
                                  onClick={() => viewContactDetails(contact)}
                                >
                                  <IonAvatar slot="start" className="contact-avatar">
                                    {contact.avatar ? (
                                      <img src={contact.avatar} alt={contact.name} />
                                    ) : (
                                      <div 
                                        className="avatar-initials" 
                                        style={{ backgroundColor: getAvatarBgColor(contact.name) }}
                                      >
                                        {getInitials(contact.name)}
                                      </div>
                                    )}
                                  </IonAvatar>
                                  <IonLabel>
                                    <h2 className="contact-name">
                                      {contact.name}
                                    </h2>
                                    <p className="contact-phone">
                                      <IonIcon icon={callOutline} className="contact-icon" />
                                      {contact.phone}
                                    </p>
                                    {!groupByLocation && (
                                      <p className="contact-city">
                                        <IonIcon icon={locationOutline} className="contact-icon" />
                                        {contact.city}
                                      </p>
                                    )}
                                  </IonLabel>
                                  <IonButton 
                                    fill="clear" 
                                    slot="end" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showContactActions(contact);
                                    }}
                                  >
                                    <IonIcon slot="icon-only" icon={ellipsisVertical} />
                                  </IonButton>
                                </IonItem>
                                <IonItemOptions side="end">
                                  <IonItemOption color="success" onClick={() => window.open(`tel:${contact.phone}`)}>
                                    <IonIcon slot="icon-only" icon={callOutline} />
                                  </IonItemOption>
                                  {contact.email && (
                                    <IonItemOption color="tertiary" onClick={() => window.open(`mailto:${contact.email}`)}>
                                      <IonIcon slot="icon-only" icon={mailOutline} />
                                    </IonItemOption>
                                  )}
                                </IonItemOptions>
                              </IonItemSliding>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {hasMoreContacts && (
          <IonInfiniteScroll
            threshold="100px"
            disabled={loading}
            onIonInfinite={loadMoreContacts}
          >
            <IonInfiniteScrollContent loadingText="Loading more contacts..."></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      <IonModal isOpen={showContactDetail} onDidDismiss={() => setShowContactDetail(false)}>
        {selectedContact && (
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowContactDetail(false)}>
                    <IonIcon slot="icon-only" icon={closeCircleOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Contact Details</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => showContactActions(selectedContact)}>
                    <IonIcon slot="icon-only" icon={ellipsisVertical} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="contact-detail-header">
                <div className="contact-detail-avatar">
                  {selectedContact.avatar ? (
                    <img src={selectedContact.avatar} alt={selectedContact.name} />
                  ) : (
                    <div 
                      className="avatar-initials large" 
                      style={{ backgroundColor: getAvatarBgColor(selectedContact.name) }}
                    >
                      {getInitials(selectedContact.name)}
                    </div>
                  )}
                </div>
                <h1 className="contact-detail-name">{selectedContact.name}</h1>
              </div>

              <IonList lines="full" className="contact-detail-list">
                <IonItem>
                  <IonIcon icon={callOutline} slot="start" color="success" />
                  <IonLabel>
                    <h2>Phone</h2>
                    <p>{selectedContact.phone}</p>
                  </IonLabel>
                  <IonButton slot="end" fill="clear" onClick={() => window.open(`tel:${selectedContact.phone}`)}>
                    Call
                  </IonButton>
                </IonItem>
                
                {selectedContact.email && (
                  <IonItem>
                    <IonIcon icon={mailOutline} slot="start" color="tertiary" />
                    <IonLabel>
                      <h2>Email</h2>
                      <p>{selectedContact.email}</p>
                    </IonLabel>
                    <IonButton slot="end" fill="clear" onClick={() => window.open(`mailto:${selectedContact.email}`)}>
                      Email
                    </IonButton>
                  </IonItem>
                )}
                
                <IonItem>
                  <IonIcon icon={locationOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>City</h2>
                    <p>{selectedContact.city}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
              
              <div className="action-buttons">
                <IonButton expand="block" color="primary">
                  <IonIcon slot="start" icon={personOutline} />
                  Edit Contact
                </IonButton>
                <IonButton expand="block" color="danger" fill="outline">
                  <IonIcon slot="start" icon={trashOutline} />
                  Delete Contact
                </IonButton>
              </div>
            </IonContent>
          </IonPage>
        )}
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
      />
    </IonPage>
  );
};

export default ContactListPage;