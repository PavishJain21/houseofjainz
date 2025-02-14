import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonSearchbar,
} from '@ionic/react';
import { calendar, flower } from 'ionicons/icons';
import './Calender.css';
import FooterPage from './footer/footer';

const panchangData = {
  "January": [
    { "date": "2025-01-01", "festival": "जैन पर्व और त्यौहार" },
    { "date": "2025-01-07", "festival": "पार्श्वनाथ जयंती" },
    { "date": "2025-01-14", "festival": "यतीन्द्र सुरेश्वर दिवस" },
    { "date": "2025-01-17", "festival": "श्री राजेन्द्र सूरिश्वर दिवस" }
  ],
  "February": [
    { "date": "2025-02-07", "festival": "शीतलनाथ जन्म तप" },
    { "date": "2025-02-08", "festival": "मेरु त्रयोदशी" },
    { "date": "2025-02-08", "festival": "आदिनाथ निर्वाण कल्याणक" },
    { "date": "2025-02-09", "festival": "ऋषभदेव मोक्ष" },
    { "date": "2025-02-14", "festival": "दशलक्षण (3/3) प्रारंभ" },
    { "date": "2025-02-16", "festival": "मर्यादा महोत्सव" },
    { "date": "2025-02-23", "festival": "श्री जितेन्द्र रथ यात्रा" },
    { "date": "2025-02-23", "festival": "दशलक्षण (3/3) समाप्त" }
  ],
  "March": [
    { "date": "2025-03-17", "festival": "अष्टान्हिका (3/3) प्रारंभ" },
    { "date": "2025-03-25", "festival": "अष्टान्हिका (3/3) समाप्त" }
  ],
  "April": [
    { "date": "2025-04-13", "festival": "दशलक्षण (1/3) प्रारंभ" },
    { "date": "2025-04-15", "festival": "आयम्बिल ओली प्रारंभ" },
    { "date": "2025-04-21", "festival": "महावीर जयंती" },
    { "date": "2025-04-22", "festival": "दशलक्षण (1/3) समाप्त" },
    { "date": "2025-04-23", "festival": "आयम्बिल ओली समाप्त" }
  ],
  "May": [
    { "date": "2025-05-18", "festival": "श्री महावीर स्वामी का वैकुंठ ज्ञान दिवस" },
    { "date": "2025-05-24", "festival": "ज्येष्ठ जिनवार व्रत प्रारंभ" }
  ],
  "June": [
    { "date": "2025-06-03", "festival": "श्री अनंतनाथ जन्म तप" },
    { "date": "2025-06-22", "festival": "ज्येष्ठ जिनवार व्रत समाप्त" }
  ],
  "July": [
    { "date": "2025-07-14", "festival": "अष्टान्हिका (1/3) प्रारंभ" },
    { "date": "2025-07-20", "festival": "चौमासी चौदस" },
    { "date": "2025-07-21", "festival": "अष्टान्हिका (1/3) समाप्त" }
  ],
  "September": [
    { "date": "2025-09-03", "festival": "संवत्सरी" },
    { "date": "2025-09-04", "festival": "कल्पसूत्र पाठ" },
    { "date": "2025-09-05", "festival": "तैलधर तप" },
    { "date": "2025-09-08", "festival": "क्षमावाणी पर्व" },
    { "date": "2025-09-08", "festival": "दशलक्षण (2/3) प्रारंभ" },
    { "date": "2025-09-17", "festival": "दशलक्षण (2/3) समाप्त" }
  ],
  "October": [
    { "date": "2025-10-09", "festival": "आयम्बिल ओली प्रारंभ" },
    { "date": "2025-10-17", "festival": "आयम्बिल ओली समाप्त" },
    { "date": "2025-10-30", "festival": "श्री पद्म प्रभु जन्म तप" }
  ],
  "November": [
    { "date": "2025-11-01", "festival": "महावीर निर्वाण" },
    { "date": "2025-11-06", "festival": "ज्ञान पंचमी/ सौभाग्य पंचमी" },
    { "date": "2025-11-08", "festival": "अष्टान्हिका (2/3) प्रारंभ" },
    { "date": "2025-11-15", "festival": "अष्टान्हिका (2/3) समाप्त" },
    { "date": "2025-11-25", "festival": "महावीर स्वामी दीक्षा" }
  ],
  "December": [
    { "date": "2025-12-11", "festival": "मौन एकादशी" }
  ]
};

const PanchangPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(panchangData);

  const handleSearch = (e) => {
    const searchValue = e.detail.value.toLowerCase();
    setSearchText(searchValue);

    if (!searchValue) {
      setFilteredData(panchangData);
      return;
    }

    const filtered = Object.keys(panchangData).reduce((acc, month) => {
      const filteredFestivals = panchangData[month].filter(
        item => item.festival.toLowerCase().includes(searchValue)
      );
      if (filteredFestivals.length > 0) {
        acc[month] = filteredFestivals;
      }
      return acc;
    }, {});

    setFilteredData(filtered);
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="wave-container">
          <div className="wave"></div>
        </div>

        <nav className="navbar">
          <div className="logo">House of Jain-Z</div>
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Community</a>
            <a href="#" className="nav-link">Events</a>
            <a href="#" className="nav-link">Resources</a>
          </div>
        </nav>

        <div className="panchang-container">
          {/* Header Section */}
          <div className="page-header">
            <div className="lotus-symbol">
              <svg viewBox="0 0 100 100" width="50" height="50">
                <path fill="#FF725E" d="M50 15 C30 35, 30 45, 50 65 C70 45, 70 35, 50 15" />
                <path fill="#FF725E" d="M30 35 C20 45, 20 55, 30 75 C50 65, 50 55, 30 35" />
                <path fill="#FF725E" d="M70 35 C80 45, 80 55, 70 75 C50 65, 50 55, 70 35" />
              </svg>
            </div>
            <h1>जैन पंचांग २०२५</h1>
            <p className="subtitle">धार्मिक त्योहार एवं पर्व</p>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <IonSearchbar
              value={searchText}
              onIonChange={handleSearch}
              placeholder="त्योहार खोजें..."
              className="custom-searchbar"
            />
          </div>

          {/* Month Selector */}
          <IonSegment 
            value={selectedMonth} 
            onIonChange={e => setSelectedMonth(e.detail.value)}
            scrollable
            className="month-segment"
          >
            {Object.keys(filteredData).map(month => (
              <IonSegmentButton key={month} value={month}>
                <IonLabel>{month}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>

          {/* Festival Cards */}
          <div className="festivals-container">
            {filteredData[selectedMonth]?.map((item, index) => (
              <IonCard key={index} className="festival-card">
                <IonCardContent>
                  <div className="festival-date">
                    <IonIcon icon={calendar} />
                    <span>{getFormattedDate(item.date)}</span>
                  </div>
                  <div className="festival-name">
                    <IonIcon icon={flower} className="festival-icon" />
                    <h2>{item.festival}</h2>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>
      </IonContent>
     
    </IonPage>
  );
};

export default PanchangPage;