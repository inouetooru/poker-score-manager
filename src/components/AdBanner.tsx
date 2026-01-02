import { useEffect } from 'react';
import { AdMob, type BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AD_CONFIG } from '../config/ads';

export function AdBanner() {
    useEffect(() => {
        // Androidプラットフォームでのみ広告を表示
        if (Capacitor.getPlatform() === 'android') {
            showBanner();
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
            await AdMob.initialize();

            // バナー広告のオプション設定
            const options: BannerAdOptions = {
                adId: AD_CONFIG.BANNER_AD_ID,
                adSize: BannerAdSize.BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
            };

            // バナー広告を表示
            await AdMob.showBanner(options);
        } catch (error) {
            console.error('Banner ad error:', error);
        }
    };

    const hideBanner = async () => {
        try {
            await AdMob.removeBanner();
        } catch (error) {
            console.error('Error removing banner:', error);
        }
    };

    // Reactコンポーネントとしては何もレンダリングしない
    // 広告はネイティブレイヤーで表示される
    return null;
}
