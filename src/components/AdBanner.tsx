import { useEffect } from 'react';
import { AdMob, type BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AD_CONFIG } from '../config/ads';

type View = 'dashboard' | 'new-round' | 'players' | 'player-detail' | 'event-detail' | 'settings' | 'sessions';

interface AdBannerProps {
    currentView: View;
}

export function AdBanner({ currentView }: AdBannerProps) {
    useEffect(() => {
        console.log('AdBanner mounted, platform:', Capacitor.getPlatform());
        console.log('Current view:', currentView);

        // Androidプラットフォームでのみ広告を表示
        if (Capacitor.getPlatform() === 'android') {
            // 85%の確率で広告を表示
            const showBannerProbability = Math.random();
            console.log('Banner ad probability:', showBannerProbability);

            if (showBannerProbability < 0.85) {
                console.log('Attempting to show banner ad...');
                showBanner();
            } else {
                console.log('Banner ad not shown (15% probability)');
            }
        } else {
            console.log('Not Android platform, skipping ads');
        }

        // コンポーネントのアンマウント時にバナーを削除
        return () => {
            if (Capacitor.getPlatform() === 'android') {
                hideBanner();
            }
        };
    }, [currentView]); // currentViewが変更されたら再実行

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
