import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import crypto from 'crypto-js';

const X = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Your Cloudinary details
  const cloudName = ''; // Replace with your Cloudinary cloud name
  const apiKey = ''; // Replace with your Cloudinary API key
  const apiSecret = ''; // ⚠️ NOT SAFE for frontend! Use backend in production
  const publicId = ''; // Replace with your actual video public_id

  useEffect(() => {
    const generateSignedUrl = async () => {
      try {
        const timestamp = Math.floor(Date.now() / 1000) + 3600; // Expires in 1 hour

        // Generate signature
        const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.SHA1(signatureString).toString();

        // Generate the final signed URL
        const signedUrl = `https://res.cloudinary.com/${cloudName}/video/authenticated/${publicId}.mp4?api_key=${apiKey}&timestamp=${timestamp}&signature=${signature}`;

        setVideoUrl("https://res.cloudinary.com/dhwjmtd9z/video/upload/v1739093792/lmovhumrgfl0p6mtsqw0.mp4");
        
        console.log('Signed URL:', signedUrl);
      } catch (error) {
        console.error('Error generating signed URL:', error);
      } finally {
        setLoading(false);
      }
    };

    generateSignedUrl();
  }, []);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    // player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : videoUrl ? (
        <VideoView
          style={{ width: '100%', height: 250 }}
          player={player}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <Text>Error loading video</Text>
      )}
    </View>
  );
};

export default X;
