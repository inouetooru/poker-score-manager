import { useEffect } from 'react';
import { AdMob, type BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AD_CONFIG } from '../config/ads';

export function AdBanner() {
    useEffect(() => {
        console.log('AdBanner mounted, platform:', Capacitor.getPlatform());

        // Androidプラットフォームでのみ広告を表示
        if (Capacitor.getPlatform() === 'android') {
            console.log('Attempting to show banner ad...');
            showBanner();
        } else {
            console.log('Not Android platform, skipping ads');
        }

        // コンポーネントのアンマウント時にバナーを削除
        return () => {
            if (Capacitor.getPlatform() === 'android') {
                hideBanner();
            }
        };
    }, []);

    const showBanner = async () => {
        try {
            // AdMobの初期化
            console.log('Initializing AdMob...');
            await AdMob.initialize();
            console.log('AdMob initialized successfully');

            // バナー広告のオプション設定
            const options: BannerAdOptions = {
                adId: AD_CONFIG.BANNER_AD_ID,
                adSize: BannerAdSize.BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
            };

            console.log('Showing banner with Ad ID:', options.adId);
            // バナー広告を表示
            await AdMob.showBanner(options);
            console.log('Banner ad shown successfully');
        } catch (error) {
            console.error('Banner ad error:', error);
            console.error('Error details:', JSON.stringify(error));
        }
    };

    const hideBanner = async () => {
        try {
            console.log('Removing banner...');
            await AdMob.removeBanner();
            console.log('Banner removed');
        } catch (error) {
            console.error('Error removing banner:', error);
        }
    };

    // Reactコンポーネントとしては何もレンダリングしない
    // 広告はネイティブレイヤーで表示される
    return null;
}
