import { ICONS } from './constants';

export const getRandomIcon = () => {
    const icons = Object.values(ICONS);
    return icons[Math.floor(Math.random() * icons.length)];
};

export const getFaviconUrl = (url: string) => {
    try {
        const hostname = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch (e) {
        return null;
    }
};