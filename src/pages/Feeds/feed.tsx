import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonText,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTextarea,
  IonInput,
  IonFooter,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonContent,
  IonPage,
  IonActionSheet,
} from '@ionic/react';
import {
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline,
  bookmarkOutline,
  ellipsisHorizontal,
  shareSocial,
  logoWhatsapp,
  logoFacebook,
  logoTwitter,
  mailOutline,
} from 'ionicons/icons';
import { motion } from 'framer-motion';
import FooterPage from '../footer/footer';
import './feed.css';

const FeedPage = () => {
  const user  = localStorage.getItem('userDetails')
  const userDetails = user ?? JSON.parse(user);
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    username: userDetails.username,
    userAvatar: 'src/assets/user-image.jpg',
    image: null, // This will now store the File object
    likes: 0,
    caption: '',
    comments: 0,
    timeAgo: 'Just now',
    isLiked: false,
    isSaved: false,
    isDoubleTapped: false,
    file:null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://13.201.104.120:8000/api/posts/');
        const data = await response.json();
        setPosts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDoubleTap = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId && !post.isLiked) {
        return {
          ...post,
          isLiked: true,
          likes: post.likes + 1,
          isDoubleTapped: true,
        };
      }
      return post;
    }));

    setTimeout(() => {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, isDoubleTapped: false };
        }
        return post;
      }));
    }, 1000);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const loadMore = (event) => {
    setTimeout(() => {
      const newPosts = [...posts];
      setPosts(newPosts);
      event.target.complete();
    }, 1000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, file: file,image: file.name }); // Store the File object directly
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('username', newPost.username);
    formData.append('userAvatar', newPost.userAvatar); // If this is a URL, it might not work as expected; consider uploading the avatar separately if it's a file
    if (newPost.file) {
      formData.append('image', "filePath");
      formData.append('file', newPost.file); // Append the File object
    }
    formData.append('likes', newPost.likes.toString());
    formData.append('caption', newPost.caption);
    formData.append('comments', newPost.comments.toString());
    formData.append('timeAgo', newPost.timeAgo);
    formData.append('isLiked', newPost.isLiked.toString());
    formData.append('isSaved', newPost.isSaved.toString());
    formData.append('isDoubleTapped', newPost.isDoubleTapped.toString());

    try {
      const response = await fetch('http://13.201.104.120:8000/api/posts/create/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setPosts([data, ...posts]);
        setNewPost({
          username: 'jain_community',
          userAvatar: 'src/assets/user-image.jpg',
          image: null,
          likes: 0,
          caption: '',
          comments: 0,
          timeAgo: 'Just now',
          isLiked: false,
          isSaved: false,
          isDoubleTapped: false,
          file:null
        });
      } else {
        console.error('Error creating post:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsSubmitting(false);
  };

  const handleShare = (url) => {
    setShareUrl(url);
    setShowActionSheet(true);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <IonPage>
      <IonContent fullscreen className="feed-main-content">
        <IonGrid className="instagram-wall">
          <IonRow>
            <IonCol size="12" sizeMd="8" offsetMd="2">
              <IonCard className="create-post-card">
                <IonCardContent>
                  <form onSubmit={handlePostSubmit} className="create-post-form">
                    <IonTextarea
                      placeholder={t('spread_jainism')}
                      value={newPost.caption}
                      onIonChange={(e) => setNewPost({ ...newPost, caption: e.detail.value })}
                      required
                      className="create-post-textarea"
                    />
                    <div className="file-input-container">
                      <input type="file" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <IonButton fill="clear" type="submit" disabled={isSubmitting} className="create-post-button">
                      {isSubmitting ? t('posting') : t('post')}
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>

              {isLoading ? (
                <IonText>{t('loading')}</IonText>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <IonCard className="post-card">
                      <IonCardHeader className="post-header">
                        <div className="header-content">
                          <motion.div className="user-info" whileHover={{ scale: 1.02 }}>
                            <IonAvatar className="avatar">
                              <img src={post.userAvatar} alt={post.username} />
                            </IonAvatar>
                            <IonLabel className="username">{post.username}</IonLabel>
                          </motion.div>
                          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                            <IonIcon icon={ellipsisHorizontal} className="more-options" />
                          </motion.div>
                        </div>
                      </IonCardHeader>

                      <div className="post-image-container" onDoubleClick={() => handleDoubleTap(post.id)}>
                        <IonImg src={post.image} alt="Post content" className="post-image" style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1' }} />
                        {post.isDoubleTapped && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="double-tap-heart"
                          >
                            <IonIcon icon={heart} />
                          </motion.div>
                        )}
                      </div>
                      <div className="caption">
                        <span className="username">{post.username}</span> {post.caption}
                      </div>

                      <IonCardContent className="post-content">
                        <div className="action-buttons">
                          <div className="left-actions">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="action-icon"
                              onClick={() => handleShare(post.file)}
                            >
                              <IonIcon icon={shareSocial} />
                            </motion.div>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </motion.div>
                ))
              )}

              <IonInfiniteScroll onIonInfinite={loadMore}>
                <IonInfiniteScrollContent />
              </IonInfiniteScroll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter>
        <FooterPage />
      </IonFooter>

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: 'Share via WhatsApp',
            icon: logoWhatsapp,
            handler: () => {
              window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Share via Gmail',
            icon: mailOutline,
            handler: () => {
              window.open(`mailto:?subject=Check this out&body=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Share via Facebook',
            icon: logoFacebook,
            handler: () => {
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Share via Twitter',
            icon: logoTwitter,
            handler: () => {
              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close',
          },
        ]}
      />
    </IonPage>
  );
};

export default FeedPage;