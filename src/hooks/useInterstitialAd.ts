import { useEffect, useCallback } from 'react';
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AD_CONFIG } from '../config/ads';

export function useInterstitialAd() {
    useEffect(() => {
        if (Capacitor.getPlatform() === 'android') {
            console.log('Preparing interstitial ad...');
            prepareInterstitial();
        }
    }, []);

    const prepareInterstitial = async () => {
        try {
            await AdMob.initialize();

            const options: AdOptions = {
                adId: AD_CONFIG.INTERSTITIAL_AD_ID,
            };

            console.log('Preparing interstitial with Ad ID:', options.adId);
            await AdMob.prepareInterstitial(options);
            console.log('Interstitial ad prepared successfully');
        } catch (error) {
            console.error('Interstitial prepare error:', error);
        }
    };

    const showInterstitial = useCallback(async () => {
        if (Capacitor.getPlatform() !== 'android') {
            console.log('Not Android platform, skipping interstitial');
            return;
        }

        try {
            console.log('Showing interstitial ad...');
            await AdMob.showInterstitial();
            console.log('Interstitial ad shown successfully');

            // 表示後、次回用に準備
            console.log('Preparing next interstitial ad...');
            await prepareInterstitial();
        } catch (error) {
            console.error('Interstitial show error:', error);
            // エラーの場合も次回用に準備
            await prepareInterstitial();
        }
    }, []);

    return { showInterstitial };
}
