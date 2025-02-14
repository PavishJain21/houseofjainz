import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="wave-container">
          <div className="wave"></div>
        </div>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Connect & Grow Together</h1>
              <p>Join our vibrant Jain community platform where tradition meets innovation. Share experiences, learn, and grow together in a modern digital space.</p>
              <button className="button get-started-btn" onClick={() => history.push('/signup')}>Get Started</button>
            </div>
            <div className="hero-cards">
              <div className="hero-card">
                <div className="card-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Global Community</h3>
                <p>Connect with Jains worldwide</p>
              </div>
              <div className="hero-card">
                <div className="card-icon">
                  <i className="fas fa-hands-helping"></i>
                </div>
                <h3>Support</h3>
                <p>Help & get helped</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-title">
            <h2>Why Choose House of Jain-Z?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-globe"></i>
              </div>
              <div className="feature-content">
                <h3>Global Network</h3>
                <p>Connect with Jains from around the world, share experiences, and build lasting relationships.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="feature-content">
                <h3>Events & Meetups</h3>
                <p>Discover and participate in local and global events, festivals, and spiritual gatherings.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="feature-content">
                <h3>Digital Library</h3>
                <p>Access a vast collection of spiritual texts, teachings, and modern interpretations.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to Join Our Community?</h2>
          <p>Start your journey with House of Jain-Z today</p>
          <button className="button get-started-btn" style={{ margin: '40px' }} onClick={() => history.push('/signup')}>Join Now</button>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Home;
